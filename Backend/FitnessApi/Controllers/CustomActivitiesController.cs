using Microsoft.AspNetCore.Mvc;
using FitnessApi.Models;
using FitnessApi.Services;

namespace FitnessApi.Controllers;

[ApiController]
[Route("custom-activities")]
public class CustomActivitiesController : ControllerBase
{
    private readonly ICustomActivityService _customActivityService;

    public CustomActivitiesController(ICustomActivityService customActivityService)
    {
        _customActivityService = customActivityService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CustomActivity>>> GetAll()
    {
        var activities = await _customActivityService.GetAllAsync();
        return Ok(activities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomActivity>> GetById(string id)
    {
        var activity = await _customActivityService.GetByIdAsync(id);
        if (activity == null)
        {
            return NotFound();
        }
        return Ok(activity);
    }

    [HttpPost]
    public async Task<ActionResult<CustomActivity>> Create([FromBody] CustomActivity activity)
    {
        var created = await _customActivityService.CreateAsync(activity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CustomActivity>> Update(string id, [FromBody] CustomActivity activity)
    {
        try
        {
            var updated = await _customActivityService.UpdateAsync(id, activity);
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
        var deleted = await _customActivityService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
