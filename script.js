document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Fonction pour mettre à jour le mode
  const updateMode = (isDark) => {
    if (isDark) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
    localStorage.setItem('darkMode', isDark);
  };

  // Initialisation
  const storedMode = localStorage.getItem('darkMode');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedMode === null) {
    updateMode(systemPrefersDark);
  } else {
    updateMode(storedMode === 'true');
  }

  // Gestion du clic
  darkModeToggle.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark-mode');
    updateMode(isDark);
    createParticles(darkModeToggle, isDark ? 'var(--neon-blue)' : 'var(--neon-pink)');
  });

  // Navigation Indicator
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const navContainer = e.target.closest('.nav-container');
      const indicator = navContainer.querySelector('.nav-indicator');
      const target = e.target;
      
      gsap.to(indicator, {
        width: target.offsetWidth,
        left: target.offsetLeft,
        backgroundColor: 'rgba(157, 0, 255, 0.3)',
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      const indicator = document.querySelector('.nav-indicator');
      gsap.to(indicator, {
        width: 0,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        duration: 0.3
      });
    });
  });

  // Gestion de la sélection des couleurs pour les jackets
  document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener('click', function() {
      // Retire la classe 'selected' de tous les boutons
      document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Ajoute la classe 'selected' au bouton cliqué
      this.classList.add('selected');
      
      // Change l'image en fonction de la couleur sélectionnée
      const jacketImage = document.getElementById('jacket-image');
      const newImage = this.getAttribute('data-image');
      const colorName = this.getAttribute('title');
      
      // Animation de transition
      gsap.to(jacketImage, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          jacketImage.src = newImage;
          jacketImage.alt = `Neon Cyber Jacket ${colorName}`;
          gsap.to(jacketImage, {
            opacity: 1,
            duration: 0.3
          });
        }
      });
    });
  });

  // Cart Functionality
  const setupCart = () => {
    const cartButtons = document.querySelectorAll('.cyber-button-small');
    const cartBadge = document.querySelector('.cart-counter');
    let cartCount = 0;
    
    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        cartCount++;
        cartBadge.textContent = cartCount;
        
        gsap.to(button, {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
      });
    });
  };

  // 3D Viewer Initialization
  const init3DViewer = () => {
    const container = document.querySelector('.cyber-3d-container');
    if (!container) return;
  
    // Optionnel: Animation GSAP pour l'image
    gsap.from('.cyber-3d-image', {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power2.out",
      delay: 0.5
    });
  
    // Effet hover amélioré
    const image = document.querySelector('.cyber-3d-image');
    image.addEventListener('mousemove', (e) => {
      const x = e.offsetX / image.offsetWidth * 100;
      const y = e.offsetY / image.offsetHeight * 100;
      image.style.transform = `scale(1.02) perspective(1000px) rotateX(${(y - 50) / 10}deg) rotateY(${(50 - x) / 10}deg)`;
      image.style.boxShadow = `${(x - 50) / 5}px ${(y - 50) / 5}px 30px rgba(157, 0, 255, 0.5)`;
    });
  
    image.addEventListener('mouseleave', () => {
      image.style.transform = 'scale(1)';
      image.style.boxShadow = '0 0 30px rgba(157, 0, 255, 0.3)';
    });
  };

  // Initialize all components
  const init = () => {
    setupCart();
    init3DViewer();
    
    // Header animation
    gsap.from('.cyber-header', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  };

  init();
});

// Particle Effect
function createParticles(element, color) {
  const particles = [];
  const rect = element.getBoundingClientRect();
  const baseX = rect.left + rect.width/2;
  const baseY = rect.top + rect.height/2;
  
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    document.body.appendChild(particle);
    
    particles.push({
      element: particle,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 0.5 + Math.random() * 0.5,
      age: 0
    });
  }
  
  const animate = () => {
    particles.forEach((p, i) => {
      p.age += 0.016;
      p.x += p.vx;
      p.y += p.vy;
      
      p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
      p.element.style.opacity = 1 - (p.age / p.life);
      
      if (p.age >= p.life) {
        p.element.remove();
        particles.splice(i, 1);
      }
    });
    
    if (particles.length) requestAnimationFrame(animate);
  };
  
  animate();
}
