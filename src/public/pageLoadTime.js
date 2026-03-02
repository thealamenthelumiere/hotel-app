// scripts/pageLoadTime.js
window.addEventListener('load', function () {
    const loadTime = (performance.now() / 1000).toFixed(3);
    const loadTimeElement = document.createElement('div');
    loadTimeElement.innerText = `Время загрузки страницы: ${loadTime} секунд`;
    loadTimeElement.style.cssText = 'font-size: 14px; color: #333; text-align: center; margin-top: 10px;';
    document.body.appendChild(loadTimeElement);
});
