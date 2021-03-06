(function () {
    'use strict';
    angular.module('qrc.services').factory('QRC', QRC);

    QRC.$inject = ['$http', '$q'/*, 'QRCTokenInjector'*/];
    function QRC($http, $q/*, QRCTokenInjector*/) {
        var ipAddress = {};
        var authToken = {};
        var defaultTimeout = 10000; // shorten the http request timeout to 5 sec, it is long enough for LAN.
        var defaultConfig = {
            timeout: defaultTimeout, 
        }

        var QRC = {
            getTokenVal: function(idx) {
                return authToken[idx];
            },

            // Followings are only utils
            setTargetIpAddress: setTargetIpAddress,
            getHashCode: getHashCode,
            setTargetAuthToken: setTargetAuthToken,

            // Followings are QRC API
            reboot: reboot,
            getScreenshot: getScreenshot,

            getPublicInfo: getPublicInfo,
            getToken: getToken,
            getInfo: getInfo,

            listSettings: listSettings,
            setSettings: setSettings,
            getSettings: getSettings,

            getWifiScanResults: getWifiScanResults,
            getWifiState: getWifiState,
            setWifiState: setWifiState,
            getWifiNetwork: getWifiNetwork,
            setWifiNetwork: setWifiNetwork,

            getProxy: getProxy,
            setProxy: setProxy,

            setProp: setProp,
            listProp: listProp,

            setSecurityPassword: setSecurityPassword,
            deleteSecurityPassword: deleteSecurityPassword,

            listAudioVolume: listAudioVolume,
            setAudioVolume: setAudioVolume,

            listLed: listLed,
            getLed: getLed,
            setLed: setLed,

            setPresenceEnableState: setPresenceEnableState,
            getPresenceStatus: getPresenceStatus,
            setPresenceStatus: setPresenceStatus,
            getPresenceGearing: getPresenceGearing,
            setPresenceGearing: setPresenceGearing,

            getEth0State: getEth0State,
            setEth0State: setEth0State,
            getEth0Network: getEth0Network,
            setEth0Network: setEth0Network,
            buildUrl: buildUrl,
            postConfig: postConfig,
            rebootDevice: rebootDevice,
        };
        return QRC;

        // Followings are only utils

        function getHashCode(value) {
            var hash = 0;
            if (value.length == 0) return hash;
            for (var i = 0; i < value.length; i++) {
                var char = value.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }
        function setTargetIpAddress(ip_address, idx) {
            if (!idx) idx = 0;
            ipAddress[idx] = ip_address + ":8080";
        }

        function setTargetAuthToken(token, idx) {
            if (!idx) idx = 0;
            authToken[idx] = token;
            //QRCTokenInjector.setToken(token);
        }


        // Followings are QRC API
        function reboot(idx) {
            var url = buildUrl("/v1/task/reboot", idx);
            return $http.post(url, {}, getConfig(idx));
        }
        function getScreenshot(idx) {
            var url = buildUrl("/v1/task/screenshot", idx);
            return $http.get(url, getConfig(idx));
        }

        function getPublicInfo(key, idx) {
            var url = buildUrl("/v1/public/info?key=" + key, idx);
            return $http.get(url, getConfig(idx, true));
        }
        function getToken(password_input, idx) {
            var url = buildUrl("/v1/oauth2/token", idx);
            return $http.post(url, {
                grant_type: "password",
                username: "admin",
                password: password_input},
                              getConfig(idx, true));
        }
        function getInfo(idx) {
            var url = buildUrl("/v1/info", idx);
            return $http.get(url, getConfig(idx));
        }

        function listSettings(idx) {
            var url = buildUrl("/v1/settings", idx);
            return $http.get(url, getConfig(idx));
        }
        function setSettings(key, value, idx) {
            var url = buildUrl("/v1/settings/" + key, idx);
            console.log(key+': '+value);
            return $http.post(url, {
                "value": value}, getConfig(idx));
        }

        function postConfig(url, param, idx) {
            console.log("url:" + url + " param:" + JSON.stringify(param));
            return $http.post(url, param, getConfig(idx));
        }

        function getSettings(key, idx) {
            var url = buildUrl("/v1/settings/" + key, idx);
            return $http.get(url, getConfig(idx));
        }

        function getWifiScanResults(idx) {
            var url = buildUrl("/v1/wifi/scan_results", idx);
            return $http.get(url, getConfig(idx));
        }

        function setWifiState(state, idx) {
            var stateStr = (state != 0)? "enabled" : "disabled";
            var url = buildUrl("/v1/wifi/state", idx);
            return $http.post(url, {
                "value": stateStr}, getConfig(idx));
        }
        
        function getWifiState(idx) {
            var url = buildUrl("/v1/wifi/state", idx);
            return $http.get(url, getConfig(idx));
        }
        
        function getWifiNetwork(idx) {
            var url = buildUrl("/v1/wifi/network", idx);
            return $http.get(url, getConfig(idx));
        }
        function setWifiNetwork(wifiConfig, idx) {
            var url = buildUrl("/v1/wifi/network", idx);
            return $http.post(url, wifiConfig, getConfig(idx));
        }

        // proxy
        function getProxy(idx) {
            var url = buildUrl("/v1/net/proxy", idx);
            return $http.get(url, getConfig(idx));
        }
        function setProxy(param, idx) {
            var url = buildUrl("/v1/net/proxy", idx);
            return $http.post(url, param, getConfig(idx));
        }

        function setProp(prop, value, idx) {
            var url = buildUrl("/v1/prop/" + prop, idx);
            return $http.post(url, {
                "value": value}, getConfig(idx));
        }
        function listProp(idx) {
            var url = buildUrl("/v1/prop", idx);
            return $http.get(url, getConfig(idx));
        }

        function setSecurityPassword(value, idx) {
            var url = buildUrl("/v1/user/password", idx);
            return $http.post(url, {
                "value": value}, getConfig(idx));
        }
        
        function deleteSecurityPassword(idx) {
            var url = buildUrl("/v1/user/password", idx);
            return $http.delete(url, getConfig(idx));
        }

        function listAudioVolume(idx) {
            var url = buildUrl("/v1/audio/volume", idx);
            return $http.get(url, getConfig(idx));
        }

        function setAudioVolume(streamType, value, idx) {
            var url = buildUrl("/v1/audio/volume/" + streamType, idx);
            return $http.post(url, {
                "value": value}, getConfig(idx));
        }

        function listLed(idx) {
            var url = buildUrl("/v1/led", idx);
            return $http.get(url, getConfig(idx));
        }

        function  getLed(key, idx) {
            var url = buildUrl("/v1/led/" + key, idx);
            return $http.get(url, getConfig(idx));
        }

        function  setLed(key, r, g, b, idx) {
            var url = buildUrl("/v1/led/" + key, idx);
            return $http.post(url, {
                "red": r, "green": g, "blue": b}, getConfig(idx));
        }
        
        function setPresenceEnableState(enableState, idx) {
            var url = buildUrl("/v1/presence/enabled", idx);
            var obj = {value: enableState};
            return $http.post(url, obj, getConfig(idx, false, 60000));            
        }

        function getPresenceStatus(type, index, idx) {
            var url = buildUrl("/v1/presence/status/" + index + "/" + type, idx);
            return $http.get(url, getConfig(idx, false, 60000));
        }

        function setPresenceStatus(type, value, index, idx) {
            var url = buildUrl("/v1/presence/status/" + index, idx);
            var obj = {};
            obj[type] = value;
            return $http.post(url, obj, getConfig(idx, false, 60000));
        }

        function getPresenceGearing(type, index, idx) {
            var url = buildUrl("/v1/presence/status/" + index + "/" + type, idx);
            return $http.get(url, getConfig(idx, false, 60000));
        }

        function setPresenceGearing(type, value, index, idx) {
            var url = buildUrl("/v1/presence/status/" + index, idx);
            var obj = {};
            obj[type] = value;
            return $http.post(url, obj, getConfig(idx, false, 60000));
        }

        function getEth0State(idx) {
            var url = buildUrl("/v1/eth/0/state", idx);
            return $http.get(url, getConfig(idx));
        }
        function setEth0State(state, idx) {
            var stateStr = (state != 0)? "enabled" : "disabled";
            var url = buildUrl("/v1/eth/0/state", idx);
            return $http.post(url, {
                "value": stateStr}, getConfig(idx));
        }
        function getEth0Network(idx) {
            var url = buildUrl("/v1/eth/0/network", idx);
            return $http.get(url, getConfig(idx));
        }
        function setEth0Network(ethConfig, idx) {
            var url = buildUrl("/v1/eth/0/network", idx);
            return $http.post(url, ethConfig, getConfig(idx));
        }
        function rebootDevice(reasonStr, idx) {
            var url = buildUrl("/v1/reboot", idx);
            return $http.post(url, {"reason": reasonStr}, getConfig(idx));
        }

        function buildUrl(path, idx) {
            var url = "";
            if (!idx) idx = 0;
            if (ipAddress[idx] != null) {
                url = "http://" + ipAddress[idx] + path;
            } else {
                console.error("Target ipAddress is null.");
            }
            return url;
        }

        // ------------------------------- Internal functions

        function getConfig(idx, noAuth, timeout) {
            var config = {};
            if (!idx) idx = 0;
            if (!noAuth) {
                config.headers = {'Authorization': "Bearer " + authToken[idx]};
            }
            config.timeout = timeout? timeout:defaultTimeout;
            return config;
        }
    }
    /*
    angular.module('qrc.services').factory('QRCTokenInjector', QRCTokenInjector);
    QRCTokenInjector.$inject = [];
    function QRCTokenInjector() {
        var bearerToken;
        var QRCTokenInjector = {
            setToken: setToken,
            request: function(req) {
                if (!req.headers.Authorization && bearerToken) {
                    req.headers.Authorization = bearerToken;
                }
                return req;
            }
        };
        return QRCTokenInjector;

        function setToken(token) {
            bearerToken = "Bearer " + token;
        }

    }

    angular.module('qrc.services').config(config);
    config.$inject = ['$httpProvider'];
    function config($httpProvider) {
        $httpProvider.interceptors.push('QRCTokenInjector');
    }
    */
})();
