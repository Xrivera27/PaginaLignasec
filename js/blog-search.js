// Datos de los blogs
const blogPosts = [
    {
        id: 1,
        title: "¿Por qué necesito servicios de ciberseguridad si mi empresa es pequeña?",
        category: "Ciberseguridad para pymes",
        image: "images/blog/blog01.jpeg",
        link: "blog-details.html",
        date: "Septiembre 19, 2025"
    },
    {
        id: 2,
        title: "¿Qué es un MSSP y por qué puede marcar la diferencia en tu empresa?",
        category: "Servicios MSSP",
        image: "images/blog/blog02.jpg",
        link: "blog-details1.html",
        date: "Septiembre 20, 2025"
    },
    {
        id: 3,
        title: "Ciberseguridad en la nube: el nuevo frente de batalla para las empresas",
        category: "Ciberseguridad",
        image: "images/blog/blog03.jpg",
        link: "blog-details2.html",
        date: "Septiembre 21, 2025"
    },
    {
        id: 4,
        title: "Análisis de datos: la clave para tomar decisiones inteligentes en tu empresa",
        category: "Analisis de datos",
        image: "images/blog/blog04.jpg",
        link: "blog-details3.html",
        date: "Septiembre 22, 2025"
    }
];

// Función para normalizar texto (remover acentos y convertir a minúsculas)
function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Función para crear el HTML de un post
function createPostHTML(post) {
    return `
        <article class="post prt-blog-classic">
            <div class="featured-imagebox featured-imagebox-post style4">
                <div class="featured-thumbnail">
                    <a href="${post.link}"><img class="img-fluid" src="${post.image}" alt="${post.title}" width="767" height="657"></a>
                </div>
                <div class="featured-content featured-content-post">
                    <div class="post-meta">
                        <span class="prt-meta-line category">
                            <a href="blog.html">${post.category}</a>
                        </span>
                    </div>
                    <div class="featured-title">
                        <h3><a href="${post.link}">${post.title}</a></h3>
                    </div>
                    <div class="prt-postbox-btn">
                        <a class="prt-btn prt-btn-size-sm btn-inline prt-icon-btn-right" href="${post.link}">Más detalles</a>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// Función para mostrar los resultados
function displayResults(results) {
    const blogContainer = document.querySelector('.prt-blog-classic-inner');
    
    if (results.length === 0) {
        blogContainer.innerHTML = `
            <div class="no-results" style="padding: 40px; text-align: center;">
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    results.forEach(post => {
        html += createPostHTML(post);
    });
    
    // Agregar paginación al final
    html += `
        <div class="row">
            <div class="col-md-12 m-auto ">
                <div class="pagination-block text-center prt-pagination">
                    <span class="page-numbers current">1</span>
                    <a class="page-numbers" href="#">2</a>
                    <a class="next page-numbers" href="#"><i class="ti ti-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `;
    
    blogContainer.innerHTML = html;
}

// Función principal de búsqueda
function searchBlog(searchTerm) {
    const normalizedSearch = normalizeText(searchTerm);
    
    if (normalizedSearch === '') {
        // Si no hay término de búsqueda, mostrar todos los posts
        displayResults(blogPosts);
        return;
    }
    
    const results = blogPosts.filter(post => {
        const normalizedTitle = normalizeText(post.title);
        const normalizedCategory = normalizeText(post.category);
        
        return normalizedTitle.includes(normalizedSearch) || 
               normalizedCategory.includes(normalizedSearch);
    });
    
    displayResults(results);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = searchForm.querySelector('input[name="s"]');
    
    // Prevenir el envío del formulario
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        searchBlog(searchTerm);
    });
    
    // Búsqueda en tiempo real (opcional)
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        // Debounce para no buscar en cada tecla
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            searchBlog(searchTerm);
        }, 300);
    });
    
    // Agregar evento a los enlaces de categorías
    const categoryLinks = document.querySelectorAll('.widget-categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryText = this.textContent.trim();
            searchInput.value = categoryText;
            searchBlog(categoryText);
            
            // Scroll suave a los resultados
            document.querySelector('.content-area').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
});