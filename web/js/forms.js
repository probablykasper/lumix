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

    fold("file select", () => {

        // click "select file" button opens file select dialog
        $("body").on("click", ".upload-form button.files", () => {
            $(".upload-form input#files").click();
        });

        function containsAFile(e) {
            if (e.originalEvent) e = e.originalEvent;
            const dtTypes = e.dataTransfer.types;
            if (dtTypes.length == 1 && dtTypes[0] == "Files") {
                return true;
            }
            return false;
        }

        // setup
        const setupEvents = "drag dragstart dragend dragover dragenter dragleave drop";
        $(window).on(setupEvents, (e) => {
            if ($(e.target).inOrIs(".upload-form")) {
                e.preventDefault();
                e.stopPropagation();
            }
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
        $(window).on("dragenter", (e) => {
            if ($(e.target).inOrIs(".upload-form")) {
                if (containsAFile(e)) show();
                if (containsAFile(e)) $(".upload-form .main-form").addClass("hidden");
            }
        });
        // hide
        $(window).on("dragend", (e) => {
            hide();
        });
        $(window).on("dragleave", (e) => {
            console.log(e);
            e = e.originalEvent;
            if (e.relatedTarget == null || $(e.target).hasClass("upload-form")) {
                hide();
            }
        });
        // drop
        $(window).on("drop", (e) => {
            hide();
            if (containsAFile(e)) {
                const files = e.originalEvent.dataTransfer.files;
                if (files[0].type == "image/png" || files[0].type == "image/jpeg") {
                    handleFiles(files);
                } else { // wrong fileExt

                }
            }
        });

        $("body").on("change", ".upload-form input#files", function(e) {
            const input = $(this);
            const files = input.prop("files");
            handleFiles(files);
        });

        // handle files
        function handleFiles(files) {
            window.uploadData = files;
            $(".select-file.container").addClass("hidden");

            const reader = new FileReader();
            $(".upload-form .main-form").removeClass("hidden");
            reader.onload = (e) => {
                const url = e.target.result;
                $(".upload-form .thumbnail").attr("style", `background-image: url("${url}")`);
                $(".upload-form .thumbnail-container").addClass("visible");

            };
            reader.readAsDataURL(files[0]);

        }

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

    function upload() {

        const data = new FormData();
        data.append("image", uploadData[0], uploadData[0].name);
        data.append("title", $(".upload-form input.title").val());
        data.append("description", $(".upload-form textarea.description").val());

        const tagsArray = [];
        $(".upload-form .tags-box .tag").each((i, obj) => {
            const tagText = $(obj).find(".tag-text").html();
            tagsArray.push(tagText);
        });
        data.append("tags", JSON.stringify(tagsArray));

        console.log(data.get("image"));
        console.log(data.get("title"));
        console.log(data.get("description"));
        console.log(data.get("tags"));

        xhr(data, "/upload", {
            contentType: "none",
        }, (res, err) => {
            if (err); // http status code not 2xx
            console.log(res);
            if (res.errors.length == 0) {
                console.log("success!");
            }
        });

    }

    // upload button click
    $("body").on("click", ".upload-form button.upload", () => {
        upload();
    });

});
