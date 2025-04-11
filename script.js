document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.getElementById('video-container');
    
    // Mostrar mensaje de carga
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.textContent = 'Cargando videos...';
    document.body.appendChild(loadingElement);
    
    // Cargar videos desde el archivo JSON
    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo videos.json');
            }
            return response.json();
        })
        .then(videos => {
            // Eliminar mensaje de carga
            document.body.removeChild(loadingElement);
            
            if (!videos || videos.length === 0) {
                showError('No se encontraron videos en el archivo JSON');
                return;
            }
            
            // Crear elementos de video
            videos.forEach((video, index) => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                
                const videoElement = document.createElement('video');
                videoElement.src = video.url;
                videoElement.loop = true;
                videoElement.muted = false; // Los usuarios podrán escuchar el audio
                videoElement.playsInline = true;
                videoElement.preload = 'metadata';
                videoElement.setAttribute('data-index', index);
                
                // Agregar fallback para error de carga
                videoElement.onerror = () => {
                    videoElement.style.display = 'none';
                    const errorMsg = document.createElement('div');
                    errorMsg.textContent = `No se pudo cargar el video: ${video.title}`;
                    errorMsg.style.position = 'absolute';
                    errorMsg.style.top = '50%';
                    errorMsg.style.left = '50%';
                    errorMsg.style.transform = 'translate(-50%, -50%)';
                    errorMsg.style.color = '#fe4980';
                    videoItem.appendChild(errorMsg);
                };
                
                const videoInfo = document.createElement('div');
                videoInfo.className = 'video-info';
                
                const videoTitle = document.createElement('h3');
                videoTitle.textContent = video.title;
                
                videoInfo.appendChild(videoTitle);
                videoItem.appendChild(videoElement);
                videoItem.appendChild(videoInfo);
                videoContainer.appendChild(videoItem);
            });
            
            // Configurar la funcionalidad de reproducción automática
            setupAutoplay();
        })
        .catch(error => {
            document.body.removeChild(loadingElement);
            showError(`Error: ${error.message}`);
        });
    
    // Función para mostrar mensajes de error
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
    }
    
    // Configurar la reproducción automática basada en la visibilidad
    function setupAutoplay() {
        const videos = document.querySelectorAll('.video-item video');
        if (!videos.length) return;
        
        // Reproducir el primer video automáticamente
        if (videos[0]) {
            videos[0].play().catch(e => console.log('Error al reproducir el video:', e));
        }
        
        // Observer para detectar qué video está visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el video es visible en más del 50%
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    // Pausar todos los videos
                    videos.forEach(v => {
                        v.pause();
                    });
                    
                    // Reproducir solo el video visible
                    entry.target.play().catch(e => console.log('Error al reproducir el video:', e));
                }
            });
        }, {
            threshold: 0.5 // Detectar cuando el 50% del video es visible
        });
        
        // Observar todos los videos
        videos.forEach(video => {
            observer.observe(video);
        });
        
        // Manejar scroll manual
        videoContainer.addEventListener('scroll', () => {
            const scrollPos = videoContainer.scrollTop;
            const videoHeight = window.innerHeight;
            
            // Calcular qué video está visible
            const currentVideoIndex = Math.floor(scrollPos / videoHeight + 0.5);
            
            // Pausar todos los videos
            videos.forEach(video => {
                video.pause();
            });
            
            // Reproducir solo el video visible
            if (videos[currentVideoIndex]) {
                videos[currentVideoIndex].play().catch(e => console.log('Error al reproducir el video:', e));
            }
        });
    }
    
    // Manejar clics en los elementos de navegación
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover la clase active de todos los elementos
            navItems.forEach(i => i.classList.remove('active'));
            // Agregar la clase active al elemento clickeado
            item.classList.add('active');
            
            // Aquí podrías agregar la funcionalidad para cambiar de pestaña
            // Por ahora, solo mostraremos un mensaje
            if (!item.classList.contains('active')) {
                alert('Esta funcionalidad no está implementada en esta versión');
            }
        });
    });
});
