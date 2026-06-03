using Microsoft.AspNetCore.Mvc;
using FitnessApi.Models;
using FitnessApi.Services;

namespace FitnessApi.Controllers;

[ApiController]
[Route("[controller]")]
public class HabitsController : ControllerBase
{
    private readonly IHabitService _habitService;

    public HabitsController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Habit>>> GetAll()
    {
        var habits = await _habitService.GetAllAsync();
        return Ok(habits);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Habit>> GetById(string id)
    {
        var habit = await _habitService.GetByIdAsync(id);
        if (habit == null)
        {
            return NotFound();
        }
        return Ok(habit);
    }

    [HttpPost]
    public async Task<ActionResult<Habit>> Create([FromBody] Habit habit)
    {
        var created = await _habitService.CreateAsync(habit);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Habit>> Update(string id, [FromBody] Habit habit)
    {
        try
        {
            var updated = await _habitService.UpdateAsync(id, habit);
            return Ok(updated);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _habitService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
