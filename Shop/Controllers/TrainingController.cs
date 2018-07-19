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
using Shop.Data.Models;
using Shop.Services;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TrainingController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly IDataAcessService<Word> _dictionary;

        public TrainingController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger, 
          IDataAcessService<Word> dictionary)
        {
            _userManager = userManager;
            _logger = logger;
            _dictionary = dictionary;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var words = _dictionary.GetAll();
            words.Shuffle();
            
            var training = new List<TrainingItemView>();
            var trainingCapacity = words.Count < 10 ? words.Count : 10;

            for (var i = 0; i < trainingCapacity; i++)
            {
                words.Shuffle();
                var dictionaryItem = words[i];
                var options = words.Take(4).Select(w => w.Term).ToList();

                if(options.All(it => it != dictionaryItem.Translation))
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
