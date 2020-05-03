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
    $("#imcomplete-surveys-count").text(incompleteCount.toString());
    $("#complete-rate-percentage").text(completeRate.toString() + "%");
    $("#complete-rate-progress-bar").attr("style", "width: " + completeRate.toString() + "%");

    // create the bar chart
    createBarChart();

    // create the pie chart
    createPieChart();

    // populate the surveys table
    $.each(window.surveys, function(idx, survey) {
        let template = getRowTemplate();
        template = template.replace('{{title}}', survey.name)
            .replace('{{questionCount}}', getSurveyQuestionsCount(survey, window.questions))
            .replace('{{createdDate}}', survey['createdDate'])
            .replace('{{completeDate}}', survey['completeDate']);
        let rowElement = $.parseHTML(template);
        $("#survey-table-rows").add(rowElement);
    })


});