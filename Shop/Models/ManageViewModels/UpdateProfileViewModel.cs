using System.ComponentModel.DataAnnotations;

namespace Shop.Models.ManageViewModels
{
    public class UpdateProfileViewModel
    {
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        [Display(Name = "Phone number")]
        public string PhoneNumber { get; set; }

        public string Image { get; set; }
    }
}
