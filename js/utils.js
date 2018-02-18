/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.19
*
 */
//IE doesn't have .remove() on elements. Edge & all others do. Polyfill from: https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
//IE doesn't have .startsWith() for strings. Edge & all others do. Polyfill from: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
	position = position || 0;
	return this.substr(position, searchString.length) === searchString;
    };
}
// Production steps / ECMA-262, Edition 5, 15.4.4.19
// Référence : http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        var T, A, k;

        if (this == null) {
            throw new TypeError(' this est null ou non défini');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' n est pas une fonction');
        }

        if (arguments.length > 1) {
            T = thisArg;
        }

        A = new Array(len);
        k = 0;

        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}

/*!
	Creates CSS for zoom-in & zoom-out cursors
	-refer to _ax.scss for details
	-requires zoom-in.cur & zoom-out.cur
*/
function createCssCursor(cursor, rootDir, cursorImgDir, asString){
	var result = [];

	if(rootDir != null && cursorImgDir != null && (cursor === "zoom-in" || cursor === "zoom-out")){
		result.push("url(" + cursorImgDir + "/" + cursor + ".cur), url(" + rootDir + "/" + cursorImgDir + "/" + cursor + ".cur), auto");
		result.push("-moz-zoom-in");
		result.push("-webkit-zoom-in");
		result.push("zoom-in");
	}

	if(asString){
		var tmpResult = "";
		result.forEach(function(currVal){ tmpResult += "cursor:" + currVal + ";"; });
		result = tmpResult;
	}

	return result;
};

//Get full height of selector, including padding & margins
function getFullHeight(selector){
    var height = 0;
    var selector = angular.element(selector);
    var parsePx = function(val){
        return parseInt(val.length > 0 ? val.slice(0,-2) : 0);
    };

    if(selector){
        height = angular.element(selector).outerHeight(true);
    }

    return height;
};

//For deep cloning object(otherwise, Javascript creates pointers)
function clone(obj) {
    var copy;

    if (null == obj || "object" != typeof obj) {
        copy = obj;
    } else {
        copy = obj.constructor();
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                copy[i] = obj[i];
            }
        }
    }

    return copy;
};
//To check if objects are {}, null, or undefined
function isEmpty(obj) {
    var empty = true;

    for (var i in obj) {
        empty = false;
        break;
    }

    return empty;
};

/*! string.replace() only replaces first occurrence. This replaces all occurrences
    Russel Gauthier - 04/09/2012 - gauthier.russel@gmail.com
*/
var stringReplaceAll = function(inputStr, searchStr, replaceStr){
    var resultStr = "";

    var i = inputStr.indexOf(searchStr);
    while(i !== -1){
        resultStr += inputStr.slice(0, i) + replaceStr;
        inputStr = inputStr.slice(i).replace(searchStr, "");

        i = inputStr.indexOf(searchStr);
    }
    resultStr += inputStr;

    return resultStr;
};

/*! Log messages - Russel Gauthier - 03/01/2013 - gauthier.russel@gmail.com
 */
var logMsg = function(notAssert, mark, persists){
    persists = ((persists === undefined && !PERSISTS) || !persists && PERSISTS || persists) ? true : false;

    if(notAssert && persists){
        if(arguments.length < 4){
            console.log("logMsg - %s", mark);
        } else {
            var msgArray = [];

            for(var i = 3; i < arguments.length; i++){
                msgArray.push(arguments[i]);
            }

            console.log("logMsg - %s", mark, msgArray);
        }

        if(TRACE){
            console.trace();
        }
    }
};

//Normalize paths
function pathNormalize(path){
    var result = "";

    var urlParts = path.split("#!")[0].split("/");
    var nonRelativeFound = false;
    for(var i = 0; i < urlParts.length; i++){
        var currUrlPart = urlParts[i];

        if(i === 0 && nonRelativeFound){
            nonRelativeFound = false;
        }

        if(currUrlPart === ".."){
            if(nonRelativeFound){
                urlParts = urlParts.slice(0, i - 1).concat(urlParts.slice(i + 1));

                i -= 2;
            }
        } else {
            nonRelativeFound = true;
        }
    }

    result = urlParts.join("/");
    while(result.indexOf("//") > -1){
        result = result.replace("//", "/");
    }

    return result;
};

//Joins paths & normalize (don't have to worry about missing or double / )
var pathJoin = function(path1, path2){ //can accept unlimited paths
    path1 = !path1 ? "" : path1;
    path2 = !path2 ? "" : path2;

    var result = "";

    if(!((path1 === "" && path2 === "") || typeof(path1) !== "string" || typeof(path2) !== "string")){
        var paths = [];
        var hasProtocol = false;
        var protocol = "";
        var domain;

        if(path1.split("://").length > 1){
            protocol = path1.split("://")[0];
            hasProtocol = true;
            domain = path1.split("://")[1].split("/")[0];

            paths.push(path1.split("://")[1].split("/").slice(1).join("/").split("#!")[0]);
        } else {
            paths.push(path1.split("#!")[0]);
        }

        if(path2 !== "" && path2 !== "/" && path2 !== "//"){
            paths.push(path2);
        }
        for(var i = 2; i < arguments.length; i++){
            if(arguments[i] !== "" && arguments[i] !== "/" && arguments[i] !== "//"){
                paths.push(arguments[i]);
            }
        }

        var currPath;
        for(var i = 0; i < paths.length; i++){
            currPath = paths[i];

            if(currPath && (typeof(currPath) === "string" || typeof(currPath) === "number")){
                if(typeof(currPath) === "number"){
                    currPath = currPath + "";
                }

                if(i === 0){
                    if(currPath.length > 1){
                        currPath = currPath.charAt(currPath.length - 1) === "/" ? currPath.slice(0, -1) : currPath;
                    }
                } else {
                    currPath = currPath.charAt(0) === "/" ? currPath.slice(1) : currPath;
                    currPath = currPath.charAt(currPath.length - 1) === "/" ? currPath.slice(0, -1) : currPath;
                }

                result += currPath;
                if(currPath !== "/" && currPath !== "" && i !== paths.length - 1){
                    result += "/";
                } else if(i === paths.length - 1 && paths[i].charAt(paths[i].length - 1) === "/"){
                    result += "/";
                }
            }
        }
    }

    result = pathNormalize(result);

    if(hasProtocol){
        result = protocol + "://" + domain + "/" + result;
    }

    return result;
};

