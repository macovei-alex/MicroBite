namespace ResourceServer.Data.DTO;

public class CreateOrderDto
{
	public required string Address { get; set; }
	public string? AdditionalNotes { get; set; }
	public required List<Item> OrderItems { get; set; }

	public class Item
	{
		public required int ProductId { get; set; }
		public required int Quantity { get; set; }
	}
}

