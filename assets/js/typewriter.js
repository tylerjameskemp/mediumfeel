// ===== Nav Typewriter Animation =====
(function() {
    const navTypewriter = document.getElementById('nav-typewriter');
    const navCursor = document.querySelector('.nav-cursor');

    if (!navTypewriter) return;

    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        navTypewriter.textContent = 'Medium Feel';
        return;
    }

    const navIterations = [
        { text: 'Medium Feel', style: 'normal', strike: false },
        { text: 'MediumFeel', style: 'normal', strike: true },
        { text: 'Medium Feel', style: 'italic', strike: false },
        { text: 'Medium Feel.', style: 'normal', strike: true },
        { text: 'M e d i u m  F e e l', style: 'spaced', strike: true },
        { text: 'Medium Feel!', style: 'bold', strike: false },
        { text: 'MEDIUM FEEL', style: 'normal', strike: true },
        { text: 'Medium Feel', style: 'tight', strike: false },
        { text: 'Medium  Feel', style: 'normal', strike: true },
        { text: 'Medium Feel', style: 'bold-italic', strike: false }
    ];

    let navIterationIndex = 0;

    function typeNavText(text, style, callback) {
        const span = document.createElement('span');
        span.className = 'nav-iteration';

        // Apply style classes
        if (style === 'italic') span.classList.add('italic');
        if (style === 'bold') span.classList.add('bold');
        if (style === 'bold-italic') {
            span.classList.add('bold');
            span.classList.add('italic');
        }
        if (style === 'spaced') span.classList.add('spaced');
        if (style === 'tight') span.classList.add('tight');

        navTypewriter.appendChild(span);

        let i = 0;
        function typeChar() {
            if (i < text.length) {
                span.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 80);
            } else if (callback) {
                setTimeout(callback, 800);
            }
        }
        typeChar();
    }

    function eraseNavText(callback) {
        const span = navTypewriter.querySelector('.nav-iteration');
        if (!span) {
            callback();
            return;
        }

        let text = span.textContent;
        let i = text.length;

        function eraseChar() {
            if (i > 0) {
                span.textContent = text.substring(0, i - 1);
                i--;
                setTimeout(eraseChar, 50);
            } else {
                navTypewriter.removeChild(span);
                if (callback) setTimeout(callback, 200);
            }
        }
        eraseChar();
    }

    function navTypewriterLoop() {
        const iteration = navIterations[navIterationIndex];

        typeNavText(iteration.text, iteration.style, () => {
            if (iteration.strike) {
                const span = navTypewriter.querySelector('.nav-iteration');
                if (span) {
                    span.classList.add('struck');
                    setTimeout(() => {
                        eraseNavText(() => {
                            navIterationIndex = (navIterationIndex + 1) % navIterations.length;
                            navTypewriterLoop();
                        });
                    }, 600);
                }
            } else {
                setTimeout(() => {
                    eraseNavText(() => {
                        navIterationIndex = (navIterationIndex + 1) % navIterations.length;
                        navTypewriterLoop();
                    });
                }, 1500);
            }
        });
    }

    // Start nav typewriter after a brief delay
    setTimeout(navTypewriterLoop, 500);
})();