/*
*
*   Project-specific functions
*
*/

//Gives root url from the top of structure
var getRootFileUrl = function(path){
    var result = null;

    var pathOrig = path;
    if(arguments.length > 1){
        for(var i = 1; i < arguments.length; i++){
            path = pathJoin(path, arguments[i]);
        }
    }
    if(path !== null && typeof(path) == "string"){
        result = location.protocol + "//" + location.hostname;

        if(location.port.length > 0){
            result += ":" + location.port;
        }

        if(APP !== undefined && APP.CATALYNX_ROOT_URL !== undefined){
            result += APP.CATALYNX_ROOT_URL;
        }

        //result += "/_branches/" + APP.CATALYNX_BRANCH + "/";
        result += "/_branches/" + APP.CATALYNX_BRANCH + "/";

        if(path.length > 0 && path[0] === "/"){
            path = path.substring(1);
        }

        result += path;
    }

    return result;
};
var getBranch = function(){
    var result = null;

    if(APP !== undefined){
	    result = APP.BRANCH_NAME;//APP.CATALYNX_BRANCH;
    }

    return result;
};
var getCatalogueFileUrl = function(path){
    var result = null;

    if(arguments.length > 1){
        for(var i = 1; i < arguments.length; i++){
            path = pathJoin(path, arguments[i]);
        }
    }

    if(path !== null && typeof(path) == "string" && APP.CATALOGUE_ID){
        result = location.protocol + "//" + location.hostname;

        if(location.port.length > 0){
            result += ":" + location.port;
        }

        if(APP !== undefined && APP.CATALYNX_ROOT_URL !== undefined){
            result += APP.CATALYNX_ROOT_URL;
        }

        result += "/_catalogues/" + APP.CATALOGUE_ID + "/";

        if(path.length > 0 && path[0] === "/"){
            path = path.substring(1);
        }


        result += path;
    }

    return result;
};
var isDev = function(){
    var result = false;

    if(getBranch() !== "_current" && getBranch() !== "hotspots"){
	result = true;
    }

    return result;
};
var isHotspotsDebug = function(){
    return getBranch() === "hotspots";
};
//Takes 20px => 20 for calculations
var pixelsStrip = function(text){
    return (text !== undefined && typeof(text) === "string") ? text.slice(0, -2) : text;
};
var trimDotString = function(text, maxLength){
    var result = "";
    var parts = text.split(" ");

    if(parts[0].length > maxLength && parts[0].length > 0){
        result = text.slice(0, maxLength - 1) + "…";
    } else {
        for(var i = 0; i < parts.length && result.length < maxLength; i++){
            if((result.length + parts[i].length) < maxLength){
            	result += parts[i] + " ";
            }
        }

        result = result.trim();
        if(result.length < text.length){
            result += "…";
        }
    }

    return result;
};
function isXzogdo(scope){
    return scope.mediaInfo.getDimensions().window.width > 1150 && scope.mediaInfo.getDimensions().window.width < 1200
    && scope.mediaInfo.getDimensions().window.height > 600 && scope.mediaInfo.getDimensions().window.height < 680
    && !scope.mediaInfo.isTouch();
}
function Settings(settings){
    var _settings = settings;

    /**
    * @return {string} - the property value, or, if not found undefined
    * @throws exception if given name is invalid property name
    * @param {string} name - "a", "a.b", "a.b.c"
    * @param {string} defaultValue - value to be used if result is undefined
    **/
    var get = function (name, defaultValue) {
        var result;
        var parts;

        if (typeof (name) !== "string" || name.length === 0 || !(new RegExp("^(([a-zA-Z_\-])*\.)*(([a-zA-Z_\-])*)$")).test(name)) {
            throw "Settings:get: invalid property name: " + name + " Must be a non-empty string with only a-zA-Z_- in the property names and . as a separator";
        } else {
            if (_settings !== undefined && _settings !== null && typeof (_settings) === "object") {

                parts = name.split(".");

                result = _settings;
                for (var i in parts) {
                    var part = parts[i]

                    result = result[part];
                    if (result === undefined || result === null) {
                        break;
                    }
                }
            }
        }

        result = result === undefined && defaultValue !== undefined ? defaultValue : result;

        return result;
    };

    return {
        "get": get
    };
}

function CatalynxUtils(){
    return {
        pixelsStrip: pixelsStrip,
        trimDotString: trimDotString,
        getCatalogueFileUrl: getCatalogueFileUrl,
        getRootFileUrl: getRootFileUrl,
        isDev: isDev,
        isHotspotsDebug: isHotspotsDebug
    };
};
