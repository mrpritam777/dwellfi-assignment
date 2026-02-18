(() => {
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    const links = menu.querySelectorAll('a');
    const closeMenu = () => menu.classList.add('hidden');

    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        menu.classList.toggle('hidden');
    });

    links.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !btn.contains(event.target)) {
            closeMenu();
        }
    });
})();

(() => {
    const animatedBlocks = document.querySelectorAll('[data-company-animate]');
    if (!animatedBlocks.length) return;

    const reset = (block) => {
        const side = block.dataset.companyAnimate;
        block.classList.remove('opacity-100', 'translate-x-0');
        block.classList.add('opacity-0');

        if (side === 'left') {
            block.classList.add('-translate-x-24', 'md:-translate-x-36');
            block.classList.remove('translate-x-24', 'md:translate-x-36');
        } else {
            block.classList.add('translate-x-24', 'md:translate-x-36');
            block.classList.remove('-translate-x-24', 'md:-translate-x-36');
        }
    };

    const reveal = (block) => {
        const side = block.dataset.companyAnimate;
        block.classList.remove('opacity-0');
        block.classList.add('opacity-100');

        if (side === 'left') {
            block.classList.remove('-translate-x-24', 'md:-translate-x-36');
        } else {
            block.classList.remove('translate-x-24', 'md:translate-x-36');
        }
        block.classList.add('translate-x-0');
    };

    if (!('IntersectionObserver' in window)) {
        animatedBlocks.forEach(reveal);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                reveal(entry.target);
            } else {
                reset(entry.target);
            }
        });
    }, { threshold: 0.3 });

    animatedBlocks.forEach((block) => {
        reset(block);
        observer.observe(block);
    });
})();