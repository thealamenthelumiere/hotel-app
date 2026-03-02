// scripts/button.js
document.getElementById('bookButton').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
});

document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
});
// Функция для открытия и закрытия меню на мобильных устройствах
function toggleMenu() {
    document.getElementById('main-nav').classList.toggle('active');
}

