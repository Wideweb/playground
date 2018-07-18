using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
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

        public TicTacToeHub(TrainingService trainingService)
        {
            _trainingService = trainingService;
        }

        public async Task SelectSlot(Guid rid, int index, int option)
        {
            string name = Context.User.Identity.Name;

            if (!_rooms.TryGetValue(rid, out TicTacToe room))
            {
                throw new Exception($"room {rid} doesn\'t exist");
            }
            
            try
            {
                room.SelectSlot(index, option, name);
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

            _connections.Add(name, Context.ConnectionId);

            lock (_rooms)
            {
                openedRoom = _rooms.Values.FirstOrDefault(room => room.Started && room.DisconnectedPlayer == name);
                if(openedRoom == null)
                {
                    openedRoom = _rooms.Values.FirstOrDefault(room => !room.IsReady && !room.Started);
                }
                if (openedRoom == null)
                {
                    var rid = Guid.NewGuid();
                    openedRoom = new TicTacToe(rid);
                    _rooms.Add(rid, openedRoom);
                }
                openedRoom.AddPlayer(name);
            }

            if (openedRoom.IsReady)
            {
                if (!openedRoom.Started)
                {
                    openedRoom.Questions = _trainingService.GenerateSession(9);
                }

                foreach (var player in openedRoom.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("Start", openedRoom.ToViewModel());
                    }
                }

                openedRoom.Started = true;
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string name = Context.User.Identity.Name;

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
