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
        private readonly IImageService _imageService;

        public ManageController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger,
          IImageService imageService)
        {
            _userManager = userManager;
            _logger = logger;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var model = new IndexViewModel
            {
                UserName = user.UserName,
                Email = user.Email,
                IsEmailConfirmed = user.EmailConfirmed,
                Role = "User",
                ImageId = user.ImageId,
                Image = await _imageService.GetEncodedProfileImage(user)
            };

            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UpdateProfileViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);

                await _imageService.SaveEncodedProfileImage(user, model);
                
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
