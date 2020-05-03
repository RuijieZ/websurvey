using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SurveyService.Models;

namespace SurveyService.Controllers
{
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
            var questions = _context.Question.Where(q => q.UserId == userId);

            if (!questions.Any())
            {
                return NotFound();
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

            // coud not find a survey that matches the question
            if (!_context.Survey.Where(s => s.UserId == question.UserId && s.SurveyId == question.SurveyId).Any()) 
            {
                return BadRequest($"could not find a survey that matches the question specifies uesrid='{question.UserId}', surveyid = '{question.SurveyId}'"); 
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
            // doing some validation check
            // the survey id must belong to that user
            if (!_context.Survey.Where(s => s.SurveyId == question.SurveyId && s.UserId == question.UserId).Any())
                return BadRequest($"The survey with survey ID to be '{question.SurveyId}' and user id to be '{question.UserId}' does not exist");

            _context.Question.Add(question);
            await _context.SaveChangesAsync();

            return question;
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
