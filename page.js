/* Shared behaviour for the detail pages (Values, Built by Me, Experience):
   top bar, full-screen menu and fade-in on scroll. The home page has its own script. */
(function () {
  var root = document.documentElement;
  var motion = root.classList.contains('motion');

  /* Top bar: background once scrolled, hides when scrolling down, comes back when scrolling up. */
  var bar = document.getElementById('bar'), lastY = 0;
  function onBar() {
    var y = window.scrollY;
    bar.classList.toggle('scrolled', y > 20);
    bar.classList.toggle('hide', motion && y > 300 && y > lastY && !root.classList.contains('menu-open'));
    lastY = y;
  }
  window.addEventListener('scroll', onBar, { passive: true });
  onBar();

  /* Menu */
  var btn = document.getElementById('menuBtn');
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
  [].forEach.call(document.querySelectorAll('.menu a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Every page opens at its top when you click through to it, never where you left it last time
     (unless the link points to a part of the page). */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  if (nav && nav.type === 'reload' && location.hash) history.replaceState(null, '', location.pathname + location.search);
  function toTop() { if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' }); }
  toTop();
  window.addEventListener('pageshow', function (e) { if (e.persisted) toTop(); });

  /* Fade-in on scroll */
  var items = document.querySelectorAll('.reveal');
  if (motion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    [].forEach.call(items, function (el) { io.observe(el); });
  } else {
    [].forEach.call(items, function (el) { el.classList.add('in'); });
  }
})();
