function populate_survey_questions() {
    // var data = [{question_body: "question 1", type: "text"}, {question_body: "question 2", type: "bool"}, {question_body: "question 1", type: "bool"}];
    var q_ul = $('#survey_questions');
    var data = [];
    if (data.length === 0) {
        $("#no-questions-label").show();
    } else {
        $("#no-questions-label").hide();
    }

    $.each(data, function (idx) {
        var li = $('<li/>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .text(data[idx]["question_body"])
            .appendTo(q_ul);

        var div = $('<div/>')
            .appendTo(li);

        var new_class = data[idx]["type"] === "bool" ? "badge-info" : "badge-warning";


        var type = $('<span/>')
            .addClass("badge badge-pill question-type")
            .addClass(new_class)
            .css("margin-right", "20px")
            .text(data[idx]["type"])
            .appendTo(div);


        var aaa = $('<button/>')
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
        var q_ul = $('#survey_questions');
        if ($("#question-body").val() == "") {
            alert("empty question body");
            return;
        }

        var text = $("#boolean").prop("checked") ? "bool" : "text";
        var new_class = $("#boolean").prop("checked") ? "badge-info" : "badge-warning";

        var li = $('<li/>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .text($("#question-body").val())
            .appendTo(q_ul);

        // q_ul.text("");
        var div = $('<div/>')
            .appendTo(li);

        var type = $('<span/>')
            .addClass("badge badge-pill question-type")
            .addClass(new_class)
            .css("margin-right", "20px")
            .text(text)
            .appendTo(div);


        var aaa = $('<button/>')
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
        alert("Survey saved in the database!")
        window.location.replace("index.html");
    })
}

function take_survey_event() {
    $("#take-survey").click(function () {
        window.questions_list = [];
        $("#survey_questions li").each(function (idx, li) {
            let data = {
                question_body: $(li).contents().get(0).nodeValue,
                type: $(li).find("span").text()
            };
            window.questions_list.push(data);
        });

        if (window.questions_list.length === 0) {
            alert("You need have at least one question");
            return;
        }

        window.location.replace("survey.html");
    })
}

$(document).ready( function() {
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

})
