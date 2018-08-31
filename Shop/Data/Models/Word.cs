using System.Collections.Generic;

namespace Shop.Data.Models
{
    public class Word : IEntity
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Text { get; set; }
        public Language Language { get; set; }
        public ICollection<Translation> Translations { get; set; } = new List<Translation>();
        public string ImageId { get; set; }
    }
}