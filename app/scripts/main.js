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

  /**********************************************************************
   *
   * Event linsteners for UI elements
   *
   **********************************************************************/

  // Add the route changed listener update UI on route changed
  document.addEventListener('routeChanged', function (e) {
  	console.log("Route have changed !");
  	console.log('New route : ' + app.route);
  	app.pageChange(app.route);
  });

  /**********************************************************************
   *
   * Methods to update/refresh the UI
   *
   **********************************************************************/

   app.pageChange = function (route) {
   	$('.page').prop('hidden', true);
   	$('[data-route='+route+']').prop('hidden', false);
   }


  /**********************************************************************
   *
   * Methods for dealing with the model
   *
   **********************************************************************/

  app.getEvents = function (category) {
    $.getJSON("../data/events.json", function(data){
      var events = data.events;
      var html = '';
      for(var i = 0 ; i < Object.keys(events).length; i++) {
        if(events[i].category == category){
          console.log('plop');
          html += '<div class="event-list-item mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-cell--12-col-phone" style="background-image: url('+ events[i].photo +');">';
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
      console.log(html);
      $("[data-route="+category+"] .mdl-grid").html(html);
    });
  }

  var els = document.getElementsByClassName('event-div');

  var goToEvent = function() {
    var ev_id = this.getAttribute('data-id');
    console.log(ev_id);
    // alert(ev_id);
  }

  Array.prototype.forEach.call(els, function(el, i){
    el.addEventListener('click', goToEvent);
  });

})();
