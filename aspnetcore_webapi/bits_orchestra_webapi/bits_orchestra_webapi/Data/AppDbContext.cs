using bits_orchestra_webapi.Models;
using Microsoft.EntityFrameworkCore;

namespace bits_orchestra_webapi.Data
{
	public class AppDbContext : DbContext
	{
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }
        public DbSet<Employee> Employees { get; set; }
    }
}
