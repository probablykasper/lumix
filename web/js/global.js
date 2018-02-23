// search
const searchField = $(".search")[0];
$(".search").keypress((e) => {
    if (e.which == 13) {
        const searchQuery = searchField.value;
        window.location = `/search/${searchQuery}`;
    }
});
