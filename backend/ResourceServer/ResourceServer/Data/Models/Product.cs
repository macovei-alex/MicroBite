using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceServer.Data.Models
{
	[Table(name: "product")]
	public class Product
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public required ProductCategory Category { get; set; }

		[Required]
		public required string Name { get; set; }

		[Required]
		public required decimal Price { get; set; }

		[Required]
		public required string Description { get; set; }

		public string? Image { get; set; }
	}
}
