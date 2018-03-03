// register form
if (page == "register") {
    $("button.register").on("click", () => {
        const req = {
            displayname: $(".register-form input.displayname").val(),
            username: $(".register-form input.username").val(),
            email: $(".register-form input.email").val(),
            password: $(".register-form input.password").val(),
        }
        xhr(req, "/register", (res, err) => {
            if (err); // http status code not 2xx
            console.log(res);
        });
    });
}

// login form
if (page == "login") {
    $("button.login").on("click", () => {
        const req = {
            email: $(".login-form input.email").val(),
            password: $(".login-form input.password").val(),
        }
        xhr(req, "/login", (res, err) => {
            if (err); // http status code not 2xx
            console.log(res);
        });
    });
}
