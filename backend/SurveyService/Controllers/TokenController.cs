using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using SurveyService.Models;



namespace SurveyService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly SurveyContext _context;

        public TokenController(IConfiguration config, SurveyContext context)
        {
            _configuration = config;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Users _userData)
        {

            if (_userData != null && _userData.UserName != null && _userData.Password != null)
            {
                System.Diagnostics.Debug.WriteLine("**********************************");
                System.Diagnostics.Debug.WriteLine(_userData.UserName);
                System.Diagnostics.Debug.WriteLine(_userData.Password);

                var user = await GetUser(_userData.UserName, _userData.Password);

                if (user != null)
                {
                    //create claims details based on the user information
                    var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("Id", user.UserId.ToString()),
                        new Claim("UserName", user.UserName),
                   };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddDays(1), signingCredentials: signIn);

                    var returnTokenObj = new Token
                    {
                        UserId = user.UserId,
                        TokenString = new JwtSecurityTokenHandler().WriteToken(token),
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    };
                    return Ok(returnTokenObj);
                }
                else
                {
                    return BadRequest("Invalid credentials");
                }
            }
            else
            {
                return BadRequest();
            }
        }

        private async Task<Users> GetUser(string name, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserName == name && u.Password == password);
        }
    }
}