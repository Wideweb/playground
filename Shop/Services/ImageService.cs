using System;
using System.Threading.Tasks;
using Shop.Models;
using Shop.Models.ManageViewModels;
using Shop.Utils;

namespace Shop.Services
{
    public class ImageService : IImageService
    {
        private readonly IFileManager _fileManager;
        
        public ImageService(IFileManager fileManager)
        {
            _fileManager = fileManager;
        }
        
        public async Task<string> GetEncodedProfileImage(ApplicationUser user)
        {
            if (String.IsNullOrEmpty(user.ImageId))
                return String.Empty;
            

                var sourceImage = await _fileManager.Get(Folder.Profile, user.ImageId);
                var encodedImage = FileConverter.ToBase64String(sourceImage);

            return encodedImage;
        }

        public async Task SaveEncodedProfileImage(ApplicationUser user, UpdateProfileViewModel model)
        {
            if (IsNewImageFromModel(model))
            {
                await _fileManager.Delete(Folder.Profile, user.ImageId);
                user.ImageId = await _fileManager.Save(FileConverter.FromBase64String(model.Image), Folder.Profile);
            }
            else if(IsImageDeleted(model, user))
            {
                await _fileManager.Delete(Folder.Profile, user.ImageId);
                user.ImageId = null;
            }
        }
        
        private bool IsNewImageFromModel(UpdateProfileViewModel model)
        {
            return !String.IsNullOrEmpty(model.Image) && String.IsNullOrEmpty(model.ImageId);
        }

        private bool IsImageDeleted(UpdateProfileViewModel model, ApplicationUser user)
        {
            return String.IsNullOrEmpty(model.Image) && !String.IsNullOrEmpty(user.ImageId);
        }
    }

}