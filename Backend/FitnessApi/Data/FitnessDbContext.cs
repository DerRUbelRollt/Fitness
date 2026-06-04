using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using FitnessApi.Models;
using System.Linq;

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

               var logComparer = new ValueComparer<Dictionary<string, bool>>(
                        (d1, d2) =>
                            d1 != null &&
                            d2 != null &&
                            d1.OrderBy(x => x.Key)
                            .SequenceEqual(d2.OrderBy(x => x.Key)),

                        d => d.Aggregate(
                            0,
                            (hash, kv) => HashCode.Combine(hash, kv.Key, kv.Value)
                        ),

                        d => d.ToDictionary(
                            kv => kv.Key,
                            kv => kv.Value
                        )
                    );
        modelBuilder.Entity<Habit>()
            .Property(h => h.Log)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<Dictionary<string, bool>>(v, (JsonSerializerOptions?)null) ?? new())
                    .Metadata.SetValueComparer(logComparer);
    }
}
