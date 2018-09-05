using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;
using Shop.Models.ManageViewModels;
using Shop.Services;
using Shop.Utils;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ManageController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly IFileManager _imageManager;

        public ManageController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger,
          IFileManager imageManager)
        {
            _userManager = userManager;
            _logger = logger;
            _imageManager = imageManager;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var encodedImage = string.Empty;

            if (!string.IsNullOrEmpty(user.ImageId))
            {
                var sourceImage = await _imageManager.Get(Folder.Profile, user.ImageId);
                encodedImage = FileConverter.ToBase64String(sourceImage);
            }

            var model = new IndexViewModel
            {
                UserName = user.UserName,
                Email = user.Email,
                IsEmailConfirmed = user.EmailConfirmed,
                Role = "User",
                Image = encodedImage
            };

            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UpdateProfileViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);

                if (!string.IsNullOrEmpty(model.Image))
                {
                    user.ImageId = await _imageManager.Save(FileConverter.FromBase64String(model.Image), Folder.Profile);
                }
                else
                {
                    user.ImageId = null;
                }

                user.UserName = model.UserName;
                user.Email = model.Email;
                user.PhoneNumber = model.PhoneNumber;

                await _userManager.UpdateAsync(user);
                return Ok();
            }

            return BadRequest(model);
        }
    }
}
