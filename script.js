// Clean and Optimized JavaScript for Daimanzoku Education Center

class DaimanzokuWebsite {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        this.contactForm = document.getElementById('contactForm');
        
        this.init();
    }
    
    init() {
        this.initMobileNavigation();
        this.initSmoothScrolling();
        this.initScrollEffects();
        this.initHeroButtons();
        this.initContactForm();
        this.initBackToTop();
        console.log('✅ Daimanzoku Education Center website loaded successfully!');
    }
    
    // Mobile Navigation
    initMobileNavigation() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking on links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    // Smooth Scrolling
    initSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });
    }
    
    scrollToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = window.innerWidth < 768 ? 60 : 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Scroll Effects
    initScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar scroll effect
            if (this.navbar) {
                if (currentScrollY > 50) {
                    this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    this.navbar.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
                } else {
                    this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    this.navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                }
            }
            
            // Active section highlighting
            this.updateActiveSection();
            
            lastScrollY = currentScrollY;
        });
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Hero Buttons
    initHeroButtons() {
        const freeCounselingBtn = document.getElementById('btnFreeCounseling');
        const viewCoursesBtn = document.getElementById('btnViewCourses');
        
        if (freeCounselingBtn) {
            freeCounselingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#contact');
                
                // Focus on first input after scroll
                setTimeout(() => {
                    const firstInput = document.querySelector('#contactForm input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            });
        }
        
        if (viewCoursesBtn) {
            viewCoursesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#courses');
            });
        }
    }
    
    // Contact Form
    initContactForm() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
            
            // Real-time validation
            const inputs = this.contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${field.placeholder || 'This field'} is required`;
            isValid = false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        
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
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone);
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.style.borderColor = '#ef4444';
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
    
    handleFormSubmission() {
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Validate all fields
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
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
    
    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 1.5rem; cursor: pointer; margin-left: 1rem;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Back to Top Button
    initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DaimanzokuWebsite();
});

// Handle window resize
window.addEventListener('resize', () => {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.getElementById('navToggle');
    
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 768 && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
    }
});
