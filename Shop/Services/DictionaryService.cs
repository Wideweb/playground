using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Shop.Data.Models;
using Shop.Extensions;
using Shop.Models;
using Shop.Utils;

namespace Shop.Services
{
    public class DictionaryService : IDictionaryService
    {
        private readonly IDataAcessService<Word> _dictionaryAcessService;
        private readonly IFileManager _imageManager;

        public DictionaryService(IDataAcessService<Word> dictionaryAcessService, IFileManager imageManager)
        {
            _dictionaryAcessService = dictionaryAcessService;
            _imageManager = imageManager;
        }

        public async Task<DictionaryItemView> GetItemViewById(long id)
        {
            var word = await _dictionaryAcessService
                .Get(id);

            if(word == null)
            {
                throw new ArgumentException(nameof(id));
            }

            var encodedImage = string.Empty;

            if (!string.IsNullOrEmpty(word.ImageId))
            {
                var sourceImage = await _imageManager.Get(Folder.Dictionary, word.ImageId);
                encodedImage = FileConverter.ToBase64String(sourceImage);
            }

            return new DictionaryItemView
            {
                Id = word.Id,
                Term = word.Text,
                Translation = word.Translations.FirstOrDefault()?.Text ?? "no translation",
                Image = encodedImage
            };
        }

        public async Task<List<DictionaryItemView>> GetItemViewsByUserId(string userId)
        {
            var words = _dictionaryAcessService
                .GetAll()
                .Where(it => it.UserId == userId);

            var items = new List<DictionaryItemView>();
            foreach (var word in words)
            {
                var item = new DictionaryItemView();

                item.Id = word.Id;
                item.Term = word.Text;
                item.Translation = word.Translations.FirstOrDefault()?.Text ?? "no translation";

                var encodedImage = string.Empty;

                if (!string.IsNullOrEmpty(word.ImageId))
                {
                    var sourceImage = await _imageManager.Get(Folder.Dictionary, word.ImageId);
                    encodedImage = FileConverter.ToBase64String(sourceImage);
                }

                item.Image = encodedImage;
                
                items.Add(item);
            }
            
            return items;
        }

        public async Task SaveItemViewByUserId(DictionaryItemView item, string userId)
        {
            var word = item.ToWordWithUserId(userId);
            
            if (!string.IsNullOrEmpty(item.Image))
            {
                var imageId = await _imageManager.Save(FileConverter.FromBase64String(item.Image), Folder.Dictionary);
                word.ImageId = imageId;
            }
            
            _dictionaryAcessService.Save(word);
        }

        public void DeleteItemById(long id)
        {
            _dictionaryAcessService.Delete(id);
        }
    }
}