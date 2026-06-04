using Microsoft.AspNetCore.Mvc;
using FitnessApi.Models;
using FitnessApi.Services;

namespace FitnessApi.Controllers;

[ApiController]
[Route("activities")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ScheduledActivity>>> GetAll()
    {
        var activities = await _activityService.GetAllAsync();
        return Ok(activities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ScheduledActivity>> GetById(string id)
    {
        var activity = await _activityService.GetByIdAsync(id);
        if (activity == null)
        {
            return NotFound();
        }
        return Ok(activity);
    }

    [HttpPost]
    public async Task<ActionResult<ScheduledActivity>> Create([FromBody] ScheduledActivity activity)
    {
        var created = await _activityService.CreateAsync(activity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ScheduledActivity>> Update(string id, [FromBody] ScheduledActivity activity)
    {
        try
        {
            var updated = await _activityService.UpdateAsync(id, activity);
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
        var deleted = await _activityService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
