using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceServer.Data.Models;

public class Order
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public required OrderStatus Status { get; set; }

    [Required]
    public required string AccountId { get; set; }

    [Required]
    public required string Address { get; set; }

    [Required]
    public required DateTime OrderTime { get; set; }

    public DateTime? DeliveryTime { get; set; }

    public string? AdditionalNotes { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new();
}
