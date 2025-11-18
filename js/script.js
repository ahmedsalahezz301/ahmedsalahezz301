document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            // Change icon based on menu state
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                mobileMenuButton.querySelector('i').classList.remove('fa-times');
                mobileMenuButton.querySelector('i').classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    const icon = mobileMenuButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = 'auto';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = `#${section.getAttribute('id')}`;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-teal-600', 'border-teal-600');
            link.classList.add('text-gray-700');
            
            if (link.getAttribute('href') === current) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-teal-600', 'border-teal-600');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initialize on page load

    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Project slider with auto-play and touch support
    const projectSlider = document.getElementById('project-slider');
    const prevButton = document.getElementById('prev-project');
    const nextButton = document.getElementById('next-project');
    const projectDots = document.querySelectorAll('.project-dot');
    let currentProject = 0;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (projectSlider && prevButton && nextButton) {
        const projects = document.querySelectorAll('.project-slide');
        const totalProjects = projects.length;
        
        // Set initial active dot
        updateDots();
        
        // Next project
        function nextProject() {
            currentProject = (currentProject + 1) % totalProjects;
            updateSlider();
        }
        
        // Previous project
        function prevProject() {
            currentProject = (currentProject - 1 + totalProjects) % totalProjects;
            updateSlider();
        }
        
        // Event listeners for buttons
        nextButton.addEventListener('click', nextProject);
        prevButton.addEventListener('click', prevProject);
        
        // Dot navigation
        projectDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentProject = index;
                updateSlider();
                resetAutoPlay();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextProject();
                resetAutoPlay();
            } else if (e.key === 'ArrowLeft') {
                prevProject();
                resetAutoPlay();
            }
        });
        
        // Touch events for mobile swipe
        projectSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        projectSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to trigger slide change
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - next project
                nextProject();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - previous project
                prevProject();
            }
            resetAutoPlay();
        }
        
        // Auto-play functionality
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                nextProject();
            }, 5000); // Change slide every 5 seconds
        }
        
        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
        
        // Start auto-play when user interacts with the slider
        projectSlider.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        projectSlider.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        function updateSlider() {
            // Update slider position with smooth transition
            projectSlider.style.transform = `translateX(-${currentProject * 100}%)`;
            updateDots();
            
            // Update button states
            prevButton.disabled = currentProject === 0;
            nextButton.disabled = currentProject === totalProjects - 1;
            
            // Add active class to current slide for animations
            projects.forEach((project, index) => {
                if (index === currentProject) {
                    project.classList.add('active');
                } else {
                    project.classList.remove('active');
                }
            });
        }
        
        function updateDots() {
            projectDots.forEach((dot, index) => {
                if (index === currentProject) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Initialize first slide as active
        projects[0].classList.add('active');
        
        // Start auto-play
        startAutoPlay();
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                projectSlider.style.transition = 'none';
                projectSlider.style.transform = `translateX(-${currentProject * 100}%)`;
                // Force reflow
                void projectSlider.offsetHeight;
                projectSlider.style.transition = 'transform 0.5s ease';
            }, 250);
        });
    }
    
    // Form submission with validation and feedback
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form elements
            const formElements = contactForm.elements;
            let isValid = true;
            
            // Simple validation
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.required && !element.value.trim()) {
                    element.classList.add('border-red-500');
                    isValid = false;
                } else {
                    element.classList.remove('border-red-500');
                }
                
                // Email validation
                if (element.type === 'email' && element.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(element.value)) {
                        element.classList.add('border-red-500');
                        isValid = false;
                    }
                }
            }
            
            if (!isValid) {
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            
            try {
                // Simulate form submission (replace with actual fetch/axios call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification('There was an error sending your message. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
        
        // Input validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.classList.add('border-red-500');
                } else {
                    this.classList.remove('border-red-500');
                }
                
                // Email validation
                if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        this.classList.add('border-red-500');
                    } else {
                        this.classList.remove('border-red-500');
                    }
                }
            });
        });
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('opacity-100', 'translate-x-0');
            notification.classList.remove('opacity-0', 'translate-x-full');
        }, 10);
        
        // Auto-remove after delay
        setTimeout(() => {
            notification.classList.remove('opacity-100', 'translate-x-0');
            notification.classList.add('opacity-0', 'translate-x-full');
            
            // Remove from DOM after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out',
            offset: 100
        });
    }
    
    // Intersection Observer for scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Initialize animations when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateOnScroll);
    } else {
        animateOnScroll();
    }
    
    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    const icon = mobileMenuButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = 'auto';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation classes to sections with staggered delays
    document.querySelectorAll('section').forEach((section, index) => {
        section.classList.add('animate-on-scroll');
        section.style.animationDelay = `${index * 0.1}s`;
    });
});
