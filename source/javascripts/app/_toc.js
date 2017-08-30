//= require ../lib/_jquery
//= require ../lib/_jquery_ui
//= require ../lib/_jquery.tocify
//= require ../lib/_imagesloaded.min
(function (global) {
  'use strict';

  var closeToc = function() {
    $(".tocify-wrapper").removeClass('open');
    $("#nav-button").removeClass('open');
  };

  var hashGeneratorIndex = [1, 1, 1];
  var lastHashGeneratorLevel = 0;

  var makeToc = function() {
    global.toc = $("#toc").tocify({
      selectors: 'h1, h2, h3',
      extendPage: false,
      theme: 'none',
      smoothScroll: false,
      showEffectSpeed: 0,
      hideEffectSpeed: 180,
      ignoreSelector: '.toc-ignore',
      highlightOffset: 60,
      scrollTo: -1,
      scrollHistory: true,
      hashGenerator: function (text, element) {
        var level = element.prop('nodeName').substr(1,1);

        if (lastHashGeneratorLevel < level) {
          hashGeneratorIndex[level - 1] = 1;
        }
        else
          hashGeneratorIndex[level - 1] += 1;

        var headingNumber = "";
        for (var i = 0; i < level; ++i) {
          headingNumber = headingNumber.concat(hashGeneratorIndex[i]).concat(".");
        }

        element.prop('innerHTML', headingNumber.concat(" ").concat(text));

        lastHashGeneratorLevel = level;

        element.prop('id', element.prop('id').concat(headingNumber));

        return element.prop('id');
      }
    }).data('toc-tocify');

    $("#nav-button").click(function() {
      $(".tocify-wrapper").toggleClass('open');
      $("#nav-button").toggleClass('open');
      return false;
    });

    $(".page-wrapper").click(closeToc);
    $(".tocify-item").click(closeToc);
  };

  // Hack to make already open sections to start opened,
  // instead of displaying an ugly animation
  function animate() {
    setTimeout(function() {
      toc.setOption('showEffectSpeed', 180);
    }, 50);
  }

  $(function() {
    makeToc();
    animate();
    setupLanguages($('body').data('languages'));
    $('.content').imagesLoaded( function() {
      global.toc.calculateHeights();
    });
  });
})(window);

