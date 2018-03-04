// search, press enter
const searchField = $(".search")[0];
$("body").on("keypress", ".search", (e) => {
    if (e.which == 13) {
        const searchQuery = searchField.value;
        window.location = `/search/${searchQuery}`;
    }
});

if (loggedIn) {

    // press profile pic to toggle account box
    $("body").on("click", "img.account-icon", () => {
        $(".account-box").toggleClass("visible");
    });
    $(document).on("click", (e) => {
        if (!$(e.target).parents(".account-icon-container").length) {
            $(".account-box").removeClass("visible");
        }
    });

}

// auto-resize textareas
$("body").on("input", "textarea.auto-resize", (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    const scrollheight = textarea.scrollHeight;
    var computedStyle = getComputedStyle(textarea);
    var paddingTop = computedStyle.paddingBottom.slice(0, -2);
    var paddingBot = computedStyle.paddingTop.slice(0, -2);
    var padding = Number(paddingTop) + Number(paddingBot);
    textarea.style.height = textarea.scrollHeight - padding+"px";
});
