# Smile To Unlock

Want to give away free content on your site? How about asking for a smile in return :)

Smile To Unlock is a Web Component built using the StencilJS compiler, so  is framework agnostic, can be used in an Angular, Vue, React or even in a vanilla web application.

Smile To Unlock captures an image from the users camera and uses the [Azure Cognitive Services Emotive API](http://bit.ly/emotive-api-stu) to figure out how happy the person is.

- NOTE: On the FREE tier you get 30,000 API requests a month. 

## Demo

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/PYuzAE2K5aE/0.jpg)](https://www.youtube.com/watch?v=PYuzAE2K5aE)

You can also see it working on my site here: https://codecraft.tv/courses/angular/es6-typescript/decorators/

## Getting Started

1. Grab an [API Key](https://azure.microsoft.com/try/cognitive-services/?api=emotion-api&WT.mc_id=stu-oss-ashussai) from Azure 

- NOTE: On the FREE tier you get 30,000 API requests a month. 

2. Add this tag to your HTML

```html
<smile-to-unlock api-key="<YOUR_API_KEY_HERE>"></smile-to-unlock>
```

3. Add this code to trigger the component

```js
var locker = document.querySelector('smile-to-unlock');
locker.start();
```

This opens the component full screen and starts asking the user to smile.

4. Add this code to check to see if the user has smiled

```js
locker.addEventListener("userSmiled", function (ev) {
    // --> Add the code to show the free content here <--
    
    locker.end(); // End the locker so the camera is shutdown
})
```

## Using the helper hider

As a shortcut if you just have a video or part of the page you want to hide from the user unless they smile you can use the helper `<smile-to-unlock-hider></smile-to-unlock-hider>` component.

1. Place the hider inside the component you want to hide.

NOTE: The element you want to hide should have the style `position: relative;`

```html
<div class="this-is-what-want-to-hide" style="position: relative;">
    <!-- This will add a black overlay to any content with some text and a button to start the smiling process -->
    <smile-to-unlock-hider></smile-to-unlock-hider>

    <!-- This is the actual unlocker component  -->
    <smile-to-unlock api-key="<YOUR_API_KEY_HERE>"></smile-to-unlock>
</div>

```

2. Then make sure to add this code at the end of your html file somewhere:

- This code shows the hider overlay over the content you want to hide (so the user can't see it or click on any buttons if it's a video).

```js
(function() {
    var hider = document.querySelector('smile-to-unlock-hider');
    var locker = document.querySelector('smile-to-unlock');

    // This event is called when the user has clicked Smile To Unlock
    hider.addEventListener("readyToSmile", function (ev) {
    // Starts the locker full screen
    locker.start();

    // This event is sent when the user has smiled
    locker.addEventListener("userSmiled", function (ev) {
        console.log(ev.detail.score);

        // Hide the hider so we show the content
        hider.hide();

        // End the locker so the camera is shutdown
        locker.end();
    })
    })
})();
```


## Working on Smile To Unlock

To setup run:

```bash
npm install
npm start
```

To view the build, start an HTTP server inside of the `/www` directory.

To watch for file changes during develop, run:

```bash
npm run dev
```

To build the app for production, run:

```bash
npm run build
```