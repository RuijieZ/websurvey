using System;
using System.Collections.Generic;

namespace SurveyService.Models
{
    public partial class Users
    {
        public Users()
        {
            Question = new HashSet<Question>();
            Survey = new HashSet<Survey>();
        }

        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual ICollection<Question> Question { get; set; }
        public virtual ICollection<Survey> Survey { get; set; }

    }
}
