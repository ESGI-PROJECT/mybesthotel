/**
 * Main.js
 * 
 * Main js application script
 */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // Check to see if there's an updated version of service-worker.js with
      // new files to cache:
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-update-method
      if (typeof registration.update === 'function') {
        registration.update();
      }

      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  window.app = {};
  var app = window.app;
  		app.version = "0.0.1";
  		app.mainPage = "events";
      app.pathJson = "../data/events.json";

  /**********************************************************************
   *
   * Event linsteners for UI elements
   *
   **********************************************************************/

  // Add the route changed listener update UI on route changed
  document.addEventListener('routeChanged', function (e) {
  	console.log("Route have changed !");
  	console.log('New route : ' + app.route);
  	app.pageChange(app.route, e.detail);
  });

  $('form button').click(function(){
    app.saveEvent();
  });

  var chatForm = document.querySelector("#chat-form");
  console.log(chatForm);
  chatForm.addEventListener('submit', function (e) {
  	e.preventDefault();
  	var messageValue = document.querySelector('#chat-input').value;
		var messageDate = new Date().getTime();

  	var messageContext = {};

  	messageContext.userId 	= app.userId;
  	// Fixme : change the user name
  	messageContext.userName	= 'Plopman';
  	messageContext.message 	= messageValue;
  	messageContext.date 		= messageDate;

  	app.sendMessage(messageContext);
  	app.writeMessage({data: messageContext}, true);
  });

  /**********************************************************************
   *
   * Methods to update/refresh the UI
   *
   **********************************************************************/

   app.pageChange = function (route, detail) {
   	$('.page').prop('hidden', true);
   	$('[data-route='+route+']').prop('hidden', false);

   	$('#fabButton').prop('hidden', false);
   	if (app.params.hideFab) {
   		$('#fabButton').prop('hidden', true);
   	} else {
   		$('.direct-chat-messages').html('');
   		app.updateNumber({numUsers: 1});
   		if (app.socket) {
   			console.log('left');
   			app.socket.emit('disconnect', 'true');
   			app.socket.disconnect();
   			app.socket = null;
   		}
   	}

   	// Replace menu button by return button
   	if (route != app.mainPage) {
   		$('header .mdl-layout__drawer-button').prop('hidden', true);
   		$('header .mdl-layout__drawer-button')
   			.after('<div class="mdl-layout__drawer-button back-arrow"><i class="material-icons">arrow_back</i></div>');

		  $('.back-arrow').click(function (e) {
		  	if (detail.backLink) {
		  		window.page.redirect(detail.backLink);
		  	} else {
		  		window.page.redirect('/');
		  	}
		  });
   	} else {
   		$('header .mdl-layout__drawer-button').prop('hidden', false);
   		$('.back-arrow').remove();
   	}
   }

   $(function() {
    var availableTags = [
      {
        value: "DisneyLand",
        latitude: 48.872211,
        longitude: 2.775801, 
      },
      {
        value: "Macumba",
        latitude: 48.864731,
        longitude: 2.381944, 
      }
    ];
    $( "#tags" ).autocomplete({
      source: availableTags,
      focus: function( event, ui ) {
        $( "#tags" ).val( ui.item.value );
        return false;
      },
      select: function( event, ui ) {
        $( "#tags" ).val( ui.item.value );
        console.log('select');
        app.displayEventMap(ui.item.latitude, ui.item.longitude, "createEvent");
        return false;
      }
    });
  });


  /**********************************************************************
   *
   * Methods for dealing with the model
   *
   **********************************************************************/

  app.getEvents = function (category) {
    $.getJSON(app.pathJson, function(data){
      var events = data.events;
      var html = '';
      var eventPresence = false;
      for(var i = 0 ; i < Object.keys(events).length; i++) {
        if(events[i].category == category){
          eventPresence = true;
          html += '<a href="/event/' + category + '/' + events[i].id + '" class="event-list-item mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-cell--12-col-phone" style="background-image: url('+ events[i].photo +');">';
          html += '<p><i class="material-icons">bookmark_border</i> '+ events[i].category_name +' </p>';
          html += '<h4>'+ events[i].name +'</h4>';
          html += '<span class="mdl-list__item-primary-content">';
          html += '<i class="material-icons">access_time</i> '+ events[i].startDate;
          html += '</span></br>';
          html += '<span><i class="material-icons">place</i> '+ events[i].lieu +'</span>';
          html += '<div class="event-icons">';
          html += '<i class="material-icons">favorite_border</i>'+ events[i].participants.length;
          html += '</div>';
          html += '</div>';
        }
      }
      if(eventPresence == false) {
        html += '<div class="demo-card-wide mdl-card mdl-shadow--2dp no-event">';
        html += '<div class="mdl-card__actions mdl-card--border">';
        html += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">';
        html += 'Pas d\'évènement prévu pour le moment.';
        html += '</a>';
        html += '</div>';
        html += '</div>';
      }
      $("[data-route='categoryEvent'] .mdl-grid").html(html);
    });
  }

  app.getEvent = function (id) {
     $.getJSON(app.pathJson, function(data){
      var events = data.events;
      var html = '';
      for(var i = 0 ; i < Object.keys(events).length; i++) {
        if(events[i].id == id){
          html += '<div class="event-list-item mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-cell--12-col-phone" style="background-image: url('+events[i].photo+');">';
          html += '<p><i class="material-icons">bookmark_border</i> '+ events[i].category_name +' </p>';
          html += '<h4>'+ events[i].name +'</h4>';
          html += '<div class="mdl-card__actions mdl-card--border">'
          html += 'Date de début: '+events[i].startDate+'</br>';
          html += 'Date de fin: '+events[i].endDate+'</br>';
          html += 'Lieu: '+events[i].lieu;
          html += '</div>';
          html += '<div class="event-icons"><img width="30px" src="images/logo.svg"></div>';
          html += '<div class="mdl-grid"><div id="yesButton" class="mdl-cell mdl-cell--4-col mdl-4-btn"><i class="material-icons">check_circle</i><p>J\'y vais</p></div><div id="maybeButton" class="mdl-cell mdl-cell--4-col mdl-4-btn"><i class="material-icons">offline_pin</i><p>Peut-être</p></div><div id="noButton" class="mdl-cell mdl-cell--4-col mdl-4-btn"><i class="material-icons">cancel</i><p>Ignorer</p></div></div>';
          html += '<div class="event-icons"><a class="chat-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored" href="/event/'+ events[i].category +'/' + events[i].id +'/chat">Chat <img width="30px" src="images/logo.svg"></a></div>';
          html += '<div class="mdl-card__actions mdl-card--border">';
          html += '<a class="mdl-button mdl-button--colored mdl-js-ripple-effect">';
          html += 'Description de l\'événement';
          html += '</a>';
          html += '<div class="mdl-card__supporting-text">';
          html += events[i].description;
          html += '</div>';
          html += '<div class="mdl-card__actions mdl-card--border">';
          html += '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">';
          html += 'Participants';
          html += '</a>';
          html += '</div>';
          html += '<div class="mdl-list">';
          var participants = events[i].participants;
          for(var j = 0 ; j < Object.keys(participants).length; j++) {
            html += '<div class="mdl-list__item">';
            html += '<span class="mdl-list__item-primary-content">';
            html += '<i class="material-icons mdl-list__item-avatar">person</i>';
            html += '<span class="name-participant">'+participants[j].name+'</span>';
            html += '</span>';
            html += '<a onclick="showDialog('+j+')" class="mdl-list__item-secondary-action accordion-item dialog-button'+j+'"><i class="material-icons">info</i></a>';
            html += '</div>';
            html += '<dialog id="dialog'+j+'" class="mdl-dialog">';
            html += '<h3 class="mdl-dialog__title">'+participants[j].name+'</h3>';
            html += '<div class="mdl-dialog__content">';
            html += ''+participants[j].email+'<br/>';
            html += ''+participants[j].language+'<br/>';
            html += '</div>';
            html += '<div class="mdl-dialog__actions">';
            html += '<button type="button" class="mdl-button">Close</button>';
            html += '</div>';
            html += '</dialog>';
          }
          html += '</div>';
          html += '<div class="event-list-item mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-cell--12-col-phone event-map" id="eventMap">';
          html += '</div>';
          html += '</div>';
          var latitude = events[i].latitude;
          var longitude = events[i].longitude;
        }
      }
      
      $("[data-route='event'] .mdl-grid").html(html).promise().done(function(){
        $(".mdl-4-btn").click(function(e) {
           app.toggleButtons(e.currentTarget.id);
        });
      });;
      app.displayEventMap(latitude, longitude, "getEvent");

		  // var showModalButton = document.querySelector('.chat-button');
		  // var dialog = document.querySelector('.chat-box');

		  // app.ListenDialogButton(showModalButton, dialog);
    });
  }

  app.writeMessage = function (data, sender) {
  	name = sender?'Vous':data.data.userName;

		var messageValue = document.querySelector('#chat-input').value = ""

  	sender = sender?'right':'left';
  	var month = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juill', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  	var msgDate = new Date(data.data.date);
  	var msgDay = (msgDate.getDate() < 10)? "0" + msgDate.getDate():msgDate.getDate();
		var msgMonth = month[msgDate.getMonth()];
		var msgHour = (msgDate.getHours() < 10)? "0" + msgDate.getHours():msgDate.getHours();
		var msgMin = (msgDate.getMinutes() < 10)? "0" + msgDate.getMinutes():msgDate.getMinutes();

		var date = msgDay+' '+msgMonth+' '+msgHour+':'+msgMin;

  	var html = '';
		html += '<div class="direct-chat-msg '+sender+'">';
		html += '<div class="direct-chat-info clearfix">';
		html += '<span class="direct-chat-name pull-'+sender+'">'+name+'</span>';
		// Default position
		html += '<span class="direct-chat-timestamp pull-right">'+date+'</span>';
		html += '</div>';
		html += '<img class="direct-chat-img" src="http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46b12d72da.png" alt="message user image">';
		html += '<div class="direct-chat-text">';
		html += data.data.message;
		html += '</div>';
		html += '</div>';

		$('.direct-chat-messages').append(html);
  }

  app.saveEvent = function () {
    app.pathJson = "../data/events2.json";
  }

  app.toggleButtons = function (id) {
    var yesButton = $("#yesButton");
    var maybeButton = $("#maybeButton");
    var noButton = $("#noButton");
    if (id == "yesButton") {
      yesButton.toggleClass("button-pressed", true);
      maybeButton.toggleClass("button-pressed", false);
      noButton.toggleClass("button-pressed", false);
    } else if (id == "maybeButton") {
      yesButton.toggleClass("button-pressed", false);
      maybeButton.toggleClass("button-pressed", true);
      noButton.toggleClass("button-pressed", false);
    } else if (id == "noButton") {
      yesButton.toggleClass("button-pressed", false);
      maybeButton.toggleClass("button-pressed", false);
      noButton.toggleClass("button-pressed", true);
    }
  }

  var els = document.getElementsByClassName('event-div');

  var goToEvent = function() {
    var ev_id = this.getAttribute('data-id');
  }

  Array.prototype.forEach.call(els, function(el, i){
    el.addEventListener('click', goToEvent);
  });
    
  app.displayEventMap = function(latitude, longitude, from) {
      var latlng = new google.maps.LatLng(latitude, longitude);
      
      var options = {
          center: latlng,
          zoom: 19,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      if(from == "getEvent") {
        var eventMap = new google.maps.Map(document.getElementById("eventMap"), options);
      } else {
        var eventMap = new google.maps.Map(document.getElementById("eventMapForm"), options);
        document.getElementById("eventMapForm").removeAttribute("hidden");
      }
      
      var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				map: eventMap
		  });
  }

  app.getNewMessage = function (message) {
  	console.log(message);
		app.writeMessage(message);
  }

  app.updateNumber = function (number) {
  	console.log(number);
  	$('#chat-count-user').html(number.numUsers);
  }

  /**********************************************************************
   *
   * Methods for dealing with the web socket
   *
   **********************************************************************/

   app.openConnection = function (event, room) {
   	var socketNamespace = 'socket-' + event + '-' + room;
   	if (!app.socket || socketNamespace != app.socket.socketNamespace) {

   		app.userId = new Date().getTime();

			var serverUrl = window.location.origin + "?category="+event+"&eventId="+room+"&userId=" + app.userId;
			$.ajax({
				url: serverUrl
			})
			.done(function(data) {
			  console.log('success');
			  console.log(event + '-' + room);
	   		var namespaceName = event + '-' + room;

	   		app.socket = io('/' + namespaceName);
	   		app.socket.socketNamespace = 'socket-' + namespaceName;

			 	app.socket.on('new message', function(msg){
			    app.getNewMessage(msg);
			    // Action to do when receiving a new message
			  });

				app.socket.on('user join', function(data){
					console.log('user join');
					app.updateNumber(data);
			  });

			  app.socket.on('user left', function(data){
			    console.log('user left');
			    app.updateNumber(data);
			  });
			})
			.fail(function() {
			  console.error("error");
			})
   	}
   	return app.socket;
   }
   app.sendMessage = function (contesxt) {
		app.socket.emit('new message', contesxt);
   }

	app.getMessage = function (e) {
    socket.on('new message', function (data) {
     console.log(data);
     // app.writeMessage(data);
    });
	}

})();
