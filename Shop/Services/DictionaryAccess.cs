using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Razor.Language;
using Shop.Controllers;
using Shop.Data.Models;
using Shop.Models;
using Shop.Services.Repository;

namespace Shop.Services
{
    public class DictionaryAccess : IDataAcessService<Word>
    {
        private IEntityRepository<Word> _wordsRepository;
        
        public DictionaryAccess(IEntityRepository<Word> wordsRepository)
        {
            _wordsRepository = wordsRepository;
        }

        public List<DictionaryItemView> GetAll()
        {
            var values = _wordsRepository
                .GetWhere(w => true)
                .Select(w => new DictionaryItemView
                {
                    Id = w.Id,
                    Term = w.Text,
                    Translation = w.Translations.First()?.Text ?? "no translation"
                });,

            return values.ToList();
        }

        public void Save(DictionaryItemView item)
        {
            var word = new Word
            {
                Text = item.Term
            };

            var translation = new Translation
            {
                Text = item.Translation,
                Word = word
            };
            
            word.Translations = new List<Translation> {translation};
            
            _wordsRepository.Add(word);
        }

        public void Delete(long id)
        {
            _wordsRepository.DeleteWhere(it => it.Id == id);
        }
    }
}