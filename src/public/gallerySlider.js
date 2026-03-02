// Инициализация слайдера Swiper для галереи отеля
// Параметры конфигурации:
//   - loop: включает зацикливание слайдов
//   - pagination: элемент для пагинации, позволяет переключаться по клику
//   - navigation: элементы для кнопок "вперед" и "назад"
const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true, // Позволяет переключаться по клику на точках пагинации
    },
    navigation: {
        nextEl: '.swiper-button-next', // Кнопка "вперед"
        prevEl: '.swiper-button-prev', // Кнопка "назад"
    },
});
