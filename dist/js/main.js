$(function() {
  initScrollingBehaviour();
  initCanvas();

  // var $canvas = $('#home-canvas');
  // var ctx = $canvas[0].getContext('2d');
  // var circles = [2];

  // for (var i = 0; i < 1; i++) {
  //   var x = getRandomInt(0, $canvas.attr('width'));
  //   var y = getRandomInt(0, $canvas.attr('height'));
  //   var r = getRandomInt(50, 200);
  //   var lineWidth = getRandomInt(2, 5);
  //   var a = Math.random() * 2 * Math.PI;

  //   circles[i] = { x: x, y: y, r: r };

  //   for (var j = lineWidth; j > 0; j--) {
  //     var trueRadius = r - (lineWidth - j) * getRandomInt(6, 20);
  //     var a = Math.random() * 2 * Math.PI;

  //     ctx.beginPath();
  //     ctx.arc(x, y, trueRadius, 0, 2 * Math.PI);
  //     ctx.strokeStyle = 'rgb(' + 45 + ', ' + 45 + ', ' + 45 + ')';
  //     ctx.lineWidth = j;
  //     ctx.stroke();

  //     ctx.beginPath();
  //     ctx.arc(x, y, trueRadius, a, a + 0.2);
  //     ctx.strokeStyle =
  //       'rgb(' +
  //       getRandomInt(128, 255) +
  //       ', ' +
  //       getRandomInt(128, 255) +
  //       ', ' +
  //       getRandomInt(128, 255) +
  //       ')';
  //     ctx.lineWidth = j;
  //     ctx.stroke();
  //   }
  // }

  // animateCanvas()

  // function animateCanvas() {
  //   requestAnimationFrame(animateCanvas);

  //   circles.forEach(function(circle) {
  //     console.log(circle);
  //   });
  // }

  // $('#home').mousemove(function(e) {
  //   var offset = $(this).offset();
  //   var mouseX = e.pageX - offset.left;
  //   var mouseY = e.pageY - offset.top;

  //   console.log({ x: mouseX, y: mouseY });
  // });
});

function initCanvas() {
  var $canvas = $('#home-canvas');
  var ctx = $canvas[0].getContext('2d');
  var circles = [];

  resizeCanvas();

  $(window).resize(resizeCanvas);
}

function resizeCanvas() {
  var canvas = $('#home-canvas')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initScrollingBehaviour() {
  var $window = $(window);
  var $sections = $('section');
  var $menuPoints = $('nav > a');

  var scrollPos = $window.scrollTop();
  var isScrolling = false;
  var currentSection = getCurrentSection();

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
        scrollTop: i == 0 ? 0 : $sections.eq(0).height() * i + $('nav').height()
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
