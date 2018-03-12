const req = {
    userID: pageUserID,
    skip: 0,
    limit: null,
};
xhr(req, "/getUsersImages", (res, err) => {
    if (err); // http status code not 2xx
    console.log(res);
    if (res.errors.length == 0) {
        for (let i = 0; i < res.images.length; i++) {
            const image = res.images[i];
            let imageElement = $(".sample-image").clone();
            imageElement.removeClass("sample-image").addClass("image");
            imageElement.find("img").attr("src", "/i/"+image.filename);
            $(".images-container .col-"+i%3).append(imageElement);
        }
    }

});
