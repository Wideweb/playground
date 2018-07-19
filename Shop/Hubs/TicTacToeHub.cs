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
            ILogger<TrainingService> logger
            )
        {
            _trainingService = trainingService;
            _logger = logger;
        }

        public async Task SelectSlot(Guid rid, int index, int option)
        {
            string name = Context.User.Identity.Name;

            _logger.LogTrace($"User selects slot | name:{name}, rid:{rid}, index:{index}, option:{option}");

            if (!_rooms.TryGetValue(rid, out TicTacToe room))
            {
                _logger.LogWarning($"Room doesn\'t exist | name:{name}, rid:{rid}");
                return;
            }
            
            try
            {
                room.SelectSlot(index, option, name);
                _logger.LogTrace($"Slot was successfully selected | name:{name}, rid:{rid}, index:{index}, option:{option}");
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
                _logger.LogWarning($"Failed to select slot | name:{name}, rid:{rid}, index:{index}, option:{option}, messsage:{e.Message}");
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

            _logger.LogTrace($"User connected | name:{name}");

            _connections.Add(name, Context.ConnectionId);

            lock (_rooms)
            {
                _logger.LogTrace($"Search started game | name:{name}");
                openedRoom = _rooms.Values.FirstOrDefault(room => room.Started && room.DisconnectedPlayer == name);
                if(openedRoom == null)
                {
                    _logger.LogTrace($"Search new game | name:{name}");
                    openedRoom = _rooms.Values.FirstOrDefault(room => !room.IsReady && !room.Started);
                }
                if (openedRoom == null)
                {
                    var rid = Guid.NewGuid();
                    openedRoom = new TicTacToe(rid);
                    _rooms.Add(rid, openedRoom);
                    _logger.LogTrace($"New game room is created | name:{name}, rid:{rid}");
                }
                openedRoom.AddPlayer(name);
                _logger.LogTrace($"User is added to the room | name:{name}, rid:{openedRoom.Rid}");
            }

            if (openedRoom.IsReady)
            {
                if (!openedRoom.Started)
                {
                    openedRoom.Questions = _trainingService.GenerateSession(9);
                    _logger.LogTrace($"Start new game | name:{name}, rid:{openedRoom.Rid}");
                }
                else
                {
                    _logger.LogTrace($"Game already begun | name:{name}, rid:{openedRoom.Rid}");
                }

                foreach (var player in openedRoom.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("Start", openedRoom.ToViewModel());
                    }
                }

                openedRoom.Started = true;
                _logger.LogTrace($"Game started | name:{name}, rid:{openedRoom.Rid}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string name = Context.User.Identity.Name;

            _logger.LogTrace($"User disconnected | name:{name}");

            var occupiedRooms = _rooms.Values.Where(room => room.Players.Contains(name));
            foreach(var room in occupiedRooms)
            {
                lock (_rooms)
                {
                    room.RemovePlayer(name);
                }

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
                }
            }

            _connections.Remove(name, Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
