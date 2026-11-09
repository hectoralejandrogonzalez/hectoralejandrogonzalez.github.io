/* Keeps the hover glow working while the page scrolls.
   Browsers only update :hover when the mouse moves, so while you scroll (and the card rows slide
   under a still pointer) the card under the pointer would not light up. This checks what is under
   the pointer on every scroll frame and marks it with .is-hover, which the styles treat like hover. */
(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;   // phones and tablets: nothing to do
  var x = -1, y = -1, current = {}, ticking = false;

  function mark(key, el) {
    if (current[key] === el) return;
    if (current[key]) current[key].classList.remove('is-hover');
    current[key] = el;
    if (el) el.classList.add('is-hover');
  }
  function update() {
    ticking = false;
    var el = x < 0 ? null : document.elementFromPoint(x, y);
    mark('card', el && el.closest('.card, .stack-card__inner'));
    mark('section', el && el.closest('main > section'));
    mark('lead', el && el.closest('.hero-mid .lead'));
  }
  function soon() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; soon(); }, { passive: true });
  window.addEventListener('scroll', soon, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { x = -1; soon(); });
})();
