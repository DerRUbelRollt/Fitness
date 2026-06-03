using FitnessApi.Data;
using FitnessApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApi.Services;

public interface IHabitService
{
    Task<List<Habit>> GetAllAsync();
    Task<Habit?> GetByIdAsync(string id);
    Task<Habit> CreateAsync(Habit habit);
    Task<Habit> UpdateAsync(string id, Habit habit);
    Task<bool> DeleteAsync(string id);
}

public class HabitService : IHabitService
{
    private readonly FitnessDbContext _context;

    public HabitService(FitnessDbContext context)
    {
        _context = context;
    }

    public async Task<List<Habit>> GetAllAsync()
    {
        return await _context.Habits.ToListAsync();
    }

    public async Task<Habit?> GetByIdAsync(string id)
    {
        return await _context.Habits.FindAsync(id);
    }

    public async Task<Habit> CreateAsync(Habit habit)
    {
        _context.Habits.Add(habit);
        await _context.SaveChangesAsync();
        return habit;
    }

    public async Task<Habit> UpdateAsync(string id, Habit habit)
    {
        var existing = await _context.Habits.FindAsync(id);
        if (existing == null)
            throw new InvalidOperationException($"Habit {id} not found");

        existing.Name = habit.Name;
        existing.Emoji = habit.Emoji;
        existing.Color = habit.Color;
        existing.Log = habit.Log;

        _context.Habits.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var habit = await _context.Habits.FindAsync(id);
        if (habit == null)
            return false;

        _context.Habits.Remove(habit);
        await _context.SaveChangesAsync();
        return true;
    }
}
