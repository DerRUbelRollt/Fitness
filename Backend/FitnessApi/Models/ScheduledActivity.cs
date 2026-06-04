using System.Text.Json.Serialization;
using FitnessApi.Utilities;

namespace FitnessApi.Models;

public class ScheduledActivity
{
    public string Id { get; set; } = string.Empty;
    public string? PresetId { get; set; }
    public string? CustomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    
    [JsonConverter(typeof(DateOnlyJsonConverter))]
    public string Date { get; set; } = string.Empty; // ISO YYYY-MM-DD
    
    [JsonConverter(typeof(TimeOnlyJsonConverter))]
    public string? StartTime { get; set; } // HH:mm format
    
    public int DurationMin { get; set; }
    public bool Completed { get; set; }
    public string? Notes { get; set; }
    public double? Distance { get; set; }
    public int? Steps { get; set; }
}
