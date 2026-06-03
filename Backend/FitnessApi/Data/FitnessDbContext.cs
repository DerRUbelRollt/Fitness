using Microsoft.EntityFrameworkCore;
using FitnessApi.Models;

namespace FitnessApi.Data;

public class FitnessDbContext : DbContext
{
    public FitnessDbContext(DbContextOptions<FitnessDbContext> options) : base(options)
    {
    }

    public DbSet<UserProfile> Users { get; set; }
    public DbSet<ScheduledActivity> ScheduledActivities { get; set; }
    public DbSet<CustomActivity> CustomActivities { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<Habit> Habits { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User (singleton)
        modelBuilder.Entity<UserProfile>()
            .HasKey(u => u.Id);

        // ScheduledActivity
        modelBuilder.Entity<ScheduledActivity>()
            .HasKey(a => a.Id);
        modelBuilder.Entity<ScheduledActivity>()
            .Property(a => a.Date)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        // CustomActivity
        modelBuilder.Entity<CustomActivity>()
            .HasKey(c => c.Id);

        // Goal
        modelBuilder.Entity<Goal>()
            .HasKey(g => g.Id);
        modelBuilder.Entity<Goal>()
            .Property(g => g.CreatedAt)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        // Habit with JSON serialization for Log
        modelBuilder.Entity<Habit>()
            .HasKey(h => h.Id);
        modelBuilder.Entity<Habit>()
            .Property(h => h.CreatedAt)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        modelBuilder.Entity<Habit>()
            .Property(h => h.Log)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, bool>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new());
    }
}
