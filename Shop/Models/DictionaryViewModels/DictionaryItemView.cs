using System.ComponentModel.DataAnnotations;

namespace Shop.Models
{
    public class DictionaryItemView
    {
        public long Id { get; set; }

        [Required]
        public string Term { get; set; }

        [Required]
        public string Translation { get; set; }

        public string Image { get; set; }

        public string ImageId { get; set; }
    }
}