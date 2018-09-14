using Microsoft.AspNetCore.Mvc;
using Shop.Models;
using Shop.Services;
using System.Threading.Tasks;

namespace Shop.Controllers
{
    public class PushNotificationsApiController
    {
        private readonly IPushSubscriptionStore _subscriptionStore;

        public PushNotificationsApiController(IPushSubscriptionStore subscriptionStore)
        {
            _subscriptionStore = subscriptionStore;
        }

        // GET push-notifications-api/public-key
        [HttpGet("public-key")]
        public ContentResult GetPublicKey()
        {
            return Content(_notificationService.PublicKey, "text/plain");
        }

        // POST push-notifications-api/subscriptions
        [HttpPost("subscriptions")]
        public async Task<IActionResult> StoreSubscription([FromBody]PushSubscription subscription)
        {
            await _subscriptionStore.StoreSubscriptionAsync(subscription);

            return new NoContentResult();
        }

        // DELETE push-notifications-api/subscriptions?endpoint={endpoint}
        [HttpDelete("subscriptions")]
        public async Task<IActionResult> DiscardSubscription(string endpoint)
        {
            await _subscriptionStore.DiscardSubscriptionAsync(endpoint);

            return new NoContentResult();
        }
    }
}
