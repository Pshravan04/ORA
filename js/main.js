import 'https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initGSAP();
    initThreeJS();
    initCustomCursor();
    initHeaderScroll();
});

// --- Smooth Scrolling (Lenis) ---
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keep GSAP ScrollTrigger in sync with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);
    }
}

// --- GSAP Animations (Emil Kowalski / Impeccable style) ---
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up + Glass Blur Reveals
    const fadeElements = document.querySelectorAll('[data-animate="fade-up"]');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50, filter: 'blur(10px)' },
            { 
                opacity: 1, y: 0, filter: 'blur(0px)',
                duration: 1.2, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Parallax Images
    const parallaxImages = document.querySelectorAll('[data-parallax="true"] img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Horizontal Scroll for Projects
    const horizontalSection = document.querySelector('.projects-horizontal');
    if (horizontalSection) {
        const track = horizontalSection.querySelector('.projects-track');
        let trackWidth = track.offsetWidth;
        let windowWidth = window.innerWidth;
        
        gsap.to(track, {
            x: () => -(trackWidth - windowWidth + (windowWidth * 0.1)),
            ease: 'none',
            scrollTrigger: {
                trigger: horizontalSection,
                pin: true,
                start: 'top top',
                end: () => `+=${trackWidth}`,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }

    // Number Counter Stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const suffix = stat.getAttribute('data-suffix') || '';
        gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
            },
            onUpdate: function() {
                stat.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
            }
        });
    });
}

// --- Three.js Integration (Luxury 3D Elements) ---
function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const heroCanvasContainer = document.getElementById('hero-3d');
    if (heroCanvasContainer) {
        setupThreeScene(heroCanvasContainer, 'torus');
    }

    const aboutCanvasContainer = document.getElementById('about-3d');
    if (aboutCanvasContainer) {
        setupThreeScene(aboutCanvasContainer, 'icosahedron');
    }
}

function setupThreeScene(container, shapeType) {
    const scene = new THREE.Scene();
    
    // Transparent background
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // Premium Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xB8955D, 2, 10); // Luxury Gold light
    pointLight.position.set(-2, -2, 2);
    scene.add(pointLight);

    // Luxury Material (Gold / Marble feel)
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xE7DCCF, // Primary Cream
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.2, // Glass-like effect
        thickness: 0.5,
    });

    let geometry;
    if (shapeType === 'torus') {
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
    } else {
        geometry = new THREE.IcosahedronGeometry(1.5, 0);
        // wireframe overlay
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xB8955D, wireframe: true, transparent: true, opacity: 0.3 });
        const wireframe = new THREE.Mesh(geometry, wireMaterial);
        wireframe.scale.set(1.01, 1.01, 1.01);
        scene.add(wireframe);
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Floating Animation
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.002;
        mesh.position.y = Math.sin(t) * 0.2; // Float up and down

        scene.children.forEach(child => {
            if (child.type === 'Mesh' && child !== mesh) {
                child.rotation.y += 0.005;
                child.rotation.x += 0.002;
                child.position.y = Math.sin(t) * 0.2;
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// --- Custom Cursor ---
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Add styles dynamically or assume they are in CSS
    cursor.style.position = 'fixed';
    cursor.style.top = '0';
    cursor.style.left = '0';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'var(--color-luxury-gold)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.3s, height 0.3s, background-color 0.3s';
    cursor.style.mixBlendMode = 'difference';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        // smooth follow
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.backgroundColor = 'var(--color-off-white)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--color-luxury-gold)';
        });
    });
}

// --- Header Scroll Effect ---
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
