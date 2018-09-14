using System;
using System.Collections.Generic;

namespace Shop.Models
{
    public class PushSubscription
    {
        public string Endpoint { get; set; }

        public IDictionary<string, string> Keys { get; set; }
    }
}
