document.addEventListener('DOMContentLoaded', () => {
    // Wrapper for smooth grid animation
    document.querySelectorAll('.scene-content').forEach(content => {
        const inner = document.createElement('div');
        inner.className = 'scene-content-inner';
        while (content.firstChild) {
            inner.appendChild(content.firstChild);
        }
        content.appendChild(inner);
    });

    initProgressObserver();
    initDrawerMenu();
});

function startReading() {
    // Rolar até Detalhes da Peça e abrir se estiver fechada
    const detailsSection = document.getElementById('scene-1');
    if (detailsSection) {
        if (!detailsSection.classList.contains('expanded')) {
            detailsSection.classList.add('expanded');
        }
        detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 1. Intersection Observer for Header & Progress
function initProgressObserver() {
    const topNav = document.getElementById('top-nav');
    const hero = document.getElementById('hero');
    const currentSceneText = document.getElementById('current-scene');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    
    const scenes = Array.from(document.querySelectorAll('.scene-section'));

    // Observer to hide/show header based on Hero visibility
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                topNav.classList.add('hidden');
            } else {
                topNav.classList.remove('hidden');
            }
        });
    }, { threshold: 0.1 });
    
    if (hero) heroObserver.observe(hero);

    // Update Progress on Scroll
    window.addEventListener('scroll', () => {
        if (!scenes.length) return;
        
        // Calculate percentage (ignoring hero height)
        const heroHeight = hero ? hero.offsetHeight : 0;
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        let percentage = 0;
        if (scrollPosition > heroHeight) {
            const scrollableDistance = documentHeight - heroHeight - windowHeight;
            const currentScroll = scrollPosition - heroHeight;
            percentage = Math.min(100, Math.max(0, (currentScroll / scrollableDistance) * 100));
        }
        
        const percValue = Math.round(percentage);
        progressText.innerText = `${percValue}%`;
        progressBar.style.width = `${percentage}%`;

        // Determine current scene
        let currentTitle = 'Detalhes da Peça';
        // Check which scene is near the top of the viewport
        for (let i = scenes.length - 1; i >= 0; i--) {
            const rect = scenes[i].getBoundingClientRect();
            // If the top of the scene is above the middle of the screen
            if (rect.top <= windowHeight / 3) {
                currentTitle = scenes[i].getAttribute('data-title');
                updateMenuHighlight(scenes[i].id);
                break;
            }
        }
        currentSceneText.innerText = currentTitle;
    });
}

// 2. Fullscreen Logic
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('fullscreen-btn');
    if (document.fullscreenElement) {
        btn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        btn.setAttribute('title', 'Sair da Tela Cheia');
        btn.setAttribute('aria-label', 'Sair da Tela Cheia');
    } else {
        btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        btn.setAttribute('title', 'Tela Cheia');
        btn.setAttribute('aria-label', 'Tela Cheia');
    }
});

// 3. Drawer Menu Logic
function initDrawerMenu() {
    const drawerList = document.getElementById('drawer-list');
    const scenes = document.querySelectorAll('.scene-section');
    
    drawerList.innerHTML = '';
    
    scenes.forEach(scene => {
        const title = scene.getAttribute('data-title');
        const id = scene.id;
        
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerText = title;
        btn.id = `menu-link-${id}`;
        btn.onclick = () => {
            toggleMenu();
            scene.scrollIntoView({ behavior: 'smooth' });
        };
        li.appendChild(btn);
        drawerList.appendChild(li);
    });
}

function toggleMenu() {
    const drawer = document.getElementById('drawer-menu');
    const overlay = document.getElementById('drawer-overlay');
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
}

function updateMenuHighlight(activeId) {
    document.querySelectorAll('.drawer-list button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`menu-link-${activeId}`);
    if (activeBtn) activeBtn.classList.add('active');
}
// 4. Accordion Logic
function toggleScene(headerElement) {
    const sceneSection = headerElement.closest('.scene-section');
    sceneSection.classList.toggle('expanded');
}



// Removed unused Audio Player code that was causing JS errors
