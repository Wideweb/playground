using System.Collections.Generic;
using Shop.Data.Models;

namespace Shop.Services
{
    public interface IDataAcessService<T> where T : class, IEntity
    {
        List<Word> GetAll();
        void Save(Word item);
        void Delete(long id);
    }
}