<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.15
*
*/
namespace Arxos\Login\OAuth2_OpenID;
use OpenIDConnectClient\OpenIDConnectClient;

class OAuth2_OpenID {
    private $settings;
    private $connection;
    private $access_token = null;
    private $is_authorized = false;
    private $refresh_token = null;
    private $user_id = null;
	private $user_info = [];

    function __construct(\Arxos\Settings\Settings $settings){
        $this->settings = $settings;
		$this->is_authorized = false;

		$this->connection = new OpenIDConnectClient(
			$this->settings->get("PRIVATE.LOGIN.SETTINGS.URL_BASE"),
			$this->settings->get("PRIVATE.LOGIN.SETTINGS.params.client_id"),
			$this->settings->get("PRIVATE.LOGIN.SETTINGS.params.client_secret"));

		foreach(preg_split("/ /", $this->settings->get("PRIVATE.LOGIN.SETTINGS.params.scope")) as $scope){
			$this->connection->addScope($scope);
		}

		$this->connection->providerConfigParam(array("authorization_endpoint"=>$this->settings->get("PRIVATE.LOGIN.SETTINGS.URL_AUTHORIZE")));
		$this->connection->setResponseTypes(preg_split("/ /", $this->settings->get("PRIVATE.LOGIN.SETTINGS.params.response_types")));

		if(getBranch() === "_testing"){
		    $this->connection->setRedirectUrl("https://price.socialfymedia.com/_testing/hvac/");
		} else {
		    $this->connection->setRedirectUrl($this->settings->get("PRIVATE.LOGIN.SETTINGS.params.redirect_uri"));
		}
    }
    function login() : bool {
    	$result = true;

    	try {
			$this->connection->authenticate($_SESSION["LOGIN_RESET"]);
			$this->_getUserInfo();

			$this->user_id = $this->user_info["sub"];
			$this->_isAuthorized($this->user_info);

			$this->access_token = $this->connection->getAccessToken();
			$this->refresh_token = $this->connection->getRefreshToken();
		} catch (OpenIDConnectClientException $e){
			//TODO put something here to handle exceptions
			$result = false;
		}

        return $result;
    }
    function logout($getURL=false, $redirect=true) {
    	if($redirect){
    		return $this->connection->signOut($this->access_token, $redirect ? $this->settings->get("PRIVATE.LOGIN.SETTINGS.URL_SIGNOUT") : $redirect, $getURL);
    	} else {
    		return $this->connection->signOut($this->access_token, NULL, $getURL);
    	}
    }
    private function _isAuthorized(array $userInfo): bool {
    	$this->is_authorized = false;

    	foreach($this->settings->get("PRIVATE.LOGIN.authorization.fields") as $field){
    		if(isset($userInfo[$field["key"]]) && $userInfo[$field["key"]] === $field["value"]){
    			$this->is_authorized = true;
    		}
    	}

    	return $this->is_authorized;
    }
    public function isAuthorized(): bool {
    	return $this->is_authorized;
    }
    public function getUserId(): string {
    	return $this->user_info;
    }
    private function _getUserInfo() {
    	$this->user_info = json_decode(json_encode($this->connection->requestUserInfo()), true);
    }
    public function getUserInfo() : array {
    	return $this->user_info;
    }
	public function getServerStoreInfo(): array {
		return [
			"user_id" => $this->user_id,
			"access_token" => $this->access_token,
			"is_authorized" => $this->is_authorized,
			"refresh_token" => $this->refresh_token
		];
	}
}
/*
    "PRIVATE": {
		"LOGIN": {
			"ENABLED": true,
			"REMOTE": true,
			"TYPE": "oauth2 openid",
			"SETTINGS": {
				"URL_AUTHORIZE": "https://signon-stage.priceindustries.com/connect/authorize",
				"URL_BASE": "https://signon-stage.priceindustries.com/",
				"URL_EXIT": "https://signon-stage.priceindustries.com/login",
				"URL_SIGNOUT": "https://signon-stage.priceindustries.com/logout",
				"params": {
					"response_types": "code id_token",
					"client_id": "Price_EngBook",
					"client_secret": "61e4e7fad18e3bc6f7dcacab9af59213",
					"redirect_uri": "https://price.socialfymedia.com/_dev/hvac/",
					"scope":"openid profile email offline_access"
				}
			},
			"authorization": {
				"fields": [
					{
						"name": "EngineeringHandbook",
						"value": true
					}
				]
			}
		}
    }
    */
