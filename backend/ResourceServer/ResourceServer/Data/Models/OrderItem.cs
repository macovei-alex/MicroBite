using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResourceServer.Data.Models;

public class OrderItem
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	public Product? Product { get; set; }

	[JsonIgnore]
	public Order? Order { get; set; }

	[Required]
	public decimal TotalPrice { get; set; }

	[Required]
	public int Count { get; set; }
}
