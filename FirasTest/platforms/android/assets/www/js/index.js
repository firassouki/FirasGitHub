/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


function onSuccess(position) {

    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
                        'Longitude: ' + position.coords.longitude + '<br />' +
                        'Altitude: ' + position.coords.altitude + '<br />' +
                        'Accuracy: ' + position.coords.accuracy + '<br />' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                        'Heading: ' + position.coords.heading + '<br />' +
                        'Speed: ' + position.coords.speed + '<br />' +
                        'Timestamp: ' + position.timestamp + '<br />';

    var currentposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapoptions = {
        zoom: 12,
        center: currentposition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapoptions);

    var marker = new google.maps.Marker({
        position: currentposition,
        map: map
    });
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');

    var currentposition = new google.maps.LatLng(33.8869, 35.5131);
    // alert('Hi');
    var mapoptions = {
        zoom: 12,
        center: currentposition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // alert('Hi');
    var map = new google.maps.Map(document.getElementById("map"), mapoptions);

    var marker = new google.maps.Marker({
        position: currentposition,
        map: map
    });

    alert('The location shown is not your real location :(');
}

var pushNotification;

function RegisterNotifications() {
    try {
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(
                        successHandlerNotification,
                        errorHandlerNotification, {
                            "senderID": "756443271233",
                            "ecb": "onNotificationGCM"
                        });
        }
        else {
            pushNotification.register(
                tokenHandlerNotification,
                errorHandlerNotification, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onNotificationAPN"
                });
        }
    }

    catch (e) {
        alert("registration error:" + e.message);
    }
}

function successHandlerNotification(result) {
    //alert('result = ' + result);
	//alert('successHandlerNotification: result = ' + result);
	console.log('successHandlerNotification: result = ' + result);
}

function errorHandlerNotification(error) {
    alert('errorHandlerNotification error = ' + error);
}

function tokenHandlerNotification(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    //alert('device token = ' + result);
	alert('tokenHandlerNotification: device token = ' + result);
	console.log('tokenHandlerNotification: device token = ' + result);
}

// iOS
function onNotificationAPN (event) {
	if ( event.alert )
	{
		navigator.notification.alert(event.alert);
	}

	if ( event.sound )
	{
		var snd = new Media(event.sound);
		snd.play();
	}

	if ( event.badge )
	{
		pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
	}
}

function onNotificationGCM(e) {
    //alert('from event');
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
//                $.ajax({
//                    type: "POST",
//                    url: "http://192.168.0.141:8787/notification/post.php",
//                    data: { name: "" + e.regid, name2: "asdfsadf" }
//                })
//                .done(function (msg) {
//             alert("Data Saved: " + msg);
//            });
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
               
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/" + e.soundname);
                my_media.play();
            }
            else {  // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
					var my_media = new Media("/android_asset/www/" + e.soundname);
					my_media.play();
                }
                else {
                    $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            break;

        case 'error':
            $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        try {
            pushNotification = window.plugins.pushNotification;
            //alert('after push var');
            RegisterNotifications();
           // alert(device.uuid);
            //navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } catch (e) {
            alert(e.message);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

         console.log('Received Event: ' + id);
    }
};