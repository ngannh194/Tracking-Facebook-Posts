var sampleRequest = "https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=172665601992710&av=100060731011028&ext=1661248613&hash=AeTH9dBy1iqb9cFA6lI"
var ProfileEndpoint = "https://m.facebook.com/ufi/reaction/profile/browser/?";
var ShareEndpoint = "https://m.facebook.com/browse/shares?";
var ProfileEndpointNext = "https://m.facebook.com/ufi/reaction/profile/browser/fetch/?";


class FBHelper {

    async getUserLikesPost(postID) {
        // console.log(`Next page on ad ${postID} with reaction ${reactionType}`);
        let param = new URLSearchParams();
        param.set("ft_ent_identifier", postID);
        param.set("__a", localStorage.getItem("a"));
        param.set("__req", "j");
        param.set("__dyn", localStorage.getItem("dyn"));
        param.set("fb_dtsg_ag", localStorage.getItem("fb_dtsg_get"));
        let res = 1;
        try {
            res = await ajax({
                "method": "GET",
                "url": ProfileEndpoint + param.toString(),
                "content-type": "application/x-www-form-urlencoded",
            });
        } catch (err) {
            return [];
        }

        if (!res.ok) {
            return [];
        }

        const data = await res.text();
        // console.log("RAW text ", decodeURIComponent(data));
        // let pattern = /"html":"([^,]*)/i;
        // var finder = pattern.exec(data);
        var shownIDs = parseDataUserLikePost(data);
        // console.log("start sleep");
        // await this.sleep(5000);
        // console.log("end sleep");
   //     this.getUserLikesPostNext(postID, shownIDs["data"].join("%2C"));
        if (shownIDs.data != null){
            var bodyData = {
                "post_id": postID,
                "user_ids": shownIDs.data
                }
                try {
                res = await ajax({
                "method": "POST",
                "data": JSON.stringify(bodyData),
                "url": "https://us-central1-fb-tracking-93750.cloudfunctions.net/saveUserLikePost",
                "headers": {
                    "content-type": 'application/json'
                }
            // "content-type": "application/x-www-form-urlencoded",
                });
                } catch (err) {
                return [];
                }
        }
    }

    async getUserSharePost(postID) {
        let param = new URLSearchParams();
        param.set("id", postID);
        param.set("__a", localStorage.getItem("a"));
        param.set("__req", "g");
        param.set("__csr", "");
        param.set("user", "g");
        param.set("__dyn", localStorage.getItem("dyn"));
        param.set("fb_dtsg_ag", localStorage.getItem("fb_dtsg_get"));
        let res = 1;
        try {
            res = await ajax({
                "method": "GET",
                "url": ShareEndpoint + param.toString(),
                "content-type": "application/x-www-form-urlencoded",
            });
        } catch (err) {
            return [];
        }

        if (!res.ok) {
            return [];
        }

        const data = await res.text();
        var shownIDs = parseDataUserSharePost(data);
        console.log(shownIDs);
        if (shownIDs.data != null){
            var bodyData = {
                "post_id": postID,
                "user_ids": shownIDs.data
                }
                try {
                res = await ajax({
                "method": "POST",
                "data": JSON.stringify(bodyData),
                "url": "https://us-central1-fb-tracking-93750.cloudfunctions.net/saveUserSharePost",
                "headers": {
                    "content-type": 'application/json'
                }
            // "content-type": "application/x-www-form-urlencoded",
                });
                } catch (err) {
                return [];
                }
        }
    }


    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getUserLikesPostNext(postID, shownIDs) {
        // console.log(`Next page on ad ${postID} with reaction ${reactionType}`);
        let param = new URLSearchParams();
        param.set("ft_ent_identifier", postID);
        param.set("limit", "50");
        param.set("shown_ids");
        param.set("total_count", "100");

        var bodyData = {
            "fb_dtsg": localStorage.getItem("fb_dtsg_get"),
            "__dyn": localStorage.getItem("dyn"),
            "__csr": localStorage.getItem(""),
            "__req": localStorage.getItem("e"),
            "__a": localStorage.getItem("a"),
        };
        let res = 1;
        try {
            res = await ajax({
                "method": "POST",
                "data": JSON.stringify(bodyData),
                "url": ProfileEndpointNext + param.toString(),
                "content-type": "application/x-www-form-urlencoded",
            });
        } catch (err) {
            return [];
        }

        if (!res.ok) {
            return [];
        }

        const data = await res.text();
        // console.log("RAW text ", decodeURIComponent(data));
        // let pattern = /"html":"([^,]*)/i;
        // var finder = pattern.exec(data)
        // console.log("DATA ", escape(finder[1]));
        parseDataUserLikePost(data);
    }

}

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        if (details.url.indexOf("m.facebook.com") == -1) {
            return
        }

        // if (details.method == "POST") {
        //     if (details.url.indexOf("https://www.m.facebook.com/ajax/bz") !== -1) {
        //         const urlParams = new URLSearchParams(details.url);
        //         dyn = urlParams.get("__dyn");
        //         fbDtsgPost = urlParams.get("fb_dtsg");
        //     }
        // }
            // console.log("Request url ", details.url, details["method"]);
        if (details["method"] == "GET") {
            // const urlParams = new URLSearchParams(details["url"]);
            // const value = urlParams.get("fb_dtsg_ag")
            // if (value !== null) {
            //     console.log("GET fb dtsg: ", value);
            //     chrome.storage.sync.set({"fb_dtsg_get": value}, function () {
            //         // console.log('Value is set to ' + value);
            //     });
            //     localStorage.setItem("fb_dtsg_get", value);
            // }
            // return
            if (details.url.indexOf("fb_dtsg_ag") !== -1) {
                const urlParams = new URLSearchParams(details.url);
                var dyn = urlParams.get("__dyn");
                var fbDtsgPost = urlParams.get("fb_dtsg_ag");
                var aData = urlParams.get("__a");
                console.log("DYN ", dyn)
                console.log("fbDtsgPost ", fbDtsgPost)
                localStorage.setItem("a", aData);
                localStorage.setItem("dyn", dyn);
                localStorage.setItem("fb_dtsg_get", fbDtsgPost);

            }
        }

    },
    // filters
    {urls: ['https://*/*', 'http://*/*']},
    // extraInfoSpec
    ['requestBody']);


chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        // console.log("Refix headers:  "+ JSON.stringify(details.requestHeaders));
        var newRequestsHeaders = [];
        if (details.url.indexOf("https://www.facebook.com/ufi/reaction/profile/browser/fetch") !== -1 || details.url.indexOf("https://www.facebook.com/api/graphql") !== -1) {
            for (var i = 0; i < details.requestHeaders.length; i++) {
                const headerName = details.requestHeaders[i].name.toLowerCase();
                if ((headerName === "origin") && (details.requestHeaders[i].value.includes("chrome-extension"))) {
                    continue
                }

                if (headerName.startsWith("sec-fetch")) {
                    continue
                }

                newRequestsHeaders.push(details.requestHeaders[i]);
            }
            newRequestsHeaders.push({name: "referer", value: "https://www.facebook.com"})
            details.requestHeaders = newRequestsHeaders;
        }

        return {requestHeaders: details.requestHeaders};
    },
    // filters
    {urls: ['https://*/*', 'http://*/*']},
    // extraInfoSpec
    ['blocking', 'requestHeaders', 'extraHeaders']);


function sendRequest(request) {
    const method = request["method"];
    const url = request["url"];
    const data = request["data"];
    const callback = request["done"];
    const cookies = request["cookies"]
    var contentType = request["content-type"]

    if (!request.hasOwnProperty("content-type")) {
        contentType = "application/json";
    }

    var xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.withCredentials = true;

    if (cookies != null && cookies.length) {
        document.cookie = cookies;
    }

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            callback(this);
        }
    })

    xhr.send(data);
}

async function ajax(request) {
    const method = request["method"];
    const url = request["url"];
    const data = request["data"];
    var contentType = request["content-type"]

    if (!request.hasOwnProperty("content-type")) {
        contentType = "application/json";
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": contentType,
        },
        credentials: 'include',
        body: data,
    })

    return response
}

function urlencodeFormData(fd) {
    var s = '';

    function encode(s) {
        return encodeURIComponent(s).replace(/%20/g, '+');
    }

    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
        }
    }
    return s;
}


function parseDataUserLikePost(text) {
    console.log(text)
    if (text.startsWith("for (;;);")) {
        // let data = JSON.parse(text.substring(9, text.length));
        // if ("errorSummary" in data) {
        //     return {"data": [], "error": data["errorSummary"]}
        // }
        // if (!("domops" in data)) {
        //     return {"data": [], "error": "No data"}
        // }
        let pattern = /shown_ids=([^&amp;]*)/i;
        var finder = pattern.exec(text)
        console.log(finder.length)
        if (finder.length >= 2) {
            var listUserID = finder[1].split(`\\u00252C`);
            console.log("USER IDS ", listUserID);
            return {"data": listUserID, "error": ""}
        }

    }
    return {"data": [], "error": "No data"}
}

