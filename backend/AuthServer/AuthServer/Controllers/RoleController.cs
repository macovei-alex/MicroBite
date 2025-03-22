using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;

namespace AuthServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoleController(RoleRepository repository) : ControllerBase
{
    private readonly RoleRepository _repository = repository;

    [HttpGet("{id}")]
    public async Task<ActionResult<Role>> GetById(int id)
    {
        var role = await _repository.GetByIdAsync(id);
        return role != null ? Ok(role) : NotFound();
    }

    [HttpGet]
    public async Task<ActionResult<List<Role>>> GetAll()
    {
        return Ok(await _repository.GetAllAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Role>> Create([FromBody] Role role)
    {
        var createdRole = await _repository.AddAsync(role);
        return CreatedAtAction(nameof(GetById), new { id = createdRole.Id }, createdRole);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Role role)
    {
        if (id != role.Id) return BadRequest();
        return await _repository.UpdateAsync(role) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await _repository.DeleteAsync(id) ? NoContent() : NotFound();
    }
}