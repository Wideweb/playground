using System;
using System.Collections.Generic;

namespace Shop.Models.TicTacToeModels
{
    public class TicTacToeViewModel
    {
        public Guid Rid { get; set; }
        public bool Turn { get; set; }
        public string FirstPlayer { get; set; }
        public string SecondPlayer { get; set; }
        public IEnumerable<string> Map { get; set; }
        public string Winner { get; set; }
        public IEnumerable<TrainingItemView> Questions { get; set; }
        public IEnumerable<int> Path { get; set; }
    }
}
