using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Shop.Models;
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
        private string[] _map;
        private string _winner;

        public Guid Rid => _rid;
        public bool IsReady => !string.IsNullOrEmpty(_firstPlayer) && !string.IsNullOrEmpty(_secondPlayer);
        public bool IsEmpty => string.IsNullOrEmpty(_firstPlayer) && string.IsNullOrEmpty(_secondPlayer);
        public IEnumerable<string> Players => new List<string>() { _firstPlayer, _secondPlayer }.Where(item => !string.IsNullOrEmpty(item));
        public bool Started { get; set; }
        public List<TrainingItemView> Questions { get; set; }

        public TicTacToe(Guid rid)
        {
            _rid = rid;
            _turn = true;
            _firstPlayer = null;
            _secondPlayer = null;
            _winner = null;
            _map = new string[9];
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

        public void SelectSlot(int index, int option, string player)
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

            NextTurn();

            if (Questions[index].DictionaryItem.Translation != Questions[index].Options[option])
            {
                throw new Exception("Wrong Answer");
            }

            _map[index] = activePlayer;
            FindWinner();
        }

        private void FindWinner()
        {
            if(!string.IsNullOrEmpty(_map[0]) && _map[0] == _map[1] && _map[1] == _map[2])
            {
                _winner = _map[0];
            }
            else if (!string.IsNullOrEmpty(_map[3]) && _map[3] == _map[4] && _map[4] == _map[5])
            {
                _winner = _map[3];
            }
            else if (!string.IsNullOrEmpty(_map[6]) && _map[6] == _map[7] && _map[7] == _map[8])
            {
                _winner = _map[6];
            }
            else if (!string.IsNullOrEmpty(_map[0]) && _map[0] == _map[3] && _map[3] == _map[6])
            {
                _winner = _map[0];
            }
            else if (!string.IsNullOrEmpty(_map[1]) && _map[1] == _map[4] && _map[4] == _map[7])
            {
                _winner = _map[1];
            }
            else if (!string.IsNullOrEmpty(_map[2]) && _map[2] == _map[5] && _map[5] == _map[8])
            {
                _winner = _map[2];
            }
            else if (!string.IsNullOrEmpty(_map[0]) && _map[0] == _map[4] && _map[4] == _map[8])
            {
                _winner = _map[0];
            }
            else if (!string.IsNullOrEmpty(_map[2]) && _map[2] == _map[4] && _map[4] == _map[6])
            {
                _winner = _map[2];
            }
            else if (_map.All(x => !string.IsNullOrEmpty(x)))
            {
                _winner = "Draw";
            }
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
                Turn = _turn,
                Winner = _winner,
                Questions = Questions
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
        public string Winner { get; set; }
        public IEnumerable<TrainingItemView> Questions {get;set;}
    }

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

            bool fail = false;
            try
            {
                room.SelectSlot(index, option, name);
            }
            catch (Exception e)
            {
                fail = true;
            }

            foreach (var player in room.Players)
            {
                foreach (var connectionId in _connections.GetConnections(player))
                {
                    await Clients.Client(connectionId).SendAsync("SelectSlot", room.ToViewModel());
                }
            }

            if (fail)
            {
                foreach (var player in room.Players)
                {
                    foreach (var connectionId in _connections.GetConnections(player))
                    {
                        await Clients.Client(connectionId).SendAsync("SelectSlotFailed", room.ToViewModel(), index, option);
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
