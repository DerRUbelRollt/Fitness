using FitnessApi.Data;
using FitnessApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApi.Services;

public interface IUserService
{
    Task<UserProfile?> GetAsync();
    Task<UserProfile> UpdateAsync(UserProfile user);
}

public class UserService : IUserService
{
    private readonly FitnessDbContext _context;
    private const string DefaultUserId = "user-1";

    public UserService(FitnessDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfile?> GetAsync()
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == DefaultUserId);
    }

    public async Task<UserProfile> UpdateAsync(UserProfile user)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Id == DefaultUserId);

        if (existing == null)
        {
            user.Id = DefaultUserId;
            _context.Users.Add(user);
        }
        else
        {
            existing.Name = user.Name;
            existing.CurrentStreak = user.CurrentStreak;
            existing.LongestStreak = user.LongestStreak;
            existing.LastActivityDate = user.LastActivityDate;
            existing.StepsToday = user.StepsToday;
            existing.StepsGoal = user.StepsGoal;
            existing.CalorieToday = user.CalorieToday;
            existing.CalorieGoal = user.CalorieGoal;
            existing.MinutesGoal = user.MinutesGoal;

            _context.Users.Update(existing);
            user = existing;
        }

        await _context.SaveChangesAsync();
        return user;
    }
}
