const req = {
    userId: pageUserId,
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
            imageElement.attr("data-file-id", image.fileId);
            imageElement.find("a.image-link").attr("href", "/i/"+image.fileId);
            imageElement.find("img.image").attr("src", "/i/"+image.filename);
            imageElement.find("img.profile-picture").attr("src", image.userId.profilePictureURL);
            imageElement.find("a.row-left").attr("href", image.userId.username);
            if (image.likedByUser) {
                imageElement.find(".row-right .icon.like").addClass("liked");
            }
            imageElement.find("p.displayname").html(image.userId.displayname);
            $(".images-container .col-"+i%3).append(imageElement);
        }
    }

});
