using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Shop.Services;
using System;
using System.Threading.Tasks;

namespace Shop.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        public async Task SendMessage(string message)
        {
            string name = Context.User.Identity.Name;

            foreach (var connectionId in _connections.GetAllConnections())
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", name, message);
            }
        }

        public async Task SendPrivateMessage(string who, string message)
        {
            string name = Context.User.Identity.Name;

            foreach (var connectionId in _connections.GetConnections(who))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", name, message);
            }
        }

        public override async Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;

            foreach (var connectionId in _connections.GetAllConnections())
            {
                await Clients.Client(connectionId).SendAsync("UserConnected", name);
            }

            _connections.Add(name, Context.ConnectionId);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string name = Context.User.Identity.Name;

            _connections.Remove(name, Context.ConnectionId);

            foreach (var connectionId in _connections.GetAllConnections())
            {
                await Clients.Client(connectionId).SendAsync("UserDisconnected", name);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
