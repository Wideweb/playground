using Shop.Models;
using System.Threading.Tasks;

namespace Shop.Services
{
    public interface IPushSubscriptionStore
    {
        Task StoreSubscriptionAsync(PushSubscription subscription);

        Task DiscardSubscriptionAsync(string endpoint);
    }
}
