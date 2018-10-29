function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    //Very ugly hack to get correct file
    if(window.location.href.indexOf("posts") > -1){
      xobj.open('GET', '../posts/test.json', true); 
    }
    else{
       xobj.open('GET', '/posts/test.json', true);
    }
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    var all_posts= actual_JSON['posts'];

    //Create 'post' section where articles are added
    var posts_div = document.createElement('div');
    posts_div.className = 'mini-posts';


    for (x =0 ; x <3 ; x++){
      current_post=all_posts[x]

      var article_div = document.createElement('article');
      var img = document.createElement('img');
      var aref = document.createElement('a');
      var text = document.createElement('p');


      /* Variable data*/
      text.innerHTML += current_post['Description'];
      img.src = current_post['Img-Link'];
      aref.href=current_post['Link'];

      /* Static part */
      aref.className='image';
      aref.appendChild(img);


      /* Arranging the data*/
      document.getElementById('sideposts').appendChild(posts_div);
      posts_div.appendChild(article_div);
      article_div.appendChild(aref)
      article_div.appendChild(text);
      }

      var ul = document.createElement('ul');
      var li = document.createElement('li');
      var a = document.createElement('a');

      a.href="index.html#projects";
      a.className="button";
      a.innerHTML +="More";
      ul.className='actions';

      li.appendChild(a);
      ul.appendChild(li);
      document.getElementById('sideposts').appendChild(ul);

      
});



/* Default functions*/
(function($) {

  var $window = $(window),
    $head = $('head'),
    $body = $('body');

  // Breakpoints.
    breakpoints({
      xlarge:   [ '1281px',  '1680px' ],
      large:    [ '981px',   '1280px' ],
      medium:   [ '737px',   '980px'  ],
      small:    [ '481px',   '736px'  ],
      xsmall:   [ '361px',   '480px'  ],
      xxsmall:  [ null,      '360px'  ],
      'xlarge-to-max':    '(min-width: 1681px)',
      'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
    });

  // Stops animations/transitions until the page has ...

    // ... loaded.
      $window.on('load', function() {
        window.setTimeout(function() {
          $body.removeClass('is-preload');
        }, 100);
      });

    // ... stopped resizing.
      var resizeTimeout;

      $window.on('resize', function() {

        // Mark as resizing.
          $body.addClass('is-resizing');

        // Unmark after delay.
          clearTimeout(resizeTimeout);

          resizeTimeout = setTimeout(function() {
            $body.removeClass('is-resizing');
          }, 100);

      });

  // Fixes.

    // Object fit images.
      if (!browser.canUse('object-fit')
      ||  browser.name == 'safari')
        $('.image.object').each(function() {

          var $this = $(this),
            $img = $this.children('img');

          // Hide original image.
            $img.css('opacity', '0');

          // Set background.
            $this
              .css('background-image', 'url("' + $img.attr('src') + '")')
              .css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
              .css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

        });

 
    //Sidebar
    var $sidebar = $('#sidebar'),
      $sidebar_inner = $sidebar.children('.inner');

    // Inactive by default on <= large.
      breakpoints.on('<=large', function() {
        $sidebar.addClass('inactive');
      });


    // Hack: Workaround for Chrome/Android scrollbar position bug.
      if (browser.os == 'android'
      &&  browser.name == 'chrome')
        $('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
          .appendTo($head);

    // Toggle.
      $('<a href="#sidebar" class="toggle">Toggle</a>')
        .appendTo($sidebar)
        .on('click', function(event) {

          // Prevent default.
            event.preventDefault();
            event.stopPropagation();

          // Toggle.
            $sidebar.toggleClass('inactive');

        });

    // Events.

      // Link clicks.
        $sidebar.on('click', 'a', function(event) {

          // >large? Bail.
            if (breakpoints.active('>large'))
              return;

          // Vars.
            var $a = $(this),
              href = $a.attr('href'),
              target = $a.attr('target');

          // Prevent default.
            event.preventDefault();
            event.stopPropagation();

          // Check URL.
            if (!href || href == '#' || href == '')
              return;

          // Hide sidebar.
            $sidebar.addClass('inactive');

          // Redirect to href.
            setTimeout(function() {

              if (target == '_blank')
                window.open(href);
              else
                window.location.href = href;

            }, 500);

        });

      // Prevent certain events inside the panel from bubbling.
        $sidebar.on('click touchend touchstart touchmove', function(event) {

          // >large? Bail.
            if (breakpoints.active('>large'))
              return;

          // Prevent propagation.
            event.stopPropagation();

        });

      // Hide panel on body click/tap.
        $body.on('click touchend', function(event) {

          // >large? Bail.
            if (breakpoints.active('>large'))
              return;

          // Deactivate.
            $sidebar.addClass('inactive');

        });

    // Scroll lock.
    // Note: If you do anything to change the height of the sidebar's content, be sure to
    // trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

      $window.on('load.sidebar-lock', function() {

        var sh, wh, st;

        // Reset scroll position to 0 if it's 1.
          if ($window.scrollTop() == 1)
            $window.scrollTop(0);

        $window
          .on('scroll.sidebar-lock', function() {

            var x, y;

            // <=large? Bail.
              if (breakpoints.active('<=large')) {

                $sidebar_inner
                  .data('locked', 0)
                  .css('position', '')
                  .css('top', '');

                return;

              }

            // Calculate positions.
              x = Math.max(sh - wh, 0);
              y = Math.max(0, $window.scrollTop() - x);

            // Lock/unlock.
              if ($sidebar_inner.data('locked') == 1) {

                if (y <= 0)
                  $sidebar_inner
                    .data('locked', 0)
                    .css('position', '')
                    .css('top', '');
                else
                  $sidebar_inner
                    .css('top', -1 * x);

              }
              else {

                if (y > 0)
                  $sidebar_inner
                    .data('locked', 1)
                    .css('position', 'fixed')
                    .css('top', -1 * x);

              }

          })
          .on('resize.sidebar-lock', function() {

            // Calculate heights.
              wh = $window.height();
              sh = $sidebar_inner.outerHeight() + 30;

            // Trigger scroll.
              $window.trigger('scroll.sidebar-lock');

          })
          .trigger('resize.sidebar-lock');

        });

  // Menu.
    var $menu = $('#menu'),
      $menu_openers = $menu.children('ul').find('.opener');

    // Openers.
      $menu_openers.each(function() {

        var $this = $(this);

        $this.on('click', function(event) {

          // Prevent default.
            event.preventDefault();

          // Toggle.
            $menu_openers.not($this).removeClass('active');
            $this.toggleClass('active');

          // Trigger resize (sidebar lock).
            $window.triggerHandler('resize.sidebar-lock');

        });

      });

})(jQuery);
