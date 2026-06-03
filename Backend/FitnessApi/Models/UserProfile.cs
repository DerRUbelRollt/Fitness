namespace FitnessApi.Models;

public class UserProfile
{
    public string Id { get; set; } = "user-1";
    public string Name { get; set; } = string.Empty;
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime? LastActivityDate { get; set; }
    public int StepsToday { get; set; }
    public int StepsGoal { get; set; } = 10000;
    public int CalorieToday { get; set; }
    public int CalorieGoal { get; set; } = 2100;
    public int MinutesGoal { get; set; } = 60;
}
