using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DictionaryController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;

        private static new List<DictionaryItemView> _dictionary = new List<DictionaryItemView>() {
            new DictionaryItemView { Term = "Home", Translation = "Дом" },
            new DictionaryItemView { Term = "Head", Translation = "Голова" }
        };

        public DictionaryController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_dictionary);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DictionaryItemView item)
        {
            if (ModelState.IsValid)
            {
                _dictionary.Add(item);
                return Ok();
            }

            return BadRequest(item);
        }
    }
}
