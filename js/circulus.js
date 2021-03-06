var TweenLite = TweenLite || null;
var TweenMax = TweenMax || null;

(function(TweenLite, TweenMax) {
  if (!TweenMax || !TweenLite) { return; }

  function circulusInit() {
    var svg = document.getElementById('menu'),
    items = svg.querySelectorAll('.item'),
    trigger = svg.getElementById('trigger'),
    open = false;

    //first scale the elements down
    TweenLite.set(items, {
      scale: 0,
      visibility: "visible"
    });
    svg.style.pointerEvents = "none";

    //set up event handler
    trigger.addEventListener('click', toggleMenu, false);

    //toggle menu when trigger is clicked
    function toggleMenu(event) {
      if (!event) var event = window.event;
      event.stopPropagation();
      open = !open;
      if (open) {
        TweenMax.staggerTo(items, 0.7, {
          scale: 1,
          ease: Elastic.easeOut
        }, 0.05);
        svg.style.pointerEvents = "auto";
      } else {
        TweenMax.staggerTo(items, .3, {
          scale: 0,
          ease: Back.easeIn
        }, 0.05);
        svg.style.pointerEvents = "none";
      }
    }

    svg.onclick = function(e) {
      e.stopPropagation();
    }

    //close the nav when document is clicked
    document.onclick = function() {
      open = false;
      TweenMax.staggerTo(items, .3, {
        scale: 0,
        ease: Back.easeIn
      }, 0.05);
      svg.style.pointerEvents = "none";
    };
  };

  window.document.addEventListener('svgload', circulusInit);
})(TweenLite, TweenMax);
