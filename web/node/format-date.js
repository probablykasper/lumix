const months = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December",
];
module.exports = (date, format) => {
    // YYYY
    let result = format.replace("YYYY", date.getFullYear());

    // MMMM
    result = result.replace("MMMM", months[date.getMonth()]);

    // Dth
    let dayOfMonth = date.getDate();
    let th = "th";
    if (dayOfMonth == 1) th = "st";
    if (dayOfMonth == 2) th = "nd";
    if (dayOfMonth == 3) th = "rd";
    result = result.replace("Dth", dayOfMonth+th);
    return result;
}
