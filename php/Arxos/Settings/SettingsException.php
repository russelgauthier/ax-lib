<?php
/*
*
* Author: Russel Gauthier(c)
*
 */
namespace Arxos\Settings;

class SettingsException extends Exception {
    public function __construct($message, $code){
        parent::__construct($message, $code);
    }
    public function __toString(){
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
