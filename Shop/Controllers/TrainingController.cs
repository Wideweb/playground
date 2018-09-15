using System.Collections.Generic;
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
    public class TrainingController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly TrainingService _trainingService;
        private readonly IDictionaryService _dictionaryService;

        public TrainingController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger, 
          TrainingService trainingService,
          IDictionaryService dictionaryService)
        {
            _userManager = userManager;
            _logger = logger;
            _trainingService = trainingService;
            _dictionaryService = dictionaryService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = _userManager.GetUserId(User);

            if(_dictionaryService.GetCapacity(userId) < 10)
            {
                return BadRequest(new DictionaryCapacityError(10));
            }

            return Ok(await _trainingService.GenerateSession(10, userId));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IList<TrainingResultItemView> result)
        {
            return Ok();
        }
    }
}
