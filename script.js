// ==================== MENÚ HAMBURGUESA ==================== 

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('activo');
    hamburger.classList.toggle('activo');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('activo');
        hamburger.classList.remove('activo');
    });
});

// ==================== FILTRADO DE PROYECTOS ====================

const filtros = document.querySelectorAll('.filtro-btn');
const proyectos = document.querySelectorAll('.proyecto-card');

filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
        // Remover clase activo de todos los botones
        filtros.forEach(f => f.classList.remove('activo'));
        
        // Agregar clase activo al botón clickeado
        filtro.classList.add('activo');

        const categoriaSeleccionada = filtro.getAttribute('data-filtro');

        proyectos.forEach((proyecto, indice) => {
            const categorias = proyecto.getAttribute('data-categoria');
            const coincide = categoriaSeleccionada === 'todos' || categorias.includes(categoriaSeleccionada);

            if (coincide) {
                proyecto.style.display = 'flex';
                proyecto.style.transitionDelay = `${indice * 60}ms`;
                requestAnimationFrame(() => {
                    proyecto.style.opacity = '1';
                    proyecto.style.transform = 'scale(1)';
                });
            } else {
                proyecto.style.transitionDelay = '0ms';
                proyecto.style.opacity = '0';
                proyecto.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (proyecto.style.opacity === '0') {
                        proyecto.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});

// ==================== FORMULARIO DE CONTACTO ====================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const mensaje = this.querySelector('textarea').value;

        // Validación básica
        if (!nombre || !email || !mensaje) {
            mostrarAlerta('Por favor completa todos los campos', 'error');
            return;
        }

        // Validar email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            mostrarAlerta('Por favor ingresa un email válido', 'error');
            return;
        }

        // Simular envío
        mostrarAlerta('¡Mensaje enviado correctamente! Te contactaré pronto.', 'exito');
        
        // Limpiar formulario
        this.reset();
    });
}

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    const alertaExistente = document.querySelector('.alerta');
    if (alertaExistente) {
        alertaExistente.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensaje;

    // Agregar estilos a la alerta
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        ${tipo === 'exito' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;

    document.body.appendChild(alerta);

    // Remover alerta después de 4 segundos
    setTimeout(() => {
        alerta.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alerta.remove(), 300);
    }, 4000);
}

// ==================== SCROLL SUAVE Y ANIMACIONES ====================

// Observador de intersección para animaciones al scroll (estilo AOS: fade-up escalonado)
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observador.unobserve(el);
            // Al terminar la revelación, se limpia la transición inline
            // para que el hover vuelva a usar var(--transition) sin retraso.
            el.addEventListener('transitionend', () => {
                el.style.transition = '';
            }, { once: true });
        }
    });
}, {
    threshold: 0.15
});

// Aplicar observador a elementos, escalonando el retraso según su posición dentro de cada grupo
const gruposAnimados = document.querySelectorAll('.resumen-grid, .competencias-grid, .proyectos-grid, .skills-list');

gruposAnimados.forEach(grupo => {
    Array.from(grupo.children).forEach((el, indice) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.7s ease-out ${Math.min(indice * 100, 450)}ms, transform 0.7s ease-out ${Math.min(indice * 100, 450)}ms`;
        observador.observe(el);
    });
});

// ==================== CONTADOR DE ESTADÍSTICAS ====================

function contarHasta(elemento, valor) {
    let contador = 0;
    const incremento = valor / 50;
    const intervalo = setInterval(() => {
        contador += incremento;
        if (contador >= valor) {
            contador = valor;
            clearInterval(intervalo);
        }
        elemento.textContent = Math.floor(contador) + (elemento.textContent.includes('+') ? '+' : '%');
    }, 30);
}

// Activar contador cuando se vea la sección
const estadisticasSection = document.querySelector('.estadisticas');
if (estadisticasSection) {
    let contadorActivado = false;

    const observadorEstadisticas = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !contadorActivado) {
                contadorActivado = true;
                document.querySelectorAll('.estadistica-item h3').forEach(h3 => {
                    const valor = parseInt(h3.textContent);
                    if (!isNaN(valor)) {
                        contarHasta(h3, valor);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    observadorEstadisticas.observe(estadisticasSection);
}

// ==================== NAVEGACIÓN ACTIVA EN NAVBAR ====================

window.addEventListener('scroll', () => {
    const secciones = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let seccionActual = '';

    secciones.forEach(seccion => {
        const distancia = seccion.offsetTop - window.innerHeight / 2;
        if (window.scrollY >= distancia) {
            seccionActual = seccion.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('activo');
        if (link.getAttribute('href') === `#${seccionActual}`) {
            link.classList.add('activo');
        }
    });
});

// ==================== EFECTO DE SCROLL SUAVE PERSONALIZADO ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const elemento = document.querySelector(href);
            if (elemento) {
                elemento.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== ANIMACIÓN DE CARGA INICIAL ====================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Agregar estilos CSS para animaciones
const estilosAnimaciones = document.createElement('style');
estilosAnimaciones.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .nav-link.activo {
        color: var(--primary-color);
    }
`;
document.head.appendChild(estilosAnimaciones);

// ==================== DETALLES DE COMPATIBILIDAD MOBILE ====================

// Detectar si es móvil
function esMobile() {
    return window.innerWidth <= 768;
}

// Ajustar comportamiento según tamaño de pantalla
window.addEventListener('resize', () => {
    if (!esMobile() && navMenu.classList.contains('activo')) {
        navMenu.classList.remove('activo');
        hamburger.classList.remove('activo');
    }
});

// ==================== INICIALIZACIÓN ====================

console.log('Portfolio cargado correctamente ✓');
console.log('Utiliza las opciones de filtrado para ver proyectos por categoría');
