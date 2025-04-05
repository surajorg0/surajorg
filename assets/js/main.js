document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
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
    milestones.forEach((milestone, index) => {
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
    
    // Typewriter effect for the tagline
    const typewriterElement = document.getElementById('typewriter');
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
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
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
    
    // Add glowing effect to CTA button
    const ctaButton = document.querySelector('.cta-button');
    gsap.to(ctaButton, {
        boxShadow: '0 0 20px #8a2be2, 0 0 40px #8a2be2',
        repeat: -1,
        yoyo: true,
        duration: 2
    });
    
    // Create meteor animations
    createMeteors();
    
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

// Add parallax effect to stars
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Parallax for particles-js
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
}); 