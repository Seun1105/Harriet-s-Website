// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Cursor dot
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        overwrite: 'auto'
    });

    // Cursor ring
    gsap.to(cursorFollower, {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        overwrite: 'auto'
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
    gsap.to(cursorFollower, { opacity: 0, duration: 0.2 });
});

document.addEventListener('mouseenter', () => {
    gsap.to(cursor, { opacity: 1, duration: 0.2 });
    gsap.to(cursorFollower, { opacity: 0.5, duration: 0.2 });
});

// ========== NAVIGATION ==========
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Sticky nav on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when link clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========== TEXT REVEAL ANIMATION ==========
function revealText() {
    const reveals = document.querySelectorAll('[data-reveal]');

    reveals.forEach((element, index) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
        });
    });
}

// ========== SCROLL ANIMATIONS ==========
function animateOnScroll() {
    // Pillar animations
    gsap.from(".pillar", {
        scrollTrigger: {
            trigger: ".pillars",
            start: "top 70%"
        },
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out"
    });

    // Step animations
    gsap.from(".step", {
        scrollTrigger: {
            trigger: ".framework-steps",
            start: "top 75%"
        },
        x: -60,
        opacity: 0,
        stagger: 0.2,
        duration: 1.1,
        ease: "power3.out"
    });

    // Service cards animation
    gsap.from(".service-card", {
        scrollTrigger: {
            trigger: ".services-grid",
            start: "top 75%"
        },
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out"
    });

    // Reveal text elements
    revealText();
}

// ========== FORM SUBMISSION ==========
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.textContent;

        // Disable button
        btn.disabled = true;
        btn.textContent = "Sending...";

        setTimeout(() => {
            btn.textContent = "Story Received — Thank You";
            btn.style.background = "#22C55E";
            btn.style.color = "#fff";

            // Show success message
            form.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('visible');
            }

            setTimeout(() => {
                alert("Thank you! Harriet will be in touch shortly to discuss your technology story.");
                form.reset();
                form.style.display = 'flex';
                if (formSuccess) {
                    formSuccess.classList.remove('visible');
                }
                btn.textContent = originalText;
                btn.style.background = "";
                btn.style.color = "";
                btn.disabled = false;
            }, 1500);
        }, 800);
    });
}

// ========== TICKER ANIMATION ==========
function animateTicker() {
    const ticker = document.querySelector('.ticker-track');
    if (ticker) {
        gsap.to(ticker, {
            x: -ticker.offsetWidth / 2,
            duration: 40,
            ease: 'none',
            repeat: -1
        });
    }
}

// ========== IMAGE STRIP ANIMATION ==========
function animateImageStrip() {
    const stripItems = document.querySelectorAll('.strip-item');
    stripItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 75%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.15
        });
    });
}

// ========== INITIALIZE ==========
window.addEventListener('load', () => {
    animateOnScroll();
    animateTicker();
    animateImageStrip();

    // Hero headline animation
    gsap.from(".hero-headline", {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out"
    });

    // Hero sub animation
    gsap.from(".hero-sub", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power4.out"
    });

    // Hero actions animation
    gsap.from(".hero-actions", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power4.out"
    });

    console.log("%cHarriet — Strategic Technology Storytelling Initiative\nBuilt with intention and clarity.", "color:#0A84FF; font-family:monospace");
});

// Handle GSAP and ScrollTrigger on page refresh
ScrollTrigger.refresh();