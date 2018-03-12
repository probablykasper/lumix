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
    if (page == "user") __webpack_require__(4);
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

window.xhr = function (reqContent, url) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = arguments[3];

    if (typeof options == "function") callback = options;
    if (typeof options == "function") options = {};
    if (options.type == undefined) options.type = "POST";
    if (options.contentType == undefined) options.contentType = "json";
    var xhr = new XMLHttpRequest();
    xhr.open(options.type, url, true);
    if (options.type == "GET") {
        xhr.send();
    } else if (options.contentType == "form") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("data=" + JSON.stringify(reqContent));
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
$("body").on("keypress", ".search", function (e) {
    if (e.which == 13) {
        var searchQuery = searchField.value;
        window.location = "/search/" + searchQuery;
    }
});

if (loggedIn) {

    // press profile pic to toggle account box
    $("body").on("click", "img.account-icon", function () {
        $(".account-box").toggleClass("visible");
    });
    $(document).on("click", function (e) {
        if (!$(e.target).parents(".account-icon-container").length) {
            $(".account-box").removeClass("visible");
        }
    });
}

// auto-resize textareas
$("body").on("input", "textarea.auto-resize", function (e) {
    var textarea = e.target;
    textarea.style.height = "auto";
    var scrollheight = textarea.scrollHeight;
    var computedStyle = getComputedStyle(textarea);
    var paddingTop = computedStyle.paddingBottom.slice(0, -2);
    var paddingBot = computedStyle.paddingTop.slice(0, -2);
    var padding = Number(paddingTop) + Number(paddingBot);
    textarea.style.height = textarea.scrollHeight - padding + "px";
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// register form
fold("register form", function () {

    function submitRegisterForm() {
        var req = {
            displayname: $(".register-form input.displayname").val(),
            username: $(".register-form input.username").val(),
            email: $(".register-form input.email").val(),
            password: $(".register-form input.password").val()
        };
        xhr(req, "/register", function (res, err) {
            if (err) ; // http status code not 2xx
            console.log(res);
            if (res.errors.length == 0) {
                window.location = "/login";
            }
        });
    }

    // register button click
    $("body").on("click", "button.register", function () {
        submitRegisterForm();
    });

    // enter to register
    $("body").on("keypress", ".register-form input", function (e) {
        if (e.which == 13) submitRegisterForm(); // enter
    });
});

fold("login form", function () {

    function submitLoginForm() {
        var req = {
            email: $(".login-form input.email").val(),
            password: $(".login-form input.password").val()
        };
        xhr(req, "/login" + window.location.search, function (res, err) {
            if (err) ; // http status code not 2xx
            console.log(res);
            if (res.errors.length == 0) {
                window.location = res.redirect;
            }
        });
    }

    // login button click
    $("body").on("click", ".login-form button.login", function () {
        submitLoginForm();
    });

    // enter to login
    $("body").on("keypress", ".login-form input", function (e) {
        if (e.which == 13) submitLoginForm(); // enter
    });
});

fold("upload form", function () {

    fold("file select", function () {

        // click "select file" button opens file select dialog
        $("body").on("click", ".upload-form button.files", function () {
            $(".upload-form input#files").click();
        });

        function containsAFile(e) {
            if (e.originalEvent) e = e.originalEvent;
            var dtTypes = e.dataTransfer.types;
            if (dtTypes.length == 1 && dtTypes[0] == "Files") {
                return true;
            }
            return false;
        }

        // setup
        var setupEvents = "drag dragstart dragend dragover dragenter dragleave drop";
        $(window).on(setupEvents, function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        function show() {
            $(".upload-form .drop-to-select-file").removeClass("hidden");
            if (window.uploadData) {
                $(".upload-form .main-form").removeClass("hidden");
            } else {
                $(".upload-form .select-file").addClass("hidden");
            }
        }
        function hide() {
            $(".upload-form .drop-to-select-file").addClass("hidden");
            if (window.uploadData) {
                $(".upload-form .main-form").removeClass("hidden");
            } else {
                $(".upload-form .main-form").addClass("hidden");
                $(".upload-form .select-file").removeClass("hidden");
            }
        }
        // show
        $(window).on("dragenter", function (e) {
            if (containsAFile(e)) show();
            if (containsAFile(e)) $(".upload-form .main-form").addClass("hidden");
        });
        // hide
        $(window).on("dragend", function (e) {
            hide();
        });
        $(window).on("dragleave", function (e) {
            e = e.originalEvent;
            if (e.relatedTarget == null) {
                hide();
            }
        });
        // drop
        $(window).on("drop", function (e) {
            hide();
            if (containsAFile(e)) {
                var files = e.originalEvent.dataTransfer.files;
                if (files[0].type == "image/png" || files[0].type == "image/jpeg") {
                    handleFiles(files);
                } else {// wrong fileExt

                }
            }
        });

        $("body").on("change", ".upload-form input#files", function (e) {
            var input = $(this);
            var files = input.prop("files");
            handleFiles(files);
        });

        // handle files
        function handleFiles(files) {
            window.uploadData = files;
            $(".select-file.container").addClass("hidden");

            var reader = new FileReader();
            $(".upload-form .main-form").removeClass("hidden");
            reader.onload = function (e) {
                var url = e.target.result;
                $(".upload-form .thumbnail").attr("style", "background-image: url(\"" + url + "\")");
                $(".upload-form .thumbnail-container").addClass("visible");
            };
            reader.readAsDataURL(files[0]);
        }
    });

    // add tag when comma/enter
    $("body").on("keypress", ".upload-form input.add-tag", function (e) {
        if (e.which == 44) e.preventDefault(); // comma
        if (e.which == 44 || e.which == 13) {
            // comma || enter
            var $inputElement = $(this);
            var value = $(this).val();
            $inputElement.val(""); // empty the input
            $("\n                <div class=\"tag\">\n                <div class=\"tag-text\">" + value + "</div>\n                <button class=\"remove-tag\">x</div>\n                </div>\n                ").insertBefore($inputElement);
        }
    });

    // remove tag button
    $("body").on("click", ".upload-form .remove-tag", function () {
        $(this).parent().remove();
    });

    // clicking the tags-box focuses the add-tag input element
    $("body").on("click", ".upload-form .tags-box", function (e) {
        if (e.target == e.currentTarget) {
            $(".upload-form input.add-tag").focus();
        }
    });

    function upload() {

        var data = new FormData();
        data.append("image", uploadData[0], uploadData[0].name);
        data.append("title", $(".upload-form input.title").val());
        data.append("description", $(".upload-form textarea.description").val());

        var tagsArray = [];
        $(".upload-form .tags-box .tag").each(function (i, obj) {
            var tagText = $(obj).find(".tag-text").html();
            tagsArray.push(tagText);
        });
        data.append("tags", JSON.stringify(tagsArray));

        console.log(data.get("image"));
        console.log(data.get("title"));
        console.log(data.get("description"));
        console.log(data.get("tags"));

        xhr(data, "/upload", {
            contentType: "none"
        }, function (res, err) {
            if (err) ; // http status code not 2xx
            console.log(res);
            if (res.errors.length == 0) {
                console.log("success!");
            }
        });
    }

    // upload button click
    $("body").on("click", ".upload-form button.upload", function () {
        upload();
    });
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var req = {
    userID: pageUserID,
    skip: 0,
    limit: null
};
xhr(req, "/getUsersImages", function (res, err) {
    if (err) ; // http status code not 2xx
    console.log(res);
    if (res.errors.length == 0) {
        for (var i = 0; i < res.images.length; i++) {
            var image = res.images[i];
            var imageElement = $(".sample-image").clone();
            imageElement.removeClass("sample-image").addClass("image");
            imageElement.find("img").attr("src", "/i/" + image.filename);
            $(".images-container .col-" + i % 3).append(imageElement);
        }
    }
});

/***/ })
/******/ ]);