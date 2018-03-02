/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$(document).ready(function () {

    __webpack_require__(1);
    __webpack_require__(2);
    __webpack_require__(3);
    if (loggedIn) {}
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.loopObject = function (object, callback) {
    var i = 0;
    for (var key in object) {
        // skip loop if the property is from prototype
        if (!object.hasOwnProperty(key)) continue;

        // callback(object, key);
        callback(key, i);
        i++;
    }
};

window.xhr = function (reqContent, url, callback) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var xhr = new XMLHttpRequest();
    if (options.type == undefined) options.type = "POST";
    if (options.contentType == undefined) options.contentType = "json";
    xhr.open(options.type, url, true);
    if (options.type == "GET") {
        xhr.send();
    } else if (options.contentType == "values") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("data=" + JSON.stringify(reqContent));
    } else if (options.contentType == "json") {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(reqContent));
    }
    // else if (options.contentType == "multipart") {
    //     // xhr.setRequestHeader("Content-type", "multipart/form-data");
    // }
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            var err = null;
            if (!String(this.status).startsWith("2")) {
                console.error("HTTP error " + this.status);
                err = this.status;
            }
            callback(res, err);
        }
    };
};

// self-invoking function replacement (looks cleaner imo)
window.fold = function (description, callback) {
    callback();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// search, press enter
var searchField = $(".search")[0];
$(".search").keypress(function (e) {
    if (e.which == 13) {
        var searchQuery = searchField.value;
        window.location = "/search/" + searchQuery;
    }
});

if (loggedIn) {

    // press profile pic to toggle account box
    $("img.account-icon").on("click", function () {
        $(".account-box").toggleClass("visible");
    });
    $(document).on("click", function (e) {
        if (!$(e.target).parents(".account-icon-container").length) {
            $(".account-box").removeClass("visible");
        }
    });
}

// function fullPageElement(element) {
//     const headerHeight = $(".site-header").height();
//     let windowHeight = $(window).height();
//     element.height(windowHeight - headerHeight);
//     $(window).on("resize", () => {
//         windowHeight = $(window).height();
//         element.height(windowHeight - headerHeight);
//     });
// }
// if (page == "home") fullPageElement($(".center-container"));
// if (page == "login") fullPageElement($(".form-container"));
// if (page == "register") fullPageElement($(".form-container"));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// register form
if (page == "register") {
    $("button.register").on("click", function () {
        var req = {
            displayname: $(".register-form input.displayname").val(),
            username: $(".register-form input.username").val(),
            email: $(".register-form input.email").val(),
            password: $(".register-form input.password").val()
            // const req =
            // `email=${email}`+
            // `&password=${password}`
        };xhr(req, "/register", function (res, err) {
            if (err) ; // http status code not 2xx
            console.log(res);
        });
    });
}

/***/ })
/******/ ]);