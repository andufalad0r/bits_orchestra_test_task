using bits_orchestra_webapi.Models;
using bits_orchestra_webapi.Services;
using Microsoft.AspNetCore.Mvc;

namespace bits_orchestra_webapi.Controllers
{
	[Route("test/[controller]")]
	[ApiController]
	public class EmployeeController : ControllerBase
	{
		public readonly IEmployeeService employeeService;
        public EmployeeController(IEmployeeService employeeService)
        {
            this.employeeService = employeeService;
        }
		[HttpGet]
		public async Task<IActionResult> GetAll() 
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);
			var employees = await employeeService.GetAllAsync();
			return Ok(employees);
		}
		[HttpPost]
		public async Task<IActionResult> Add([FromBody] List<EmployeeDTO> employee)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);
			var employees = await employeeService.AddAsync(employee);
			return Ok(employees);
		}
		[HttpPut]
		[Route("{id:int}")]
		public async Task<IActionResult> Update([FromRoute] int id, [FromBody] EmployeeDTO employeeDto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);
			var employee = await employeeService.UpdateAsync(id, employeeDto);
			if(employee == null)
			{
				return NotFound();
			}
			return Ok(employee);
		}
		[HttpDelete]
		[Route("{id:int}")]
		public async Task<IActionResult> Delete([FromRoute] int id)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);
			var employee = await employeeService.DeleteAsync(id);
			if (employee == null)
			{
				return NotFound();
			}
			return Ok(employee);
		}
	}
}
