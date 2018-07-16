using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Shop.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shop.Hubs
{
    class TicTacToe
    {
        private Guid _rid;
        private bool _turn;
        private string _firstPlayer;
        private string _secondPlayer;
        private List<string> _map;

        public Guid Rid => _rid;
        public bool IsReady => string.IsNullOrEmpty(_firstPlayer) || string.IsNullOrEmpty(_secondPlayer);
        public List<string> Players => new List<string>() { _firstPlayer, _secondPlayer };

        public TicTacToe(Guid rid)
        {
            _rid = rid;
            _turn = true;
            _firstPlayer = null;
            _secondPlayer = null;
            _map = new List<string>(9);
        }

        public void AddPlayer(string name)
        {
            if(IsReady)
            {
                throw new Exception($"The game is full");
            }

            if(string.IsNullOrEmpty(_firstPlayer))
            {
                _firstPlayer = name;
            }
            else if (string.IsNullOrEmpty(_secondPlayer))
            {
                _secondPlayer = name;
            }
        }

        public void RemovePlayer(string name)
        {
            if(_firstPlayer == name)
            {
                _firstPlayer = null;
            }

            if (_secondPlayer == name)
            {
                _secondPlayer = null;
            }
        }

        public void SelectSlot(int index, string player)
        {
            var activePlayer = _turn ? _firstPlayer : _secondPlayer;
            if(activePlayer != player)
            {
                throw new Exception($"The player {player} can't make a selectoin. {activePlayer} turn");
            }

            if(!string.IsNullOrEmpty(_map[index]))
            {
                throw new Exception($"the cell {index} is already occupied by {_map[index]}");
            }

            _map[index] = activePlayer;
            NextTurn();
        }

        private void NextTurn()
        {
            _turn = !_turn;
        }

        public TicTacToeViewModel ToViewModel()
        {
            return new TicTacToeViewModel
            {
                Rid = _rid,
                FirstPlayer = _firstPlayer,
                SecondPlayer = _secondPlayer,
                Map = _map,
                Turn = _turn
            };
        }
    }

    class TicTacToeViewModel
    {
        public Guid Rid { get; set; }
        public bool Turn { get; set; }
        public string FirstPlayer { get; set; }
        public string SecondPlayer { get; set; }
        public IEnumerable<string> Map { get; set; }
    }

    [Authorize]
    public class TicTacToeHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        private readonly static Dictionary<Guid, TicTacToe> _rooms = 
            new Dictionary<Guid, TicTacToe>();

        public async Task SelectSlot(Guid rid, int index)
        {
            string name = Context.User.Identity.Name;

            if (!_rooms.TryGetValue(rid, out TicTacToe room))
            {
                throw new Exception($"room {rid} doesn\'t exist");
            }

            room.SelectSlot(index, name);

            foreach (var player in room.Players)
            {
                foreach (var connectionId in _connections.GetConnections(player))
                {
                    await Clients.Client(connectionId).SendAsync("SelectSlot", room.ToViewModel());
                }
            }
        }

        public override async Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;
            TicTacToe openedRoom;

            lock (_rooms)
            {
                openedRoom = _rooms.Values.FirstOrDefault(room => !room.IsReady);
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
                foreach(var player in openedRoom.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("Start", openedRoom.ToViewModel());
                    }
                }
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
            }

            _connections.Remove(name, Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
