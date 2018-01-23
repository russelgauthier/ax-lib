<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.14
*
 */
namespace Arxos\Settings;
use Arxos\Util\Util;

class Settings {
    private $settings;

    function __construct(array $settings){
        $this->settings = $settings;
    }

    function get(string $name, $default = null) {
        $result = null;

        $name = trim($name);
        if(empty($name)){
            throw new SettingsException("get(string name, default=null) ->  name cannot be an empty string");
        }

        $currValue = $this->settings;
        $parts = preg_split("/\./", $name);
        foreach($parts as $part){
            if(is_array($currValue)){
                if(array_key_exists($part, $currValue)){
                    $currValue = $currValue[$part];
                    $result = $currValue;
                } else {
                    $result = $default;
                    break;
                }
            } else {
                $result = $default;
                break;
            }
        }

        return $result;
    }
    function getSettings(){
        return $this->settings;
    }

    function set(string $name, $value, bool $override = false){
        $name = trim($name);
        if(empty($name)){
            throw new SettingsException("set(string name, value, override=false) ->  name cannot be an empty string");
        }

        $parts = preg_split("/\./", $name);

        $currValue = &$this->settings;
        foreach($parts as $part){
            if(!isset($currValue[$part])){
                $currValue[$part] = [];
            }

            $currValue = &$currValue[$part];
        }

        if($override || !$override && $currValue === []){
            $currValue = $value;
        }
    }

    function setDefaults(array $defaultSettings, bool $override = false){
        $str = "";
        function walk_settings(array &$curr_settings, string $str = "", array $levels = []) {
            $str = "";

            array_walk($curr_settings, function($v, $k) use (&$str, &$levels){
                if(is_array($v) && Util::is_array_assoc($v)){
                    array_push($levels, $k);
                    $str .= walk_settings($v, $str, $levels);
                    array_pop($levels);
                } else {
                    foreach($levels as $level){
                        $str .= "$level.";
                    }

                    $str .= "$k//" . json_encode($v) . "\n";
                }
            });

            return $str;
        }

        $strSettings = trim(walk_settings($defaultSettings, $str));

        foreach(preg_split("/\\n/", $strSettings) as $strSetting){
            $split_results = preg_split("/\/\//", $strSetting);

            $name = $split_results[0];
            $value = json_decode($split_results[1], 1);

            $this->set($name, $value, $override);
        }
    }
}
