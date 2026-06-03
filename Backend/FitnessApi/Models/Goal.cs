namespace FitnessApi.Models;

public class Goal
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int Target { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty; // "day", "week", "month"
    public string? ActivityFilter { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
