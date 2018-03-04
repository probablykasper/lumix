import qq from "fine-uploader/lib/core/traditional";
// register form
fold("register form", () => {

    function submitRegisterForm() {
        const req = {
            displayname: $(".register-form input.displayname").val(),
            username: $(".register-form input.username").val(),
            email: $(".register-form input.email").val(),
            password: $(".register-form input.password").val(),
        };
        xhr(req, "/register", (res, err) => {
            if (err); // http status code not 2xx
            console.log(res);
            if (res.errors.length == 0) {
                window.location = "/login";
            }
        });
    }

    // register button click
    $("body").on("click", "button.register", () => {
        submitRegisterForm();
    });

    // enter to register
    $("body").on("keypress", ".register-form input", (e) => {
        if (e.which == 13) submitRegisterForm();  // enter
    });

});

fold("login form", () => {

    function submitLoginForm() {
        const req = {
            email: $(".login-form input.email").val(),
            password: $(".login-form input.password").val(),
        };
        xhr(req, `/login${window.location.search}`, (res, err) => {
            if (err); // http status code not 2xx
            console.log(res);
            if (res.errors.length == 0) {
                window.location = res.redirect;
            }
        });
    }

    // login button click
    $("body").on("click", ".login-form button.login", () => {
        submitLoginForm();
    });

    // enter to login
    $("body").on("keypress", ".login-form input", (e) => {
        if (e.which == 13) submitLoginForm();  // enter
    });

});

fold("upload form", () => {

    function submitUploadForm() {
        const req = {
            title: $(".upload-form input.title").val(),
            description: $(".upload-form textarea.description").val(),
        };
        // xhr(req, "/upload", (res, err) => {
        //     if (err); // http status code not 2xx
        //     console.log(res);
        //     if (res.errors.length == 0) {
        //         window.lcation = "???"
        //     }
        // });
    }

    fold("file upload", () => {

        // click "select file" button opens file select dialog
        $("body").on("click", ".upload-form button.files", () => {
            $(".upload-form input#files").click();
        });

        function containsAFile(e) {
            const dtTypes = e.originalEvent.dataTransfer.types;
            console.log(e.originalEvent.dataTransfer.files);
            // if (dtTypes.length == 1 && dtTypes[0] == "Files") {
            //     return true;
            // }
            // return false;
        }

        // setup
        const setupEvents = "drag dragstart dragend dragover dragenter dragleave drop";
        $(window).on(setupEvents, (e) => {
            console.log(containsAFile(e));
            if (containsAFile(e)) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // const qq = require("fine-uploader/fine-uploader/fine-uploader.core.js");
        const uploader = new qq.FineUploaderBasic({
            debug: true,
            element: $(".upload-form button.files").get(0),
            request: {
                endpoint: "/uploads",
            },
            deleteFile: {
                enabled: true,
                endpoint: "uploads",
            },
            retry: {
                enableAuto: true,
            },
        });

    });

    // add tag when comma/enter
    $("body").on("keypress", ".upload-form input.add-tag", function(e) {
        if (e.which == 44) e.preventDefault(); // comma
        if (e.which == 44 || e.which == 13) { // comma || enter
            const $inputElement = $(this);
            const value = $(this).val();
            $inputElement.val(""); // empty the input
            $(`
                <div class="tag">
                <div class="tag-text">${value}</div>
                <button class="remove-tag">x</div>
                </div>
                `).insertBefore($inputElement);
            }
        });

    // remove tag button
    $("body").on("click", ".upload-form .remove-tag", function() {
        $(this).parent().remove();
    });

    // clicking the tags-box focuses the add-tag input element
    $("body").on("click", ".upload-form .tags-box", (e) => {
        if (e.target == e.currentTarget) {
            $(".upload-form input.add-tag").focus();
        }
    });

});
