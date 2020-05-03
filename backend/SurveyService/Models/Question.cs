using System;
using System.Collections.Generic;

namespace SurveyService.Models
{
    public partial class Question
    {
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public int SurveyId { get; set; }
        public string QuestionBody { get; set; }
        public string QuestionType { get; set; }
        public string QuestionAnwser { get; set; }

        public virtual Survey Survey { get; set; }
        public virtual Users User { get; set; }
    }
}
