using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SurveyService.Models;

namespace SurveyService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SurveyContext _context;

        public UsersController(SurveyContext context)
        {
            _context = context;
        }



        // POST: api/Users
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Users>> PostUsers(Users newUser)
        {
            var existingUsers = _context.Users.Where(u => u.Name == newUser.Name);
            // we have to make sure the user name is unique
            if (existingUsers.Any()) 
                return Conflict(new { message = $"An existing user with the name '{newUser.Name}' was already found." });

            if (newUser.Name.Length > 200 || newUser.Name.Length < 5) 
                return StatusCode(422, "User name is too long or too short. A valid User name is between 5 to 200 characters long"); 
            
            if (newUser.Password.Length > 200 || newUser.Password.Length < 6) 
                return StatusCode(422, "User password is too long or too short. A valid Password is btween 6 to 200 characters long");

            if (!IsPasswordStrong(newUser.Password))
                return StatusCode(422, "Password not strong enough. Strong password should contain at least one upper case and one lower case letter");

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsers", new { id = newUser.UserId }, newUser);
        }



        private  bool IsPasswordStrong(string password)
        {
            return Regex.IsMatch(password, @"^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$");
        }
    }
}
