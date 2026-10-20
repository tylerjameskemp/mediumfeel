(function() {
    'use strict';

    var navbar = document.querySelector('.navbar');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!navbar || !toggle || !links) return;

    var mobile = window.matchMedia('(max-width: 768px)');
    var expanded = false;

    function setExpanded(next, returnFocus) {
        expanded = mobile.matches && next;
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
        toggle.classList.toggle('active', expanded);
        links.classList.toggle('is-open', expanded);
        links.inert = mobile.matches && !expanded;
        if (mobile.matches && !expanded) {
            links.setAttribute('aria-hidden', 'true');
        } else {
            links.removeAttribute('aria-hidden');
        }
        document.body.classList.toggle('nav-open', expanded);
        if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function() {
        setExpanded(!expanded);
    });

    links.addEventListener('click', function(event) {
        if (event.target.closest('a')) setExpanded(false, mobile.matches);
    });

    document.addEventListener('keydown', function(event) {
        if (!expanded) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setExpanded(false, true);
            return;
        }
        if (event.key !== 'Tab') return;
        var focusable = [toggle].concat(Array.from(links.querySelectorAll('a[href]')));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !focusable.includes(document.activeElement))) {
            event.preventDefault();
            first.focus();
        }
    });

    document.addEventListener('focusin', function(event) {
        if (expanded && event.target !== toggle && !links.contains(event.target)) toggle.focus();
    });

    function updateViewport() {
        var focusedLink = links.contains(document.activeElement);
        var focusedToggle = document.activeElement === toggle;
        setExpanded(false, mobile.matches && focusedLink);
        if (!mobile.matches && focusedToggle) links.querySelector('a').focus();
    }
    if (mobile.addEventListener) mobile.addEventListener('change', updateViewport);
    else mobile.addListener(updateViewport);

    function updateScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    setExpanded(false);
    document.documentElement.classList.add('js');
})();
