using Microsoft.AspNetCore.Mvc;
using FitnessApi.Models;
using FitnessApi.Services;

namespace FitnessApi.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<UserProfile>> GetUser()
    {
        var user = await _userService.GetAsync();
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult<UserProfile>> UpdateUser([FromBody] UserProfile user)
    {
        var updated = await _userService.UpdateAsync(user);
        return Ok(updated);
    }
}
