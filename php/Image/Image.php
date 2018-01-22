<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.13
*
 */
namespace Arxos\Image;

class Image {
    public static function getDimensions($img_file){
        if(!is_file($img_file)){
            throw new ImageException(sprintf("Error: %s doesn't exist", $img_file), 0x01);
        }

        $img_result = getimagesize($img_file);
        if(!$img_result){
            throw new ImageException(sprintf("Error: %s throwed error while retrieving img size", $img_file), 0x02);
        }

        list($width, $height) = array_slice($img_result, 0, 2);

        return [
            "width" => $width,
            "height" => $height
        ];
    }
}
class ImageException extends \Exception {
    public function __construct($message, $code = 0x00, Exception $previous = null){
        parent::__construct($message, $code, $previous);
    }
    public function __toString(){
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
