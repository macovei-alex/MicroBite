using System.ComponentModel.DataAnnotations;

namespace ResourceServer.Data.DTO;

public class ProductCreateDto
{
	public required string Name { get; set; }
	public required int CategoryId { get; set; }
	public required decimal Price { get; set; }
	public required string Description { get; set; }
	public string? Image { get; set; }
}
