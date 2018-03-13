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

    // MMM
    result = result.replace("MMM", months[date.getMonth()].substr(0,3));

    let dayOfMonth = date.getDate();

    // Dth
    let th = "th";
    if (dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31 ) th = "st";
    if (dayOfMonth == 2 || dayOfMonth == 22 ) th = "nd";
    if (dayOfMonth == 3 || dayOfMonth == 23 ) th = "rd";
    result = result.replace("Dth", dayOfMonth+th);
    
    // D
    result = result.replace("D", dayOfMonth);


    return result;
}
