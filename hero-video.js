/* Hero background video: picks the phone or computer version, starts from the beginning when the red opening ends,
   and pauses while the hero is off screen. Visitors who turn off motion see a still of your marked page instead. */
(function () {
  var v = document.getElementById('heroVideo');
  if (!v) return;
  var name = window.matchMedia('(max-width: 760px)').matches ? 'hero-magazine-phone' : 'hero-magazine-desktop';
  if (!document.documentElement.classList.contains('motion')) { v.poster = name + '-still.jpg'; return; }
  v.poster = name + '-start.jpg';
  v.src = name + '.mp4';

  var held = document.body.classList.contains('loading'), onScreen = true;
  function sync() {
    if (!held && onScreen && !document.hidden) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    else v.pause();
  }
  if (held) {
    // the opening is over when the page drops its "loading" class; start with the name, which comes in 0.245 s later
    var mo = new MutationObserver(function () {
      if (document.body.classList.contains('loading')) return;
      mo.disconnect();
      setTimeout(function () { held = false; v.currentTime = 0; sync(); }, 245);
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; sync(); }).observe(v.closest('.stage'));
  }
  document.addEventListener('visibilitychange', sync);
  sync();
})();
