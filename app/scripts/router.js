
(function (window, document) {
	console.info('Router is loaded !');
	var app = window.app || {};
			app.baseUrl = '/';
			app.route 	= 'index';

    if (window.location.port === '') {  // if production
      page.base(app.baseUrl.replace(/\/$/, ''));
    }

  	// Create a custom event to fire when the route changed
  	var event = new CustomEvent('routeChanged', { 'detail': {} });

    page(app.baseUrl, function() {
	  	app.route = 'events';
      app.params = {};
      document.dispatchEvent(event);
    });

    page('/', function() {
      app.route = 'events';
      app.params = {};
      document.dispatchEvent(event);
    });

    page('/events', function() {
      app.route = 'events';
      app.params = {};
      document.dispatchEvent(event);
    });

    page('/event', function() {
      app.route = 'event';
      app.params = {};
    	document.dispatchEvent(event);
    });

    // Route example
    // page('/...', function() {
    //   app.route = '...';
    //   app.params = {};
    //   
    //   Add your custom data to the event detail object
    //   event.detail['...'] = ...;
    //   document.dispatchEvent(event);
    // });

    // 404
    page('*', function() {
      page.redirect(app.baseUrl);
      console.error('Error : Can\'t find: ' + window.location.href  + '. Redirected you to Home Page');
    });

    // add #! before urls
    page({
      hashbang: true
    });


})(window, document);