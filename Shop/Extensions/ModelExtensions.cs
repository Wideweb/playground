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

        public static Word ToWord(this DictionaryItemView item)
        {
            var word = new Word();
            word.Text = item.Term;

            var translation = new Translation
            {
                Text = item.Translation,
                Word = word
            };
            
            word.Translations.Add(translation);

            return word;
        }
    }
}