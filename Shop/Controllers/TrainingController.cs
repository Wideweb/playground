using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;
using System.Linq;
using Shop.Extensions;
using Shop.Utils;
using System.Collections.Generic;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TrainingController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;

        

        public TrainingController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            DB.Dictionary.Shuffle();
            var training = new List<TrainingItemView>();
            var trainingCapacity = DB.Dictionary.Count < 10 ? DB.Dictionary.Count : 10;

            for (var i = 0; i < trainingCapacity; i++)
            {
                DB.Words.Shuffle();
                var dictionaryItem = DB.Dictionary[i];
                var options = DB.Words.Take(4).ToList();

                if(!options.Any(it => it == dictionaryItem.Translation))
                {
                    options.RemoveAt(0);
                    options.Add(dictionaryItem.Translation);
                }

                training.Add(new TrainingItemView {
                    DictionaryItem = dictionaryItem,
                    Options = options
                });
            }

            return Ok(training);
        }
    }
}
