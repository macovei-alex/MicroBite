using System.Text;

namespace AuthServer.Utils;

public static class Functions
{
	public static string ToSnakeCase(string input)
	{
		if (string.IsNullOrEmpty(input))
		{
			return input;
		}

		StringBuilder result = new();
		result.Append(char.ToLower(input[0]));

		for (int i = 1; i < input.Length; i++)
		{
			if (char.IsUpper(input[i]))
			{
				result.Append('-');
			}
			result.Append(char.ToLower(input[i]));
		}

		return result.ToString();
	}
}
