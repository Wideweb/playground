using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.Models;

namespace Shop.Services
{
    public interface IDictionaryService
    {
        Task<List<DictionaryItemView>> GetItemViewsByUserId(string userId);
        Task SaveItemViewByUserId(DictionaryItemView item, string userId);
        void DeleteItemById(long id);
    }
}