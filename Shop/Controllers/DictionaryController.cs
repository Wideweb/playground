﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shop.Models;
using System.Linq;
using Shop.Data.Models;
using Shop.Extensions;
using Shop.Services;
using Amazon.S3.Transfer;
using System;

namespace Shop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DictionaryController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        private readonly IDataAcessService<Word> _dictionary;
        private readonly IFileManager _fileManager;

        public DictionaryController(
            UserManager<ApplicationUser> userManager,
            ILogger<DictionaryController> logger,
            IDataAcessService<Word> dictionary,
            IFileManager fileManager)
        {
            _userManager = userManager;
            _logger = logger;
            _dictionary = dictionary;
            _fileManager = fileManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = _userManager.GetUserId(User);
            var values = _dictionary.GetAll().Where(it => it.UserId == userId).Select(it => it.ToDictionaryItemView());
            return Ok(values);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DictionaryItemView item)
        {
            if (ModelState.IsValid)
            {
                var userId = _userManager.GetUserId(User);
                _dictionary.Save(item.ToWordWithId(userId));

                if (!string.IsNullOrEmpty(item.Image))
                {
                    string image = item.Image.Split(',')[1];
                    await _fileManager.Save(Convert.FromBase64String(image), "item", "dictionary");
                    var file = await _fileManager.Get("item", "dictionary");
                }
                
                return Ok();
            }

            return BadRequest(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            _dictionary.Delete(id);
            return Ok();
        }
    }
}