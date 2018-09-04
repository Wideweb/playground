using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.Data.Models;

namespace Shop.Services
{
    public interface IDataAcessService<T> where T : class, IEntity
    {
        Task<Word> Get(long id);
        List<Word> GetAll();
        void Save(Word item);
        void Delete(long id);
    }
}