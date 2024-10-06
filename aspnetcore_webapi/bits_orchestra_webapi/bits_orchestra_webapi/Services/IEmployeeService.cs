using bits_orchestra_webapi.Models;

namespace bits_orchestra_webapi.Services
{
	public interface IEmployeeService
	{
		Task<List<Employee>> GetAllAsync();
		Task<List<Employee>> AddAsync(List<EmployeeDTO> employees);
		Task<Employee> UpdateAsync(int id, EmployeeDTO employee);
		Task<Employee> DeleteAsync(int id);
	}
}
