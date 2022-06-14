const ERROR_CODES = [204, 403, 404, 412, 420, 421, 422, 423, 424, 500, 502, 503, 520, 522, 524, 525];
const ERROR_MESSAGES = {
    c0: "<b>ERROR</b>: An error occurred; the nature is unknown",
    c204: "<b>ERROR 204</b>: No content was found; no post was found",
    c403: "<b>ERROR 403</b>: An error occurred with the User agent; change it from the code",
    c404: "<b>ERROR 404</b>: Not found",
    c412: "<b>ERROR 412</b>: Precondition failed",
    c420: "<b>ERROR 420</b>: Record could not be saved",
    c421: "<b>ERROR 421</b>: User throttled, try again another time",
    c422: "<b>ERROR 422</b>: The resource can not be modified",
    c423: "<b>ERROR 423</b>: The resource already exists",
    c424: "<b>ERROR 424</b>: The parameters are not valid",
    c500: "<b>ERROR 500</b>: Internal Server Error; e621 may not be accessible",
    c502: "<b>ERROR 502</b>: Bad Gateway; a gateway received an invalid response from the server",
    c503: "<b>ERROR 503</b>: Service Unavailable; the program requested too many images",
    c520: "<b>ERROR 520</b>: Unkown Error; the server's response violates the protocol",
    c522: "<b>ERROR 522</b>: Connection Time-Out: the program couldn't communicate with e621",
    c524: "<b>ERROR 524</b>: Connection Time-Out: connection established but could not continue further",
    c525: "<b>ERROR 525</b>: Handshake Failed: the SSL handshake with e621 failed"
};

const PROJECT_NAME = "Testing the API for myself";
const VERSION = "0.0";
const USERNAME = "fsk-nsfw";
const USER_AGENT = PROJECT_NAME + "/" + VERSION +" (by " + USERNAME + " on e621)";

let active_image_number = 0;

let imageList = [];

$(document).ready(function() {
    $("button").click(function() {
        active_image_number = (active_image_number + 1) % imageList.length;
        showNextPicture();
    });

    requestFiles();
    showNextPicture();
});

function displayError(error_value) {
    $("body").append("<div id='error_div'></div>");
    let error_div = document.getElementById("error_div");
        error_div.style.backgroundColor = "#FF00005F";
        error_div.style.border = "0.1cm solid #CC0000";

        error_div.style.position = "absolute";
        error_div.style.top = "3vh";
        error_div.style.left = "25vw";

        error_div.style.width = "48vw";
        error_div.style.height = "10vh";

    $("#error_div").append("<p id='error_message'></p>");
    let error_message = document.getElementById("error_message");
        error_message.style.widows = "46vw";
        error_message.style.height = "8vh";

        error_message.style.paddingTop = "-0.5vh";
        error_message.style.paddingLeft = "1vw";

        error_message.style.color = "#CC0000";
        error_message.style.textAlign = "center";
        error_message.style.fontSize = "160%";
        error_message.style.fontFamily = "cabin";

    let error_code = 0;
    for (let key in ERROR_CODES) {
        if (error_value == ERROR_CODES[key]) {
            error_code = ERROR_CODES[key];
            break;
        }
    }

    error_message.innerHTML = ERROR_MESSAGES["c" + error_code];

    $("#error_div").delay(5000).fadeOut(1000).promise().done(function() {
        document.body.removeChild(document.getElementById("error_div"));
    });
}

function occurredError(xhr, status, error) {
    displayError(xhr.status);
}

function dividePictures(data) {
    for (let i in data.posts) {
        imageList[i] = data.posts[i].file.url;
        console.log(imageList[i]);
    }
}

function showNextPicture() {
    $("#image").attr("src", imageList[active_image_number]);
}

function requestFiles() {
    $.ajax({
        dataType: "application/json",
        converters: {
            "text application/json": jQuery.parseJSON
        },
        url: "https://e621.net/posts.json?_client=" + USER_AGENT + "&limit=" + 15 + "&page=" + 1 + "&tags=lycanroc+-female" + "&callback=?",
        success: dividePictures,
        error: occurredError
    })
};