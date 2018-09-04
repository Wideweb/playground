using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;
using Shop.Services;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DictionaryController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly IDictionaryService _dictionaryService;

        public DictionaryController(
            UserManager<ApplicationUser> userManager,
            ILogger<DictionaryController> logger,
            IDictionaryService dictionaryService
            )
        {
            _userManager = userManager;
            _logger = logger;
            _dictionaryService = dictionaryService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = _userManager.GetUserId(User);
            var items = await _dictionaryService.GetItemViewsByUserId(userId);
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(long id)
        {
            return Ok(await _dictionaryService.GetItemViewById(id));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DictionaryItemView item)
        {
            if (ModelState.IsValid)
            {
                var userId = _userManager.GetUserId(User);
                await _dictionaryService.SaveItemViewByUserId(item, userId);       
                return Ok();
            }

            return BadRequest(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            _dictionaryService.DeleteItemById(id);
            return Ok();
        }
    }
}