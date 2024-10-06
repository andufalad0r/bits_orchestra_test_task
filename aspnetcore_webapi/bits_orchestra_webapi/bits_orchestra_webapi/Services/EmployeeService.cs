using bits_orchestra_webapi.Data;
using bits_orchestra_webapi.Models;
using Microsoft.EntityFrameworkCore;

namespace bits_orchestra_webapi.Services
{
	public class EmployeeService : IEmployeeService
	{
		public readonly AppDbContext dbContext;
		public EmployeeService(AppDbContext dbContext)
		{
			this.dbContext = dbContext;
		}
		public async Task<List<Employee>> GetAllAsync()
		{
			return await dbContext.Employees.ToListAsync();
		}
		public async Task<List<Employee>> AddAsync(List<EmployeeDTO> employees)
		{
			var employeeModels = employees.Select(employee => employee.ToEmployee()).ToList();
			await dbContext.Employees.AddRangeAsync(employeeModels);
			await dbContext.SaveChangesAsync();
			return employeeModels;
		}
		public async Task<Employee> UpdateAsync(int id, EmployeeDTO employee)
		{
			var employeeModel = await dbContext.Employees.FirstOrDefaultAsync(employee => employee.Id == id);
			if(employeeModel == null)
			{
				return null;
			}
			employeeModel.Name = employee.Name;
			employeeModel.Salary = employee.Salary;
			employeeModel.PhoneNumber = employee.PhoneNumber;
			employeeModel.BirthDate = employee.BirthDate;

			await dbContext.SaveChangesAsync();
			return employeeModel;
		}
		public async Task<Employee> DeleteAsync(int id)
		{
			var employeeModel = await dbContext.Employees.FirstOrDefaultAsync(employee => employee.Id == id);
			if (employeeModel == null)
			{
				return null;
			}
			dbContext.Employees.Remove(employeeModel);
			await dbContext.SaveChangesAsync();
			return employeeModel;
		}
	}
}
