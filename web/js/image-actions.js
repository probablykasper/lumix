$("body").on("click", ".image .icon.like", (e) => {
    const req = {
        fileId: $(e.target).parents(".image").attr("data-file-id"),
    };
    console.log(req);
    xhr(req, "/like-toggle", (res, err) => {
        if (err); // http status code not 2xx
        console.log(res);
        if (res.errors.length == 0) {
            if (res.liked) {
                console.log("success liking");
                $(e.target).addClass("liked");
            } else {
                console.log("success unliking");
                $(e.target).removeClass("liked");
            }
        }
    });
});
