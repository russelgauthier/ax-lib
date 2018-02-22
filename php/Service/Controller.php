<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.20
*
*/
namespace Arxos\Service;
use Exception;
use PDO;

abstract class Controller {
    protected $config = null;

    function __construct($config){
        try {
            header("Content-Type:application/json");

            if(isset($_SERVER["CONTENT_TYPE"])){
                $inputJson = json_decode(file_get_contents("php://input"), true);
                if($inputJson === NULL){
                    echo json_encode(array("errorCode"=>json_last_error(), "errorMessage"=>"JSON input error: " . json_last_error_msg(), "errorTrace"=>""));
                } else {
                    $_REQUEST = array_replace_recursive($_REQUEST, $inputJson);
                }
            }

            $this->config = $config;
            $this->readRequest();
        } catch(ControllerException $e){
            echo json_encode(array("errorMessage"=>$e->getMessage(), "errorCode"=>$e->getCode(), "errorTrace"=>$e->getTraceAsString()));
        }
    }
    private function readRequest(){
        $inputs = $_REQUEST;
        if(!array_key_exists("method", $inputs)){
            throw new ControllerException("Method must be specified.", 0x01);
        }

        $method = $_REQUEST["method"];
        if(!method_exists($this, $method)){
            throw new ControllerException("Specified method doesn't exist: $method", 0x02);
        }

        $method_params = array_slice($_REQUEST, 1);

        try {
            //Checking args
            foreach($this->config as $currMethod=>$currMethodConfig){
                if($currMethod === $method){
                    foreach($currMethodConfig["args"] as $arg){
                        if(!array_key_exists($arg, $method_params)){
                            throw new ControllerException("Error with $method args: argument: $arg, is required.", 0x03);
                        }
                    }
                }
            }

            //Calling method & echoing JSON results
            $methodResults = $this->$method($method_params);
            if(gettype($methodResults) === "object"){
                echo json_encode($methodResults->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode($methodResults);
            }
        } catch(ControllerException $e){
            throw new ControllerException("Error calling method \$this->" . $method . "(): " . $e->getMessage(), $e->getCode());
        }
    }
}
class ControllerException extends Exception {
    public function __construct($message, $code, Exception $previous = null){
        parent::__construct($message, $code, $previous);
    }
    public function __toString(){
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
