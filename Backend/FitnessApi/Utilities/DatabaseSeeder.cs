using Microsoft.EntityFrameworkCore;
using FitnessApi.Data;
using FitnessApi.Models;

namespace FitnessApi.Utilities;

public class DatabaseSeeder
{
    public static async Task SeedAsync(FitnessDbContext context)
    {
        // Nur seeden wenn Datenbank leer ist
        if (await context.Users.AnyAsync())
            return;

        // Default User erstellen
        var defaultUser = new UserProfile
        {
            Id = "user-1",
            Name = "Max Rubel",
            CurrentStreak = 0,
            LongestStreak = 0,
            StepsToday = 0,
            StepsGoal = 10000,
            CalorieToday = 0,
            CalorieGoal = 2100,
            MinutesGoal = 60
        };

        context.Users.Add(defaultUser);

        // Beispiel Goals
        var goals = new List<Goal>
        {
            new()
            {
                Id = Guid.NewGuid().ToString().Substring(0, 8),
                Title = "4× Gym pro Woche",
                Target = 4,
                Unit = "Einheiten",
                Period = "week",
                ActivityFilter = "gym",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid().ToString().Substring(0, 8),
                Title = "Täglich 10k Schritte",
                Target = 10000,
                Unit = "Schritte",
                Period = "day",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Goals.AddRange(goals);
        await context.SaveChangesAsync();
    }
}
