using System;
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
    public class QuestionsController : ControllerBase
    {
        private readonly SurveyContext _context;

        public QuestionsController(SurveyContext context)
        {
            _context = context;
        }


        // GET: api/Questions/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestion(int userId)
        {
            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != userId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            var questions = _context.Question.Where(q => q.UserId == userId);

            if (!questions.Any())
            {
                return new List<Question>();
            }

            return await questions.ToListAsync();
        }

        // PUT: api/Questions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ActionResult<Question>> PutQuestion(int id, Question question)
        {
            if (id != question.QuestionId)
            {
                return BadRequest("id parameter does not match in the payload");
            }

            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != question.UserId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            // coud not find a survey that matches the question
            if (!_context.Survey.Where(s => s.UserId == question.UserId && s.SurveyId == question.SurveyId).Any()) 
            {
                return NotFound($"could not find a survey that matches the question specifies uesrid='{question.UserId}', surveyid = '{question.SurveyId}'"); 
            }

            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return question;
        }

        // POST: api/Questions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            // first check authorization
            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != question.UserId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            var survey = _context.Survey.Where(s => s.SurveyId == question.SurveyId).FirstOrDefault();
            
            if (question.SurveyId != -1)                    // surveyId == -1 means we are creating a question without any survey. In that case, we do not need check past survey Onwner
            {
                if (survey == null)
                {
                    return StatusCode(400, $"Survey with id: '{question.SurveyId}' does not exist");
                }

                if (survey.UserId != TokenHelper.GetTokenUserIdInClaim(HttpContext))
                {
                    return StatusCode(401, "You are not authorized to peform this action because the survey does not belong to you");
                }
            }


            _context.Question.Add(question);
            await _context.SaveChangesAsync();

            return Ok(question);
        }

        // DELETE: api/Questions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Question>> DeleteQuestion(int id)
        {
            var question = await _context.Question.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            if (TokenHelper.GetTokenUserIdInClaim(HttpContext) != question.UserId)
            {
                return StatusCode(401, "You are not authorized to perform this Action");
            }

            _context.Question.Remove(question);
            await _context.SaveChangesAsync();

            return question;
        }

        private bool QuestionExists(int id)
        {
            return _context.Question.Any(e => e.QuestionId == id);
        }
    }
}
