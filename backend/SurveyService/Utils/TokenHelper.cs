using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SurveyService.Utils
{
    public class TokenHelper
    {
        public static int GetTokenUserIdInClaim(HttpContext context)
        {
            ClaimsIdentity identity = context.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                IEnumerable<Claim> claims = identity.Claims;
                // or
                var id = identity.FindFirst("id");
                if (id != null)
                    return Int32.Parse(id.Value);

            }
            return -1;
        }
    }
}
