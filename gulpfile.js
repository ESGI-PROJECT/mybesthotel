var gulp = require('gulp');
var webserver = require('gulp-webserver');
 
gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      path: '/',
      host: 'dev.betweenus.com',
      port: 8000,
      livereload: true,
      // open: true,
			// https: {
			// 	key: '/etc/ssl/certs/ssl-cert-snakeoil.pem',
			// 	cert: '/etc/ssl/private/ssl-cert-snakeoil.key'
			// }
    }));
});