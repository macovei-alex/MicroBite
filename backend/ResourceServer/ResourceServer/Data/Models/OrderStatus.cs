using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceServer.Data.Models;

public class OrderStatus
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    [Required]
    public required string Name { get; set; }
}
