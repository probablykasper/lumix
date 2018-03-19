$("body").on("click", ".image .icon.like", (e) => {
    const req = {
        fileID: $(e.target).parents(".image").attr("data-file-id"),
    };
    console.log(req);
    xhr(req, "/like-toggle", (res, err) => {
        if (err); // http status code not 2xx
        console.log(res);
        if (res.errors.length == 0) {
            console.log("success liking");
        }
    });
});
