 document.addEventListener("DOMContentLoaded", () => {

      const btn = document.getElementById("menuBtn");
      const menu = document.getElementById("mobileMenu");
      const links = menu ? menu.querySelectorAll("a") : [];
      const tabFund = document.getElementById("solutionTabFund");
      const tabInvestor = document.getElementById("solutionTabInvestor");
      const panelFund = document.getElementById("solutionPanelFund");
      const panelInvestor = document.getElementById("solutionPanelInvestor");

      if (btn && menu) {
        const closeMenu = () => menu.classList.add("hidden");

        // TOGGLE MENU
        btn.addEventListener("click", (event) => {
          event.stopPropagation();
          menu.classList.toggle("hidden");
        });

        // CLOSE MENU WHEN CLICK LINK
        links.forEach((link) => {
          link.addEventListener("click", closeMenu);
        });

        // CLOSE WHEN CLICK OUTSIDE
        document.addEventListener("click", (event) => {
          if (!menu.contains(event.target) && !btn.contains(event.target)) {
            closeMenu();
          }
        });
      }

      // SOLUTION TABS TOGGLE
      if (tabFund && tabInvestor && panelFund && panelInvestor) {
        function setActiveTab(target) {
          const isFund = target === "fund";

          panelFund.classList.toggle("hidden", !isFund);
          panelInvestor.classList.toggle("hidden", isFund);

          tabFund.setAttribute("aria-selected", String(isFund));
          tabInvestor.setAttribute("aria-selected", String(!isFund));

          tabFund.classList.toggle("border-brand", isFund);
          tabFund.classList.toggle("text-brand", isFund);
          tabFund.classList.toggle("border-transparent", !isFund);
          tabFund.classList.toggle("text-neutral-700", !isFund);

          tabInvestor.classList.toggle("border-brand", !isFund);
          tabInvestor.classList.toggle("text-brand", !isFund);
          tabInvestor.classList.toggle("border-transparent", isFund);
          tabInvestor.classList.toggle("text-neutral-700", isFund);
        }

        tabFund.addEventListener("click", () => setActiveTab("fund"));
        tabInvestor.addEventListener("click", () => setActiveTab("investor"));
        setActiveTab("fund");
      }

    });

    (() => {
      const rings = document.querySelectorAll('[data-spin-ring]');
      if (!rings.length) return;

      const angles = Array.from(rings, () => 0);
      let lastTime = performance.now();

      function animate(now) {
        const delta = now - lastTime;
        lastTime = now;

        rings.forEach((ring, index) => {
          const speed = Number(ring.dataset.speed || 0.02);
          angles[index] = (angles[index] + delta * speed) % 360;
          ring.style.transform = `rotate(${angles[index]}deg)`;
        });

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    })();

    (() => {
      const viewport = document.getElementById('teamViewport');
      const track = document.getElementById('teamTrack');
      const prev = document.getElementById('teamPrev');
      const next = document.getElementById('teamNext');
      const dotsWrap = document.getElementById('teamDots');
      if (!viewport || !track || !prev || !next || !dotsWrap) return;

      const slides = Array.from(track.querySelectorAll('.team-slide'));
      if (!slides.length) return;

      let index = 0;
      let visible = 1;
      let slideWidth = 0;
      let autoTimer = null;

      function getVisibleCount() {
        const width = viewport.clientWidth;
        if (width >= 960) return 4;
        if (width >= 720) return 3;
        if (width >= 480) return 2;
        return 1;
      }

      function getMaxIndex() {
        return Math.max(0, slides.length - visible);
      }

      function updateDots() {
        const max = getMaxIndex();
        const count = max + 1;

        if (dotsWrap.childElementCount !== count) {
          dotsWrap.innerHTML = '';
          for (let i = 0; i < count; i += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to team slide ${i + 1}`);
            dot.className = `h-2.5 w-2.5 rounded-full ${i === index ? 'bg-brand' : 'bg-neutral-300'}`;
            dot.addEventListener('click', () => {
              index = i;
              apply();
              restartAuto();
            });
            dotsWrap.appendChild(dot);
          }
        } else {
          [...dotsWrap.children].forEach((dot, dotIndex) => {
            dot.classList.toggle('bg-brand', dotIndex === index);
            dot.classList.toggle('bg-neutral-300', dotIndex !== index);
          });
        }

        dotsWrap.classList.toggle('hidden', count <= 1);
      }

      function updateNavState() {
        const max = getMaxIndex();
        const noSlides = max <= 0;
        prev.disabled = noSlides;
        next.disabled = noSlides;
        prev.classList.toggle('opacity-40', noSlides);
        next.classList.toggle('opacity-40', noSlides);
        prev.classList.toggle('cursor-not-allowed', noSlides);
        next.classList.toggle('cursor-not-allowed', noSlides);
      }

      function apply() {
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        updateDots();
        updateNavState();
      }

      function layout() {
        visible = getVisibleCount();
        slideWidth = viewport.clientWidth / visible;

        slides.forEach((slide) => {
          slide.style.width = `${slideWidth}px`;
        });
        track.style.width = `${slideWidth * slides.length}px`;

        const max = getMaxIndex();
        if (index > max) index = max;
        apply();

        if (max <= 0) {
          stopAuto();
        } else if (!autoTimer) {
          restartAuto();
        }
      }

      function goNext() {
        const max = getMaxIndex();
        if (max <= 0) return;
        index = index >= max ? 0 : index + 1;
        apply();
      }

      function goPrev() {
        const max = getMaxIndex();
        if (max <= 0) return;
        index = index <= 0 ? max : index - 1;
        apply();
      }

      function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
      }

      function restartAuto() {
        stopAuto();
        autoTimer = setInterval(goNext, 3200);
      }

      prev.addEventListener('click', () => {
        goPrev();
        restartAuto();
      });

      next.addEventListener('click', () => {
        goNext();
        restartAuto();
      });

      viewport.addEventListener('mouseenter', stopAuto);
      viewport.addEventListener('mouseleave', restartAuto);
      window.addEventListener('resize', layout);

      layout();
      restartAuto();
    })();

    (() => {
      const viewport = document.getElementById('backedViewport');
      const track = document.getElementById('backedTrack');
      if (!viewport || !track) return;

      const slides = Array.from(track.querySelectorAll('.backed-slide'));
      if (slides.length < 2) return;

      slides.forEach((slide) => {
        track.appendChild(slide.cloneNode(true));
      });

      let oneSetWidth = 0;
      let offset = 0;
      let paused = false;
      let lastTs = performance.now();
      const speed = 0.05;

      function measure() {
        oneSetWidth = slides.reduce((sum, slide) => sum + slide.getBoundingClientRect().width, 0);
      }

      function tick(ts) {
        const delta = ts - lastTs;
        lastTs = ts;

        if (!paused && oneSetWidth > 0) {
          offset = (offset + (delta * speed)) % oneSetWidth;
          track.style.transform = `translateX(-${offset}px)`;
        }

        requestAnimationFrame(tick);
      }

      function onVisibilityChange() {
        paused = document.hidden;
      }

      viewport.addEventListener('mouseenter', () => {
        paused = true;
      });

      viewport.addEventListener('mouseleave', () => {
        paused = false;
      });

      window.addEventListener('resize', measure);
      document.addEventListener('visibilitychange', onVisibilityChange);

      measure();
      requestAnimationFrame(tick);
    })();