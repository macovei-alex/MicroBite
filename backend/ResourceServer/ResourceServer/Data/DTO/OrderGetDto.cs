namespace ResourceServer.Data.DTO;

public class OrderGetDto
{
	public required int Id { get; set; }
	public required Guid AccountId { get; set; }
	public required string Status { get; set; }
	public required string Address { get; set; }
	public required DateTime OrderTime { get; set; }
	public DateTime? DeliveryTime { get; set; }
	public string? AdditionalNotes { get; set; }
	public required List<Item> OrderItems { get; set; }

	public class Item
	{
		public required int ProductId { get; set; }
		public required int Quantity { get; set; }
		public required decimal TotalPrice { get; set; }


		public override bool Equals(object? obj)
		{
			if (obj is not Item other)
			{
				return false;
			}
			return ProductId == other.ProductId
				&& Quantity == other.Quantity
				&& TotalPrice == other.TotalPrice;
		}

		public override int GetHashCode()
		{
			return base.GetHashCode();
		}
	}

	public override bool Equals(object? obj)
	{
		if (obj is not OrderGetDto other)
		{
			return false;
		}
		return Id == other.Id
			&& AccountId.Equals(other.AccountId)
			&& Status == other.Status
			&& Address == other.Address
			&& OrderTime.Equals(other.OrderTime)
			&& (
				(DeliveryTime == null && other.DeliveryTime == null) ||
				(DeliveryTime != null && other.DeliveryTime != null && DeliveryTime.Equals(other.DeliveryTime))
			)
			&& AdditionalNotes == other.AdditionalNotes
			&& OrderItems.SequenceEqual(other.OrderItems);
	}

	public override int GetHashCode()
	{
		return base.GetHashCode();
	}
}
