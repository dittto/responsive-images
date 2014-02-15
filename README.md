responsiveImage.js
==================

This is a standalone js file that given a simple config, will handle responsive images and lazy-loading.

Why is this useful?
-------------------

Responsive (or adaptive) design is very useful for catering to varying browser sizes, but quite often images are forgotten. This can lead to trying to load images design for a desktop on to a 320px-wide screen which is a large amount of extra data required for a picture that will appear so small.

This file, given the images are setup correctly in the first place, will only load the required size of the image for the screen size, saving bandwidth and time. It calculates this by taking a list of image sizes and looks for the largest possible size that's not too large.

The lazy-loading aspect of this js is a toggle in the options that will cause the images to only start to be loaded when then user has scrolled down to them, which is useful on image-heavy sites or a slow internet connection.

How do I use this?
------------------

Include the JS file just before the end of the body tag. This needs to be called after the page has loaded:

    <script src="responsiveImage.js"></script>


Now wrap your images in `<noscript>` tags with the class `responsive`. The noscript tag serves a dual-purpose so that if a user visits your site with JavaScript turned off the site will still work with images, and to stop the browser from loading an image that is the wrong size for the user's browser. It is probably best to set your image to the smallest size, so that if someone does view your site without javascript then the site will still work.

    <noscript class="responsive">
        <img src="image-320.png" alt="A photo of Lady Justice against a blue sky" title="Lady Justice"/>
    </noscript>


You will need to set up a config for your site and then call `responsiveImage.Init(config)`. This should be called in the foot of the page. If you don't want to alter the config, then just call the code using `responsiveImage.Init({});` A config looks like:

    var config = {
        default: {
            sizes: [960, 720, 480, 320],
            lazy: false
        }
    };
    responsiveImages.Init(config);


Finally, you need to make sure your images exist. This method uses images of different sizes and these will need to be either pre-generated, or be automatically generated. Note that these sizes are the page width, not the image width.

Additional features
===================

Have multiple configs
---------------------

You may have noticed that config options are namespaced above into `default`. This is because you can have other namespaces, allowing you to have some images that have different sizes, or don't lazy-load. You can do this by:

    var config = {
        default: {
            sizes: [960, 720, 480, 320]
        },
        always: {
            sizes: [320, 160]
            lazy: false
        }
    };

You can then set a class on your noscript that matches the namespace in the config:

    <noscript class="responsive">
        <img src="image.png" alt="A photo of Liberty against a blue sky" title="Liberty"/>
    </noscript>

    ...

    <noscript class="responsive responsive-always">
        <img src="sidebar.png" alt="An advert for awesome goods" title="Buy our stuff!"/>
    </noscript>

Default configuration
=====================

The default config looks like:

    config: {
        default: {
            sizes: [960, 720, 480, 320],
            lazy: true,
            lazyPrePx: 300,
            imagePath: "[name]-[size].[ext]"
        }
    }

The first object inside config is the default namespace, this is so you can specify how different images should behave.

The options available are:

 - sizes - An array of different page width size boundaries, when there isn't space for the one boundary then the next size down is used
 - lazy - Set this to true to lazy-load images, so that they will only load when they are visible
 - lazyPrePx - This is the number of pixels a user can be above an image before it starts loading. This allows you to start loading images eariler than the user getting to them when scrolling.
 - imagePath - The format the path to the image will be when a size is added to it. By default it expects images in the format of `imageName-960.png`.