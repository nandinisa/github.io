// Loads different versions of graph
var graphs = (function () {
    var config = { data: [], $container: null, formattedData: [] },
        initModule, createDualChart, createChart, 
        loadChart, loadInbuiltSmallMultiples, formatData;

    initModule = function ($container) {
        config.$container = $container;
        // Set container height width
    }

    loadInbuiltSmallMultiples = function () {
        csv_loader.loadcsvFromUrl('/dual_axes_chart/data.csv', formatData);
        config.formattedData = '';
        config.formattedData = [
        {
            hData: [1.1, 1.3, 1.4, 1.5, 1.5, 1.6],
            aData: [0.8, 1.3, 1.4, 1.4, 1.6, 1.8],
            type: 2
        },
        {
            hData: [1.2, 1.2, 1.3, 1.4, 1.5, 1.6],
            aData: [0.8, 1.3, 1.4, 1.5, 1.6, 1.8],
            type: 2
        },
        {
            hData: [1.1, 1.2, 1.3, 1.3, 1.5, 1.5],
            aData: [0.7, 1.3, 1.3, 1.5, 1.5, 1.7],
            type: 2
        },
        {
            hData: [1, 1.1, 1.2, 1.4, 1.8, 2],
            aData: [0.9, 1, 1.1, 1.2, 1.9, 2.4],
            type: 1
        },
        {
            hData: [1.3, 1.3, 1.5, 1.8, 1.7, 1.8],
            aData: [0.7, 1.4, 1.4, 1.5, 1.7, 1.9],
            type: 1
        }
        ]        
    }

    formatData = function (data) {
        var formattedData = { };
        $.map(data, function (val, i) {
            if (formattedData[val.Type] == null) {
                formattedData[val.Type] = {};
            }
            if (formattedData[val.Type][val.Id] == null) {
                formattedData[val.Type][val.Id] = [];
            }

            formattedData[val.Type][val.Id].push(val)
        });

        config.formattedData = formattedData;
        createChart();
    }

    createChart = function () {
        var options = {
            title: {
                fontSize: '18px',
                fontWeight: 'bold'
            },
            subtitle: {
                fontSize: '17px',
                fontWeight: 'bold'
            },
            label: {
                fontSize: '16px',
                fontWeight: 'bold'
            },
            color: ''
        };

        var chartData = {
            title: 'Change in height and foliage over time',
            xaxis: {
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            y1axis: {
                data: [],
                title: 'Height'
            },
            y2axis: {
                data: [],
                title: 'Foliage area'
            }
        }
        var $container = $('#container');
        loadChart($container, chartData, options);
    }

    loadChart = function ($container, chartData, options) {
        var count = 1;
        for (var i in config.formattedData) {
            if (config.formattedData.hasOwnProperty(i)) {
                var d = config.formattedData[i];
                for (var prop in d) {
                    if (d.hasOwnProperty(prop)) {
                        // Retrieve the object array
                        var objArray = d[prop];
                        
                        var $chartContainer = $('<div></div>');
                        $chartContainer.addClass('similarDiv');
                        $container.append($chartContainer);
                        chartData.y1axis.data = $.map(objArray, function (val, i) {
                            return parseFloat(val.Height);
                        });

                        chartData.y2axis.data = $.map(objArray, function (val, i) {
                            return parseFloat(val.Area);
                        });
                        
                        if (i == 'species 1') {
                            chartData.subtitle = 'Type : Species 1 - tree ' + count;
                            options.color = '#009349';
                        }
                        else {
                            chartData.subtitle = 'Type : Species 2 - tree ' + count;
                            options.color = '#9ACD32';
                        }

                        count++;
                        createDualChart($chartContainer.get(0), chartData, options)
                    }
                }                
            }
        }
    }

    createDualChart = function (container, chartData, options) {
        var chart = new Highcharts.Chart({
            chart: {
                zoomType: 'xy',
                renderTo: container
            },
            title: {
                text: chartData.title,
                style: {
                    fontSize: options.title.fontSize,
                    fontWeight: options.title.fontWeight
                }
            },
            subtitle: {
                text: chartData.subtitle,
                style: {
                    fontSize: options.subtitle.fontSize,
                    fontWeight: options.subtitle.fontWeight
                }
            },
            xAxis: {
                categories: chartData.xaxis.data,
                crosshair: true,
                labels: {
                    style: {
                        fontWeight: options.label.fontWeight,
                        fontSize: options.label.fontSize
                    }
                }
            },
            yAxis: [{ // Primary yAxis
                title: {
                    text: chartData.y1axis.title,
                    style: {
                        color: Highcharts.getOptions().colors[1],
                        fontWeight: options.label.fontWeight,
                        fontSize: options.label.fontSize
                    }
                },
                labels: {
                    style: {
                        color: Highcharts.getOptions().colors[1],
                        fontWeight: options.label.fontWeight,
                        fontSize: options.label.fontSize
                    }
                },
                tickInterval: 0.5
            }, { // Secondary yAxis
                title: {
                    text: chartData.y2axis.title,
                    style: {
                        color: options.color,
                        fontWeight: options.label.fontWeight,
                        fontSize: options.label.fontSize
                    }
                },
                labels: {
                    style: {
                        color: options.color,
                        fontWeight: options.label.fontWeight,
                        fontSize: options.label.fontSize
                    }
                },
                tickInterval: 0.5,
                min: 0,
                max: 3,
                linkedTo: 0,
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: '#FFFFFF'
            },
            series: [{
                name: chartData.y2axis.title,
                type: 'column',
                color: options.color,
                yAxis: 1,
                data: chartData.y2axis.data,

            }, {
                name: chartData.y1axis.title,
                type: 'spline',
                color: '#000000',
                data: chartData.y1axis.data
            }]
        });
    }

    return {
        initModule: initModule,
        loadInbuiltSmallMultiples: loadInbuiltSmallMultiples
    }
})();