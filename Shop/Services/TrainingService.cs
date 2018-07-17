using Shop.Extensions;
using Shop.Models;
using Shop.Utils;
using System.Collections.Generic;
using System.Linq;

namespace Shop.Services
{
    public class TrainingService
    {
        public List<TrainingItemView> GenerateSession(int capacity)
        {
            DB.Dictionary.Shuffle();
            var training = new List<TrainingItemView>();
            var trainingCapacity = DB.Dictionary.Count < capacity ? DB.Dictionary.Count : capacity;

            for (var i = 0; i < trainingCapacity; i++)
            {
                DB.Words.Shuffle();
                var dictionaryItem = DB.Dictionary[i];
                var options = DB.Words.Take(4).ToList();

                if (!options.Any(it => it == dictionaryItem.Translation))
                {
                    options.RemoveAt(0);
                    options.Add(dictionaryItem.Translation);
                }

                training.Add(new TrainingItemView
                {
                    DictionaryItem = dictionaryItem,
                    Options = options
                });
            }

            return training;
        }
    }
}
