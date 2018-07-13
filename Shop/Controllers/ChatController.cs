using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;
using Microsoft.AspNetCore.SignalR;
using Shop.Hubs;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(
          UserManager<ApplicationUser> userManager,
          ILogger<ManageController> logger,
          IHubContext<ChatHub> hubContext)
        {
            _userManager = userManager;
            _logger = logger;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_hubContext.Clients);
        }
    }
}
