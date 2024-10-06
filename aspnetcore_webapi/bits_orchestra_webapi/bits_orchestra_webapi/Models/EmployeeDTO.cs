using System.ComponentModel.DataAnnotations;

namespace bits_orchestra_webapi.Models
{
	public class EmployeeDTO
	{
		[Required(ErrorMessage = "Name is required")]
		[StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
		public string Name { get; set; } = null!;

		[Required(ErrorMessage = "Birth date is required")]
		[DataType(DataType.Date)]
		[Display(Name = "Birth Date")]
		public DateTime BirthDate { get; set; }

		[Display(Name = "Marital Status")]
		public bool IsMarried { get; set; }

		[Required(ErrorMessage = "Phone number is required")]
		[Phone(ErrorMessage = "Invalid phone number")]
		[Display(Name = "Phone Number")]
		public string PhoneNumber { get; set; } = null!;

		[Required(ErrorMessage = "Salary is required")]
		[Range(7100, double.MaxValue, ErrorMessage = "Salary must be at least 7100 hrn")]
		[DataType(DataType.Currency)]
		public decimal Salary { get; set; }
	}
}
