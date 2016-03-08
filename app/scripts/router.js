
(function (window, document) {
	console.info('Router is loaded !');
	var app = window.app || {};
		app.baseUrl = '/';
		app.route 	= 'index';

    if (window.location.port === '') {  // if production
      page.base(app.baseUrl.replace(/\/$/, ''));
    }

    page(app.baseUrl, function() {
	  app.route = 'index';
      app.params = {};
    });

    page('/', function() {
      app.route = 'index';
      app.params = {};
    });

    // Route example
    // page('/...', function() {
    //   app.route = '...';
    //   app.params = {};
    // });

    // 404
    page('*', function() {
      // app.$.message.text = 'Can\'t find: ' + window.location.href  + '. Redirected you to Home Page';
      // app.$.message.show();
      page.redirect(app.baseUrl);
    });

    // add #! before urls
    page({
      hashbang: true
    });


})(window, document);