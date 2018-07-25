using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Shop.Data;
using Shop.Data.Models;

namespace Shop.Services
{
    public class DictionaryAccess : IDataAcessService<Word>
    {
        private ApplicationDbContext _dbContext;
        
        public DictionaryAccess(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Word> GetAll()
        {
            var values = _dbContext
                .Words
                .Include(w => w.Translations)
                .ToList();
            
            return values;
        }

        public void Save(Word word)
        {       
            _dbContext.Words.Add(word);
            _dbContext.SaveChanges();
        }

        public void Delete(long id)
        {
            var entity = _dbContext.Words.FirstOrDefault(w => w.Id == id);
            _dbContext.Entry(entity).State = EntityState.Deleted;
            _dbContext.SaveChanges();
        }
    }
}