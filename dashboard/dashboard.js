//dashboard
function loadDashboard() {
    if (getCode().toLowerCase() == 'dumy')
        var xmldoc = 'OPHContent/themes/' + loadThemeFolder() + '/sample.xml';
    else
        var xmldoc = 'OPHCore/api/default.aspx?mode=widget&code=' + getCode() + '&date=' + getUnique();

    var divname = ['contentWrapper'];
    var xsldoc = ['OPHContent/themes/' + loadThemeFolder() + '/xslt/dashboard_content.xslt'];

    //sidebar
    //divname.push('sidebarWrapper');
    //xsldoc.push('OPHContent/themes/' + loadThemeFolder() + '/xslt/dashboard_content_sidebar.xslt');

    pushTheme(divname, xmldoc, xsldoc, true);
}

function getWidgetData(dataId, f) {
    var url = 'OPHCore/api/default.aspx?mode=data&data=' + dataId;
    var dataForm;

    $.post({
        url: url,
        data: dataForm,
        success: function (data) {
            if (typeof f == "function") f(data);
        },
        dataType: 'xml'
    });

}

function drawChart(chartId, chartType, chartLabelH, chartDatasets) {
    var isStacked = false;
    if (chartType == 'barStack') { chartType = 'bar'; isStacked = true; }
    if (chartType == 'lineStack') { chartType = 'line'; isStacked = true; }
    // chartLabelH=["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
    //chartDatasets=[{
    //    label: '# of Votes',
    //    data: [12, 19, 3, 5, 2, 23],
    //    backgroundColor: [
    //    'rgba(255, 99, 132, 0.2)',
    //    'rgba(54, 162, 235, 0.2)',
    //    'rgba(255, 206, 86, 0.2)',
    //    'rgba(75, 192, 192, 0.2)',
    //    'rgba(153, 102, 255, 0.2)',
    //    'rgba(255, 159, 64, 0.2)'
    //    ],
    //    borderColor: [
    //    'rgba(255,99,132,1)',
    //    'rgba(54, 162, 235, 1)',
    //    'rgba(255, 206, 86, 1)',
    //    'rgba(75, 192, 192, 1)',
    //    'rgba(153, 102, 255, 1)',
    //    'rgba(255, 159, 64, 1)'
    //    ],
    //    borderWidth: 1
    //}]
    var ctx = document.getElementById(chartId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: chartLabelH,
            datasets: chartDatasets
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: isStacked,
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }, stacked: isStacked
                }]
            }
        }
    });
}
/* remarked by els issue for IE error
function fillChartDataSets(label, data, bgColor, borderColor, borderWidth) {
    return [{ label, data, bgColor, borderColor, borderWidth }]
    //chartDatasets=[{
    //    label: '# of Votes',
    //    data: [12, 19, 3, 5, 2, 23],
    //    backgroundColor: [
    //    'rgba(255, 99, 132, 0.2)',
    //    'rgba(54, 162, 235, 0.2)',
    //    'rgba(255, 206, 86, 0.2)',
    //    'rgba(75, 192, 192, 0.2)',
    //    'rgba(153, 102, 255, 0.2)',
    //    'rgba(255, 159, 64, 0.2)'
    //    ],
    //    borderColor: [
    //    'rgba(255,99,132,1)',
    //    'rgba(54, 162, 235, 1)',
    //    'rgba(255, 206, 86, 1)',
    //    'rgba(75, 192, 192, 1)',
    //    'rgba(153, 102, 255, 1)',
    //    'rgba(255, 159, 64, 1)'
    //    ],
    //    borderWidth: 1
    //}]
}
*/
