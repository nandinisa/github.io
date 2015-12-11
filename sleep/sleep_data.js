// JavaScript source code
sleep_data = (function () {
    var config = {
        avgSleep : new Object(), 
        avgSteps: new Object(),
        dates: new Array(),
        timesLabels: new Array(),
        minInt : 15,
        numMinIntPerHour : 4,
        sleepData: new Array(),
        seletCity : ''
    },
    cityNames = [ 'Atlanta,_GA,_United_States',
    'Austin,_TX,_United_States',
    'Boston,_MA,_United_States',
    'Charlotte,_NC,_United_States',
    'Chicago,_IL,_United_States',
    'Dallas,_TX,_United_States',
    'Denver,_CO,_United_States',
    'Houston,_TX,_United_States',
    'Las_Vegas,_NV,_United_States',
    'Los_Angeles,_CA,_United_States',
    'Miami,_FL,_United_States',
    'Minneapolis,_MN,_United_States',
    'New_York,_NY,_United_States',
    'Orlando,_FL,_United_States',
    'Phoenix,_AZ,_United_States',
    'San_Antonio,_TX,_United_States',
    'San_Diego,_CA,_United_States',
    'San_Francisco,_CA,_United_States',
    'San_Jose,_CA,_United_States',
    'Seattle,_WA,_United_States',
    'Washington,_DC,_United_States',
    'Brisbane,_Australia',
    'Melbourne,_Australia',
    'Sydney,_Australia',
    'Sao_Paulo,_Brazil',
    'Toronto,_Canada',
    'Beijing,_China',
    'Hong_Kong,_China',
    'Shanghai,_China',
    'Paris,_France',
    'Berlin,_Germany',
    'Munich,_Germany',
    'Milan,_Italy',
    'Rome,_Italy',
    'Tokyo,_Japan',
    'Mexico_City,_Mexico',
    'Moscow,_Russia',
    'Singapore',
    'Seoul,_South_Korea',
    'Madrid,_Spain',
    'Stockholm,_Sweden',
    'Zurich,_Switzerland',
    'Istanbul,_Turkey',
    'Dubai,_United_Arab_Emirates',
    'London,_United_Kingdom'],
        pad, generateDate, generateTime, loadAvgCitySleepTimes, loadAvgCitySteps,
        createCitySleepData, addDownloadLink,
        onCitySelected, initModule;

    pad = function (str, max) {
        return str.length < max ? pad("0" + str, max) : str;
    }

    loadCityNames = function () {
        var $dropDown = $('#cityDropdown');
        $.each(cityNames, function (i, item) {
            var li = '<option><a href="#">' + item + '</a></option>';
            $dropDown.append($(li));
        });

        $dropDown.bind('change', onCitySelected);
    };

    generateDate = function () {
        var startDate = new Date(2013, 5, 1), // June 1
            endDate = new Date(2014, 5, 1), // June 1
            newDate = startDate;
        while (newDate <= endDate) {
            config.dates.push(new Date(newDate));
            newDate.setDate(newDate.getDate() + 1);
        }
    };

    generateTime = function () {
        var times = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a",
               "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];
        for (var i = 0; i < times.length; i++) {
            var time = times[i];

            for (var j = 0; j < config.numMinIntPerHour; j++) {
                config.timesLabels.push(time.substring(0, time.length - 1) + ":" + pad((j * config.minInt) + "", 2) + time.substring(time.length - 1));
            }
        }
    };

    // As of now this is not saved
    loadAvgCitySleepTimes = function () {
        $.getJSON("https://s3.amazonaws.com/blog-content-production/wp-content/uploads/citylove/avg_sleep.json", function (json) {
            $.each(json, function (key, city) {
                config.avgSleep[city["city"]] = city["avg_total_sleep"];
            })
        });
    };

    // As of now this is not saved
    loadAvgCitySteps = function () {
        $.getJSON("https://s3.amazonaws.com/blog-content-production/wp-content/uploads/citylove/avg_steps.json", function (json) {
            $.each(json, function (key, city) {
                config.avgSteps[city["city"]] = city["avg_steps"];
            })
        });
    };

    createCitySleepData = function (url) {
        $.get(url, function (data) {
            var dataArray = data.match(/..../g);

            for (var i = 0; i < dataArray.length; i++) {
                // Create object
                var slData = {};
                var item = dataArray[i];
                var dateNum = Math.floor(i / (24 * config.numMinIntPerHour));

                slData.colour = item;
                slData.date = (config.dates[dateNum].getMonth() + 1) + "/" + config.dates[dateNum].getDate() + "/" + config.dates[dateNum].getFullYear();
                slData.time = config.timesLabels[(i % (24 * config.numMinIntPerHour))];
                slData.sleepPercentage = Math.round(100 * (1 - parseInt(item.substring(0, 2), 16) / 255));
                slData.steps = Math.round(1400 * (1 - parseInt(item.substring(2, 4), 16) / 255));

                // Include in sleep data
                config.sleepData.push(slData);
            }

            addDownloadLink();
        });
    };

    onCitySelected = function (e) {
        config.sleepData.length = 0;
        $('#download').empty();
        if (e.target.selectedIndex - 1 < 0) {            
            return;
        }
        var index = e.target.selectedIndex - 1;
        config.seletCity = cityNames[index];

    };

    download = function () {
        if (config.seletCity != '' && config.sleepData.length == 0) {
            createCitySleepData("https://s3.amazonaws.com/blog-content-production/wp-content/uploads/citylove/" + config.seletCity + ".txt");
        }
        else if (config.sleepData.length != 0){
            addDownloadLink();
        }
    }

    addDownloadLink = function () {
        $('#download').empty();
        var json = JSON.stringify(config.sleepData);
        var blob = new Blob([json], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        //var a = $('#download');
        //a.attr('download', "backup.json");
        //a.attr('href',url);
        //a.attr('textContent', "Download " + config.seletCity + ".json");

        var a = document.createElement('a');
        a.download = config.seletCity + ".json";
        a.href = url;
        a.textContent = "Download " +  config.seletCity + ".json";

        $('#download').append(a);
    };

    initModule = function () {
        loadAvgCitySleepTimes();
        loadAvgCitySteps();

        generateTime();
        generateDate();

        loadCityNames();

        $('#filename').bind('click', download);
    }

    return {
        initModule : initModule
    }
})();

