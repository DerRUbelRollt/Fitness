using Microsoft.AspNetCore.Mvc;
using FitnessApi.Models;
using FitnessApi.Services;

namespace FitnessApi.Controllers;

[ApiController]
[Route("[controller]")]
public class GoalsController : ControllerBase
{
    private readonly IGoalService _goalService;

    public GoalsController(IGoalService goalService)
    {
        _goalService = goalService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Goal>>> GetAll()
    {
        var goals = await _goalService.GetAllAsync();
        return Ok(goals);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Goal>> GetById(string id)
    {
        var goal = await _goalService.GetByIdAsync(id);
        if (goal == null)
        {
            return NotFound();
        }
        return Ok(goal);
    }

    [HttpPost]
    public async Task<ActionResult<Goal>> Create([FromBody] Goal goal)
    {
        var created = await _goalService.CreateAsync(goal);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Goal>> Update(string id, [FromBody] Goal goal)
    {
        try
        {
            var updated = await _goalService.UpdateAsync(id, goal);
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
        var deleted = await _goalService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
