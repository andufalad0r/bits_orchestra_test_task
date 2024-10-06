using System.ComponentModel.DataAnnotations;

namespace bits_orchestra_webapi.Models
{
	public class Employee
	{
		public int Id { get; set; }
		public string Name { get; set; } = null!;
		public DateTime BirthDate { get; set; }
		public bool IsMarried { get; set; }
		public string PhoneNumber { get; set; } = null!;
		public decimal Salary { get; set; }
	}
}
