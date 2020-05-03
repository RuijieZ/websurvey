// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

let pielabels = ["text", "bool"];
let piecount = {"text": 0, "bool": 0};

function getQuestionTypeCount () {
    if (window.questions.length === 0) {
        return [0, 0];
    }

    $.each(window.questions, function (idx, question) {
        piecount[question["questionType"]] += 1;
    });
    let res = [];
    $.each(pielabels, function (idx, t) {
        res.push(piecount[t]);
    })
    return res;
}

// Pie Chart Example
function createPieChart() {
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: pielabels,
            datasets: [{
                data: getQuestionTypeCount(),
                backgroundColor: ['#4e73df', '#1cc88a'],   //, '#36b9cc'
                hoverBackgroundColor: ['#2e59d9', '#17a673'],  // , '#2c9faf'
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}


