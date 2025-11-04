// Sidebar functionality
class Sidebar {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    // Create sidebar HTML if it doesn't exist
    if (!document.getElementById('sidebar')) {
      this.createSidebar();
    }
    
    this.sidebar = document.getElementById('sidebar');
    this.overlay = document.querySelector('.overlay');
    
    // Create overlay if it doesn't exist
    if (!this.overlay) {
      this.createOverlay();
      this.overlay = document.querySelector('.overlay');
    }
    
    this.bindEvents();
  }

  createSidebar() {
    const sidebarHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <button class="close-sidebar" onclick="sidebarInstance.close()">&times;</button>
        </div> 
        <nav class="sidebar-nav">
          <ul>
            <li><a href="perfil.html">Perfil do usuário</a></li>
            <li><a href="avaliacoes.html">Avaliações</a></li>
            <li class="shop-menu">
              <div class="shop-header" onclick="sidebarInstance.toggleShopMenu()">
                <span>SHOP</span>
                <span class="shop-icon">+</span>
              </div>
              <ul class="shop-submenu" id="shop-submenu">
                <li><a href="#" onclick="sidebarInstance.filterProducts('todos')">SHOP TODOS OS PRODUTOS</a></li>
                <li><a href="#" onclick="sidebarInstance.filterProducts('brincos')">BRINCOS</a></li>
                <li><a href="#" onclick="sidebarInstance.filterProducts('colares')">COLARES</a></li>
                <li><a href="#" onclick="sidebarInstance.filterProducts('pulseiras')">PULSEIRAS</a></li>
                <li><a href="#" onclick="sidebarInstance.filterProducts('aneis')">ANÉIS</a></li>
                <li><a href="#" onclick="sidebarInstance.filterProducts('pingentes')">PINGENTES</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
    `;
    
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
  }

  createOverlay() {
    const overlayHTML = '<div class="overlay"></div>';
    document.body.insertAdjacentHTML('beforeend', overlayHTML);
  }

  bindEvents() {
    // Close sidebar when clicking overlay
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Add menu toggle button to existing navigation if it doesn't exist
    this.addMenuToggle();
  }

  addMenuToggle() {
    const nav = document.querySelector('nav, header nav, .top-bar');
    if (nav && !nav.querySelector('.menu-toggle')) {
      const menuButton = document.createElement('button');
      menuButton.className = 'menu-toggle';
      menuButton.innerHTML = '☰';
      menuButton.onclick = () => this.toggle();
      
      // Insert at the beginning of nav
      nav.insertBefore(menuButton, nav.firstChild);
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.add('open');
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
    }
  }

  close() {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.remove('open');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  }

  toggleShopMenu() {
    const submenu = document.getElementById('shop-submenu');
    const icon = document.querySelector('.shop-icon');
    
    if (submenu && icon) {
      if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
        icon.textContent = '+';
      } else {
        submenu.style.display = 'block';
        icon.textContent = '-';
      }
    }
  }

  filterProducts(category) {
    const products = document.querySelectorAll('.produto-card, .product-card');
    
    products.forEach(product => {
      if (category === 'todos') {
        product.style.display = 'block';
      } else {
        const productCategory = product.getAttribute('data-categoria');
        if (productCategory === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      }
    });
    
    this.close();
  }
}

// Initialize sidebar when DOM is loaded
let sidebarInstance;

document.addEventListener('DOMContentLoaded', function() {
  sidebarInstance = new Sidebar();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sidebar;
}