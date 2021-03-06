﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SurveyService.Models;
using Microsoft.AspNetCore.Authorization;
using SurveyService.Utils;

namespace SurveyService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SurveysController : ControllerBase
    {
        private readonly SurveyContext _context;

        public SurveysController(SurveyContext context)
        {
            _context = context;
        }


        // GET: api/Surveys/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Survey>>> GetSurvey(int userId)
        {
            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != userId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            var survey =  _context.Survey.Where(s => s.UserId == userId);

            if (!survey.Any())
            {
                return new List<Survey>();
            }

            return await survey.ToListAsync();
        }

        // PUT: api/Surveys/5
        // 
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ActionResult<Survey>> MarkSurveyComplete(int id)
        {
            if (!SurveyExists(id))
            {
                return NotFound();
            }
            var survey = await _context.Survey.FindAsync(id);

            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != survey.UserId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            survey.CompleteDate = DateTime.Now;

            _context.SaveChanges();
            return survey;
        }

        // POST: api/Surveys
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Survey>> PostSurvey(int? userId, string? name)
        {
            if (userId == null || name == null)
            {
                return BadRequest("userId and survey name cannot be null");
            }

            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != userId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            // check if no such user found
            if (!_context.Users.Where(u => u.UserId == userId).Any())
            {
                return BadRequest($"User with userId='{userId}' does not exist");
            }

            // create a new survey object
            var newSurvey = new Survey
            {
                UserId = userId.Value,
                Name = name,
                CreateDate = DateTime.Now,
                CompleteDate = null
            };

            // save the newSurvey object to the database
            _context.Survey.Add(newSurvey);
            await _context.SaveChangesAsync();

            return Ok(newSurvey);
        }

        // DELETE: api/Surveys/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Survey>> DeleteSurvey(int id)
        {
            var survey = await _context.Survey.FindAsync(id);
            if (survey == null)
            {
                return NotFound();
            }

            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != survey.UserId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            _context.Survey.Remove(survey);
            await _context.SaveChangesAsync();

            return survey;
        }

        private bool SurveyExists(int id)
        {
            return _context.Survey.Any(e => e.SurveyId == id);
        }
    }
}
