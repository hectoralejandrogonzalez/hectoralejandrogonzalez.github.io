/* Stacking cards (from the effect isolated in variant B, effects/stacking-cards/).
   As you scroll down, each card sticks near the top and the next one slides over it; the card
   underneath shrinks a little and darkens. Scrolling up undoes it. Handles every .stack-list.
   With "reduce motion" on, cards still stack (that is just sticking) but nothing shrinks or dims. */
(function () {
  /* defaults: how much the covered card shrinks (0.06 = 6%) and darkens (0.45 = 45%) */
  var SHRINK = 0.06, DIM = 0.45;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lists = [].map.call(document.querySelectorAll('.stack-list'), function (list) {
    return {
      cards: [].filter.call(list.children, function (c) { return c.classList.contains('stack-card'); }),
      shrink: parseFloat(list.dataset.shrink || SHRINK),
      dim: parseFloat(list.dataset.dim || DIM)
    };
  });
  if (!lists.length) return;
  var ticking = false;

  function update() {
    ticking = false;
    lists.forEach(function (l) {
      l.cards.forEach(function (card, i) {
        var inner = card.firstElementChild, next = l.cards[i + 1];
        if (!next || reduce.matches) { inner.style.transform = ''; inner.style.filter = ''; return; }
        /* how much of this card the next one covers: 0 = none, 1 = fully */
        var h = inner.offsetHeight;
        var covered = Math.min(Math.max((card.getBoundingClientRect().top + h - next.getBoundingClientRect().top) / h, 0), 1);
        inner.style.transform = covered ? 'scale(' + (1 - covered * l.shrink) + ')' : '';
        inner.style.filter = covered ? 'brightness(' + (1 - covered * l.dim) + ')' : '';
      });
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  if (reduce.addEventListener) reduce.addEventListener('change', update);
  update();
})();
