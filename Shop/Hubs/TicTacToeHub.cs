using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Shop.Models.TicTacToeModels;
using Shop.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shop.Hubs
{
    [Authorize]
    public class TicTacToeHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        private readonly static Dictionary<Guid, TicTacToe> _rooms = 
            new Dictionary<Guid, TicTacToe>();

        private readonly TrainingService _trainingService;
        private readonly ILogger _logger;

        public TicTacToeHub(
            TrainingService trainingService,
            ILogger<TicTacToeHub> logger
            )
        {
            _trainingService = trainingService;
            _logger = logger;
        }

        public async Task SelectSlot(Guid rid, int index, int option)
        {
            string name = Context.User.Identity.Name;

            _logger.LogTrace($"User selects slot | user:{name}, rid:{rid}, index:{index}, option:{option}");

            if (!_rooms.TryGetValue(rid, out TicTacToe room))
            {
                _logger.LogWarning($"Room doesn\'t exist | user:{name}, rid:{rid}");
                return;
            }
            
            try
            {
                room.SelectSlot(index, option, name);
                _logger.LogTrace($"Slot was successfully selected | user:{name}, rid:{rid}, index:{index}, option:{option}");
                foreach (var player in room.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("SelectSlot", room.ToViewModel());
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogWarning($"Failed to select slot | user:{name}, rid:{rid}, index:{index}, option:{option}, error:{e.Message}");
                foreach (var player in room.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("SelectSlotFailed", room.ToViewModel(), index, option, name);
                    }
                }
            }
        }

        public override async Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;
            TicTacToe openedRoom;

            _logger.LogTrace($"User connected | user:{name}");

            _connections.Add(name, Context.ConnectionId);

            lock (_rooms)
            {
                openedRoom = FindRoomForUser(name);
                openedRoom.AddPlayer(name);
                _logger.LogTrace($"User is added to the room | user:{name}, rid:{openedRoom.Rid}");
            }

            if (openedRoom.IsReady)
            {
                StartGame(openedRoom);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string name = Context.User.Identity.Name;

            _logger.LogTrace($"User disconnected | user:{name}");

            var occupiedRooms = _rooms.Values.Where(room => room.Players.Contains(name)).ToList();
            foreach(var room in occupiedRooms)
            {
                RemoveUserFromRoom(room, name);
            }

            _connections.Remove(name, Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }

        #region PRIVATE METHODS

        private TicTacToe FindRoomForUser(string name)
        {
            _logger.LogTrace($"Search started game | user:{name}");
            var openedRoom = _rooms.Values.FirstOrDefault(room => room.Started && room.DisconnectedPlayer == name);
            if (openedRoom == null)
            {
                _logger.LogTrace($"Search new game | user:{name}");
                openedRoom = _rooms.Values.FirstOrDefault(room => !room.IsReady && !room.Started);
            }
            if (openedRoom == null)
            {
                var rid = Guid.NewGuid();
                openedRoom = new TicTacToe(rid);
                _rooms.Add(rid, openedRoom);
                _logger.LogTrace($"New game room is created | user:{name}, rid:{rid}");
            }

            return openedRoom;
        }

        private async void StartGame(TicTacToe room)
        {
            if (!room.Started)
            {
                room.Questions = _trainingService.GenerateSession(9);
                _logger.LogTrace($"Start new game | rid:{room.Rid}");
            }
            else
            {
                _logger.LogTrace($"Game already begun | rid:{room.Rid}");
            }

            foreach (var player in room.Players)
            {
                foreach (var connectionId in _connections.GetConnections(player))
                {
                    await Clients.Client(connectionId).SendAsync("Start", room.ToViewModel());
                }
            }

            room.Started = true;
            _logger.LogTrace($"Game started | rid:{room.Rid}");
        }

        private async void RemoveUserFromRoom(TicTacToe room, string name)
        {
            lock (_rooms)
            {
                room.RemovePlayer(name);
            }

            _logger.LogTrace($"User left the room | user:{name}, rid:{room.Rid}");

            foreach (var player in room.Players)
            {
                foreach (var connectionId in _connections.GetConnections(player))
                {
                    await Clients.Client(connectionId).SendAsync("UserDisconnected", room.Rid, name);
                }
            }

            if (room.IsEmpty)
            {
                lock (_rooms)
                {
                    _rooms.Remove(room.Rid);
                }

                _logger.LogTrace($"Room is deleted | rid:{room.Rid}");
            }
        }

        #endregion PRIVATE METHODS
    }
}
