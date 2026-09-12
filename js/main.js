/**
 * Zimal AI — Main JavaScript
 * Premium interactions, animations, and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll behavior for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animateObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        animateObserver.observe(el);
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // COUNTER ANIMATION (About Stats)
    // ========================================
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * target);

                    counter.textContent = current.toLocaleString() + (target === 99 ? '%' : '+');

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + (target === 99 ? '%' : '+');
                    }
                };

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ========================================
    // FAQ ACCORDION
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Show toast
            toast.classList.add('show');

            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Hide toast after 3s
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }, 1500);
    });

    // ========================================
    // BUTTON RIPPLE EFFECT
    // ========================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ========================================
    // PARALLAX EFFECT FOR HERO ORBS
    // ========================================
    const orbs = document.querySelectorAll('.gradient-orb');

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            orbs.forEach((orb, index) => {
                const factor = (index + 1) * 0.5;
                orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    // ========================================
    // WORKFLOW NODE INTERACTION
    // ========================================
    /*const workflowNodes = document.querySelectorAll('.workflow-node');

    workflowNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            workflowNodes.forEach(n => {
                if (n !== node) {
                    n.style.opacity = '0.45';
                }
            });
            node.style.zIndex = '10';
        });

        node.addEventListener('mouseleave', () => {
            workflowNodes.forEach(n => {
                n.style.opacity = '1';
            });
            node.style.zIndex = '';
        });
    });*/

    // ========================================
    // WORKFLOW NODE INTERACTION
    // ========================================
    const workflowNodes = document.querySelectorAll('.workflow-node');

    workflowNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.style.zIndex = '10';
        });

        node.addEventListener('mouseleave', () => {
            node.style.zIndex = '';
        });
    });

    // ========================================
    // SERVICE CARD HOVER GLOW
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ========================================
    // REVEAL ON SCROLL (stagger for grids)
    // ========================================
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.services-grid').forEach(grid => {
        Array.from(grid.children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        gridObserver.observe(grid);
    });

    // ========================================
    // NAVBAR ACTIVE LINK HIGHLIGHTING
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinkEls.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // ========================================
    // THEME TOGGLE → switch to the dark build
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            try { localStorage.setItem('zimal-theme', 'dark'); } catch (e) {}
            window.location.href = 'dark-mode/index.html';
        });
    }

    // ========================================
    // PRELOADER (subtle fade-in)
    // ========================================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
