/* Side-scrolling card rows: while you scroll down the page, each row of cards (.hwrap) holds
   still and slides sideways, on computers and phones alike. If a row already fits on screen
   it stays a normal row. Visitors who turn off motion get rows they can swipe instead. */
(function () {
  if (!document.documentElement.classList.contains('motion')) return;
  var rows = [].map.call(document.querySelectorAll('.hwrap'), function (w) {
    return { w: w, track: w.querySelector('.track'), bar: w.querySelector('.progress i'), dist: 0, on: false };
  });
  if (!rows.length) return;

  function setup() {
    rows.forEach(function (r) {
      r.w.classList.add('hscroll');           // measure with the side-scroll card sizes
      r.track.style.transform = '';
      r.dist = Math.max(0, r.track.scrollWidth - window.innerWidth);
      r.on = r.dist > 0;
      r.w.classList.toggle('hscroll', r.on);
      r.w.style.height = r.on ? (window.innerHeight + r.dist) + 'px' : '';
    });
    update();
  }
  function update() {
    rows.forEach(function (r) {
      if (!r.on) return;
      var p = Math.max(0, Math.min(1, -r.w.getBoundingClientRect().top / r.dist));
      r.track.style.transform = 'translate3d(' + (-p * r.dist) + 'px,0,0)';
      if (r.bar) r.bar.style.transform = 'scaleX(' + p + ')';
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  // phones resize a little whenever the address bar shows or hides; only re-measure when the width changes
  var lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth; setup();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup);
  setup();
})();