// ===== Hero Typewriter =====
(function() {
    var wrapper    = document.getElementById('hero-typewriter');
    var beforeEl   = document.getElementById('hero-tw-before');
    var selectedEl = document.getElementById('hero-tw-selected');
    var afterEl    = document.getElementById('hero-tw-after');
    if (!wrapper || !beforeEl || !selectedEl || !afterEl) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        beforeEl.textContent = 'A lab for brand, marketing, and the questions that sit between them.';
        return;
    }

    var before = '', selected = '', after = '';

    function render() {
        beforeEl.textContent  = before;
        selectedEl.textContent = selected;
        afterEl.textContent   = after;
    }

    // Script — plays once, cursor blinks at end
    var script = [
        // "An Experiment in brand"
        { action: 'type', text: 'An Experiment in brand' },
        { action: 'pause', ms: 1500 },

        // Highlight "Experiment", replace with "lab"
        { action: 'moveLeft', count: 9 },           // past " in brand"
        { action: 'selectLeft', count: 10 },         // highlight "Experiment"
        { action: 'pause', ms: 600 },
        { action: 'type', text: 'lab' },             // → "An lab in brand"
        { action: 'pause', ms: 800 },

        // Remove "n" from "An"
        { action: 'moveLeft', count: 4 },            // past " lab"
        { action: 'erase', count: 1 },               // → "A lab in brand"
        { action: 'pause', ms: 500 },

        // Fix "in" → "for"
        { action: 'moveEnd' },
        { action: 'moveLeft', count: 6 },            // cursor after "in", before " brand"
        { action: 'selectLeft', count: 2 },           // highlight "in"
        { action: 'pause', ms: 500 },
        { action: 'type', text: 'for' },              // → "A lab for brand"
        { action: 'pause', ms: 600 },

        // Add " marketing" (no comma yet)
        { action: 'moveEnd' },
        { action: 'type', text: ' marketing' },
        { action: 'pause', ms: 800 },

        // Go back and slip in the comma
        { action: 'moveLeft', count: 10 },            // past " marketing"
        { action: 'type', text: ',' },                // → "A lab for brand, marketing"
        { action: 'moveEnd' },
        { action: 'pause', ms: 400 },

        // ", and the problems"
        { action: 'type', text: ', and the problems' },
        { action: 'pause', ms: 1000 },

        // Highlight "problems", replace with "questions that"
        { action: 'selectLeft', count: 8 },           // highlight "problems"
        { action: 'pause', ms: 600 },
        { action: 'type', text: 'questions that' },
        { action: 'pause', ms: 1000 },

        // Finish
        { action: 'type', text: ' sit between them.' }
    ];

    var TYPE_SPEED  = 85;
    var ERASE_SPEED = 45;
    var MOVE_SPEED  = 40;

    function clearSelection() {
        selected = '';
        selectedEl.textContent = '';
    }

    function typeText(text, cb) {
        // Typing with a selection replaces it
        if (selected) clearSelection();
        var i = 0;
        (function next() {
            if (i < text.length) {
                before += text.charAt(i);
                render();
                i++;
                var delay = TYPE_SPEED + Math.floor(Math.random() * 40);
                if (text.charAt(i - 1) === ' ') delay += 25;
                if (text.charAt(i - 1) === ',') delay += 80;
                setTimeout(next, delay);
            } else {
                cb();
            }
        })();
    }

    function eraseChars(count, cb) {
        if (selected) { clearSelection(); render(); cb(); return; }
        var remaining = Math.min(count, before.length);
        (function next() {
            if (remaining > 0 && before.length > 0) {
                before = before.slice(0, -1);
                render();
                remaining--;
                setTimeout(next, ERASE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function moveLeft(count, cb) {
        if (selected) clearSelection();
        var remaining = Math.min(count, before.length);
        (function next() {
            if (remaining > 0 && before.length > 0) {
                after = before.charAt(before.length - 1) + after;
                before = before.slice(0, -1);
                render();
                remaining--;
                setTimeout(next, MOVE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function moveEnd(cb) {
        if (selected) {
            before += selected;
            clearSelection();
        }
        (function next() {
            if (after.length > 0) {
                before += after.charAt(0);
                after = after.slice(1);
                render();
                setTimeout(next, MOVE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function selectLeft(count, cb) {
        var remaining = Math.min(count, before.length);
        (function next() {
            if (remaining > 0 && before.length > 0) {
                selected = before.charAt(before.length - 1) + selected;
                before = before.slice(0, -1);
                render();
                remaining--;
                setTimeout(next, MOVE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function run(steps, i, done) {
        if (i >= steps.length) { if (done) done(); return; }
        var s = steps[i];
        var advance = function() { run(steps, i + 1, done); };
        if      (s.action === 'type')       typeText(s.text, advance);
        else if (s.action === 'erase')      eraseChars(s.count, advance);
        else if (s.action === 'pause')      setTimeout(advance, s.ms);
        else if (s.action === 'moveLeft')   moveLeft(s.count, advance);
        else if (s.action === 'moveEnd')    moveEnd(advance);
        else if (s.action === 'selectLeft') selectLeft(s.count, advance);
    }

    // Start after a short delay
    setTimeout(function() {
        run(script, 0);
    }, 800);
})();

// ===== About Section Typewriter =====
(function() {
    var wrapper  = document.getElementById('about-typewriter');
    var beforeEl = document.getElementById('about-tw-before');
    var afterEl  = document.getElementById('about-tw-after');
    if (!wrapper || !beforeEl || !afterEl) return;

    // Respect reduced motion — show final line and stop
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        beforeEl.textContent = "Don't be a stranger.";
        return;
    }

    // Text buffer: cursor sits between `before` and `after`
    var before = '';
    var after  = '';

    function render() {
        beforeEl.textContent = before;
        afterEl.textContent  = after;
    }

    // Script actions:
    //   type      — type text at cursor position
    //   erase     — backspace `count` chars left of cursor
    //   pause     — wait ms
    //   moveLeft  — cursor travels left `count` chars
    //   moveEnd   — cursor travels to end of text
    //   highlight — Cmd-A select-all visual
    //   clearAll  — instant delete + remove highlight
    var script = [
        { action: 'type',  text: "Don't be a stranger." },
        { action: 'pause', ms: 2500 },
        { action: 'erase', count: 9 },              // erase "stranger."
        { action: 'pause', ms: 350 },
        { action: 'type',  text: 'turd furgeson!' },
        { action: 'pause', ms: 1200 },
        { action: 'highlight' },
        { action: 'pause', ms: 600 },
        { action: 'clearAll' },
        { action: 'pause', ms: 450 },
        { action: 'type',  text: 'Hey bud, have something in mind?' },
        { action: 'pause', ms: 500 },
        { action: 'type',  text: ' Hit me up.' },
        { action: 'pause', ms: 4000 },
        { action: 'highlight' },
        { action: 'pause', ms: 600 },
        { action: 'clearAll' },
        { action: 'pause', ms: 600 },
        { action: 'type',  text: "Let's mke something cool." },
        { action: 'pause', ms: 800 },
        { action: 'moveLeft', count: 18 },          // cursor travels back to after "m" in "mke"
        { action: 'pause', ms: 200 },
        { action: 'type',  text: 'a' },             // fix: "mke" → "make"
        { action: 'pause', ms: 300 },
        { action: 'moveEnd' },                      // cursor travels back to end
        { action: 'pause', ms: 3000 },
        { action: 'highlight' },
        { action: 'pause', ms: 600 },
        { action: 'clearAll' },
        { action: 'pause', ms: 500 },
        { action: 'type',  text: "I don't wanna be anything other than what i've been tryna be lately." },
        { action: 'pause', ms: 2000 },
        { action: 'highlight' },
        { action: 'pause', ms: 800 },
        { action: 'clearAll' },
        { action: 'pause', ms: 400 },
        { action: 'type',  text: "Dang, how'd you make it this long? Respect." },
        { action: 'pause', ms: 3500 },
        { action: 'highlight' },
        { action: 'pause', ms: 600 },
        { action: 'clearAll' },
        { action: 'pause', ms: 600 }
    ];

    var TYPE_SPEED  = 65;
    var ERASE_SPEED = 35;
    var MOVE_SPEED  = 35;

    function typeText(text, cb) {
        var i = 0;
        (function next() {
            if (i < text.length) {
                before += text.charAt(i);
                render();
                i++;
                var delay = TYPE_SPEED + Math.floor(Math.random() * 45);
                if (text.charAt(i - 1) === ' ') delay += 30;
                if (text.charAt(i - 1) === '?') delay += 120;
                setTimeout(next, delay);
            } else {
                cb();
            }
        })();
    }

    function eraseChars(count, cb) {
        var remaining = Math.min(count, before.length);
        (function next() {
            if (remaining > 0 && before.length > 0) {
                before = before.slice(0, -1);
                render();
                remaining--;
                setTimeout(next, ERASE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function moveLeft(count, cb) {
        var remaining = Math.min(count, before.length);
        (function next() {
            if (remaining > 0 && before.length > 0) {
                after = before.charAt(before.length - 1) + after;
                before = before.slice(0, -1);
                render();
                remaining--;
                setTimeout(next, MOVE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function moveEnd(cb) {
        (function next() {
            if (after.length > 0) {
                before += after.charAt(0);
                after = after.slice(1);
                render();
                setTimeout(next, MOVE_SPEED);
            } else {
                cb();
            }
        })();
    }

    function run(steps, i, done) {
        if (i >= steps.length) { done(); return; }
        var s = steps[i];
        var advance = function() { run(steps, i + 1, done); };
        if      (s.action === 'type')      typeText(s.text, advance);
        else if (s.action === 'erase')     eraseChars(s.count, advance);
        else if (s.action === 'pause')     setTimeout(advance, s.ms);
        else if (s.action === 'moveLeft')  moveLeft(s.count, advance);
        else if (s.action === 'moveEnd')   moveEnd(advance);
        else if (s.action === 'highlight') { wrapper.classList.add('highlighted'); advance(); }
        else if (s.action === 'clearAll')  { before = ''; after = ''; render(); wrapper.classList.remove('highlighted'); advance(); }
    }

    // Only start when the section scrolls into view
    var section = document.querySelector('.about-contact-gradient');
    var started = false;

    function startLoop() {
        if (started) return;
        started = true;
        (function loop() {
            run(script, 0, function() { loop(); });
        })();
    }

    if (section && 'IntersectionObserver' in window) {
        new IntersectionObserver(function(entries, obs) {
            if (entries[0].isIntersecting) {
                obs.disconnect();
                startLoop();
            }
        }, { threshold: 0.3 }).observe(section);
    } else {
        setTimeout(startLoop, 1000);
    }
})();
