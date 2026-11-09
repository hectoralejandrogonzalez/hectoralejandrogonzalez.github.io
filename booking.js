/* Book a call: opens Calendly in a pop-up on the site instead of a new tab, and sends the
   visitor to the thank-you page once the call is booked. If Calendly's script does not load,
   the buttons keep working as plain links that open Calendly in a new tab. */
(function () {
  var CAL = 'https://calendly.com/h-alejandro-gonzalez00/30min';

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://assets.calendly.com/assets/external/widget.css';
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = 'https://assets.calendly.com/assets/external/widget.js';
  js.async = true;
  document.head.appendChild(js);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="' + CAL + '"]');
    if (!a || !window.Calendly || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: CAL });
  });

  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com' || !e.data || e.data.event !== 'calendly.event_scheduled') return;
    location.href = 'thank-you.html';
  });
})();
