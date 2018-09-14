using Shop.Models;

namespace Shop.Services
{
    public class PushNotificationServiceOptions
    {
        public string Subject { get; set; }

        public string PublicKey { get; set; }

        public string PrivateKey { get; set; }
    }

    public interface IPushNotificationService
    {
        void SendNotification(PushSubscription subscription, string payload);
    }
}
