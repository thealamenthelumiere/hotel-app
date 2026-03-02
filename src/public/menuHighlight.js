// scripts/menuHighlight.js
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('hover');
    });
  
    item.addEventListener('mouseleave', () => {
      item.classList.remove('hover');
    });
  });
