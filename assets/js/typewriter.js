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
