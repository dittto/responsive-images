responsiveImage.js
==================

This is a standalone js file that given a simple config, will handle responsive images and lazy-loading. Gzipped it's only 1.8KB!

Why is this useful?
-------------------

Responsive (or adaptive) design is very useful for catering to varying browser sizes, but quite often images are forgotten. This can lead to trying to load images design for a desktop on to a 320px-wide screen which is a large amount of extra data required for a picture that will appear so small.

This file, given the images are setup correctly in the first place, will only load the required size of the image for the screen size, saving bandwidth and time. It calculates this by taking a list of image sizes and looks for the largest possible size that's not too large.

The lazy-loading aspect of this js is a toggle in the options that will cause the images to only start to be loaded when then user has scrolled down to them, which is useful on image-heavy sites or a slow internet connection.

How do I use this?
------------------

Include the JS file just before the end of the body tag. This needs to be called after the page has loaded:

    <script src="responsiveImage.js"></script>


Now wrap your images in `<responsive-image>` tags with the class `responsive`. The responsive-image tag is one that isn't used by any browser, so allows us to create a custom tag for our needs - in this case storing hidden information about your images. It is recommended that you use css to make sure the tag is never show to the user. For further explanation of the responsive-image attributes, look below at the `<responsive-image> options` section.:

    <style>
        .responsive {
            display: none;
        }
    </style>

    ...

    <responsive-image class="responsive" data-src="images/testing-320.jpg" alt="A photo of Liberty against a blue sky" title="Liberty" data-class="image-class"></responsive-image>


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

Use noscript tags
-------------------

If you need to have your images available to users who don't use javascript, for instance if your analytics tell you that users are using your site but not using javascript, then you can do the following below. This is not enabled by default as the major browsers now auto-load images they find in noscript tags.

Set the `useNoScript` flag in the config:

    var config = {
        useNoScript: true,
        ...
    };

Next, wrap all of your images in the following manner. It is recommended that you specify your smallest-size of image in the noscript tag, so that the least amount of bandwidth is wasted, and that for mobile users with the smallest screens, no bandwidth is wasted.

    <noscript class="responsive">
        <img src="image-320.png" alt="A photo of Lady Justice against a blue sky" title="Lady Justice"/>
    </noscript>


Have multiple configs (namespacing)
-----------------------------------

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

Configuration
=============

The default config
------------------

The default config looks like:

    config: {
        className: "responsive",
        lazyDelay: 200,
        useNoScript: false,
        default: {
            sizes: [320, 480, 720, 100000],
            fileNames: {320: 320, 480: 480, 720: 720, 100000: 100000},
            imagePath: "^(.+\\-)(\\d+)(\\.[a-z]+)$",
            imagePathSizeField: 2,
            lazy: true,
            lazyPrePx: 200
        }
    }

The first 3 items listed are general configuration options. These apply to every image loaded using this method. The object inside the default config is the default namespace, this is so you can specify how different images should behave.

The general options are:

 - className - The name of the class used to detect a valid `<noscript>` or `<responsive-image>` tag. Alter this if you are retro-fitting an older site with responsive and lazy-loading images, find that a class called `responsive` already exists, and can't alter the other code.
 - lazyDelay - When lazy-loading is enabled this prevents too many calls at the same time, instead during this delay time (in milliseconds) any requests to lazy-load an image will be denied, with only a single request made at the end of the delay.
 - useNoScript - Allows you to use the `<noscript>` tag instead of the `<responsive-image>` tag. This is very useful for when there's a fair chance users aren't going to be running javascript.

The namespace options available are:

 - sizes - An array of different page width size boundaries, when there isn't space for the one boundary then the next size down is used. The highest size should be excessively high, at least 10000 or above, as this will guarantee an image is always used
 - fileNames - You can specify a map from the sizes used for creating an image to the filenames searched for. This is useful when working with older sites. An example of this can be found in demo.html.
 - imagePath - The format the path to the image will be when a size is added to it. The format is specified using a regex, with parentheses used to split the url into parts. One of these parts should only be the size, which will be replaced. By default it expects images in the format of `imageName-<size>.png`.
 - imagePathSizeField - The index of the `size` in the regex in `imagePath`. This number is 1-indexed.
 - lazy - Set this to true to lazy-load images so that they will only load when they are visible to the user.
 - lazyPrePx - This is the number of pixels the browser window can be above an image before it starts loading. This allows you to start loading images eariler than the user getting to them when scrolling. You can also give this a negative number to see the lazy-loading in action.


responsive-image options
--------------------------

If you choose to use the `<noscript>` tag, then all you need to do is place a normal `<img>` tag inside it with a `src`, `class`, `alt`, and `title`. These will then be used for the new image. If you are using the default `<responsive-image>` on the other hand, things are bit more complex. The following is a list of the available arguments.

 - alt - A normal alt tag to add to the image
 - class - This should be set to the same as is specified in `config.className`, which defaults to `responsive`.
 - data-class - The classes to be added to the new `img` tag created.
 - data-src - The src of one of the sizes of image. Which size doesn't matter as it's not used, only as a template for retrieving the other images.
 - title - A normal title tag to add to the image
