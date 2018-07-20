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
        private readonly IEntityRepository<Word> _wordsRepository;
        private readonly IEntityRepository<Translation> _translationsRepository;
        
        public DictionaryAccess(IEntityRepository<Word> wordsRepository, IEntityRepository<Translation> translationsRepository)
        {
            _wordsRepository = wordsRepository;
            _translationsRepository = translationsRepository;
        }

        public List<Word> GetAll()
        {
            var values = _wordsRepository
                .GetWhere(w => true);

            return values.ToList();
        }

        public void Save(Word word)
        {       
            _wordsRepository.Add(word);
        }

        public void Delete(long id)
        {
            _wordsRepository.DeleteWhere(it => it.Id == id);
            _translationsRepository.DeleteWhere(it => it.Word.Id == id);
        }
    }
}