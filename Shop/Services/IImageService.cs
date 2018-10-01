using System.Threading.Tasks;
using Shop.Models;
using Shop.Models.ManageViewModels;

namespace Shop.Services
{
    public interface IImageService
    {
        Task<string> GetEncodedProfileImage(ApplicationUser user);
        Task SaveEncodedProfileImage(ApplicationUser user, UpdateProfileViewModel model);
    }
}