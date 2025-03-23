using System.Text.Json.Serialization;

namespace ResourceServer.Data.DTO;

public class JwksEndpointPayloadDto
{
	[JsonPropertyName("keys")]
	public required List<JwksDto> Keys { get; set; }
}