function parseDataUserSharePost(text) {
    var listUserID = [];
    if (text.startsWith("for (;;);")) {
        let pattern = /profile\.php\?id=(\d+)/g;
        var finder = text.match(pattern);
        finder.forEach((e, idx)=>{
            console.log(e)
            var userID = e.split("=")[1]
            if (listUserID.indexOf(userID) < 0) {
                listUserID.push(userID)
            }
        })
    }
    return {"data": listUserID, "error": ""}
}

function parseDataUserLikePostNext(text) {
    if (text.startsWith("for (;;);")) {
        // let data = JSON.parse(text.substring(9, text.length));
        // if ("errorSummary" in data) {
        //     return {"data": [], "error": data["errorSummary"]}
        // }
        // if (!("domops" in data)) {
        //     return {"data": [], "error": "No data"}
        // }
        let pattern = /shown_ids=([^&total_count]*)/i;
        var finder = pattern.exec(text)
        if (finder.length >= 2) {
            var listUserID = finder[1].split(`\\u00252C`);
            console.log("USER IDS ", listUserID);
            return {"data": listUserID, "error": ""}
        }

    }
    return {"data": [], "error": "No data"}
}

function publishUsers(users, postID, reactionType) {
    const data = {
        "post_id": postID.toString(),
        "reaction_type": reactionType,
        "users": users,
    }

    // console.log("Data: ", data)

    console.log(`Push ${users.length} users to server `);
    // comment
    sendRequest({
        "method": "POST",
        "url": ProfileServerEndpoint,
        "data": JSON.stringify(data),
        "content-type": "application/json",
        "async": true,
        "done": function (xhr) {
            // console.log(xhr.response);
        }
    });
    updateLocalStorage(postID, reactionType, users.length);
}

function updateLocalStorage(postId, reactionType, numberUser) {
    let monitorStr = localStorage.getItem("monitor");
    let monitorObj;
    if (monitorStr != null) {
        monitorObj = JSON.parse(monitorStr);
        if (monitorObj.hasOwnProperty(postId)) {
            let currentData = monitorObj[postId];
            if (currentData.hasOwnProperty(reactionType)) {
                currentData[reactionType] = currentData[reactionType] + numberUser
            } else {
                currentData[reactionType] = numberUser
            }
            currentData["updated_at"] = getCurrentDate();
            monitorObj[postId] = currentData
        } else {
            let currentData = {};
            currentData[reactionType] = numberUser;
            currentData["updated_at"] = getCurrentDate();
            monitorObj[postId] = currentData;
        }
    } else {
        monitorObj = {};
        let currentData = {};
        currentData[reactionType] = numberUser;
        currentData["updated_at"] = getCurrentDate();
        monitorObj[postId] = currentData
    }
    let newMonitorStr = JSON.stringify(monitorObj);
    localStorage.setItem("monitor", newMonitorStr);
}

function notifySlack(message, tag) {
    let webHook = "https://hooks.slack.com/services/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";
    let userTag = "<@UNM1DUXRR> ";
    let msg = "";
    message = "Notify from: " + localStorage.getItem("userID") + ". " + message;
    if (tag) {
        msg = userTag + message
    } else {
        msg = message
    }
    sendRequest({
        "method": "POST",
        "url": webHook,
        "data": JSON.stringify({
            "text": msg
        }),
        "done": (xhr) => {
        },
    });
}

function getCurrentDate() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}


function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function isValid(obj, key) {
    if (!obj.hasOwnProperty(key)) {
        return true
    }
    return obj[key]
}

// let worker = new FBWorker();

// ------------------------------------------------------------

chrome.runtime.onInstalled.addListener(function () {
        console.log("First time load");


    focusOrCreateTab(sampleRequest);
    setTimeout(function () {
        console.log("Start get data from to may")
        var fbHelper = new FBHelper();
        fbHelper.getUserLikesPost("pfbid025VQ2ThoxQifSsA5KKz34bgMFQ6Zj32U1WiqxNV4XatTFcqrM2Bjz3WwnqADSsbUHl");
        fbHelper.getUserSharePost("pfbid025VQ2ThoxQifSsA5KKz34bgMFQ6Zj32U1WiqxNV4XatTFcqrM2Bjz3WwnqADSsbUHl");
    }, 10000)
    // var data =         localStorage.getItem("TestData");


    }
);

function focusOrCreateTab(url) {
    chrome.tabs.query({}, function (tabs) {
        chrome.tabs.update(tabs[0].id, {"url": url, "selected": true});
    })

}

// async function main() {
//
//     focusOrCreateTab("https://m.facebook.com/");
//     // await worker.run();
// }

// main();
