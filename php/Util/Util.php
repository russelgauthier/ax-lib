<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.18.1
*
*/
namespace Arxos\Util;

class Util {
    public static function pathJoin(...$paths){
        $result = NULL;

        foreach($paths as $path){
            assert(is_scalar($path));
            if(!is_scalar($path)){
                $result = NULL;
                break;
            }

            if($result === NULL){
                $result = $path;
            } else {
                if(!empty($path)){
                    if(substr($result, -1) === DIRECTORY_SEPARATOR){
                        $result = substr($result, 0, -1);
                    }
                    if($path[0] === DIRECTORY_SEPARATOR){
                        if(strlen($path) > 1){
                            $path = substr($path, 1);
                        } else {
                            $path = "";
                        }
                    }

                    $result .= DIRECTORY_SEPARATOR . $path;
                }
            }
        }

        return $result;
    }
    public static function normalizeUrl($url){
        $result = "";

        $beginningParts = [];
        $urlParts = explode("/", $url);

        //Removing beginning .. after domain name as per standard. Removing for processing beginning .. and re-adding at end
        if(preg_match("/^(?:[-A-Za-z0-9]+\.)+[A-Za-z]{2,6}$/", $urlParts[0])){
            $url = array_shift($urlParts);
            while($urlParts[0] == ".."){
                array_shift($urlParts);
            }
            array_unshift($urlParts, $url);
        } else if($urlParts[0] == ".."){
            while($urlParts[0] == ".."){
                array_push($beginningParts, array_shift($urlParts));
            }
        }

        for($i = 0; $i < count($urlParts); $i++){
            $currUrlPart = $urlParts[$i];

            if($currUrlPart == ".."){
                $urlParts = array_merge(array_slice($urlParts, 0, $i - 1), array_slice($urlParts, $i + 1));
                $i -= 2;
            }
        }
        $urlParts = array_merge($beginningParts, $urlParts);

        if(substr($urlParts[0], -1) == ":" && empty($urlParts[1])){
            $resultPrepend = implode("//", array_slice($urlParts, 0, 2));
            $urlParts = array_slice($urlParts, 2);
        }

        $result = implode("/", $urlParts);
        while(substr_count($result, "//") > 0 && !(substr_count($result, "//") == 1 && substr($urlParts[0], -1) == ":")){
            $result = str_replace("//", "/", $result);
        }
        if(!empty($resultPrepend)){
            $result = str_replace("///", "//", $resultPrepend . $result);
        }

        return $result;
    }
    public static function urlAppend($url, $attachment){
        $result = "";
        $url = Util::normalizeUrl($url);
        if(!empty($url)){
            //Processing URL fragment
            $urlFragment = NULL;
            $urlParts = preg_split("/#/", $url);
            if(count($urlParts) > 1){
                $urlFragment = implode("#", array_slice($urlParts, 1));
            }
            $urlPart = $urlParts[0];
            $urlFragment = substr($urlFragment, -1) == "#" ? substr($urlFragment, 0, -1) : $urlFragment;

            //Processing URL queryString
            $urlQueryString = NULL;
            $urlParts = preg_split("/\?/", $urlPart);
            if(count($urlParts) > 1){
                $urlQueryString = implode("?", array_slice($urlParts, 1));
            }
            $urlPart = $urlParts[0];
            $urlQueryString = substr($urlQueryString, -1) == "&" ? substr($urlQueryString, 0, -1) : $urlQueryString;

            //Processing attachment fragment
            $attachmentFragment = NULL;
            $attachmentParts = preg_split("/#/", $attachment);
            if(count($attachmentParts) > 1){
                $attachmentFragment = implode("#", array_slice($attachmentParts, 1));
            }
            $attachmentFragment = substr($attachmentFragment, -1) == "#" ? substr($attachmentFragment, 0, -1) : $attachmentFragment;

            //Processing attachment queryString
            $attachmentQueryString = $attachmentParts[0];
            $attachmentQueryString = (!empty($attachmentQueryString) && $attachmentQueryString[0] == "?") ?  substr($attachmentQueryString, 1) : $attachmentQueryString;
            $attachmentQueryString = (!empty($attachmentQueryString) && $attachmentQueryString[0] == "&") ? substr($attachmentQueryString, 1) : $attachmentQueryString;
            $attachmentQueryString = substr($attachmentQueryString, -1) == "&" ?  substr($attachmentQueryString, 0, -1) : $attachmentQueryString;

            //Adding queryString to result
            $result = $urlPart;
            $result .= (!empty($urlQueryString) || !empty($attachmentQueryString)) ? "?" : "";
            $result .= $urlQueryString;
            $result .= (!empty($urlQueryString) && !empty($attachmentQueryString)) ? "&" : "";
            $result .= $attachmentQueryString;

            //Adding fragment to result
            $result .= !empty($urlFragment) ? ("#" . $urlFragment) : "";
            $result .= !empty($attachmentFragment) ? ("#" . $attachmentFragment) : "";
        }

        return $result;
    }
}
