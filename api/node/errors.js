// module.exports = {
//     getMessage: () => {
//
//     },
//     handle: () => {
//
//     }
// }
module.exports = (error) => {
    const formatDate = require("./format-date");
    const info = error.message.slice(1);

    const codeTypes = {
        1: "User input error.",
        2: "Internal server errror.",
        3: "Authentication/Authorization error.",
    }
    const codes = {
        1001: `The image with ID "${info[0]}" does not exist.`,
        2001: `There was an error in the error handling.`,
        3001: `You need to be logged in for this.`,
    }
    const code = error.message[0];
    const codeType = Number(String(code).substr(1));
    const message = `${codeTypes[codeType]} ${codes[code]}`;
    // console.log("::xaxaxa:");
    // console.log(error.message);

    let log = `----------------------------------------------------------------------`;
    // log += `\nreferenceId: ${referenceId}`;
    log += `\ndate: ${formatDate("YYYY MMM D hh:mm:ss.xxxx")}`;
    log += `\nmessage: ${message}`;
    log += `\ncode: ${code}`;
    if (error.locations) log += `\nlocations: ${error.locations}`;
    if (error.path) log += `\npath: ${error.path}`;
    if (error.stack) log += `\nstack: ${error.stack}`;
    // console.log(error);
    // console.log(log);

    return {
        // referenceId: referenceId,
        message: message,
        code: code,
        locations: error.locations,
        path: error.path,
        // stack
    }
}

// module.exports = (error) => {
//     console.log(error);
//     if (typeof error.message == "number") {
//         error.message = [error.message];
//     } else if (!Array.isArray(error.message)) {
//         error.message = [2001];
//     }
//
//     let code = error.message[0];
//     const info = error.message.slice(1);
//     const gottenMessage = getMessage(error.message[0], info);
//     code = gottenMessage.code;
//     message = gottenMessage.message;
//
//     referenceId = 0;
//
//     // let log = `----------------------------------------------------------------------`,
//     // log += `\nreferenceId: ${referenceId}`;
//     // log += `\ndate: ${formatDate("YYYY MMM D hh:mm:ss.xxxx")}`;
//     // log += `\nmessage: ${message}`;
//     // log += `\ncode: ${code}`;
//     // if (error.locations) log += `\nlocations: ${error.locations}`;
//     // if (error.path) log += `\npath: ${error.path}`;
//     // if (error.stack) log += `\nstack: ${error.stack}`;
//
//     console.log(
//         `----------------------------------------------------------------------`,
//         "\nreferenceId: ", referenceId,
//         "\ndate: ", formatDate("YYYY MMM D hh:mm:ss.xxxx"),
//         "\nmessage: ", message,
//         "\ncode: ", code,
//         "\nlocations: ", error.locations,
//         "\npath: ", error.path,
//         "\nstack: ", error.stack,
//     );
//     // return {
//     //     referenceId: referenceId,
//     //     message: message,
//     //     code: code,
//     //     locations: error.locations,
//     //     path: error.path,
//     //     // stack
//     // }
//
// };
