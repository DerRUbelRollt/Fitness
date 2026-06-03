using FitnessApi.Data;
using FitnessApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApi.Services;

public interface ICustomActivityService
{
    Task<List<CustomActivity>> GetAllAsync();
    Task<CustomActivity?> GetByIdAsync(string id);
    Task<CustomActivity> CreateAsync(CustomActivity activity);
    Task<CustomActivity> UpdateAsync(string id, CustomActivity activity);
    Task<bool> DeleteAsync(string id);
}

public class CustomActivityService : ICustomActivityService
{
    private readonly FitnessDbContext _context;

    public CustomActivityService(FitnessDbContext context)
    {
        _context = context;
    }

    public async Task<List<CustomActivity>> GetAllAsync()
    {
        return await _context.CustomActivities.ToListAsync();
    }

    public async Task<CustomActivity?> GetByIdAsync(string id)
    {
        return await _context.CustomActivities.FindAsync(id);
    }

    public async Task<CustomActivity> CreateAsync(CustomActivity activity)
    {
        _context.CustomActivities.Add(activity);
        await _context.SaveChangesAsync();
        return activity;
    }

    public async Task<CustomActivity> UpdateAsync(string id, CustomActivity activity)
    {
        var existing = await _context.CustomActivities.FindAsync(id);
        if (existing == null)
            throw new InvalidOperationException($"CustomActivity {id} not found");

        existing.Label = activity.Label;
        existing.Color = activity.Color;
        existing.IconId = activity.IconId;

        _context.CustomActivities.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var activity = await _context.CustomActivities.FindAsync(id);
        if (activity == null)
            return false;

        _context.CustomActivities.Remove(activity);
        await _context.SaveChangesAsync();
        return true;
    }
}
