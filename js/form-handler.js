// Frontend/js/form-handler.js
class FormHandler {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Formulario de contacto popup
        const contactForm = document.getElementById('quotationForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // Formulario de newsletter
        const newsletterForm = document.getElementById('subscribe-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }

        // Manejo adicional para botón newsletter (por si es type="button")
        const newsletterBtn = document.getElementById('submit');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', this.handleNewsletterButtonClick.bind(this));
        }

        // Botón para abrir popup
        const openPopupBtn = document.getElementById('openQuotation');
        if (openPopupBtn) {
            openPopupBtn.addEventListener('click', this.openPopup.bind(this));
        }

        // Botón para cerrar popup
        const closePopupBtn = document.getElementById('closePopup');
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', this.closePopup.bind(this));
        }

        // Cerrar popup haciendo clic en overlay
        const overlay = document.querySelector('.quotation--popup-overly');
        if (overlay) {
            overlay.addEventListener('click', this.closePopup.bind(this));
        }

        const mainContactForm = document.querySelector('.query_form-1');
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', this.handleMainContactSubmit.bind(this));
    }
    }

    async handleContactSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        this.showLoader(form, true);

        try {
            const result = await window.apiService.sendContactForm(formData);
            
            if (result.success) {
                this.showMessage(result.message, true);
                form.reset();
                this.closePopup();
            } else {
                this.showMessage(result.message, false);
                if (result.errors) {
                    console.log('Errores específicos:', result.errors);
                }
            }
        } catch (error) {
            console.error('Error completo:', error);
            this.showMessage('Error de conexión. Verifica que el servidor esté funcionando.', false);
        } finally {
            this.showLoader(form, false);
        }
    }

    async handleNewsletterSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"], button[type="button"], button[id="submit"]');
        
        this.showButtonLoader(submitBtn, true, 'Suscribiendo...');

        try {
            const result = await window.apiService.subscribeNewsletter(formData);
            
            if (result.success) {
                this.showMessage(result.message, true);
                form.reset();
            } else {
                this.showMessage(result.message, false);
            }
        } catch (error) {
            console.error('Error completo:', error);
            this.showMessage('Error de conexión. Intente nuevamente.', false);
        } finally {
            this.showButtonLoader(submitBtn, false);
        }
    }

    handleNewsletterButtonClick(event) {
        // Si el botón es type="button", simular submit del formulario
        const form = event.target.closest('form');
        if (form && form.id === 'subscribe-form') {
            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            form.dispatchEvent(submitEvent);
        }
    }

    openPopup(event) {
        event.preventDefault();
        const popup = document.getElementById('quotation--popup');
        const overlay = document.querySelector('.quotation--popup-overly');
        
        if (popup && overlay) {
            popup.style.display = 'block';
            overlay.style.display = 'block';
        }
    }

    closePopup() {
        const popup = document.getElementById('quotation--popup');
        const overlay = document.querySelector('.quotation--popup-overly');
        
        if (popup && overlay) {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }
    }

    showLoader(form, show) {
        const buttons = form.querySelectorAll('button[type="submit"], button[type="button"]');
        buttons.forEach(btn => {
            if (show) {
                btn.disabled = true;
                btn.dataset.originalText = btn.textContent;
                btn.textContent = 'Enviando...';
            } else {
                btn.disabled = false;
                btn.textContent = btn.dataset.originalText || 'Enviar';
            }
        });
    }

    showButtonLoader(button, show, loadingText = 'Cargando...') {
        if (!button) return;
        
        if (show) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Suscribirse';
        }
    }

    showMessage(message, isSuccess) {
        const icon = isSuccess ? '✅' : '❌';
        alert(`${icon} ${message}`);
    }

async handleMainContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // DEBUG - agregar estas líneas
    console.log('=== DEBUG FORM DATA ===');
    for (let [key, value] of formData.entries()) {
        console.log(key + ':', value);
    }
    
    this.showLoader(form, true);

    try {
        const result = await window.apiService.sendMainContactForm(formData);
        
        if (result.success) {
            this.showMessage(result.message, true);
            form.reset();
        } else {
            this.showMessage(result.message, false);
            if (result.errors) {
                console.log('Errores específicos:', result.errors);
            }
        }
    } catch (error) {
        console.error('Error completo:', error);
        this.showMessage('Error de conexión. Verifica que el servidor esté funcionando.', false);
    } finally {
        this.showLoader(form, false);
    }
}

}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});