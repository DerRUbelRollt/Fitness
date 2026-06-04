using System.Text.Json;
using System.Text.Json.Serialization;

namespace FitnessApi.Utilities;

public class DateOnlyJsonConverter : JsonConverter<string>
{
    public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (string.IsNullOrEmpty(value))
            return value ?? string.Empty;

        // Parse the incoming value and convert to YYYY-MM-DD format
        if (DateTime.TryParse(value, out var dt))
        {
            return dt.ToString("yyyy-MM-dd");
        }

        return value;
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        if (string.IsNullOrEmpty(value))
        {
            writer.WriteNullValue();
            return;
        }

        // Ensure the output is always in YYYY-MM-DD format
        if (DateTime.TryParse(value, out var dt))
        {
            writer.WriteStringValue(dt.ToString("yyyy-MM-dd"));
        }
        else if (value.Length == 10 && value.Contains("-"))
        {
            // Already in correct format
            writer.WriteStringValue(value);
        }
        else
        {
            writer.WriteStringValue(value);
        }
    }
}

public class TimeOnlyJsonConverter : JsonConverter<string>
{
    public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (string.IsNullOrEmpty(value))
            return value ?? string.Empty;

        // Parse and convert to HH:mm format
        if (TimeSpan.TryParse(value, out var ts))
        {
            return ts.ToString(@"hh\:mm");
        }

        if (DateTime.TryParse(value, out var dt))
        {
            return dt.ToString("HH:mm");
        }

        return value;
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        if (string.IsNullOrEmpty(value))
        {
            writer.WriteNullValue();
            return;
        }

        // Ensure output is HH:mm format
        if (TimeSpan.TryParse(value, out var ts))
        {
            writer.WriteStringValue(ts.ToString(@"hh\:mm"));
        }
        else if (DateTime.TryParse(value, out var dt))
        {
            writer.WriteStringValue(dt.ToString("HH:mm"));
        }
        else if (value.Length == 5 && value.Contains(":"))
        {
            // Already in correct format
            writer.WriteStringValue(value);
        }
        else
        {
            writer.WriteStringValue(value);
        }
    }
}
