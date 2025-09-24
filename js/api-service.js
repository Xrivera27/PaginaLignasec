// Frontend/js/api-service.js - DEBUG COMPLETO
class APIService {
    constructor() {
        this.baseURL = '/Lignase%20Page/Backend/api/';
    }

    async sendContactForm(formData) {
        try {
            console.log('Conectando a:', this.baseURL + 'contact_popup.php');
            
            const response = await fetch(this.baseURL + 'contact_popup.php', {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));
            
            // VER EXACTAMENTE QUÉ DEVUELVE EL SERVIDOR
            const responseText = await response.text();
            console.log('RAW RESPONSE:', responseText);
            console.log('RESPONSE LENGTH:', responseText.length);
            console.log('FIRST 100 CHARS:', responseText.substring(0, 100));

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Intentar parsear JSON
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('JSON PARSED OK:', data);
            } catch (jsonError) {
                console.error('JSON PARSE ERROR:', jsonError);
                console.error('TRYING TO PARSE:', responseText);
                throw new Error(`Invalid JSON from server: ${responseText.substring(0, 200)}`);
            }

            return data;
            
        } catch (error) {
            console.error('Error en contacto:', error);
            throw error;
        }
    }

    async subscribeNewsletter(formData) {
    try {
        const response = await fetch(this.baseURL + 'newsletter.php', {
            method: 'POST',
            body: formData
        });

        const responseText = await response.text();
        let cleanJson = responseText;
        
        // Limpiar warnings PHP del JSON (igual que en contacto)
        const jsonStart = responseText.indexOf('{');
        if (jsonStart > 0) {
            cleanJson = responseText.substring(jsonStart);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(cleanJson);
        console.log('Newsletter procesado correctamente:', data);
        
        return data;
        
    } catch (error) {
        console.error('Error en newsletter:', error);
        throw error;
    }
}

async sendMainContactForm(formData) {
    try {
        const response = await fetch(this.baseURL + 'contact_main.php', {
            method: 'POST',
            body: formData
        });

        const responseText = await response.text();
        let cleanJson = responseText;
        
        // Limpiar warnings PHP del JSON
        const jsonStart = responseText.indexOf('{');
        if (jsonStart > 0) {
            cleanJson = responseText.substring(jsonStart);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(cleanJson);
        console.log('Contacto principal procesado:', data);
        
        return data;
        
    } catch (error) {
        console.error('Error en contacto principal:', error);
        throw error;
    }
}
}

window.apiService = new APIService();