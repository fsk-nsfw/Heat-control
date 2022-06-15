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
const VERSION = "0.1";
const USERNAME = "fsk-nsfw";
const USER_AGENT = PROJECT_NAME + "/" + VERSION +" (by " + USERNAME + " on e621)";

const ERROR_ALERT = 0;
const INFORMATION_ALERT = 1;

const IMAGES_TO_SEARCH = 20;

let showInfo = false;
let active_image_number = 0;

let obtainedData;

$(document).ready(function() {
    $("#infoTOGGLEbutton").click(function() {
        generateAlerts(INFORMATION_ALERT);

        showInfo = !showInfo;
        if (showInfo) {
            $("#alert_message").html("Infos will now be sent to the <b>console</b>");
        } else {
            $("#alert_message").html("Infos will no more be <b>shown</b>");
        }

        removeAlerts();
    });

    $("#nextIMAGEbutton").click(function() {
        active_image_number = (active_image_number + 1) % obtainedData.posts.length;

        showPicture();
    });
    
    $("#previousIMAGEbutton").click(function() {
        if (active_image_number - 1 < 0) {
            active_image_number = obtainedData.posts.length - 1;
        } else {
            active_image_number--;
        }

        showPicture();
    });
    
    $("#resetIMAGEbutton").click(function() {
        active_image_number = 0;
        showPicture();
    });

    $("#reloadSEARCHbutton").click(function() {
        requestFiles();
    });

    requestFiles();
});

function showPicture() {
    $("#image").attr("src", obtainedData.posts[active_image_number].file.url);
    showData();
}

function showData() {
    if (showInfo) {
        console.log("POST ID: " + obtainedData.posts[active_image_number].id);
        console.log("IMAGE WIDTH: " + obtainedData.posts[active_image_number].file.width);
        console.log("IMAGE HEIGTH: " + obtainedData.posts[active_image_number].file.height);
        console.log("UPVOTES: " +  + obtainedData.posts[active_image_number].score.total);
        switch(obtainedData.posts[active_image_number].rating) {
            case "s": {
                console.log("RATING: safe");
                break;
            }
            case "q": {
                console.log("RATING: questionable");
                break;
            }
            case "e": {
                console.log("RATING: explicit");
                break;
            }
        }
        console.log("IMAGE LINK: " + obtainedData.posts[active_image_number].file.url);
        console.log("POSITION: " + (active_image_number + 1));
    }
}

function requestFiles() {
    $.ajax({
        dataType: "application/json",
        converters: {
            "text application/json": jQuery.parseJSON
        },
        url: "https://e621.net/posts.json?_client=" + USER_AGENT + "&limit=" + 15 + "&page=" + 1 + "&tags=" + addInputTags() + "&callback=?",
        success: storeData,
        error: occurredError
    })
};

function addInputTags() {
    let tag_list = $("#tagINPUTtext").val();

    console.log("https://e621.net/posts.json?_client=" + USER_AGENT + "&limit=" + 15 + "&page=" + 1 + "&tags=" + tag_list + "&callback=?");
    console.log("TAGS: " + tag_list);

    return tag_list;
}

function storeData(data) {
    obtainedData = data;
}

function occurredError(xhr, status, error) {
    displayError(xhr.status);
}

function displayError(error_value) {

    generateAlerts(ERROR_ALERT);

    let error_code = 0;
    for (let key in ERROR_CODES) {
        if (error_value == ERROR_CODES[key]) {
            error_code = ERROR_CODES[key];
            break;
        }
    }

    $("#alert_message").html(ERROR_MESSAGES["c" + error_code]);

    removeAlerts();
}

function removeAlerts() {
    $("#alert_div").delay(2000).fadeOut(1000).promise().done(function() {
        document.body.removeChild(document.getElementById("alert_div"));
    });
}

function generateAlerts(type_of_alert) {
    $("body").append("<div id='alert_div'></div>");
    let alert_div = document.getElementById("alert_div");

    $("#alert_div").append("<p id='alert_message'></p>");
    let alert_message = document.getElementById("alert_message");

    switch (type_of_alert) {
        case ERROR_ALERT: {
            alert_div.style.backgroundColor = "#FF00005F";
            alert_div.style.border = "0.1cm solid #CC0000";
    
            alert_div.style.position = "absolute";
            alert_div.style.top = "3vh";
            alert_div.style.left = "25vw";
    
            alert_div.style.width = "48vw";
            alert_div.style.height = "10vh";
            alert_message.style.width = "46vw";
            alert_message.style.height = "8vh";
    
            alert_message.style.paddingTop = "-0.5vh";
            alert_message.style.paddingLeft = "1vw";
    
            alert_message.style.color = "#CC0000";
            alert_message.style.textAlign = "center";
            alert_message.style.fontSize = "160%";
            alert_message.style.fontFamily = "cabin";

            break;
        }

        case INFORMATION_ALERT: {
            alert_div.style.backgroundColor = "#00DD0A5F";
            alert_div.style.border = "0.1cm solid #00AA00";
    
            alert_div.style.position = "absolute";
            alert_div.style.top = "3vh";
            alert_div.style.left = "25vw";
    
            alert_div.style.width = "48vw";
            alert_div.style.height = "10vh";
            alert_message.style.width = "46vw";
            alert_message.style.height = "8vh";
    
            alert_message.style.paddingTop = "-0.5vh";
            alert_message.style.paddingLeft = "1vw";
    
            alert_message.style.color = "#00AA00";
            alert_message.style.textAlign = "center";
            alert_message.style.fontSize = "160%";
            alert_message.style.fontFamily = "cabin";

            break;
        }
    }
}