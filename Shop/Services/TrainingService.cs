using Shop.Data.Models;
using Shop.Extensions;
using Shop.Models;
using Shop.Utils;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shop.Services
{
    public class TrainingService
    {
        private readonly IDictionaryService _dictionary;
        private readonly IFileManager _imageManager;

        public TrainingService(
            IDictionaryService dictionary,
            IFileManager imageManager
            )
        {
            _dictionary = dictionary;
            _imageManager = imageManager;
        }

        public async Task<List<TrainingItemView>> GenerateSession(int capacity, string userId)
        {
            var words = await _dictionary.GetItemViewsByUserId(userId);
            words.Shuffle();
            var training = new List<TrainingItemView>();
            var trainingCapacity = words.Count < capacity ? words.Count : capacity;
            var trainingItems = words.Take(trainingCapacity).ToList();

            foreach(var trainingItem in trainingItems)
            {
                words.Shuffle();
                var options = words.Take(4).Select(w => w.Translation).ToList();

                if (options.All(it => it != trainingItem.Translation))
                {
                    options.RemoveAt(0);
                    options.Add(trainingItem.Translation);
                }

                var encodedImage = string.Empty;

                if (!string.IsNullOrEmpty(trainingItem.ImageId))
                {
                    var sourceImage = await _imageManager.Get(Folder.Dictionary, trainingItem.ImageId);
                    encodedImage = FileConverter.ToBase64String(sourceImage);
                }

                training.Add(new TrainingItemView
                {
                    DictionaryItem = trainingItem,
                    Options = options,
                    StudyLevel = 0,
                    Image = encodedImage
                });
            }

            return training;
        }
    }
}
