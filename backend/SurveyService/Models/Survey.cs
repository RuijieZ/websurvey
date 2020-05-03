using System;
using System.Collections.Generic;

namespace SurveyService.Models
{
    public partial class Survey
    {
        public Survey()
        {
            Question = new HashSet<Question>();
        }

        public int SurveyId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? CompleteDate { get; set; }

        public virtual Users User { get; set; }
        public virtual ICollection<Question> Question { get; set; }
    }
}
