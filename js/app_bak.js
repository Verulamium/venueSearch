/**
 * Created by davidw on 21/11/2017.
 */

/*

 changes:
 - use let,const if ok to use ES6
 - use an AJAX call to get JSON object
 - use for of loop if ES6
 - could drop namespace and just have anonymous function
 - or use constructor/prototype to add methods
 - ideally mark-up should be a table - as tabular data
 - use a template; use a framework

 */

"use strict";

// GLOBAL NAMESPACE
var WHITBREAD = WHITBREAD || {};

// REVEALING MODULE PATTERN without JQuery
WHITBREAD.bookList = (function() {

    const init = function () {

            if (document.addEventListener) {

                document.addEventListener("DOMContentLoaded", function () {// after content loaded, do stuff

                    const url = "https://api.foursquare.com/v2/venues/search?near=Fleet&query=coffee&client_id=225RZAE1NK31CMD1K0DYBI2AYVUK54TB5MTCOJXRJJRYUDSW&client_secret=NGWSIZCTXXWRV15JKWFHP3D5HI1FAFAWYYFYAFTXGK5DHTT0&limit=3&v=20170801";

                    retrieveJSON(url, function(data) {

                        // use retrieved data here
                        console.log(data);
                        //buildContent(data);
                    });
                });
            }
        },

        /**
         * Sets up AJAX request using XMLHTTRequest object, requests file via url;
         * and executes a callback with the parsed result, once it is available
         *
         * @param url {string}, callback {function}
         */
        retrieveJSON = function(url, callback) {

            const req = new XMLHttpRequest();

            req.onreadystatechange = function() {

                if ( (req.readyState === 4) ) { // 4 - request completed

                    if ( (req.status >= 200) && (req.status < 300) ) { // 200 - page request successful, 300s - redirect

                        // success
                        var data = JSON.parse(req.responseText);

                        if (callback) {
                            callback(data);
                        }

                    } else {
                        req.onError();
                    }
                }
            };

            req.onError = function() {
                console.log("There has been an error: " + req.status + " " + req.statusText);
            };

            req.open('GET', url, true);
            req.send();
        },


        /**
         * Creates results from returned JSON object and adds to DOM
         *
         * @param data {JSON object}
         */
        buildContent = function(data) {

            var books = data.items,
                i = 0,
                len = books.length,
                bookListStr = '<ol role="list" class="book-list">',
                bookListCon = document.getElementById('bookList');

            for (i; i < len; i++) {

                var bookItem = books[i],
                    bookVolDtls = bookItem.volumeInfo,
                    title = bookVolDtls.title,
                    shortDesc = bookItem.searchInfo.textSnippet,
                    pic,
                    bookNum = i+1;

                if (bookVolDtls.hasOwnProperty('imageLinks')) {
                    pic = bookVolDtls.imageLinks.thumbnail;
                }


                bookListStr += '<li class="cf" id="' + i + '">';
                if (typeof pic !== "undefined") {
                    bookListStr += '<img src="' + pic + '" alt="book cover">';
                }
                bookListStr += "<h2>" + "<span>" + bookNum + ": </span>" + title + "</h2>";
                bookListStr += "<p>" + shortDesc + "</p></li>";
            }

            bookListStr += "</ol>";
            bookListCon.innerHTML = bookListStr;
        };

    return {
        init: init // make private method, public; the others will remain private
    };

})();

WHITBREAD.bookList.init();