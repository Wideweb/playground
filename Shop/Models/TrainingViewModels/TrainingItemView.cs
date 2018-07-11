using System.Collections.Generic;

namespace Shop.Models
{
    public class TrainingItemView
    {
        public DictionaryItemView DictionaryItem { get; set; }

        public List<string> Options { get; set; }
    }
}