// Animated counter for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const count = parseInt(counter.innerText.replace('+', ''));
      const increment = target / speed;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment) + '+';
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target + '+';
      }
    });
  }
  
  // Initialize when page loads
  window.addEventListener('load', () => {
    // Hide loading screen
    document.querySelector('.loading-screen').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
    
    // Start counter animations
    setTimeout(animateCounters, 1000);
    
    // Add testimonial carousel navigation
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      let isDown = false;
      let startX;
      let scrollLeft;
  
      carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      });
  
      carousel.addEventListener('mouseleave', () => {
        isDown = false;
      });
  
      carousel.addEventListener('mouseup', () => {
        isDown = false;
      });
  
      carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
      });
    }
  });