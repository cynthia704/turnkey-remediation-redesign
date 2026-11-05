  // Signature moment: the porch light switches on shortly after load (immediately with reduced motion).
  (function () {
    var hero = document.getElementById('hero');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero) setTimeout(function () { hero.classList.add('lit'); }, reduce ? 0 : 1100);
  })();
  // Sticky header: after scrolling past the top of the page the header pins to the top as a solid bar.
  (function () {
    var head = document.querySelector('header.nav');
    if (!head) return;
    function onScroll() { head.classList.toggle('stuck', window.scrollY > 160); }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
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

  // Fire page: the photo pins and the list beside them light up together; the checklist counts what's ticked.
  (function () {
    var pins = [].slice.call(document.querySelectorAll('.pin')), items = [].slice.call(document.querySelectorAll('.lo-item'));
    if (pins.length) {
      var set = function (i) {
        pins.forEach(function (p, j) { p.classList.toggle('on', j === i); p.setAttribute('aria-pressed', j === i); });
        items.forEach(function (it, j) { it.classList.toggle('on', j === i); });
      };
      pins.forEach(function (p, i) { ['mouseenter', 'focus', 'click'].forEach(function (ev) { p.addEventListener(ev, function () { set(i); }); }); });
      items.forEach(function (it, i) { ['mouseenter', 'click'].forEach(function (ev) { it.addEventListener(ev, function () { set(i); }); }); });
      set(0);
    }
    var checks = [].slice.call(document.querySelectorAll('.fs-check')), fill = document.getElementById('fsFill'), count = document.getElementById('fsCount');
    if (checks.length && fill && count) {
      var upd = function () {
        var n = checks.filter(function (c) { return c.checked; }).length;
        fill.style.width = (n / checks.length * 100) + '%';
        count.textContent = n === checks.length ? 'All 4 done. Now call us.' : n + ' of ' + checks.length + ' done';
      };
      checks.forEach(function (c) { c.addEventListener('change', upd); }); upd();
    }
  })();

  // Fire page: the restoration track fills as you scroll through it and lights each step it reaches (all lit at once with reduced motion).
  (function () {
    var rs = document.getElementById('rs');
    if (!rs) return;
    var steps = [].slice.call(rs.querySelectorAll('.rs-step'));
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var track = rs.querySelector('.rs-track'), dots = [].slice.call(rs.querySelectorAll('.rs-dot'));
    function upd() {
      var r = rs.getBoundingClientRect(), vh = window.innerHeight;
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      // on phones the line runs down the left: stop it at the last circle's center, not the bottom of the last step's text
      var last = dots[dots.length - 1].getBoundingClientRect();
      rs.style.setProperty('--tail', Math.max(0, r.bottom - (last.top + last.height / 2)) + 'px');
      rs.style.setProperty('--p', p.toFixed(3));
      // a step lights when the line's leading edge reaches its circle (works for the row and the column layout)
      var t = track.getBoundingClientRect(), vertical = t.height > t.width;
      var edge = vertical ? t.top + p * t.height : t.left + p * t.width;
      dots.forEach(function (d, i) {
        var b = d.getBoundingClientRect(), c = vertical ? b.top + b.height / 2 : b.left + b.width / 2;
        steps[i].classList.toggle('lit', edge >= c - 2);
      });
    }
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  })();

  // Water page: "What's Leaking?" tabs (arrow keys move between them) and the moisture meter steps.
  (function () {
    var tabs = [].slice.call(document.querySelectorAll('.wl-tab'));
    if (tabs.length) {
      var pick = function (i, focus) {
        tabs.forEach(function (t, j) {
          var on = j === i;
          t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
          document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
        if (focus) tabs[i].focus();
      };
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { pick(i); });
        t.addEventListener('keydown', function (e) {
          var n = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
          if (n) { e.preventDefault(); pick((i + n + tabs.length) % tabs.length, true); }
          if (e.key === 'Home') { e.preventDefault(); pick(0, true); }
          if (e.key === 'End') { e.preventDefault(); pick(tabs.length - 1, true); }
        });
      });
    }
    var steps = [].slice.call(document.querySelectorAll('.ms-step')), needle = document.querySelector('.needle'), read = document.getElementById('msRead');
    if (steps.length && needle && read) {
      var go = function (i) {
        steps.forEach(function (s, j) { s.classList.toggle('on', j === i); s.setAttribute('aria-pressed', j === i); });
        needle.style.setProperty('--angle', steps[i].getAttribute('data-angle') + 'deg');
        read.textContent = steps[i].getAttribute('data-read');
      };
      steps.forEach(function (s, i) { s.addEventListener('click', function () { go(i); }); });
      go(0);
    }
  })();

  // Mold page: click a part of the house to see why moisture collects there.
  (function () {
    var rooms = [].slice.call(document.querySelectorAll('.hm-room')), panels = [].slice.call(document.querySelectorAll('.hm-panel'));
    if (!rooms.length) return;
    rooms.forEach(function (r) {
      r.addEventListener('click', function () {
        var n = +r.getAttribute('data-room');
        rooms.forEach(function (x) { x.setAttribute('aria-pressed', +x.getAttribute('data-room') === n); });
        panels.forEach(function (p, i) { p.hidden = i !== n; });
      });
    });
  })();

  // Service Areas: region buttons light up that region's towns on the map; on phones the map starts centered near New Orleans.
  (function () {
    var map = document.querySelector('.sa-map'), chips = [].slice.call(document.querySelectorAll('.sa-chip'));
    if (!map) return;
    var pins = [].slice.call(map.querySelectorAll('.sa-pin'));
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var was = c.getAttribute('aria-pressed') === 'true', r = c.getAttribute('data-region');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c && !was); });
        if (was) map.removeAttribute('data-region'); else map.setAttribute('data-region', r);
        pins.forEach(function (p) { p.classList.toggle('hit', !was && p.getAttribute('data-region') === r); });
      });
    });
    var sc = document.getElementById('saScroll');
    if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) * 0.62;
  })();

  // About: the key turns and the door opens on load, on hover and from the button.
  (function () {
    var stage = document.getElementById('abStage'), btn = document.getElementById('abTurn');
    if (!stage || !btn) return;
    function set(open) {
      stage.classList.toggle('open', open);
      btn.setAttribute('aria-pressed', open ? 'true' : 'false');
      btn.textContent = open ? 'Close the Door' : 'Turn the Key';
    }
    btn.addEventListener('click', function () { set(!stage.classList.contains('open')); });
    if (window.matchMedia('(hover: hover)').matches) {
      stage.addEventListener('mouseenter', function () { set(true); });
      stage.addEventListener('mouseleave', function () { set(false); });
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) set(true);
    else setTimeout(function () { set(true); }, 1200);
  })();

  // Testimonials: turn the guest book pages; chips filter the reviews by job.
  (function () {
    var leaves = [].slice.call(document.querySelectorAll('.ts-leaf')), num = document.getElementById('tsNum'), at = 0;
    if (leaves.length && num) {
      var go = function (d) {
        leaves[at].classList.remove('on');
        at = (at + d + leaves.length) % leaves.length;
        leaves[at].classList.add('on');
        num.textContent = (at + 1) + ' of ' + leaves.length;
      };
      document.getElementById('tsPrev').addEventListener('click', function () { go(-1); });
      document.getElementById('tsNext').addEventListener('click', function () { go(1); });
    }
    var chips = [].slice.call(document.querySelectorAll('.ts-chip[data-kind]')), cards = [].slice.call(document.querySelectorAll('.ts-card')), count = document.getElementById('tsCount');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var k = c.getAttribute('data-kind'), n = 0;
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        cards.forEach(function (d) {
          var show = k === 'all' || d.getAttribute('data-kind') === k;
          d.hidden = !show;
          if (show) { n++; d.classList.add('in'); }
        });
        if (count) count.textContent = n + (n === 1 ? ' review' : ' reviews') + ' shown';
      });
    });
  })();

  // FAQs: search and topic buttons filter the questions; the popular links open their answer.
  (function () {
    var box = document.getElementById('fqSearch');
    if (!box) return;
    var groups = [].slice.call(document.querySelectorAll('.fq-group')), chips = [].slice.call(document.querySelectorAll('.fq-chip')), count = document.getElementById('fqCount'), none = document.getElementById('fqNone'), cat = 'all';
    function apply() {
      var words = box.value.toLowerCase().split(/\s+/).filter(Boolean), total = 0;
      groups.forEach(function (g) {
        var shown = 0;
        [].forEach.call(g.querySelectorAll('details'), function (d) {
          var text = d.textContent.toLowerCase();
          var show = (cat === 'all' || g.getAttribute('data-cat') === cat) && words.every(function (w) { return text.indexOf(w) !== -1; });
          d.hidden = !show;
          if (show) shown++;
        });
        g.hidden = !shown;
        total += shown;
      });
      none.hidden = total > 0;
      count.textContent = total + (total === 1 ? ' question' : ' questions');
    }
    box.addEventListener('input', apply);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        cat = c.getAttribute('data-cat');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        apply();
      });
    });
    [].forEach.call(document.querySelectorAll('[data-open]'), function (a) {
      a.addEventListener('click', function () {
        box.value = ''; cat = 'all';
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
        apply();
        var d = document.getElementById(a.getAttribute('href').slice(1));
        if (d) d.open = true;
      });
    });
  })();

  // Gallery: pause the reel, filter the wall, and page through photos in a larger view.
  (function () {
    var box = document.getElementById('glBox');
    if (!box) return;
    var pause = document.getElementById('glPause'), chips = [].slice.call(document.querySelectorAll('.gl-chip')), items = [].slice.call(document.querySelectorAll('.gl-item')), count = document.getElementById('glCount');
    var img = document.getElementById('glImg'), title = document.getElementById('glBoxTitle'), num = document.getElementById('glNum'), go = document.getElementById('glGo'), at = 0;
    pause.addEventListener('click', function () {
      var on = pause.parentNode.classList.toggle('paused');
      pause.setAttribute('aria-pressed', on ? 'true' : 'false');
      pause.textContent = on ? 'Play the Reel' : 'Pause the Reel';
    });
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var k = c.getAttribute('data-kind'), n = 0;
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        items.forEach(function (d) {
          var show = k === 'all' || d.getAttribute('data-kind') === k;
          d.hidden = !show;
          if (show) n++;
        });
        document.querySelector('.gl-wall').classList.toggle('gl-some', k !== 'all');
        count.textContent = n + (n === 1 ? ' photo' : ' photos') + ' shown';
      });
    });
    function shown() { return items.filter(function (d) { return !d.hidden; }); }
    function show(d) {
      var list = shown(), t = d.querySelector('figcaption').textContent;
      at = list.indexOf(d);
      img.src = d.getAttribute('data-full');
      img.alt = t;
      title.textContent = t;
      num.textContent = (at + 1) + ' of ' + list.length;
      go.href = d.getAttribute('data-link');
      go.textContent = d.getAttribute('data-label');
    }
    function step(n) { var list = shown(); show(list[(at + n + list.length) % list.length]); }
    items.forEach(function (d) {
      d.querySelector('.gl-open').addEventListener('click', function () { show(d); box.showModal(); });
    });
    document.getElementById('glPrev').addEventListener('click', function () { step(-1); });
    document.getElementById('glNext').addEventListener('click', function () { step(1); });
    document.getElementById('glX').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  })();

  // Contact: New Orleans clock beside the sign; the chooser shows a first step and sets the form's service.
  (function () {
    var clock = document.getElementById('cnClock');
    if (clock && window.Intl) {
      var zone = 'America/Chicago', fmtT = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit' }), fmtD = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'long' });
      var tick = function () { var now = new Date(); clock.textContent = 'It\u2019s ' + fmtT.format(now) + ' on ' + fmtD.format(now) + ' in New Orleans. We answer 24/7.'; };
      tick();
      setInterval(tick, 30000);
    }
    var picks = [].slice.call(document.querySelectorAll('.cn-pick')), panels = [].slice.call(document.querySelectorAll('.cn-panel'));
    picks.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-case');
        picks.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        panels.forEach(function (p) { p.classList.toggle('cn-on', p.getAttribute('data-case') === k); });
      });
    });
    [].forEach.call(document.querySelectorAll('[data-service]'), function (b) {
      b.addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('select[name="service"]'), function (s) { s.value = b.getAttribute('data-service'); });
      });
    });
  })();

  // Residential water: rooms on the house and the room buttons pick the same panel.
  (function () {
    var rooms = [].slice.call(document.querySelectorAll('.rw-room'));
    if (!rooms.length) return;
    var picks = [].slice.call(document.querySelectorAll('.rw-pick')), panels = [].slice.call(document.querySelectorAll('.rw-panel'));
    function choose(k) {
      rooms.forEach(function (r) { r.classList.toggle('rw-on', r.getAttribute('data-room') === k); });
      picks.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-room') === k ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('rw-on', p.getAttribute('data-room') === k); });
    }
    rooms.forEach(function (r) { r.addEventListener('click', function () { choose(r.getAttribute('data-room')); }); });
    picks.forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-room')); }); });
    choose('kitchen');
  })();

  // Fire and smoke: the slider and stage buttons spread smoke across the floor plan and pick the panel.
  (function () {
    var range = document.getElementById('fsRange');
    if (!range) return;
    var rooms = [].slice.call(document.querySelectorAll('.fs-room')), stops = [].slice.call(document.querySelectorAll('.fs-stop')), panels = [].slice.call(document.querySelectorAll('.fs-panel')), vents = document.querySelector('.fs-vents');
    function set(n) {
      range.value = n;
      rooms.forEach(function (r) { r.classList.toggle('fs-lit', +r.getAttribute('data-stage') <= n); });
      vents.classList.toggle('fs-lit', n >= 4);
      stops.forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-stage') === n ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('fs-on', +p.getAttribute('data-stage') === n); });
    }
    range.addEventListener('input', function () { set(+range.value); });
    stops.forEach(function (b) { b.addEventListener('click', function () { set(+b.getAttribute('data-stage')); }); });
    rooms.forEach(function (r) { r.addEventListener('click', function () { set(+r.getAttribute('data-stage')); }); });
    set(1);
  })();

  // Air duct: parts of the air path pick a panel; the quick check counts what's ticked.
  (function () {
    var parts = [].slice.call(document.querySelectorAll('.ad-part'));
    if (!parts.length) return;
    var picks = [].slice.call(document.querySelectorAll('.ad-pick')), panels = [].slice.call(document.querySelectorAll('.ad-panel'));
    function choose(k) {
      parts.forEach(function (p) { p.classList.toggle('ad-lit', p.getAttribute('data-part') === k); });
      picks.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-part') === k ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('ad-on', p.getAttribute('data-part') === k); });
    }
    parts.forEach(function (p) { p.addEventListener('click', function () { choose(p.getAttribute('data-part')); }); });
    picks.forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-part')); }); });
    choose('return');
    var boxes = [].slice.call(document.querySelectorAll('.ad-sign input')), bar = document.getElementById('adBar'), result = document.getElementById('adResult');
    function tally() {
      var n = boxes.filter(function (x) { return x.checked; }).length;
      bar.style.width = (n / boxes.length * 100) + '%';
      result.textContent = n === 0 ? 'Nothing ticked yet.' : n === 1 ? 'One sign. Keep an eye on it, or call and ask.' : n + ' signs. Worth having them looked at.';
    }
    boxes.forEach(function (x) { x.addEventListener('change', tally); });
    tally();
  })();

  // Floor cleaning: pick a floor type; dragging the slider wipes the illustrated floor clean.
  (function () {
    var stage = document.getElementById('fcStage');
    if (!stage) return;
    var range = document.getElementById('fcRange'), picks = [].slice.call(document.querySelectorAll('.fc-pick')), panels = [].slice.call(document.querySelectorAll('.fc-panel'));
    function wipe() { stage.style.setProperty('--x', range.value + '%'); }
    range.addEventListener('input', wipe);
    picks.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-floor');
        stage.className = 'fc-stage fc-' + k + '-f';
        picks.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        panels.forEach(function (p) { p.classList.toggle('fc-on', p.getAttribute('data-floor') === k); });
        range.value = 50; wipe();
      });
    });
    wipe();
  })();

  // Commercial water: pick the floor where it started; that floor and those below it fill.
  (function () {
    var levels = [].slice.call(document.querySelectorAll('.cw-level'));
    if (!levels.length) return;
    var order = ['roof', 'upper', 'middle', 'ground'], picks = [].slice.call(document.querySelectorAll('.cw-pick')), panels = [].slice.call(document.querySelectorAll('.cw-panel'));
    function choose(k) {
      var from = order.indexOf(k);
      levels.forEach(function (l) { l.classList.toggle('cw-lit', order.indexOf(l.getAttribute('data-level')) >= from); });
      picks.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-level') === k ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('cw-on', p.getAttribute('data-level') === k); });
    }
    levels.forEach(function (l) { l.addEventListener('click', function () { choose(l.getAttribute('data-level')); }); });
    picks.forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-level')); }); });
    choose('upper');
  })();

  // Carpet: steps through the cutaway; the stain buttons pick what to do right now.
  (function () {
    var svg = document.getElementById('cpSvg');
    if (!svg) return;
    var stops = [].slice.call(document.querySelectorAll('.cp-stop')), panels = [].slice.call(document.querySelectorAll('.cp-panel')), at = 1;
    function go(n) {
      at = n;
      svg.setAttribute('data-s', n);
      stops.forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-s') === n ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('cp-on', +p.getAttribute('data-s') === n); });
    }
    stops.forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-s')); }); });
    [].forEach.call(document.querySelectorAll('.cp-next'), function (b) { b.addEventListener('click', function () { go(at === 5 ? 1 : at + 1); }); });
    var spots = [].slice.call(document.querySelectorAll('.cp-spot')), cards = [].slice.call(document.querySelectorAll('.cp-card'));
    spots.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-stain');
        spots.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        cards.forEach(function (c) { c.classList.toggle('cp-on', c.getAttribute('data-stain') === k); });
      });
    });
  })();

  // Commercial cleaning: tapped items build a list, and sending it fills the estimate form.
  (function () {
    var send = document.getElementById('ccSend');
    if (!send) return;
    var items = [].slice.call(document.querySelectorAll('.cc-item')), list = document.getElementById('ccList'), count = document.getElementById('ccCount');
    function chosen() { return items.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }); }
    function draw() {
      var on = chosen();
      list.textContent = '';
      on.forEach(function (b) {
        var li = document.createElement('li'), link = b.getAttribute('data-link'), name = b.getAttribute('data-item');
        if (link) { var a = document.createElement('a'); a.href = link; a.textContent = name; li.appendChild(a); } else { li.textContent = name; }
        list.appendChild(li);
      });
      count.textContent = on.length === 0 ? 'Nothing on it yet. Tap what needs cleaning.' : on.length + (on.length === 1 ? ' item' : ' items');
    }
    items.forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        draw();
      });
    });
    send.addEventListener('click', function () {
      var names = chosen().map(function (b) { return b.getAttribute('data-item'); });
      [].forEach.call(document.querySelectorAll('#est-form, #ct-form'), function (f) {
        var svc = f.querySelector('select[name="service"]'), msg = f.querySelector('textarea[name="message"]');
        svc.value = 'Cleaning';
        msg.value = names.length ? 'Commercial cleaning estimate for: ' + names.join(', ') + '.' : '';
      });
    });
    draw();
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
