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

}
function takeMixSurvey() {

}




$(document).ready(function () {
    getDataOrRedirect();
    $("#questions-bank, #new-survey").sortable({
        connectWith: '.list-group'
    });
    populatePreviousQuestions();
})