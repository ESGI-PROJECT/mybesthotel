# Between Us

# Install
To install the project, first you need to get the sources on github: [here](https://github.com/ESGIDIW-22/mybesthotel).

You also need to have nodejs js installed. You can download the lastest version [here](https://nodejs.org/en/download/).

`Note : Be sure to install nodejs globaly so you can access it via command line anywhere`

Once you're done with nodejs, go to the project repository and run the following command in a terminal.
```bash
    $ npm install
```

After all dependencies have been installed juste run

```bash
    $ gulp webserver
```

to run the webserver and run the app.

# Code

This simplate page web application is using [page.js](https://visionmedia.github.io/page.js/) for creating a simple declarative routing

Each route will will change an app property that will change the displayed page of the app

To create a new page you need to create  a new route like the following

```javascript
    // Route example
    page('/...', function() {
        app.route = '...';
        app.params = {};
    //   Add your custom data to the event detail object
        event.detail['...'] = ...;
        document.dispatchEvent(event);
    });
```

And create a new `section` in HTML with a `data-route` custom property

```html
    <section data-route="...">
        <!-- YOUR CONTENT HERE -->
    </section>
```