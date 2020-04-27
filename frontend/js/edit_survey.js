function populate_survey_questions() {
    var data = ["question 1", "question 2", "question 3"];
    var q_ul = $('#survey_questions');
    if (data.length == 0) {
        q_ul.text("No questions in this survey yet");
    }

    $.each(data, function (idx) {
        var li = $('<li/>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .text(data[idx])
            .appendTo(q_ul);
        var aaa = $('<button/>')
            .addClass("btn btn-danger remove-button")
            .text("Remove")
            .appendTo(li);
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

        // q_ul.text("");
        var li = $('<li/>')
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .text($("#question-body").val())
            .appendTo(q_ul);

        var aaa = $('<button/>')
            .addClass("btn btn-danger remove-button")
            .text("Remove")
            .appendTo(li);
    })
}

function remove_question_event() {
    $(".remove-button").click(function() {
        $(this).closest('li').remove();
    })
}

function take_survey_event() {

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

})

