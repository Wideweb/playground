using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;
using System.Linq;
using Shop.Utils;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DictionaryController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;

        public DictionaryController(
          UserManager<ApplicationUser> userManager,
          ILogger<DictionaryController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(DB.Dictionary);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DictionaryItemView item)
        {
            if (ModelState.IsValid)
            {
                if(DB.Dictionary.Count <= 0)
                {
                    item.Id = 1;
                }
                else
                {
                    item.Id = DB.Dictionary.Max(it => it.Id) + 1;
                }

                DB.Dictionary.Add(item);
                DB.Words.Add(item.Translation);
                return Ok();
            }

            return BadRequest(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            DB.Dictionary.RemoveAll(it => it.Id == id);
            return Ok();
        }
    }
}
