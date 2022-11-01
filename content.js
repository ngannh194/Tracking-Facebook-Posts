$(document).ready(function () {
    let mapData = {"LIKE": 1, "HEART": 2, "WOW": 3, "HAHA": 4, "SAD": 7, "ANGRY": 8}
    let monitorStr = localStorage.getItem("monitor");
    console.log(monitorStr);
    let fbVersion = localStorage.getItem("facebook_version");
    console.log(fbVersion);
    document.facebookVersionForm.facebookVersion.value=fbVersion;
    var rad = document.facebookVersionForm.facebookVersion;
    var prev = null;
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function() {
            (prev) ? console.log(prev.value): null;
            if (this !== prev) {
                prev = this;
            }
            console.log(this.value)
        });
    }
    let monitorObjs;
    $("#tbody_monitor").html("");
    if (monitorStr != null && monitorStr !== "") {

        monitorObjs = JSON.parse(monitorStr);
        for (var postId in monitorObjs) {
            let nLike, nHeart, nWow, nHaha, nSad, nAngry;
            let monitorObj = monitorObjs[postId];
            let updateAt = monitorObj["updated_at"];
            if (monitorObj.hasOwnProperty(mapData["LIKE"])) {
                nLike = monitorObj[mapData["LIKE"]]
            } else {
                nLike = 0
            }
            if (monitorObj.hasOwnProperty(mapData["HEART"])) {
                nHeart = monitorObj[mapData["HEART"]]
            } else {
                nHeart = 0
            }
            if (monitorObj.hasOwnProperty(mapData["WOW"])) {
                nWow = monitorObj[mapData["WOW"]]
            } else {
                nWow = 0
            }
            if (monitorObj.hasOwnProperty(mapData["HAHA"])) {
                nHaha = monitorObj[mapData["HAHA"]]
            } else {
                nHaha = 0
            }
            if (monitorObj.hasOwnProperty(mapData["SAD"])) {
                nSad = monitorObj[mapData["SAD"]]
            } else {
                nSad = 0
            }
            if (monitorObj.hasOwnProperty(mapData["ANGRY"])) {
                nAngry = monitorObj[mapData["ANGRY"]]
            } else {
                nAngry = 0
            }
            let row = `<tr>
        <td>${postId}</td>
        <td><div class="div-inline"><img width="16px" height="16px" src="icons/like.png">${nLike}
        <img class="ml-8" width="16px" height="16px"  src="icons/heart.png">${nHeart}
        <img class="ml-8" width="16px" height="16px"  src="icons/haha.png">${nHaha}
        <img class="ml-8" width="16px" height="16px"  src="icons/wow.png">${nWow}
        <img class="ml-8" width="24px" height="24px"  src="icons/sad.jpg">${nSad}
        <img class="ml-8" width="24px" height="24px"  src="icons/angry.jpg">${nAngry}</div></td>
        <td class="div-inline">${updateAt}</td>
    </tr>`
            $("#tbody_monitor").prepend(row);
        }

    }
});