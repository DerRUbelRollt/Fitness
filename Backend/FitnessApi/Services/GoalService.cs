using FitnessApi.Data;
using FitnessApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApi.Services;

public interface IGoalService
{
    Task<List<Goal>> GetAllAsync();
    Task<Goal?> GetByIdAsync(string id);
    Task<Goal> CreateAsync(Goal goal);
    Task<Goal> UpdateAsync(string id, Goal goal);
    Task<bool> DeleteAsync(string id);
}

public class GoalService : IGoalService
{
    private readonly FitnessDbContext _context;

    public GoalService(FitnessDbContext context)
    {
        _context = context;
    }

    public async Task<List<Goal>> GetAllAsync()
    {
        return await _context.Goals.ToListAsync();
    }

    public async Task<Goal?> GetByIdAsync(string id)
    {
        return await _context.Goals.FindAsync(id);
    }

    public async Task<Goal> CreateAsync(Goal goal)
    {
        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();
        return goal;
    }

    public async Task<Goal> UpdateAsync(string id, Goal goal)
    {
        var existing = await _context.Goals.FindAsync(id);
        if (existing == null)
            throw new InvalidOperationException($"Goal {id} not found");

        existing.Title = goal.Title;
        existing.Target = goal.Target;
        existing.Unit = goal.Unit;
        existing.Period = goal.Period;
        existing.ActivityFilter = goal.ActivityFilter;

        _context.Goals.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var goal = await _context.Goals.FindAsync(id);
        if (goal == null)
            return false;

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();
        return true;
    }
}
