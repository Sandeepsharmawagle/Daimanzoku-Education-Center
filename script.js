// Enhanced JavaScript for Daimanzoku Education Center

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Navigation Enhancement
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.initMobileToggle();
        this.initSmoothScrolling();
        this.initScrollSpy();
        this.initNavbarScroll();
        this.initClickOutside();
    }
    
    initMobileToggle() {
        if (!this.navToggle) {
            this.createMobileToggle();
        }
        
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }
    
    createMobileToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'nav-toggle';
        toggleButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        const navContainer = this.navbar?.querySelector('.nav-container');
        if (navContainer) {
            navContainer.appendChild(toggleButton);
            this.navToggle = toggleButton;
        }
    }
    
    toggleMobileMenu() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }
    
    initSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (this.navMenu && this.navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        });
    }
    
    initScrollSpy() {
        const scrollHandler = debounce(() => {
            let currentSection = '';
            this.sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 100 && sectionTop > -section.offsetHeight + 100) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }, 10);
        
        window.addEventListener('scroll', scrollHandler);
    }
    
    initNavbarScroll() {
        const scrollHandler = debounce(() => {
            if (this.navbar) {
                if (window.scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }
        }, 10);
        
        window.addEventListener('scroll', scrollHandler);
    }
    
    initClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.navbar && this.navMenu && 
                !this.navbar.contains(e.target) && 
                this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
    }
}

// Form Management
class FormManager {
    constructor() {
        this.contactForm = document.querySelector('#contactForm');
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.initContactForm();
            this.initRealTimeValidation();
        }
    }
    
    initContactForm() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(this.contactForm)) {
                this.handleFormSubmission();
            }
        });
    }
    
    initRealTimeValidation() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(field)} is required`;
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    getFieldLabel(field) {
        return field.placeholder || field.name || 'This field';
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.style.borderColor = '#ef4444';
        
        // Insert error message after the field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
        field.classList.add('error');
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
        field.classList.remove('error');
    }
    
    handleFormSubmission() {
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
            this.contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; margin-left: 1rem;">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide after 5 seconds
        const autoHide = setTimeout(() => this.hideNotification(notification), 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoHide);
                this.hideNotification(notification);
            });
        }
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// 🔥 HERO BUTTON FUNCTIONALITY - FIXED VERSION
class HeroButtonManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
            this.initHeroButtons();
        }, 100);
    }
    
    initHeroButtons() {
        console.log('🔘 Initializing hero buttons...');
        
        // Free Counseling Button - Scrolls to Contact Form
        const freeCounselingBtn = document.getElementById('btnFreeCounseling');
        console.log('Free Counseling Button:', freeCounselingBtn);
        
        if (freeCounselingBtn) {
            freeCounselingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔘 Free Counseling clicked!');
                this.scrollToSection('#contact');
                
                // Focus on the contact form for better UX
                setTimeout(() => {
                    const firstInput = document.querySelector('#contactForm input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            });
            console.log('✅ Free Counseling button listener added');
        } else {
            console.error('❌ Free Counseling button not found! Check if ID "btnFreeCounseling" exists');
        }
        
        // View Courses Button - Scrolls to Courses Section
        const viewCoursesBtn = document.getElementById('btnViewCourses');
        console.log('View Courses Button:', viewCoursesBtn);
        
        if (viewCoursesBtn) {
            viewCoursesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔘 View Courses clicked!');
                this.scrollToSection('#courses');
            });
            console.log('✅ View Courses button listener added');
        } else {
            console.error('❌ View Courses button not found! Check if ID "btnViewCourses" exists');
        }
    }
    
    scrollToSection(sectionId) {
        console.log(`📍 Scrolling to section: ${sectionId}`);
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            console.log('✅ Scroll completed');
        } else {
            console.error(`❌ Section ${sectionId} not found!`);
        }
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.initScrollReveal();
        this.initBackToTop();
        this.initButtonAnimations();
    }
    
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToReveal = document.querySelectorAll('.service-card, .course-card, .gallery-item, .certificate-item, .staff-card, .about-text, .about-img');
        elementsToReveal.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }
    
    initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
        
        const scrollHandler = debounce(() => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, 10);
        
        window.addEventListener('scroll', scrollHandler);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    initButtonAnimations() {
        const buttons = document.querySelectorAll('.cta-btn, .submit-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            btn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(0) scale(0.98)';
            });
            
            btn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-2px) scale(1)';
            });
        });
    }
}

// Application Initialization
class DaimanzokuApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.navigationManager = new NavigationManager();
        this.formManager = new FormManager();
        this.animationManager = new AnimationManager();
        this.heroButtonManager = new HeroButtonManager(); // Fixed: Add this line properly
        
        this.initEventListeners();
        this.showLoadingComplete();
    }
    
    initEventListeners() {
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            // Close mobile menu on resize
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                this.navigationManager.toggleMobileMenu();
            }
        }, 250));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    this.navigationManager.toggleMobileMenu();
                }
            }
        });
    }
    
    showLoadingComplete() {
        console.log('🎓 Daimanzoku Education Center website loaded successfully!');
        console.log('📚 All enhanced features activated');
        console.log('📏 Certificate images optimized to 120px height');
        console.log('🔘 Hero buttons are now functional');
        
        // Add loaded class to body
        document.body.classList.add('loaded');
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded - Initializing app...');
    new DaimanzokuApp();
});

// Additional smooth scrolling for all anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
/