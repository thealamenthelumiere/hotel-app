document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const preloader = document.getElementById('preloader');
    const loadButton = document.getElementById('load-reviews');

    const fetchReviews = async () => {
        try {
            // Показываем анимированный preloader (CSS-анимация описана в style.css)
            preloader.style.display = 'flex';
            // Псевдо-случайная фильтрация:
            // Если случайное число меньше 0.5, выбираем комментарии с id>=100, иначе id<=200
            const filterParam = Math.random() < 0.5 ? 'id_gte=100' : 'id_lte=200';
            const response = await fetch(`https://jsonplaceholder.typicode.com/comments?${filterParam}&_limit=10`);
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            const reviews = await response.json();
            preloader.style.display = 'none';
            reviewsContainer.innerHTML = '';
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                reviewElement.innerHTML = `
                    <h3>${review.name}</h3>
                    <p><strong>Email:</strong> ${review.email}</p>
                    <p>${review.body}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        } catch (error) {
            preloader.style.display = 'none';
            reviewsContainer.innerHTML = `<p style="color: red;">⚠ Что-то пошло не так: ${error.message}</p>`;
        }
    };

    loadButton.addEventListener('click', fetchReviews);
    fetchReviews();
});
