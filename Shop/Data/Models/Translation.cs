using Shop.Services.Repository;

namespace Shop.Data.Models
{
    public class Translation : IEntity
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public Language Language { get; set; }
        public Word Word { get; set; }
    }
}