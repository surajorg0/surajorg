document.addEventListener('DOMContentLoaded', function() {
    const hasGSAP = typeof window.gsap !== 'undefined';
    const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
    if (hasGSAP && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Add cursor trail effect
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);
    
    // Initialize the particles array
    const particles = [];
    const maxParticles = 15; // Maximum number of particles in the trail
    
    // Create cursor trail when mouse moves
    document.addEventListener('mousemove', function(e) {
        createParticle(e.clientX, e.clientY);
    });
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random size and color for variety
        const size = Math.random() * 5 + 3;
        const hue = Math.random() * 60 + 240; // Purple to pink range
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 100%, 70%)`;
        
        cursorTrail.appendChild(particle);
        particles.push({
            element: particle,
            x: x,
            y: y,
            size: size,
            alpha: 1,
            speed: Math.random() * 2 + 1
        });
        
        // Limit the number of particles
        if (particles.length > maxParticles) {
            const oldParticle = particles.shift();
            cursorTrail.removeChild(oldParticle.element);
        }
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach((particle, index) => {
            // Fade and shrink
            particle.alpha -= 0.03;
            particle.y += particle.speed;
            particle.size -= 0.1;
            
            if (particle.alpha <= 0 || particle.size <= 0) {
                cursorTrail.removeChild(particle.element);
                particles.splice(index, 1);
            } else {
                particle.element.style.opacity = particle.alpha;
                particle.element.style.width = particle.size + 'px';
                particle.element.style.height = particle.size + 'px';
                particle.element.style.top = particle.y + 'px';
            }
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Animate the milestones on scroll
    const milestones = document.querySelectorAll('.milestone');
    if (hasGSAP) {
        milestones.forEach((milestone) => {
            gsap.to(milestone, {
                scrollTrigger: {
                    trigger: milestone,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleClass: "visible",
                    once: true
                }
            });
        });
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { rootMargin: "0px 0px -20% 0px" });
        milestones.forEach((m) => observer.observe(m));
    }
    
    // Typewriter effect for the tagline
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const typewriterText = typewriterElement.textContent;
        typewriterElement.textContent = '';
        
        let i = 0;
        const typeSpeed = 100; // typing speed in milliseconds
        
        function typeWriter() {
            if (i < typewriterText.length) {
                typewriterElement.textContent += typewriterText.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        // Start the typewriter effect after a short delay
        setTimeout(typeWriter, 1000);
    }
    
    // Mobile menu toggle with overlay, ESC, and close button
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Ensure a single overlay exists
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    function openMenu() {
        if (hamburger) hamburger.classList.add('active');
        if (navLinks) navLinks.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    if (hamburger && navLinks) {
        // Toggle menu
        hamburger.addEventListener('click', () => {
            const isOpen = document.body.classList.contains('menu-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Inject a close button into the nav if missing
        let navClose = navLinks.querySelector('.nav-close');
        if (!navClose) {
            navClose = document.createElement('button');
            navClose.className = 'nav-close';
            navClose.type = 'button';
            navClose.innerHTML = '&times;';
            navLinks.insertBefore(navClose, navLinks.firstChild);
        }

        // Close on overlay click
        overlay.addEventListener('click', closeMenu);
        // Close on close button click
        navClose.addEventListener('click', closeMenu);
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        // Close when clicking any nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add floating effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    if (hasGSAP) {
        projectCards.forEach((card, index) => {
            gsap.to(card, {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2
            });
        });
    }
    
    // Add glowing effect to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (hasGSAP && ctaButton) {
        gsap.to(ctaButton, {
            boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2',
            repeat: -1,
            yoyo: true,
            duration: 2
        });
    }
    
    // Create meteor animations
    if (!document.body.classList.contains('home')) { createMeteors(); }
    
    // Initialize particles.js if container is present
    if (document.querySelector('#particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true }
            },
            retina_detect: true
        });
    }
    
    // Initialize tools if on tools page
    if (document.querySelector('.tools-section')) {
        initializeTools();
    }
    
    // Handle contact form submission (client-side only)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Show success message (in a real implementation, this would be after AJAX)
            const formContainer = contactForm.parentElement;
            formContainer.innerHTML = `
                <div class="success-message">
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you, ${name}! Your transmission has been received.</p>
                    <p>I'll respond to your message at ${email} as soon as possible.</p>
                </div>
            `;
        });
    }

    // Add cosmic floating elements randomly
    function createMeteors() {
        if (!hasGSAP) { return; }
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            // Create between 1-3 meteors per section
            const meteorCount = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < meteorCount; i++) {
                const meteor = document.createElement('div');
                meteor.classList.add('meteor');
                
                // Random position and size
                const size = Math.floor(Math.random() * 150) + 50;
                const top = Math.floor(Math.random() * 100);
                const left = Math.floor(Math.random() * 100);
                
                // Set meteor styles
                meteor.style.position = 'absolute';
                meteor.style.width = `${size}px`;
                meteor.style.height = `${size / 5}px`;
                meteor.style.background = 'linear-gradient(90deg, rgba(138, 43, 226, 0), rgba(138, 43, 226, 0.8))';
                meteor.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.5)';
                meteor.style.borderRadius = '50%';
                meteor.style.top = `${top}%`;
                meteor.style.left = `${left}%`;
                meteor.style.transform = 'rotate(-45deg)';
                meteor.style.zIndex = '1';
                meteor.style.opacity = '0';
                
                section.appendChild(meteor);
                
                // Animate meteor
                gsap.to(meteor, {
                    x: 300,
                    y: 300,
                    opacity: 1,
                    duration: Math.random() * 5 + 5,
                    delay: Math.random() * 10,
                    repeat: -1,
                    repeatDelay: Math.random() * 10 + 10,
                    ease: 'power2.in'
                });
            }
        });
    }
});



// Tools initialization
function initializeTools() {
    // Text to Speech
    const textToSpeech = document.querySelector('[data-tool="text-speech"]');
    if (textToSpeech) {
        const textarea = textToSpeech.querySelector('textarea');
        const speakButton = textToSpeech.querySelector('.tool-button');
        
        speakButton?.addEventListener('click', () => {
            if (textarea?.value) {
                const utterance = new SpeechSynthesisUtterance(textarea.value);
                window.speechSynthesis.speak(utterance);
            }
        });
    }

    // Password Generator
    const passwordGen = document.querySelector('[data-tool="password"]');
    if (passwordGen) {
        const generateBtn = passwordGen.querySelector('.tool-button');
        const lengthInput = passwordGen.querySelector('input[type="number"]');
        const output = passwordGen.querySelector('.generated-password');
        const checkboxes = passwordGen.querySelectorAll('input[type="checkbox"]');

        generateBtn?.addEventListener('click', () => {
            const length = parseInt(lengthInput?.value || '12');
            const useUppercase = checkboxes[0]?.checked;
            const useNumbers = checkboxes[1]?.checked;
            const useSymbols = checkboxes[2]?.checked;

            const password = generatePassword(length, useUppercase, useNumbers, useSymbols);
            if (output) output.value = password;
        });
    }

    // Word Counter
    const wordCounter = document.querySelector('[data-tool="wordcount"]');
    if (wordCounter) {
        const textarea = wordCounter.querySelector('textarea');
        const wordCount = wordCounter.querySelector('.word-count');
        const charCount = wordCounter.querySelector('.char-count');

        textarea?.addEventListener('input', () => {
            if (textarea.value) {
                const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
                if (wordCount) wordCount.textContent = words.length.toString();
                if (charCount) charCount.textContent = textarea.value.length.toString();
            } else {
                if (wordCount) wordCount.textContent = '0';
                if (charCount) charCount.textContent = '0';
            }
        });
    }

    // QR Code Generator
    const qrGen = document.querySelector('[data-tool="qrcode"]');
    if (qrGen) {
        const input = qrGen.querySelector('input');
        const generateBtn = qrGen.querySelector('.tool-button');
        const output = qrGen.querySelector('.qrcode-output');

        generateBtn?.addEventListener('click', () => {
            if (input?.value && output) {
                output.innerHTML = '';
                const qr = new QRCode(output, {
                    text: input.value,
                    width: 128,
                    height: 128
                });
            }
        });
    }
}

// Password Generator Helper Function
function generatePassword(length, useUppercase, useNumbers, useSymbols) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase;
    if (useUppercase) chars += uppercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}