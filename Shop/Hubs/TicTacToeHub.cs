using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Shop.Models;
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
        
        private readonly IDictionaryService _dictionaryService;
        private readonly TrainingService _trainingService;
        private readonly ILogger _logger;

        public TicTacToeHub(
            IDictionaryService dictionaryService,
            TrainingService trainingService,
            ILogger<TicTacToeHub> logger
            )
        {
            _dictionaryService = dictionaryService;
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
                _logger.LogError($"Failed to select slot | user:{name}, rid:{rid}, index:{index}, option:{option}, error:{e.Message}");
                foreach (var player in room.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("SelectSlotFailed", room.ToViewModel(), index, option, name);
                    }
                }
            }
        }

        public async Task LeaveRoom(Guid rid)
        {
            string name = Context.User.Identity.Name;

            _logger.LogTrace($"User left the room| user:{name}, rid:{rid}");

            if (!_rooms.TryGetValue(rid, out TicTacToe room))
            {
                _logger.LogWarning($"Room doesn\'t exist | user:{name}, rid:{rid}");
                return;
            }
            
            RemoveUserFromRoom(room, name, true);
        }

        public override async Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;
            TicTacToe openedRoom;

            _logger.LogTrace($"User connected | user:{name}");

            if(_dictionaryService.GetCapacity(Context.UserIdentifier) < 9)
            {
                _logger.LogTrace($"Dictionary capacity error | user:{name}");
                await Clients.Client(Context.ConnectionId).SendAsync("Error", new DictionaryCapacityError(9));
            }

            _connections.Add(name, Context.ConnectionId);

            Search();

            await base.OnConnectedAsync();
        }

        public async Task Search()
        {
            string name = Context.User.Identity.Name;
            TicTacToe openedRoom;
            
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
            _logger.LogTrace($"Search game | user:{name}");
            var openedRoom = _rooms.Values.FirstOrDefault(room => room.CanJoin(name));
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
            if (!room.IsStarted)
            {
                room.Questions = await _trainingService.GenerateSession(9, Context.UserIdentifier);
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

            room.IsStarted = true;
            _logger.LogTrace($"Game started | rid:{room.Rid}");
        }

        private async void RemoveUserFromRoom(TicTacToe room, string name, bool isLeft = false)
        {
            lock (_rooms)
            {
                room.RemovePlayer(name, isLeft);
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
