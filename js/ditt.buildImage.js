// create the namespace
if (typeof ditt == 'undefined') {
     ditt = {};
}

/**
* A container for the buildImage functions
*/
ditt.buildImage = {
     // sets a default largest size
     default_size: 20000,

     // create a store for the current window size
     current_width: document.documentElement.clientWidth,
     
     // a store for the scrollbar width
     scrollbar_width: 0,

     /**
     * Inits the class. Also calculates the scrollbar width
     */
     init: function () {
         ditt.buildImage.calcScrollWidth();
         
         // runs rebuild
         ditt.buildImage.resizeImage(true);
     },
     
     /**
      * Calculates the width of the scroll bar
      */
     calcScrollWidth: function () {
         // calculates the width of the scrollbar for this browser
         if (ditt.buildImage.scrollbar_width == 0) {
             // build a div to measure and force on scrollbars
             var div = document.createElement('div');
             div.style.width = '200px';
             div.style.overflow = 'scroll';
             document.body.appendChild(div);
             
             // if the 2 widths exist, take the difference as the scrollbar width
             // hack to get around webkit calculating the width wrongly
             if (div.offsetWidth && div.clientWidth && !RegExp(" AppleWebKit/").test(navigator.userAgent)) {
                 ditt.buildImage.scrollbar_width = div.offsetWidth - div.clientWidth;
             }
             div.parentNode.removeChild(div);
         }  
     },

     /**
     * Checks to see if the image has been resized. If it has, stores the
     * new width and tries to change the image
     */
     resizeImage: function (force) {
         // make sure force is inited
         force = force != null ? force : false;
         
         // recalc clientWidth
         var client_width = document.documentElement.clientWidth + ditt.buildImage.scrollbar_width;
         
         // if the window is the same width, don't do anything
         if (ditt.buildImage.current_width == client_width && !force) {
             return;
         }

         // store the new width
         ditt.buildImage.current_width = client_width;

         // see if the image needs changing
         ditt.buildImage.rebuild();
     },

     /**
     * Checks to see if the image needs to be changed, and changes it according to
     * the sizes available
     */
     rebuild: function () {
          // init vars
          var scripts, scripts_length, i, script, image_size, found_img, img;

          // get all the noscript scripts
          scripts = document.getElementsByTagName('noscript');
          scripts_length = scripts.length;

          // loop through all the noscript scripts
          for (i = 0; i < scripts_length; i ++) {
               // if this script tag has been inited, then don't bother changing
               script = scripts[i];
               if (!script.getAttribute('data-src')) {
                    continue;
               }

               // gets the image and size from the data-src.* attributes
               image_size = ditt.buildImage.getBoundary(script);

               // create a new id so the image can be tracked down again
               if (!script.getAttribute('image-id')) {
                    script.setAttribute('image-id', 'image_store_' + Math.floor(Math.random() * 10000000));
               }

               // check to see if the element exists and has the same size
               found_img = document.getElementById(script.getAttribute('image-id'));
               if (found_img) {
                    // if the image is the same size then ignore it
                    if (found_img.getAttribute('used-size') == image_size.size) {
                         continue;
                    } else {
                         found_img.parentNode.removeChild(found_img);
                    }
               }

               // build the image
               img = document.createElement('img');
               img.setAttribute('src', image_size.src);
               img.setAttribute('alt', script.getAttribute('alt'));
               img.setAttribute('title', script.getAttribute('title'));
               img.setAttribute('class', script.getAttribute('class'));
               img.setAttribute('id', script.getAttribute('image-id'));
               img.setAttribute('used-size', image_size.size);

               // add the image to before the noscript tag
               script.parentNode.insertBefore(img, script);
          }
     },

     /**
     * Find the width and path of the image to use from the noscript attributes.
     * These are then compared against the current page width to see which boundary
     * the image falls in to. Like "The Price is Right", the boundary is chosen by
     * the closest without being too large, for instance if the width is 800 and there
     * are 2 boundaries of 700 and 810, then it will choose 700.
     *
     * @param node The noscript element to extract the data-src.* attributes from
     * @return object An object containing the size of the boundary, and the src
     * of the related path.
     */
     getBoundary: function (node) {
          // init vars
          var i, attr, attr_name, closest_size, size, paths = {};

          // loop through all attributes for this node
          for (i = 0; i < node.attributes.length; i ++) {
               // get the attribute
               attr = node.attributes.item(i);

               // only choose attributes that are data-src or data-src-.*
               if (attr.specified && attr.nodeName.indexOf('data-src') != -1) {
                    attr_name = attr.nodeName.replace(/^data-src(-?)/g, '');
                    attr_name = attr_name ? attr_name : ditt.buildImage.default_size;
                    paths[String(attr_name)] = attr.nodeValue;
               }
          }

          // get the closest size specified without going over
          closest_size = ditt.buildImage.default_size;
          for (size in paths) {
              
               size = parseInt(size);
               if (ditt.buildImage.current_width <= size && closest_size >= size) {
                    closest_size = size;
               }
          }
          
          // alert(closest_size);

          return {size: closest_size, src: paths[closest_size]};
     }
};
