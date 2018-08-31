using System;
using System.Collections.Generic;
using System.Linq;

namespace Shop.Models.TicTacToeModels
{
    public class TicTacToe
    {
        private bool _turn;
        private string _firstPlayer;
        private string _secondPlayer;
        private string[] _map;
        private string _winner;
        private int[] _path;

        public Guid Rid { get; }
        public bool IsReady => !string.IsNullOrEmpty(_firstPlayer) && !string.IsNullOrEmpty(_secondPlayer);
        public bool IsEmpty => string.IsNullOrEmpty(_firstPlayer) && string.IsNullOrEmpty(_secondPlayer);
        public bool IsOver => !string.IsNullOrEmpty(_winner);
        public IEnumerable<string> Players => new List<string>() { _firstPlayer, _secondPlayer }.Where(item => !string.IsNullOrEmpty(item));
        public bool IsStarted { get; set; }
        public List<TrainingItemView> Questions { get; set; }
        public string DisconnectedPlayer { get; private set; }

        public TicTacToe(Guid rid)
        {
            Rid = rid;
            _turn = true;
            _firstPlayer = null;
            _secondPlayer = null;
            DisconnectedPlayer = null;
            _winner = null;
            _map = new string[9];
        }

        public void AddPlayer(string name)
        {
            if (IsReady)
            {
                throw new Exception($"The game is full");
            }

            if (string.IsNullOrEmpty(_firstPlayer))
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
            if (_firstPlayer == name)
            {
                DisconnectedPlayer = _firstPlayer;
                _firstPlayer = null;
            }

            if (_secondPlayer == name)
            {
                DisconnectedPlayer = _secondPlayer;
                _secondPlayer = null;
            }
        }

        public void SelectSlot(int index, int option, string player)
        {
            var activePlayer = _turn ? _firstPlayer : _secondPlayer;
            if (activePlayer != player)
            {
                throw new Exception($"The player {player} can't make a selectoin. {activePlayer} turn");
            }

            if (!string.IsNullOrEmpty(_map[index]))
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
            if (!string.IsNullOrEmpty(_map[0]) && _map[0] == _map[1] && _map[1] == _map[2])
            {
                _winner = _map[0];
                _path = new int[3] { 0, 1, 2 };
            }
            else if (!string.IsNullOrEmpty(_map[3]) && _map[3] == _map[4] && _map[4] == _map[5])
            {
                _winner = _map[3];
                _path = new int[3] { 3, 4, 5 };
            }
            else if (!string.IsNullOrEmpty(_map[6]) && _map[6] == _map[7] && _map[7] == _map[8])
            {
                _winner = _map[6];
                _path = new int[3] { 6, 7, 8 };
            }
            else if (!string.IsNullOrEmpty(_map[0]) && _map[0] == _map[3] && _map[3] == _map[6])
            {
                _winner = _map[0];
                _path = new int[3] { 0, 3, 6 };
            }
            else if (!string.IsNullOrEmpty(_map[1]) && _map[1] == _map[4] && _map[4] == _map[7])
            {
                _winner = _map[1];
                _path = new int[3] { 1, 4, 7 };
            }
            else if (!string.IsNullOrEmpty(_map[2]) && _map[2] == _map[5] && _map[5] == _map[8])
            {
                _winner = _map[2];
                _path = new int[3] { 2, 5, 8 };
            }
            else if (!string.IsNullOrEmpty(_map[0]) && _map[0] == _map[4] && _map[4] == _map[8])
            {
                _winner = _map[0];
                _path = new int[3] { 0, 4, 8 };
            }
            else if (!string.IsNullOrEmpty(_map[2]) && _map[2] == _map[4] && _map[4] == _map[6])
            {
                _winner = _map[2];
                _path = new int[3] { 2, 4, 6 };
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
                Rid = Rid,
                FirstPlayer = _firstPlayer,
                SecondPlayer = _secondPlayer,
                Map = _map,
                Turn = _turn,
                Winner = _winner,
                Questions = Questions,
                Path = _path
            };
        }
    }
}
