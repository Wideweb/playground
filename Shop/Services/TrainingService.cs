using Shop.Data.Models;
using Shop.Extensions;
using Shop.Models;
using Shop.Utils;
using System.Collections.Generic;
using System.Linq;

namespace Shop.Services
{
    public class TrainingService
    {
        private readonly IDataAcessService<Word> _dictionary;

        public TrainingService(IDataAcessService<Word> dictionary)
        {
            _dictionary = dictionary;
        }

        public List<TrainingItemView> GenerateSession(int capacity)
        {
            var words = _dictionary.GetAll().Select(it => it.ToDictionaryItemView()).ToList();
            words.Shuffle();
            var training = new List<TrainingItemView>();
            var trainingCapacity = words.Count < capacity ? words.Count : capacity;
            var trainingItems = words.Take(trainingCapacity);

            foreach(var trainingItem in trainingItems)
            {
                words.Shuffle();
                var options = words.Take(4).Select(w => w.Translation).ToList();

                if (options.All(it => it != trainingItem.Translation))
                {
                    options.RemoveAt(0);
                    options.Add(trainingItem.Translation);
                }

                training.Add(new TrainingItemView
                {
                    DictionaryItem = trainingItem,
                    Options = options
                });
            }

            return training;
        }
    }
}
