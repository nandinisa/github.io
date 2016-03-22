// JavaScript source code
var csv_loader = (function () {
    var loadcsvFromUrl, onSucess, onFailure, callback;

    loadcsvFromUrl = function (url, loadCallback) {
        getAsyncRequest(url, onSucess, onFailure);
        callback = loadCallback;
    }

    onSucess = function (response) {
        // Load data
        var result = $.csv.toObjects(response);
        if (callback != null) {
            callback(result);
        }
    }

    onFailure = function (response) {

    }

    getAsyncRequest = function(url, params, successCallback, failureCallback) {
        $.ajax({
            dataType: "text",
            contentType: "application/text; charset=utf-8",
            url: url,
            data: params,
            type : 'GET'
        }).done(onSucess).fail(onFailure);
    }

    return {
        loadcsvFromUrl : loadcsvFromUrl
    }
})();
