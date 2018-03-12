(function( $ ){
    $.fn.inOrIs = function(q) {
        if (this.parents(q).length || this.filter(q).length) return true;
        else return false;
    };
})(jQuery);

window.loopObject = (object, callback) => {
    let i = 0;
    for (let key in object) {
        // skip loop if the property is from prototype
        if (!object.hasOwnProperty(key)) continue;

        // callback(object, key);
        callback(key, i);
        i++;
    }
}

window.xhr = (reqContent, url, options = {}, callback) => {
    if (typeof options == "function") callback = options;
    if (typeof options == "function") options = {};
    if (options.type == undefined)        options.type = "POST";
    if (options.contentType == undefined) options.contentType = "json";
    var xhr = new XMLHttpRequest();
    xhr.open(options.type, url, true);
    if (options.type == "GET") {
        xhr.send();
    } else if (options.contentType == "form") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("data="+JSON.stringify(reqContent));
    } else if (options.contentType == "json") {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(reqContent));
    } else if (options.contentType == "none") {
        xhr.send(reqContent);
        // for file uploads (multipart/form-data)
    } else if (options.contentType) {
        xhr.setRequestHeader("Content-type", options.contentType);
        xhr.send(reqContent);
    }
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            let res = JSON.parse(this.responseText);
            let err = null;
            if (!String(this.status).startsWith("2")) {
                console.error("HTTP error "+this.status);
                err = this.status;
            }
            callback(res, err);
        }
    };
}

// self-invoking function replacement (looks cleaner imo)
window.fold = (description, callback) => {
    callback();
}
