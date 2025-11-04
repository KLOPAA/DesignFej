// Sistema de pesquisa universal
class UniversalSearch {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupSearch();
    });
  }

  setupSearch() {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-icon');

    if (searchIcon && searchInput) {
      const performSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
          this.searchProducts(searchTerm);
        } else {
          this.showAllProducts();
        }
      };

      searchIcon.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
      searchInput.addEventListener('input', performSearch);
    }
  }

  searchProducts(term) {
    const products = document.querySelectorAll('.produto-card, .product-card, .wishlist-item, .cupom-card');
    
    products.forEach(product => {
      const name = product.querySelector('h3, h4')?.textContent.toLowerCase() || '';
      const description = product.querySelector('p')?.textContent.toLowerCase() || '';
      
      if (name.includes(term) || description.includes(term)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  }

  showAllProducts() {
    const products = document.querySelectorAll('.produto-card, .product-card, .wishlist-item, .cupom-card');
    products.forEach(product => {
      product.style.display = 'block';
    });
  }
}

// Inicializar pesquisa universal
new UniversalSearch();