  // Signature moment: the porch light switches on shortly after load (immediately with reduced motion).
  (function () {
    var hero = document.getElementById('hero');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero) setTimeout(function () { hero.classList.add('lit'); }, reduce ? 0 : 1100);
  })();
  // Menu: dropdowns open on hover (CSS); the caret button toggles them for touch and keyboard; below 1200px the menu slides in as a panel.
  (function () {
    var nav = document.getElementById('menu'), head = document.querySelector('header.nav'), btn = document.getElementById('menuBtn'), close = nav.querySelector('.menu-close');
    var subs = [].slice.call(nav.querySelectorAll('.has-sub'));
    function setSub(li, open) { li.classList.toggle('open', open); li.querySelector('.subtog').setAttribute('aria-expanded', open); }
    subs.forEach(function (li) {
      li.querySelector('.subtog').addEventListener('click', function () { var o = !li.classList.contains('open'); subs.forEach(function (x) { if (x !== li) setSub(x, false); }); setSub(li, o); });
      li.addEventListener('focusout', function (e) { if (!nav.classList.contains('on') && !li.contains(e.relatedTarget)) setSub(li, false); });
    });
    function setMenu(open) { nav.classList.toggle('on', open); head.classList.toggle('menu-open', open); btn.setAttribute('aria-expanded', open); (open ? close : btn).focus(); }
    btn.addEventListener('click', function () { setMenu(true); });
    close.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (nav.classList.contains('on')) { setMenu(false); return; }
      subs.forEach(function (x) { if (x.classList.contains('open')) { setSub(x, false); x.querySelector('.subtog').focus(); } });
    });
    document.addEventListener('click', function (e) {
      if (nav.contains(e.target)) return;
      subs.forEach(function (x) { setSub(x, false); });
      if (nav.classList.contains('on') && !btn.contains(e.target)) setMenu(false);
    });
  })();

  // Doors: hover opens (CSS); click/tap toggles; Escape closes. aria-expanded tracks the open state.
  (function () {
    var ways = [].slice.call(document.querySelectorAll('.doorway'));
    function sync(w) { var open = w.classList.contains('open') || w.matches(':hover') || w.matches(':focus-within'); w.querySelector('.d-hint').setAttribute('aria-expanded', open); }
    ways.forEach(function (w) {
      var d = w.querySelector('.door');
      d.addEventListener('click', function () { var was = w.classList.contains('open'); ways.forEach(function (o) { o.classList.remove('open'); sync(o); }); if (!was) w.classList.add('open'); sync(w); });
      ['mouseenter', 'mouseleave', 'focusin', 'focusout'].forEach(function (ev) { w.addEventListener(ev, function () { setTimeout(function () { sync(w); }, 0); }); });
      w.addEventListener('keydown', function (e) { if (e.key === 'Escape') { w.classList.remove('open'); w.querySelector('.d-hint').focus(); sync(w); } });
    });
  })();

  // Process: the active step follows scroll (and hover/click/focus); the photo and progress bar follow it.
  (function () {
    var steps = [].slice.call(document.querySelectorAll('.step'));
    var imgs = [].slice.call(document.querySelectorAll('.frame img'));
    var count = document.getElementById('count'), bar = document.getElementById('bar'), list = document.getElementById('slist');
    if (!list || !steps.length) return;
    var cur = 0, pinned = false;
    function set(i) {
      if (i === cur && steps[i].classList.contains('on')) return;
      cur = i;
      steps.forEach(function (s, j) { s.classList.toggle('on', j === i); });
      imgs.forEach(function (im, j) { im.classList.toggle('on', j === i); });
      count.textContent = 'Step ' + (i + 1) + ' of 4';
      var a = steps[0].offsetTop + 25, b = steps[i].offsetTop + 25;
      bar.style.height = (b - a) + 'px';
    }
    steps.forEach(function (s, i) {
      s.addEventListener('mouseenter', function () { pinned = true; set(i); });
      s.addEventListener('click', function () { pinned = true; set(i); });
      s.addEventListener('focus', function () { pinned = true; set(i); });
    });
    list.addEventListener('mouseleave', function () { pinned = false; });
    function onScroll() {
      if (pinned) return;
      var mid = innerHeight * 0.55, best = 0;
      steps.forEach(function (s, i) { if (s.getBoundingClientRect().top < mid) best = i; });
      set(best);
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { var i = cur; cur = -1; set(i); });
    set(0); onScroll();
  })();
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .15 });
    els.forEach(function (e) { io.observe(e); });
  })();
  // Chat (prototype stand-in for the live GoHighLevel chat) and back to top.
  (function () {
    var launch = document.getElementById('chatLaunch'), panel = document.getElementById('chatPanel'), greet = document.getElementById('greet'), up = document.getElementById('toTop');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function seen() { try { return sessionStorage.getItem('tkGreet') === '1'; } catch (e) { return false; } }
    function remember() { try { sessionStorage.setItem('tkGreet', '1'); } catch (e) {} }
    function hideGreet() { greet.classList.remove('on'); remember(); }
    function setChat(open) {
      panel.hidden = !open; launch.setAttribute('aria-expanded', open); document.body.classList.toggle('chat-open', open);
      if (open) { hideGreet(); panel.querySelector('input').focus(); }
    }
    launch.addEventListener('click', function () { setChat(panel.hidden); });
    panel.querySelector('.chat-x').addEventListener('click', function () { setChat(false); launch.focus(); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setChat(false); launch.focus(); } });
    greet.querySelector('.greet-open').addEventListener('click', function () { setChat(true); });
    greet.querySelector('.greet-x').addEventListener('click', hideGreet);
    if (!seen()) setTimeout(function () { if (panel.hidden) greet.classList.add('on'); }, 4000);
    var bar = document.querySelector('.callbar');
    function fitBar() { document.documentElement.style.setProperty('--cb', (getComputedStyle(bar).display !== 'none' ? bar.offsetHeight : 0) + 'px'); }
    fitBar(); addEventListener('resize', fitBar);
    function onScroll() { up.classList.toggle('on', window.scrollY > 700); }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); document.querySelector('.brand').focus({ preventScroll: true }); });
  })();

  // Free estimate pop-up: the menu and hero buttons open it; the close button, Escape or a click outside closes it.
  (function () {
    var dlg = document.getElementById('estimate');
    [].slice.call(document.querySelectorAll('[data-estimate]')).forEach(function (b) {
      b.addEventListener('click', function () { if (typeof dlg.showModal === 'function') dlg.showModal(); else location.hash = 'contact'; });
    });
    dlg.querySelector('.est-x').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  })();
  [].slice.call(document.querySelectorAll('form.lead')).forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.querySelector('.sent').classList.add('on');
    });
  });
