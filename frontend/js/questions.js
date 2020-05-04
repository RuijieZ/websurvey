function populatePreviousQuestions() {
    var t = `
<li class="list-group-item d-flex justify-content-between align-items-center">{{text}}
    <div>
        <span class="badge badge-pill question-type {{class}}" style="margin-right: 20px;">{{type}}</span>
        <button class="btn btn-danger remove-button">Remove</button>
    </div>
</li>
`
    let lst = $("#questions-bank");
    $.each(window.questions, function(idx, q){
        let classType = q["questionType"] === "bool" ? "badge-info" : "badge-warning";
        let element = $.parseHTML(t.replace("{{text}}", q["questionBody"]).replace("{{type}}", q["questionType"]).replace("{{class}}", classType));
        $(element).appendTo(lst);
    }) ;

}

function saveMixSurvey() {

    $("#save-survey").click(function () {
        let surveyTitle = "Mixsure";



        let questions_list = [];

        if ($("#new-survey li").length === 0) {
            alert("Survey needs to have at least one question!");
            return;
        }
        let surveyId = createSurvey(window.userId, surveyTitle, window.token);
        if (surveyId == null) {
            alert("error in creating survey! Please try again!");
            return;
        }


        $("#new-survey li").each(function (idx, li) {
            // alert($(li).find("span").text());
            let question = {
                QuestionBody: $(li).contents().get(0).nodeValue,
                QuestionType: $(li).find("span").text(),
                Answer: "",
                UserId: window.userId,
                SurveyId: surveyId
            };
            questions_list.push(question);
            createQuestion(question, window.token);

        });




        alert("Survey saved in the database!")
        window.location.replace("index.html");
    });
}
function takeMixSurvey() {

    $("#take-survey").click(function () {
        let surveyTitle = "Mixsure";



        let questions_list = [];

        if ($("#new-survey li").length === 0) {
            alert("Survey needs to have at least one question!");
            return;
        }

        let surveyId = createSurvey(window.userId, surveyTitle, window.token);
        if (surveyId == null) {
            alert("error in creating survey! Please try again!");
            return;
        }

        $("#new-survey li").each(function (idx, li) {
            // alert($(li).find("span").text());
            let question = {
                QuestionBody: $(li).contents().get(0).nodeValue,
                QuestionType: $(li).find("span").text(),
                Answer: "",
                UserId: window.userId,
                SurveyId: surveyId
            };
            questions_list.push(question);
            createQuestion(question, window.token);
        });


        window.location.replace("survey.html?surveyId=" + surveyId);
    });

}




$(document).ready(function () {
    getDataOrRedirect();
    $("#questions-bank, #new-survey").sortable({
        connectWith: '.list-group'
    });
    populatePreviousQuestions();
    saveMixSurvey();
    takeMixSurvey();
})