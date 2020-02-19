$(function() {
  initScrollingBehaviour();

  $('.header-icon').click(function() {
    $header = $('header');

    if ($header.hasClass('open')) {
      $header.removeClass('open');
    } else {
      $header.addClass('open');
    }
  });
});

function getScrollBarWidth() {
  var $outer = $('<div>')
      .css({ visibility: 'hidden', width: 100, overflow: 'scroll' })
      .appendTo('body'),
    widthWithScroll = $('<div>')
      .css({ width: '100%' })
      .appendTo($outer)
      .outerWidth();
  $outer.remove();
  return 100 - widthWithScroll;
}

function initScrollingBehaviour() {
  var $window = $(window);
  var $sections = $('section');
  var $menuPoints = $('nav > a');
  var $header = $('header');

  var scrollPos = $window.scrollTop();
  var isScrolling = false;
  var currentSection = getCurrentSection();

  scrollToSection(currentSection);
  animateSection(currentSection);

  $window.scroll(function() {
    if (!isScrolling) {
      if ($window.scrollTop() > scrollPos) {
        scrollToSection(currentSection + 1);
      } else if ($window.scrollTop() < scrollPos) {
        scrollToSection(currentSection - 1);
      }
    }
  });

  var resizeTimer;

  $window.resize(function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (!isScrolling) {
        currentSection = getCurrentSection();

        scrollToSection(currentSection);
      }
    }, 250);
  });

  $('#home > div > div > a.btn').click(function(e) {
    e.preventDefault();
    scrollToSection(1);
  });

  $menuPoints.click(function(e) {
    e.preventDefault();

    var $this = $(this);

    $menuPoints.each(function(i) {
      if ($(this).is($this)) {
        scrollToSection(i);

        if ($header.css('position') == 'fixed') {
          $header.removeClass('open');
        }
      }
    });
  });

  function animateSection(i) {
    var $section = $sections.eq(i);

    if (!$section.hasClass('in-view')) {
      $section.addClass('in-view');
    }
  }

  function scrollToSection(i) {
    isScrolling = true;
    disableScroll();

    $('html').animate(
      {
        scrollTop:
          i == 0
            ? 0
            : $sections.eq(0).height() * i +
              ($header.css('position') == 'fixed' ? 0 : $header.height())
      },
      500,
      'swing',
      function() {
        isScrolling = false;
        scrollPos = $window.scrollTop();
        enableScroll();
      }
    );

    currentSection = i;
    animateSection(i);
    setMenuPoint(currentSection);
  }

  function getCurrentSection() {
    var retSection;

    if ($sections) {
      $sections.each(function(i) {
        if (!$(this).visible()) {
          retSection = --i;
          setMenuPoint(i);
          return false;
        } else if ($(this).is($sections.last())) {
          retSection = i;
          setMenuPoint(i);
        }
      });

      return retSection;
    }
  }

  function setMenuPoint(i) {
    currentMP = $('nav > a.active');

    if (currentMP) {
      currentMP.removeClass('active');
    }

    $('nav > a:nth-of-type(' + ++i + ')').addClass('active');
  }
}

// left: 37, up: 38, right: 39, down: 40,
// space bar: 32, page up: 33, page down: 34, end: 35, home: 36
var keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function disableScroll() {
  if (window.addEventListener)
    // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  document.addEventListener('wheel', preventDefault, { passive: false }); // Disable scrolling in Chrome
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
  if (window.removeEventListener)
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
  document.removeEventListener('wheel', preventDefault, { passive: false }); // Enable scrolling in Chrome
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}
