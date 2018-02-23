// search, press enter
const searchField = $(".search")[0];
$(".search").keypress((e) => {
    if (e.which == 13) {
        const searchQuery = searchField.value;
        window.location = `/search/${searchQuery}`;
    }
});

if (loggedIn) {

    // press profile pic to toggle account box
    $("img.account-icon").on("click", () => {
        $(".account-box").toggleClass("visible");
    });
    $(document).on("click", (e) => {
        if (!$(e.target).parents(".account-icon-container").length) {
            $(".account-box").removeClass("visible");
        }
    });

}
