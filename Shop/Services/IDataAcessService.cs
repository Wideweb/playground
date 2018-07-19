using System.Collections.Generic;
using Shop.Data.Models;
using Shop.Models;
using Shop.Services.Repository;

namespace Shop.Services
{
    public interface IDataAcessService<T> where T : class, IEntity
    {
        List<DictionaryItemView> GetAll();
        void Save(DictionaryItemView item);
        void Delete(long id);
    }
}