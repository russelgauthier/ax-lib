/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.13.1
*
 */
/*! 09/24/2015 Russel Gauthier - gauthier.russel@gmail.com
 ax.enquire module that requires enquire.js to provide auto-updated(based on Bootstrap & Facebook values):
 -isXs(), isSm(), isMd(), isLg(), isXsMin(), isSmMin(), isMdMin(), isLgMin()
 -isFb()
 -isTouch()
 -getOrientation()
 -isPortrait()
 -isLandscape()
 -getInfo()
 -getBrowser()
 */
angular.module("ax.mediaInfo", [])
.provider("$axMediaInfo", [function () {
    var _lg, _md, _sm, _xs, _orientation, _fb, _browserInfo;
    _lg = false;
    _md = false;
    _sm = false;
    _xs = false;
    _orientation = "landscape";
    _fb = false; //(APP === undefined || APP.FB === undefined) ? false : APP.FB.isFb;
	_browserInfo = detect != null ? detect.parse(navigator.userAgent).browser : undefined;

    return {
		getBrowser: function(){
			return  _browserInfo;
		},
        getDimensions: function(){
            var result = {viewport:{},window:{}};

            result.viewport = {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height:Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            };
            result.window = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            return result;
        },
        getInfo: function () {
            var result;

            if (_lg) {
                result = "lg";
            } else if (_md) {
                result = "md";
            } else if (_sm) {
                result = "sm";
            } else {
                result = "xs"
            }

            if (this.isTouch()) {
                result += ",touch";
            } else {
                result += ",!touch";
            }

            if (_fb) {
                result += ",fb";
            } else {
                result += ",!fb";
            }

            return result;
        },
        getOrientation: function(){
            return _orientation;
        },
        getScrollbarWidth: function(){
        	var scrollbarWidth
			var scrollbarTestDiv;

			//Create scrollbar test div
			scrollbarTestDiv = document.createElement("div");
			scrollbarTestDiv.className = "scrollbar-test-measure"; //defined in: _scss/_other.scss
			document.body.appendChild(scrollbarTestDiv);

			// Get the scrollbar width
			scrollbarWidth = scrollbarTestDiv.offsetWidth - scrollbarTestDiv.clientWidth;

			// Delete the scrollbar test div
			document.body.removeChild(scrollbarTestDiv);

			return scrollbarWidth;
        },
        getSize: function(){
            var result;

            if (_lg) {
                result = "lg";
            } else if (_md) {
                result = "md";
            } else if (_sm) {
                result = "sm";
            } else {
                result = "xs"
            }

            return result;
        },
        isTouch: function () {
            var result = false;

            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i)) {
                result = true;
            }

            return result;
        },
        isFb: function () {
            _fb = (APP === undefined || APP.FB === undefined) ? false : APP.FB.isFb

            return _fb;
        },
        $get: ['$injector', '$timeout', function ($injector, $timeout) {
            enquire.register("(orientation: portrait)", {
                setup: function(){
                    $timeout(function(){});
                },
                match: function(){
                    _orientation = "portrait";
                    $timeout(function(){});
                },
                unmatch: function(){
                    _orientation = "landscape";
                    $timeout(function(){});
                }
            }, true);
            enquire.register("screen and (min-width:0px)", {    //Bootstrap Xs
                setup: function () {
                    $timeout(function () {
                    });
                },
                match: function () {
                    _xs = true;
                    $timeout(function () {
                    });
                },
                unmatch: function () {
                    _xs = false;
                    $timeout(function () {
                    });
                }
            }, true);
            enquire.register("screen and (min-width:768px)", {  //Bootstrap Sm
                setup: function () {
                    $timeout(function () {
                    });
                },
                match: function () {
                    _sm = true;
                    $timeout(function () {
                    });
                },
                unmatch: function () {
                    _sm = false;
                    $timeout(function () {
                    });
                }
            }, true);
            enquire.register("screen and (min-width:992px)", {  //Bootstrap Md
                setup: function () {
                    $timeout(function () {
                    });
                },
                match: function () {
                    _md = true;
                    $timeout(function () {
                    });
                },
                unmatch: function () {
                    _md = false;
                    $timeout(function () {
                    });
                }
            }, true);
            enquire.register("screen and (min-width:1200px)", {  //Bootstrap Lg
                setup: function () {
                    $timeout(function () {
                    });
                },
                match: function () {
                    _lg = true;
                    $timeout(function () {
                    });
                },
                unmatch: function () {
                    _lg = false;
                    $timeout(function () {
                    });
                }
            }, true);

            return {
            	getBrowser: this.getBrowser,
                getDimensions: this.getDimensions,
                getInfo: this.getInfo,
                getOrientation: _orientation,
                getScrollbarWidth: this.getScrollbarWidth,
                getSize: this.getSize,
                isLgMin: function () {
                    return _lg;
                },
                isMdMin: function () {
                    return _md;
                },
                isSmMin: function () {
                    return _sm;
                },
                isXsMin: function () {
                    return _xs;
                },
                isLgMax: function () {
                    return _lg || _md || _sm || _xs;
                },
                isMdMax: function () {
                    return !_lg && (_md || _sm || _xs);
                },
                isSmMax: function () {
                    return !_md && (_sm || _xs);
                },
                isXsMax: function () {
                    return !_sm && _xs;
                },
                isLg: function () {
                    return _lg;
                },
                isMd: function () {
                    return !_lg && _md;
                },
                isSm: function () {
                    return !_md && _sm;
                },
                isXs: function () {
                    return !_sm && _xs;
                },
                isPortrait: function(){
                    return _orientation === "portrait";
                },
                isLandscape: function(){
                    return _orientation === "landscape";
                },
                isFb: this.isFb,
                isTouch: this.isTouch,
                matches: this.matches
            };
        }]
    };
}]);

