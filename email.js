/* "Email me": instead of opening an email program straight away, the button opens a small window
   (on phones and computers alike). The visitor picks what the email is about, which fills in the
   subject and a "Hi Héctor," greeting, then chooses Gmail or Outlook, the device's own email app,
   or just copying the address for later. Ctrl/Cmd/Shift-click keeps the plain email link. */
(function () {
  if (!window.HTMLDialogElement) return;   // very old browsers: plain link

  /* What the email can be about: the button label and the subject it fills in ('' = no subject). */
  var TOPICS = [
    ['Work with you', 'I’d like to work with you'],
    ['Know more about you', 'I’d like to know more about you'],
    ['Something else', '']
  ];
  var GREETING = 'Hi Héctor,\n\n';

  var dlg, addrEl, copyBtn, appLink, gmail, outlook, topicBtns, addr = '', subject = TOPICS[0][1];

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'mail-pick';
    dlg.setAttribute('aria-labelledby', 'mailPickH');
    dlg.innerHTML =
      '<button class="mail-x" type="button" aria-label="Close">&times;</button>' +
      '<h2 id="mailPickH">Email me</h2>' +
      '<p class="mail-addr"></p>' +
      '<p class="mail-step" id="mailTopicH">What’s it about?</p>' +
      '<div class="mail-topics" role="group" aria-labelledby="mailTopicH">' +
        TOPICS.map(function (t, i) {
          return '<button type="button" class="mail-topic" aria-pressed="' + (i === 0) + '" data-i="' + i + '">' + t[0] + '</button>';
        }).join('') +
      '</div>' +
      '<div class="mail-opts">' +
        '<a class="btn primary" data-k="gmail" target="_blank" rel="noopener">Gmail</a>' +
        '<a class="btn ghost" data-k="outlook" target="_blank" rel="noopener">Outlook</a>' +
        '<a class="btn ghost" data-k="app">Email app</a>' +
        '<button class="btn ghost" type="button" data-k="copy">Copy address</button>' +
      '</div>' +
      '<p class="mail-note">Gmail and Outlook start a new message to me, in their app or your browser. Email app uses your device’s usual email app.</p>';
    document.body.appendChild(dlg);
    addrEl = dlg.querySelector('.mail-addr');
    gmail = dlg.querySelector('[data-k="gmail"]');
    outlook = dlg.querySelector('[data-k="outlook"]');
    appLink = dlg.querySelector('[data-k="app"]');
    copyBtn = dlg.querySelector('[data-k="copy"]');
    topicBtns = [].slice.call(dlg.querySelectorAll('.mail-topic'));

    topicBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        topicBtns.forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
        subject = TOPICS[+b.dataset.i][1];
        links();
      });
    });
    dlg.querySelector('.mail-x').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   // click outside the box
    [gmail, outlook, appLink].forEach(function (a) { a.addEventListener('click', function () { setTimeout(function () { dlg.close(); }, 0); }); });
    copyBtn.addEventListener('click', function () {
      function done(ok) {
        copyBtn.textContent = ok ? 'Copied!' : 'Select and copy above';
        setTimeout(function () { copyBtn.textContent = 'Copy address'; }, 2000);
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(addr).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  }

  /* Point the three buttons at a new message with the address, the chosen subject and the greeting. */
  function links() {
    var e = encodeURIComponent, to = e(addr), body = e(GREETING), su = subject ? e(subject) : '';
    gmail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + to + (su ? '&su=' + su : '') + '&body=' + body;
    outlook.href = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + to + (su ? '&subject=' + su : '') + '&body=' + body;
    appLink.href = 'mailto:' + addr + '?' + (su ? 'subject=' + su + '&' : '') + 'body=' + body;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a || a.closest('.mail-pick') || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    if (!dlg) build();
    addr = decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]);
    addrEl.textContent = addr;
    links();
    dlg.showModal();
  });
})();
