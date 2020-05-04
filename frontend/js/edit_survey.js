function populate_survey_questions() {
    // var data = [{question_body: "question 1", type: "text"}, {question_body: "question 2", type: "bool"}, {question_body: "question 1", type: "bool"}];
    let q_ul = $('#survey_questions');
    let data = window.data;
    if (data.length === 0) {
        $("#no-questions-label").show();
    } else {
        $("#no-questions-label").hide();
    }

    $.each(data, function (idx) {
        let li = $('<li/>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .text(data[idx]["questionBody"])
            .appendTo(q_ul);

        let div = $('<div/>')
            .appendTo(li);

        let new_class = data[idx]["questionType"] === "bool" ? "badge-info" : "badge-warning";


        let type = $('<span/>')
            .addClass("badge badge-pill question-type")
            .addClass(new_class)
            .css("margin-right", "20px")
            .text(data[idx]["type"])
            .appendTo(div);


        let aaa = $('<button/>')
            .addClass("btn btn-danger remove-button")
            .text("Remove")
            .appendTo(div);
    });
}

function initialize_checkbox() {
    $('#boolean').prop("checked", true);
    $('#short_answer').prop("checked", false);

    $('#boolean').click(function(){
        $("#short-answer").prop("checked", !$("#short-answer").prop("checked"));
    });

    $('#short-answer').click(function(){
        $("#boolean").prop("checked", !$("#boolean").prop("checked"));
    });

}

function add_survey_question_event() {
    $("#add").click(function() {
        // does not allow empty question body
        let q_ul = $('#survey_questions');
        if ($("#question-body").val() == "") {
            alert("empty question body");
            return;
        }

        let text = $("#boolean").prop("checked") ? "bool" : "text";
        let new_class = $("#boolean").prop("checked") ? "badge-info" : "badge-warning";

        let li = $('<li/>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .text($("#question-body").val())
            .appendTo(q_ul);

        // q_ul.text("");
        let div = $('<div/>')
            .appendTo(li);

        let type = $('<span/>')
            .addClass("badge badge-pill question-type")
            .addClass(new_class)
            .css("margin-right", "20px")
            .text(text)
            .appendTo(div);


        let aaa = $('<button/>')
            .addClass("btn btn-danger remove-button")
            .text("Remove")
            .appendTo(div);

        // have to add the event for the new element
        remove_question_event();

        // remove the no question label
        $("#no-questions-label").hide();

        // set the input box to be empty
        $("#question-body").val("");
    })
}

function remove_question_event() {
    $(".remove-button").click(function() {
        if ($("#survey_questions").length === 1) {
            $("#no-questions-label").show();
        }
        $(this).closest('li').remove();

    })
}

function save_survey_event() {
    $("#save-survey").click(function () {
        let surveyTitle = $("#survey-title").val();
        if (surveyTitle === "") {
            alert("Please enter a title for the survey!");
            return;
        }

        let surveyId = createSurvey(window.userId,surveyTitle, window.token);
        if (surveyId == null) {
            alert("error in creating survey! Please try again!");
            return;
        }

        let questions_list = [];
        $("#survey_questions li").each(function (idx, li) {
            let question = {
                QuestionBody: $(li).contents().get(0).nodeValue,
                QuesitonType: $(li).find("span").text(),
                Answer: "",
                UserId: window.userId,
                SurveyId: surveyId
            };
            createQuestion(question, token);
            questions_list.push(question);
        });

        if (questions_list.length === 0) {
            alert("Survey needs to have at least one question!");
            return;
        }

        alert("Survey saved in the database!")
        window.location.replace("index.html");
    })
}

function take_survey_event() {
    $("#take-survey").click(function () {
        window.questions_list = [];
        $("#survey_questions li").each(function (idx, li) {
            let data = {
                questionBody: $(li).contents().get(0).nodeValue,
                type: $(li).find("span").text(),
                answer: ""
            };
            window.questions_list.push(data);
        });

        window.localStorage.setItem('questions_list', JSON.stringify(window.questions_list));

        if (window.questions_list.length === 0) {
            alert("You need have at least one question");
            return;
        }
        window.localStorage.setItem("survey_title", $("#survey-title").val() === "" ? "New Survey" : $("#survey-title").val());
        alert(window.localStorage.getItem("survey_title"))

        window.location.replace("survey.html");
    })
}

$(document).ready( function() {
    const userStr = window.localStorage.getItem("user");
    if (!userStr) {
        needToLogin();
    }
    let user = JSON.parse(userStr);
    if (!user['userId']) {
        needToLogin();
    }
    // get token
    let token = getCredential(user);
    let userId = getUserId(user);
    if (!token || !userId) {
        needToLogin();
    }
    let userFirstLastName = getUserFirstLastName(user);
    $("#user-first-last-name").text(userFirstLastName);

    window.token = token;
    window.userId = userId;
    window.data = [];

    // populate survey Questions
    populate_survey_questions();

    // set up checkbox event and initial values
    initialize_checkbox();

    // add survey question event handler
    add_survey_question_event();

    // add remove question event handler
    remove_question_event();

    // add save survey event
    save_survey_event();

    // add take survey event
    take_survey_event();

    // make the question sortable
    $( "#survey_questions" ).sortable();
    $( "#survey_questions" ).disableSelection();

})