/*! SVG Toggle - Russel Gauthier - 10/07/2015 - gauthier.russel@gmail.com
 Requires snap.svg.js (<script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg-min.js"></script> tested)
 */
angular.module("ax.svgtoggle", [])
.controller('svgToggleCtrl', ['$scope', function($scope){
}])
.directive('axSvgtoggle', function(){
    var SvgToggle = function(svgContainerSelector, svgUrl, iconsInfo, scope) {
        var svgContainer = Snap(svgContainerSelector);
        var toggledIcon = null;

        Snap.load(svgUrl, function(loadedFragment) {
            svgContainer.append(loadedFragment);
            var initLoad = true;

            var toggleIcon = function(newIcon){
                var prevIcon = toggledIcon;

                if(prevIcon === undefined || prevIcon === null){
                    toggledIcon = newIcon;

                    newIcon.click();
                    initLoad = false;
                } else if(prevIcon !== undefined && prevIcon !== null && !prevIcon.compare(newIcon)){
                    prevIcon.toggleOut(true);

                    toggledIcon = newIcon;
                }

            };
            var iconToggleFactory = function(iconInfo) {
                var iconElement, iconElementParts, iconSelectedPart;
                var states = {
                    out: 0,
                    over: 1,
                    toggled: 2
                };
                var state = states.out;

                iconElement = svgContainer.select(iconInfo.selector);
                iconElementParts = (iconInfo.selectorGroup !== undefined && iconInfo.selectorGroup !== null) ? svgContainer.selectAll(iconInfo.selectorGroup) : null;
                iconSelectedPart = iconElementParts !== null ? iconElementParts : iconElement;

                var click = function(){
                    if(state !== states.toggled){
                        toggleIcon(iconInfo);
                        iconSelectedPart.attr(iconInfo.clickAttrs[iconInfo.selector.slice(1)]);
                        state = states.toggled;

                        if(!initLoad){
                            eval(iconInfo.clickFnc);
                        }
                    }
                };
                var hover = function(overrideToggle){
                    overrideToggle = overrideToggle === undefined ? false : overrideToggle;

                    if (overrideToggle || state !== states.toggled) {
                        iconSelectedPart.attr(iconInfo.overAttrs[iconInfo.selector.slice(1)]);
                        state = states.over;
                    }
                };
                var toggleOut = function(overrideToggle){
                    overrideToggle = overrideToggle === undefined ? false : overrideToggle;
                    if (overrideToggle || state !== states.toggled) {
                        iconSelectedPart.attr(iconInfo.outAttrs[iconInfo.selector.slice(1)]);
                        state = states.out;
                    }
                };
                iconElement.click(function(evt) {
                    click();
                }).hover(function(evt) {
                        hover();
                    },function(evt) {
                        toggleOut();
                    }
                );


                iconInfo.compare = function(otherIcon){
                    return iconInfo.selector === otherIcon.selector && iconInfo.selectorGroup === otherIcon.selectorGroup;
                };


                iconInfo.click = click;
                iconInfo.hover = hover;
                iconInfo.toggleOut = toggleOut;
            };

            for (var i in iconsInfo) {
                iconToggleFactory(iconsInfo[i]);
                if(iconsInfo[i].toggled !== undefined && iconsInfo[i].toggled){
                    toggleIcon(iconsInfo[i]);
                }
            }

            if(toggledIcon === null){
                toggleIcon(iconsInfo[0]);
            }
        });
    };

    return {
        restrict: 'A',
        transclude: false,
        scope: {
            axSvgtoggle: '='
        },
        template: '<svg id="id_' + Date.now() + "_" + Math.random().toString().slice(2) + '" width="100%" height="100%" style=""></svg>',
        link: function(scope, elem, attrs){
            var svgId = elem[0].innerHTML.split("<svg ")[1].split("id=\"")[1].split("\"")[0]
                + "_" + Date.now() + "_" + Math.random().toString().slice(2);

            elem[0].innerHTML = "<svg id=\"" + svgId + "\" width=\"100%\" height=\"100%\" style=\"\"></svg>";

            requiredAttributes = ["axSvgtoggleHref", "axSvgtoggleIds"];

            //Checking for required attributes
            for(var key in requiredAttributes){
                var currKey = requiredAttributes[key];

                if(!(currKey in attrs)){
                    throw("ax.svgtoggle -> axSvgtoggle(directive) : Missing required attribute: " + currKey);
                }
            }

            var href = attrs.axSvgtoggleHref;

            var toggleIds = tagValue2Json(attrs, "axSvgtoggleIds");
            var overAttrs = tagValue2Json(attrs, "axSvgtoggleOverAttrs");
            var outAttrs = tagValue2Json(attrs, "axSvgtoggleOutAttrs");
            var clickAttrs = tagValue2Json(attrs, "axSvgtoggleClickAttrs");
            var clickFncs = tagValue2Json(attrs, "axSvgtoggleClicks", true);
            var defaultId = attrs.axSvgtoggleDefault;
            var selectedId = attrs.axSvgtoggleSelectedId;

            //console.log("selectedId", selectedId, attrs.axSvgtoggleSelectedId); //TODO: Go back and make changing of selectedId dynamic
            //scope.$watch("attrs.axSvgtoggleSelectedId", function(newVal){
            //   console.log("watchers");
            //});

            if(!(defaultId in toggleIds)){
                throw("ax.svgtoggle -> axSvgtoggle(directive) : Default toggle set to non-existent svg id: " + defaultId);
            }

            var toggles = [];
            for(var i in toggleIds){
                var currToggle = {
                    selector: "#" + i,
                    outAttrs: outAttrs,
                    overAttrs: overAttrs,
                    clickAttrs: clickAttrs,
                    clickFnc: clickFncs[i]
                };

                if(toggleIds[i] !== null){
                    currToggle.selectorGroup = [];

                    for(var j in toggleIds[i]){
                        currToggle.selectorGroup.push("#" + toggleIds[i][j]);
                    }
                }
                if(defaultId === i){
                    currToggle.toggled = true;
                }

                toggles.push(currToggle);
            }

            SvgToggle("#" + svgId, attrs.axSvgtoggleHref, toggles, scope);


            function tagValue2Json(attrs, tagName, isFunc){
                var result = null;

                if(tagName in attrs){
                    currTag = attrs[tagName];

                    if(isFunc === undefined || !isFunc){
                        result = JSON.parse("{" + currTag.split('"').join('\"').split("'").join('"') + "}");
                    } else {
                        result = JSON.parse("{" + currTag.split('"').join('\"').split("'").join('"') + "}");
                        for(var i in result){
                            //Ensuring all clickFncs are mapped to working functions{
                            var currCallback = result[i];
                            var currFuncs = currCallback.match(/([a-zA-Z]+\w*\.?)*[a-zA-Z]+\w*[(]/g);
                            var currFuncParts = currCallback.split(/([a-zA-Z]+\w*\.?)*[a-zA-Z]+\w*[(]/g).slice(1);
                            var callBackResult = "";

                            for(var j in currFuncs){
                                var currFunc = currFuncs[j].slice(0, -1);
                                var currFuncStr = "";
                                var funcFound = false;

                                //Checking top scope
                                currFuncStr = currFunc;
                                if(eval("typeof(" + currFuncStr + ")") === "function"){
                                    funcFound = true;
                                } else {
                                    var currScope = scope;
                                    var currFuncStr = "scope";

                                    while(currScope !== null && !funcFound){
                                        if(eval("typeof(" + currFuncStr + "." + currFunc + ")") === "function"){
                                            funcFound = true;
                                        } else {
                                            currScope = currScope.$parent;
                                            currFuncStr += ".$parent";
                                        }
                                    }
                                }

                                if(!funcFound){
                                    throw("ax.svgtoggle -> axSvgtoggle(directive) -> tagValue2Json() : Invalid function: " + currFunc + "() in all scopes.");
                                } else {
                                    if(currFuncStr !== currFunc){
                                        currFuncStr += "." + currFunc;
                                    }
                                    currFuncStr += "(" + currFuncParts[(parseInt(j) + 1)*2 - 1];

                                    callBackResult += currFuncStr;
                                }
                            }

                            result[i] = callBackResult;
                        }
                    }
                }

                return result;
            };
        }
    };
});
/*! SVG Button - Russel Gauthier - 10/07/2015 - gauthier.russel@gmail.com
 Requires snap.svg.js (<script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg-min.js"></script> tested)
 */
angular.module("ax.svgbutton", [])
.controller('svgButtonCtrl', ['$scope', function($scope){
}])
.directive('axSvgbutton', [function(){
    var SvgInit = function(svgContainerSelector, svgUrl, iconInfo, scope) {
        var svgContainer = Snap(svgContainerSelector);

        if(svgContainer !== null && svgContainer !== undefined){
            Snap.load(svgUrl, function(loadedFragment) {
                if(loadedFragment !== undefined && loadedFragment !== null){
                    svgContainer.append(loadedFragment);

                    var iconElement, iconElementParts, iconSelectedPart;

                    iconElement = svgContainer.select(iconInfo.selector);
                    iconElementParts = (iconInfo.selectorGroup !== undefined && iconInfo.selectorGroup !== null) ? svgContainer.selectAll(iconInfo.selectorGroup) : null;
                    iconSelectedPart = iconElementParts !== null ? iconElementParts : iconElement;

                    if(iconElement !== null){
                        iconElement.click(function(evt) {
                            iconSelectedPart.attr(iconInfo.clickAttrs);
                            eval(iconInfo.clickFnc);
                        }).hover(function(evt) {
                                iconSelectedPart.attr(iconInfo.overAttrs);
                            }, function(evt) {
                                iconSelectedPart.attr(iconInfo.outAttrs);
                            }
                        );
                    }
                }
            });
        }
    };

    return {
        restrict: 'A',
        template: '<svg id="id_' + Date.now() + '_' + Math.random().toString().slice(2) + '" width="100%" height="100%" style=""></svg>',
        link: function(scope, elem, attrs){
            var svgId = elem[0].innerHTML.split("<svg ")[1].split("id=\"")[1].split("\"")[0]
                + "_" + Date.now() + "_" + Math.random().toString().slice(2);

            var styleStr = "";
            if(attrs.axSvgbuttonWidth){
                styleStr += "width:" + attrs.axSvgbuttonWidth + ";";
            }
            if(attrs.axSvgbuttonHeight){
                styleStr += "height:" + attrs.axSvgbuttonHeight + ";";
            }

            elem[0].innerHTML = "<svg id=\"" + svgId + "\" width=\"100%\" height=\"100%\" style=\"" + styleStr + "\"></svg>";

            //Checking for required attributes
            var requiredAttributes = ["axSvgbuttonHref", "axSvgbuttonIds"];
            for(var key in requiredAttributes){
                var currKey = requiredAttributes[key];

                if(!(currKey in attrs)){
                    throw("ax.svgbutton -> axSvgbutton(directive) : Missing required attribute: " + currKey);
                }
            }

            var href = attrs.axSvgbuttonHref;
            var toggleIds = tagValue2Json(attrs, "axSvgbuttonIds");
            var selector = "";
            for(var key in toggleIds){
                selector = key;
            }

            var currAttrs = {
                selector: "#" + selector,
                outAttrs: tagValue2Json(attrs, "axSvgbuttonOutAttrs"),
                overAttrs: tagValue2Json(attrs, "axSvgbuttonOverAttrs"),
                clickAttrs: tagValue2Json(attrs, "axSvgbuttonClickAttrs"),
                clickFnc: tagValue2Json(attrs, "axSvgbuttonClick", true)
            };

            if(toggleIds[selector] !== null){
                currAttrs.selectorGroup = [];

                for(var j in toggleIds[selector]){
                    currAttrs.selectorGroup.push("#" + toggleIds[selector][j]);
                }
            }

            SvgInit("#" + svgId, href, currAttrs, scope);

            function tagValue2Json(attrs, tagName, isFunc){
                var result = null;
                if(tagName in attrs){
                    currTag = attrs[tagName];

                    if(isFunc === undefined || !isFunc){
                        result = JSON.parse("{" + currTag.split('"').join('\"').split("'").join('"') + "}");
                    } else {
                        result = currTag;

                        var currCallback = result;

                        var currFuncs = [currCallback.split("(")[0] + "("]; //var currFuncs = currCallback.match(/([a-zA-Z]+\w*\.?)*[a-zA-Z]+\w*[(]/g);
                        var currFuncParts = [currCallback.split("(")[0], currCallback.split("(").slice(1).join("(").slice(0,-1) + ")"]; //currCallback.split(/([a-zA-Z]+\w*\.?)*[a-zA-Z]+\w*[(]/g).slice(1);
                        var currCallbackResult = "";

                        for(var j in currFuncs){
                            var currFunc = currFuncs[j].slice(0, -1);
                            var currFuncStr = "";
                            var funcFound = false;

                            //Checking top scope
                            currFuncStr = currFunc;
                            if(currFunc !== ""){
                                if(eval("typeof(" + currFuncStr + ")") === "function"){
                                    funcFound = true;
                                } else {
                                    var currScope = scope;
                                    var currFuncStr = "scope";

                                    while(currScope !== null && !funcFound){
                                        if(eval("typeof(" + currFuncStr + "." + currFunc + ")") === "function"){
                                            funcFound = true;
                                        } else {
                                            currScope = currScope.$parent;
                                            currFuncStr += ".$parent";
                                        }
                                    }
                                }

                                if(!funcFound){
                                    throw("ax.svgbutton -> axSvgbutton(directive) -> tagValue2Json() : Invalid function: " + currFunc + "() in all scopes.");
                                } else {
                                    if(currFuncStr !== currFunc){
                                        currFuncStr += "." + currFunc;
                                    }
                                    currFuncStr += "(" + currFuncParts[(parseInt(j) + 1)*2 - 1];

                                    currCallbackResult += currFuncStr;
                                }
                            }
                        }

                        result = currCallbackResult;
                    }
                }

                return result;
            };
        }
    };
}]);

/*!
	Focuses on item when loaded
*/
angular.module("ax.util", [])
.directive("axAutofocus", [function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $elem){
        	$timeout(function(){
        		$elem[0].focus();
        	});
        }
    };
}]);

/*! 04/23/2016 Russel Gauthier - gauthier.russel@gmail.com
ax.ucUtils modules requires utils.js' CatalynxUtils class.
Contains client-specific functions:
-pixelsString(text),
-trimDotString(text, maxLength),
-getCatalogueFileUrl(path),
-getRootFileUrl(path)
*/
angular.module('ax.ucUtils', [])
.provider('$axUcUtils', [function(){
    var _ucUtils = new CatalynxUtils();
    return {
        pixelsStrip: _ucUtils.pixelsStrip,
        trimDotString: _ucUtils.trimDotString,
        getCatalogueFileUrl: _ucUtils.getCatalogueFileUrl,
        getRootFileUrl: _ucUtils.getRootFileUrl,
        $get: [function () {
            return {
                pixelsStrip: this.pixelsStrip,
                trimDotString: this.trimDotString,
                getCatalogueFileUrl: this.getCatalogueFileUrl,
                getRootFileUrl: this.getRootFileUrl
            };
        }]
    };
}]);
