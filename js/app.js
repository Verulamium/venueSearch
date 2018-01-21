// GLOBAL NAMESPACE
var WB = WB || {};

// REVEALING MODULE PATTERN using vanilla js
WB.getVenues = (function() {

    "use strict";// enforce strict js rules better for performance/security

    const placeFld = document.getElementById("placeName");
    let ul = document.createElement("ul");

    var
        init = function() {

            if (document.addEventListener) {

                document.addEventListener("DOMContentLoaded", function() {// after content loaded do stuff
                    document.body.className = "";// remove no-js class
                    setUpEventListeners();
                });
            }
        },

        // add event listeners
        setUpEventListeners = function() {

            let elem = document.getElementById("placeSearchFrm");// parent dom element
            if (elem.addEventListener) {
                elem.addEventListener("click", eventDelegator, false);
            }
        },

        // use of event bubbling to make event handling more efficient
        eventDelegator = function(evt) {

            let elem = evt.target;
            let nodeName = evt.target.nodeName.toLowerCase();

            if (nodeName === "input") {

                if (elem.id === "placeNameSubmit") {
                    if (placeFld.value !== "") {

                        if (document.getElementById("venue__list")) {

                            removeOldContent();
                        }

                        buildURL();
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }

            evt.preventDefault();
            evt.stopPropagation();
        },

        // construct url for API
        buildURL = function() {

            const api = "https://api.foursquare.com/v2/venues/explore?";
            const client_id = "&client_id=225RZAE1NK31CMD1K0DYBI2AYVUK54TB5MTCOJXRJJRYUDSW";
            const client_secret = "&client_secret=NGWSIZCTXXWRV15JKWFHP3D5HI1FAFAWYYFYAFTXGK5DHTT0&limit=3&v=20170801";

            let place = "near=" + placeFld.value;
            let limit = "&limit=20";
            let version = "&v=20170801";
            let url = api + place + client_id + client_secret + limit + version;

            retrieveJSON(url, function(data) {

                // use retrieved data here
                filterJSON(data);
            });
        },

        // Set up AJAX request and execute a callback with the parsed result, once it is available
        retrieveJSON = function(url, callback) {

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {

                if (req.readyState === 4) { // 4 - request completed

                    // success
                    if ((req.status >= 200) && (req.status < 300)) { // 200 - page request successful, 300s - redirect

                        let data = JSON.parse(req.responseText);
                        if (callback) {
                            callback(data);
                        }
                    // error
                    } else {
                        req.onError();
                    }
                }
            };

            req.onError = function() {
                console.log("No results found. Error type: " + req.status + " " + req.statusText);
            };

            req.open("GET", url, true);
            req.send();
        },

        // build results from returned JSON object
        filterJSON = function(data) {

            let recommendations = data.response.groups[0].items;
            let i=0;
            let noOfRecommends = recommendations.length;

            for(i; i<noOfRecommends; i++) {

                let vItem = recommendations[i].venue;
                let vName = vItem.name;
                let vURL = vItem.url;
                populateVenueList(vName, vURL);
            }
        },

        populateVenueList = function(vName, vURL) {

            let li = document.createElement("li");
            let a = document.createElement("a");
            let vText = document.createTextNode(vName);

            li.className = "venue__list-item";

            if (vURL !== undefined) {

                a.setAttribute("href", vURL);
                a.setAttribute("target", "_blank");
                li.appendChild(a);
                a.appendChild(vText);
                a.className = "venue__list-item-link";

            } else {
                li.appendChild(vText);
            }

            ul.className = "venue__list";
            ul.id = "venue__list";
            ul.appendChild(li);
            addContentToDOM();
        },

        removeOldContent = function() {

            let oldVList = document.getElementById("venue__list");
            while (oldVList.firstChild) {
                oldVList.removeChild(oldVList.firstChild);// needed to remove old venue list
            }
        },

        addContentToDOM = function() {

            document.getElementById("venues").appendChild(ul);
        };


    return {
        init: init // make private method, public; the others will remain private
    };

})();

WB.getVenues.init();