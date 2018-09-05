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

        public TrainingController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger, 
          TrainingService trainingService)
        {
            _userManager = userManager;
            _logger = logger;
            _trainingService = trainingService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _trainingService.GenerateSession(10));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IList<TrainingResultItemView> result)
        {
            return Ok();
        }
    }
}
