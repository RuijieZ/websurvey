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
            var survey =  _context.Survey.Where(s => s.UserId == userId);

            if (survey == null)
            {
                return NotFound();
            }

            return await survey.ToListAsync();
        }

        // PUT: api/Surveys/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSurvey(int id, Survey survey)
        {
            if (id != survey.SurveyId)
            {
                return BadRequest();
            }

            _context.Entry(survey).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SurveyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Surveys
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Survey>> PostSurvey(Survey survey)
        {
            System.Diagnostics.Debug.WriteLine("********************************************************************");
            System.Diagnostics.Debug.WriteLine(survey.CreateDate);
            if (survey.CreateDate == null)
            {

                survey.CreateDate = DateTime.Now;
                survey.CompleteDate = null;
            }
            _context.Survey.Add(survey);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSurvey", new { id = survey.SurveyId }, survey);
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
