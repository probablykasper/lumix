$(document).ready(() => {

    require("./common");
    require("./ui");
    require("./image-actions");
    require("./forms");
    if (page == "user") require("./user");
    if (loggedIn) {

    }

});
