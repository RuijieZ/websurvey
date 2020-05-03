function getRowTemplate() {
    return
    `
      <tr>
        <td>{{title}}</td>
        <td>{{questionCount}}</td>
        <td>{{createdDate}}</td>
        <td>{{completeDate}}</td>
      </tr>
    `;
}

function  getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function needToLogin() {
    alert("Sorry, you need to login again!");
    window.location.href = "login.html";
}

function getCredential(user) {
    if (!user) {
        return null;
    }
    return user["tokenString"] ? user["tokenString"] : null;
}

function getUserId(user) {
    if (!user) {
        return null;
    }
    return user["userId"] ? user["userId"] : null;
}

function getUserFirstLastName(user) {
    if (!user || !user["firstName"] || !user["lastName"]) {
        return "Example User";
    }
    return user["firstName"] + " " + user["lastName"];
}

// save surveys in window.survey object
function getSurveysOrRedirect(userId, token) {
    let settings = {
        "url": "https://localhost:44350/api/surveys/" + userId,
        "method": "GET",
        "async": false,
        "timeout": 10000,
        "headers": {
            "Content-Type": ["application/json"],
            "Authorization": "Bearer " + token
        },
    };

    $.ajax(settings).done(function (response) {
        console.log('survey data:');
        console.log(response);
        window.surveys = response;
    }).fail(function (request, status, error) {
        if (request.status == 401) {
            needToLogin();
        } else {
            alert("Sorry, something went wrong! Please try refresh this page or try to login again.");
        }
    });
}

// save questions in window.questions object
function getQuestionsOrRedirect(userId, token) {
    let settings = {
        "url": "https://localhost:44350/api/questions/" + userId,
        "method": "GET",
        "async": false,
        "timeout": 10000,
        "headers": {
            "Content-Type": ["application/json"],
            "Authorization": "Bearer " + token
        },
    };

    $.ajax(settings).done(function (response) {
        console.log("questions:");
        console.log(response);
        window.questions = response;
    }).fail(function (request, status, error) {
        if (request.status == 401) {
            needToLogin();
        } else {
            alert("Sorry, something went wrong! Please try refresh this page or try to login again.");
        }
    });
}

function getSurveyQuestionsCount(survey, questions) {
    let count = 0;
    $.each(questions, function (idx, question) {
        if (question["surveyId"] === survey["surveyId"]) {
            count += 1;
        }
    });
    return count;
}

function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? false : decodeURIComponent(sParameterName[1]);
        }
    }
}

function getQuestionsBelongToSurveyOrRedirect(token, surveyId) {
    let settings = {
        "url": "https://localhost:44350/api/questions/" + surveyId,
        "method": "GET",
        "timeout": 10000,
        "async": false,
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },

    };

    $.ajax(settings).done(function (response) {
        console.log("questions of survey " + surveyId.toString());
        console.log(response);
        return questions;
    }).fail(function (request, status, error) {
        if (request.status == 401) {
            needToLogin();
        } else {
            alert("Sorry, something went wrong! Please try refresh this page or try to login again.");
        }
    });
}

function createSurvey(userId, surveyTitle, token) {
    let settings = {
        "url": "https://localhost:44350/api/surveys?userId={{userId}}&name={{title}}".replace("{{userId}}", userId).replace("{{title}}", surveyTitle),
        "method": "POST",
        "timeout": 10000,
        "headers": {
            "Content-Type": ["application/json"],
            "Authorization": "Bearer " + token
        },
        "data": JSON.stringify({
                "UserId": userId,
                "Name": surveyTitle,
                "CreateDate": getDate(),
                "CompleteDate": null
            }),
    };

    $.ajax(settings).done(function (response) {
        console.log("saving survey: ");
        console.log(response);
        return response["surveyId"];
    }).fail(function (request, status, error) {
        console.log("error happened in saving survey");
        console.log(request);
        console.log(status);
        console.log(error);
        return null;
    });
    return null;
}

function createQuestion(questionObj) {
    let settings = {
        "url": "https://localhost:44350/api/questions",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({"UserId":1,"SurveyId":1,"QuestionBody":"My new question","QuestionType":"bool","QuestionAnwser":""}),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}


function getDataOrRedirect() {
    const userStr = window.localStorage.getItem("user");
    if (!userStr) {
        needToLogin();
    }
    let user = JSON.parse(userStr);
    let token = getCredential(user);
    let userId = getUserId(user);
    let userFirstLastName = getUserFirstLastName(user);

    $("#user-first-last-name").text(userFirstLastName);

    if (token == null || userId == null) {
        needToLogin();
    }

    getSurveysOrRedirect(userId, token);
    getQuestionsOrRedirect(userId, token);

}

