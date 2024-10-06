namespace bits_orchestra_webapi.Models
{
	public static class EmployeeMapper
	{
		public static Employee ToEmployee(this EmployeeDTO employeeDto) 
		{
			return new Employee
			{
				Name = employeeDto.Name,
				BirthDate = employeeDto.BirthDate,
				IsMarried = employeeDto.IsMarried,
				PhoneNumber = employeeDto.PhoneNumber,
				Salary = employeeDto.Salary
			};
		}
	}
}
