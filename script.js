// Sticky Navigation
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Contact Modal Handling
const contactModal = document.getElementById('contact-modal');
const openContactBtns = document.querySelectorAll('.open-contact-btn');
const closeContactBtn = document.getElementById('modal-close-btn');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('form-submit-btn');

function openModal() {
    if (contactModal) {
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (contactModal) {
        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

openContactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

if (closeContactBtn) {
    closeContactBtn.addEventListener('click', closeModal);
}

// Close when clicking on background backdrop
if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
        closeModal();
    }
});

// Handle Form Submission via Web3Forms API
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        if (formStatus) {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData.entries());
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                if (formStatus) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                }
                contactForm.reset();
                setTimeout(() => {
                    closeModal();
                    if (formStatus) {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }
                }, 3000);
            } else {
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = result.message || 'Something went wrong. Please try again.';
                }
            }
        } catch (error) {
            if (formStatus) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Network error. Please try again later or email directly.';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
    });
}
