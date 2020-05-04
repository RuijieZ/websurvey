$(document).ready(function () {
    getDataOrRedirect();
    $("#surveys-count").text(window.surveys.length.toString());
    $("#questions-count").text(window.questions.length.toString());

    let incompleteCount = 0;
    $.each(window.surveys, function (idx, element) {
        if (element["completeDate"] == null) {
            incompleteCount += 1;
        }
    });

    let completeRate = window.surveys.length === 0 ? 0 : (window.surveys.length - incompleteCount) * 100.0 / window.surveys.length;
    completeRate = completeRate.toFixed(2);
    $("#imcomplete-surveys-count").text(incompleteCount.toString());
    $("#complete-rate-percentage").text(completeRate.toString() + "%");
    $("#complete-rate-progress-bar").attr("style", "width: " + completeRate.toString() + "%");

    // create the bar chart
    createBarChart();

    // create the pie chart
    createPieChart();

    // populate the surveys table
    let dataset = [];
    $.each(window.surveys, function(idx, survey) {
        dataset.push([
            survey["surveyId"],
            survey["name"],
            getSurveyQuestionsCount(survey, window.questions),
            survey['createDate'],
            survey['completeDate']
        ]);
    });
    $('#dataTable').DataTable({
         "columnDefs": [ {
             "targets": -1,
             // "defaultContent": '<a href="survey.html?surveyId=" class="card-link" id="take-survey">Take the survey now</a>',
             "render": function (data, type, row) {
                 if (data == null) {
                     let link = '<a href="survey.html?surveyId={{surveyId}}" class="card-link" id="take-survey">Take the survey now</a>'.replace("{{surveyId}}", row[0].toString());
                     return link;
                 } else {
                     return row[4];
                 }

             }
         }],
        data: dataset,
        columns: [
            { title: "Id"},
            { title: "Title" },
            { title: "Questions" },
            { title: "Create Time" },
            { title: "Complete Time" }
        ]
    });




});