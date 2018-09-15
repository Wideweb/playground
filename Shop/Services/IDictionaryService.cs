using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.Models;

namespace Shop.Services
{
    public interface IDictionaryService
    {
        long GetCapacity(string userId);
        Task<DictionaryItemView> GetItemViewById(long id);
        Task<List<DictionaryItemView>> GetItemViewsByUserId(string userId);
        Task SaveItemViewByUserId(DictionaryItemView item, string userId);
        void DeleteItemById(long id);
    }
}