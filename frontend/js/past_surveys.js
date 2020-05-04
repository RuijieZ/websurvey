$(document).ready(function () {
    getDataOrRedirect();

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
    $('#dataTable2').DataTable({
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
})