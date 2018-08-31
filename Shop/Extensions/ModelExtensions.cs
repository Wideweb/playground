using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Shop.Data.Models;
using Shop.Models;

namespace Shop.Extensions
{
    public static class ModelExtensions
    {
        public static DictionaryItemView ToDictionaryItemView(this Word word)
        {
            var item = new DictionaryItemView
            {
                Id = word.Id,
                Term = word.Text,
                Translation = word.Translations.FirstOrDefault()?.Text ?? "no translation"
            };

            return item;
        }

        public static Word ToWordWithUserId(this DictionaryItemView item, string userId)
        {
            var word = new Word();
            word.Text = item.Term;
            word.UserId = userId;

            var translation = new Translation
            {
                Text = item.Translation,
                Word = word
            };
            
            word.Translations.Add(translation);

            return word;
        }

        public static Word WithImageId(this Word word, string imageId)
        {
            word.ImageId = imageId;
            return word;
        }
    }
}