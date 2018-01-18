<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.8
*
 */
namespace Arxos\Fb;

class Fb {
    private $signed_request;

    public static function isFb(){
        $result = !empty($_REQUEST["signed_request"]) || !(empty($_SESSION["signed_request"]));
        if($result){
            $signed_request = !empty($_REQUEST["signed_request"]) ? $_REQUEST["signed_request"] : $_SESSION["signed_request"];
        }

        if(isset($_SESSION["signed_request"])){
            $_REQUEST["signed_request"] = $_SESSION["signed_request"];
            unset($_SESSION["signed_request"]);
        }

        return $result;
    }
}
