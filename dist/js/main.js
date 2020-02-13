$(function() {
  initScrollingBehaviour();
  initCanvas();

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
  var prevTime;
  var delta;
  const TwoPI = 2 * Math.PI;

  resizeCanvas();

  $(window).resize(resizeCanvas);

  var solarSystems = createSolarSystemsArray(1);

  //animateCanvas();

  function createSolarSystemsArray(numberOfSolarSystems) {
    var retSolarSystems = [];

    Debug.StartTimer('solarsystems-init-loop');

    if (numberOfSolarSystems > 0) {
      for (var i = 0; i < numberOfSolarSystems; i++) {
        var r = getRandomInt(50, 50); //10, 50
        var x = getRandomInt(
          r,
          $canvas.attr('width') - r - getScrollBarWidth()
        ); //r, $canvas.attr('width') - r - getScrollBarWidth()
        var y = getRandomInt(r, $canvas.attr('height') - r); //r, $canvas.attr('height') - r
        var hsl = [getRandomInt(0, 65), 100, getRandomInt(40, 90)]; //[getRandomInt(0, 65), 100, getRandomInt(40, 90)]
        var glow = getRandomInt(10, 10); //2, 10
        var planetDistance = 2 * r;

        retSolarSystems[i] = {
          x: x,
          y: y,
          r: r,
          hsl: hsl,
          glow: glow,
          planets: []
        };

        for (var j = 0; j < r / 5; j++) {
          var planetRadius = getRandomInt(10, 10); //2, r / 5

          planetDistance += planetRadius * (Math.random() + 1.5); //Math.random() + 1.5

          var a = Math.random() * 2 * Math.PI;

          retSolarSystems[i].planets[j] = {
            x: x + planetDistance * Math.cos(a),
            y: y + planetDistance * Math.sin(a),
            a: a,
            r: planetRadius,
            distance: planetDistance,
            msToCompleteOrbit: getRandomInt((j + 1) * 1000, (j + 2) * 1000), //(j + 1) * 1000, (j + 2) * 1000
            rgb: [
              getRandomInt(0, 255), //10, 50
              getRandomInt(0, 255), //10, 50
              getRandomInt(0, 255) //10, 50
            ]
          };

          planetDistance += planetRadius * (Math.random() + 1.5); //Math.random() + 1.5
        }
      }
    }
    Debug.StopTimer('solarsystems-init-loop');

    return retSolarSystems;
  }

  function animateCanvas(now) {
    Debug.StartTimer('animateCanvas');
    requestAnimationFrame(animateCanvas);
    ctx.clearRect(0, 0, $canvas.attr('width'), $canvas.attr('height'));

    delta = now - prevTime;
    prevTime = now;

    if (isNaN(delta)) return;

    solarSystems.forEach(function(solarSystem) {
      drawSolarSystem(solarSystem);
    });
    Debug.StopTimer('animateCanvas');
  }

  function drawSolarSystem(solarSystem) {
    Debug.StartTimer('drawSun');
    drawSun(
      solarSystem.x,
      solarSystem.y,
      solarSystem.r,
      solarSystem.hsl,
      solarSystem.glow
    );
    Debug.StopTimer('drawSun');

    Debug.StartTimer('drawPlanets');
    for (let i = 0; i < solarSystem.planets.length; i++) {
      var planet = solarSystem.planets[i];

      Debug.StartTimer('drawPlanet' + i);
      drawOrbit(solarSystem.x, solarSystem.y, planet.distance);
      drawPlanet(solarSystem.x, solarSystem.y, planet);
      Debug.StopTimer('drawPlanet' + i);
    }
    Debug.StopTimer('drawPlanets');
  }

  function drawSun(x, y, r, hsl, glow) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
    ctx.shadowBlur = r;
    ctx.shadowColor = 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
    ctx.fill();

    for (let j = 0; j < glow; j++) {
      ctx.shadowBlur = r * 10;
      ctx.fill();
    }
  }

  function drawPlanet(sunX, sunY, planet) {
    planet.a += (delta / planet.msToCompleteOrbit) * 2;
    if (planet.a >= TwoPI) planet.a -= TwoPI;

    ctx.beginPath();
    ctx.arc(
      sunX + planet.distance * Math.cos(planet.a),
      sunY + planet.distance * Math.sin(planet.a),
      planet.r,
      0,
      TwoPI
    );
    ctx.fillStyle =
      'rgb(' + planet.rgb[0] + ',' + planet.rgb[1] + ',' + planet.rgb[2] + ')';
    ctx.fill();
  }

  function drawOrbit(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TwoPI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.stroke();
  }
}

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
