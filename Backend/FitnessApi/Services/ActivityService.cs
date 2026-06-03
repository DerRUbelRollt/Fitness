using FitnessApi.Data;
using FitnessApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApi.Services;

public interface IActivityService
{
    Task<List<ScheduledActivity>> GetAllAsync();
    Task<ScheduledActivity?> GetByIdAsync(string id);
    Task<ScheduledActivity> CreateAsync(ScheduledActivity activity);
    Task<ScheduledActivity> UpdateAsync(string id, ScheduledActivity activity);
    Task<bool> DeleteAsync(string id);
}

public class ActivityService : IActivityService
{
    private readonly FitnessDbContext _context;

    public ActivityService(FitnessDbContext context)
    {
        _context = context;
    }

    public async Task<List<ScheduledActivity>> GetAllAsync()
    {
        return await _context.ScheduledActivities.ToListAsync();
    }

    public async Task<ScheduledActivity?> GetByIdAsync(string id)
    {
        return await _context.ScheduledActivities.FindAsync(id);
    }

    public async Task<ScheduledActivity> CreateAsync(ScheduledActivity activity)
    {
        _context.ScheduledActivities.Add(activity);
        await _context.SaveChangesAsync();
        return activity;
    }

    public async Task<ScheduledActivity> UpdateAsync(string id, ScheduledActivity activity)
    {
        var existing = await _context.ScheduledActivities.FindAsync(id);
        if (existing == null)
            throw new InvalidOperationException($"Activity {id} not found");

        existing.Title = activity.Title;
        existing.Color = activity.Color;
        existing.Icon = activity.Icon;
        existing.Date = activity.Date;
        existing.StartTime = activity.StartTime;
        existing.DurationMin = activity.DurationMin;
        existing.Completed = activity.Completed;
        existing.Notes = activity.Notes;
        existing.Distance = activity.Distance;
        existing.Steps = activity.Steps;
        existing.PresetId = activity.PresetId;
        existing.CustomId = activity.CustomId;

        _context.ScheduledActivities.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var activity = await _context.ScheduledActivities.FindAsync(id);
        if (activity == null)
            return false;

        _context.ScheduledActivities.Remove(activity);
        await _context.SaveChangesAsync();
        return true;
    }
}
