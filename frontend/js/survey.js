function add_continue_event() {
    $('.btn-secondary').click(function(){

        var nextId = $(this).parents('.tab-pane').next().attr("id");
        var step = nextId.replace("step", "");
        var percent = (parseInt(step) / window.questions_list.length) * 100;

        $(window.current_active).hide();
        window.current_active = "#" + nextId;
        $(window.current_active).show();

        $('.progress-bar').css({width: percent + '%'})
            .text("Step " + step + " of " + window.questions_list.length.toString());

    });
}

function add_next_question_event() {
    $('a[data-toggle="tab"]').click('shown.bs.tab', function (e) {
        //update progress
        var step = $(e.target).data('step');
        var percent = (parseInt(step) / window.questions_list.length) * 100;
        var step_id = "#step" + step;

        $('.progress-bar').css({width: percent + '%'})
            .text("Step " + step + " of" + window.questions_list.length.toString());

        // hide the current step and show the stuff
        if (window.current_active !== step_id) {
            $(window.current_active).hide();
            $(step_id).show();
            window.current_active = step_id;
        }
    });
}

function add_question_tags() {
    let q_tab = $("#q-tab");
    $.each(window.questions_list, function(idx, element){
        let qid = idx + 1;
        let q = $("<a/>")
            .addClass("nav-item nav-link")
            .attr({href:"#", "data-toggle":"tab", "data-step": qid.toString()})
            .text("Question " + qid.toString())
            .appendTo(q_tab);
    })
}

function add_question_content() {

    $.each(window.questions_list, function (idx, element) {
        let question_body = element["question_body"];
        let question_type = element["type"];

        let question_num = idx + 1;
        let questions_content = $("#question-content");
        let div = $("<div/>")
            .addClass("tab-pane")
            .attr("id", "step" + question_num.toString())
            .appendTo(questions_content);

        let hr = $("<hr/>")
            .appendTo(div)

        let subdiv = $("<div/>")
            .addClass("well")
            .appendTo(div);

        let label = $("<h2/>")
            .text("Question " + question_num.toString())
            .appendTo(subdiv);

        let p = $("<p/>")
            .text(question_body)
            .addClass("font-italic")
            .appendTo(subdiv);

        if (question_type === "text") {
            let subsubdiv = $("<div/>")
                .addClass("form-group")
                .appendTo(subdiv);

            let label = $("<label/>")
                .attr({"for": "exampleFormControlTextarea1"})
                .text("Write your response here")
                .appendTo(subsubdiv);

            let textarea = $("<textarea/>")
                .addClass("form-control")
                .attr({rows:"3", "id": "textarea-question" + question_num.toString()})
                .appendTo(subsubdiv);
        } else {
            let subsubdiv1 = $("<div/>")
                .addClass("form-check form-check-inline")
                .appendTo(subdiv);

            let input1 = $("<input/>")
                .addClass("form-check-input")
                .attr({type: "checkbox",value:"yes", id: "radio1-question"+question_num.toString()})
                .prop("checked", true)
                .appendTo(subsubdiv1);

            let label1 = $("<label/>")
                .addClass("form-check-label")
                .attr("for", "inlineRadio1")
                .text("Yes")
                .appendTo(subsubdiv1);

            let subsubdiv2 = $("<div/>")
                .addClass("form-check form-check-inline")
                .appendTo(subdiv);

            let input2 = $("<input/>")
                .addClass("form-check-input")
                .attr({type: "checkbox", value:"no", id: "radio2-question"+question_num.toString()})
                .appendTo(subsubdiv2);


            // add the checkbox event
            $(input1).click(function(){
                $(input2).prop("checked", !$(input1).prop("checked"));
            });

            $(input2).click(function(){
                $(input1).prop("checked", !$(input2).prop("checked"));
            });


            let label2 = $("<label/>")
                .addClass("form-check-label")
                .attr("for", "inlineRadio1")
                .text("No")
                .appendTo(subsubdiv2);
        }

        let br = $("</br>")
            .appendTo(div);

        if (idx === window.questions_list.length - 1) {
            // last one
            let button = $("<button/>")
                .addClass("btn btn-success")
                .text("Done")
                .attr("id", "done")
                .appendTo(div);
        } else {
            let button = $("<button/>")
                .addClass("btn btn-secondary")
                .text("Continue")
                .appendTo(div);
        }
    });
}

function initialize_display() {
    window.current_active = "#step1";
    $(window.current_active).show();

    // set up the progress bar to be
    let progress = 100/window.questions_list.length;
    $(".progress-bar").text("Step 1 of " + window.questions_list.length.toString())
        .attr("style", "width: " + progress.toString() + "%")

    // somehow boostrap automatically hides this
    // got mannually turn it on
    $(".tab-pane").show();

    // show first question and hide the rest
    $("#step1").show();
    for (let i=2; i <= window.questions_list.length; i++) {
        $("#step" + i.toString()).hide();
    }

    // show the title
    $("h3").text(window.localStorage.getItem("survey_title"));
}

function save_result() {
    $("#done").click(function () {
        // first summerize the result and save to backend
        for (let i=1; i <= window.questions_list.length; i++) {
            let element = window.questions_list[i-1];
            let type = element["type"];
            if (type === "text") {
                element["answer"] = $("#textarea-question" + i.toString()).val();
            } else {
                element["answer"] = $("#radio1-question" + i.toString()).prop("checked") ? "Yes" : "No";
            }
        }

        let doc = new jsPDF();

        doc.text(20, 10, 'Survey Name: ' + window.localStorage.getItem("survey_title"));
        // doc.addPage();
        $.each(window.questions_list, function(idx, e) {
            let qid = idx + 1;
            doc.text(20, 20 + 20 * qid, "Question " + qid.toString() + " " + e["question_body"]);
            doc.text(25, 20 + 20 * qid + 10, "Answer " + e["answer"])
        })
        // Save the PDF
        doc.save(window.localStorage.getItem("survey_title") + '.pdf');

    })
}


$(document).ready(function () {
    window.questions_list = JSON.parse(localStorage.getItem('questions_list')) || [];

    // initialize question tab
    add_question_tags();

    // create survey data
    add_question_content();

    // add next continue event
    add_continue_event();

    // add next question event
    add_next_question_event();

    // initialize display
    initialize_display();

    // add download pdf
    save_result();

})

