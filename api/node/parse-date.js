function isNumber(string) {
    return /^\d+$/.test(string);
}
module.exports = (input, errCallback) => {
    function err(code) {
        errCallback(code);
        return false;
    }
    // log timezone:
    // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // YYYY.MM.DD hh:mm:ss.xxx
    // if (typeof input != "string") return err(0);

    // let year = input.substr(0, 4);
    // let month = input.substr(5, 2);
    // let day = input.substr(8, 2);
    // let hour = input.substr(11, 2);
    // let minute = input.substr(14, 2);
    // let second = input.substr(17, 2);
    // let millisecond = input.substr(20, 3);
    // d = [year, month, day, hour, minute, second, millisecond];
    // for (let i = 0; i < d.length; i++) {
    //     if (!isNumber(d[i])) {
    //         return err(i+1); // error codes 1-7
    //     }
    // }

    //           new Date(year, month, day, hour, minute, second, millisecond);
    // let output = new Date(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
    let output = new Date(input);
    if (Object.is(output.valueOf(), NaN)) err(8);
    return output;
}
