<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.17
*
*/
namespace Arxos\Login;

class Login {
    private $auth_type;
    private $inner_login;
    private $settings;

    function __construct(\Arxos\Settings\Settings $settings){
        $this->settings = $settings;
        $this->auth_type = $settings->get("PRIVATE.LOGIN.TYPE", "");
        $this->inner_login = null;

        if($this->auth_type === "oauth2 openid"){
            $this->inner_login = new OAuth2_OpenID\OAuth2_OpenID($this->settings);
        }
    }
    function isAuthorized(): bool {
    	return $this->inner_login->isAuthorized();
    }
    function login(): bool{
    	return $this->inner_login->login();
    }
    function logout($getURL=false, $redirect=true){
    	return $this->inner_login->logout($getURL);
    }
    function getServerStoreInfo(): array {
    	return $this->inner_login->getServerStoreInfo();
    }
    function getUserInfo() : array {
    	return $this->inner_login->getUserInfo();
    }
    function getUserId(): string {
		return $this->inner_login->getUserInfo();
    }
}
