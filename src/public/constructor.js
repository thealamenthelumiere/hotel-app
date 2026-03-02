document.addEventListener('DOMContentLoaded', () => {
    // Элементы формы
    const form = document.getElementById('schedule-form');
    const container = document.getElementById('schedule-container');
    const eventsInput = document.getElementById('events-per-day');
    const languageSelect = document.getElementById('language');
    const weekTypeSelect = document.getElementById('week-type');
    const leisureInputs = document.querySelectorAll('input[name="leisure"]');

    // Загрузка сохранённых параметров из localStorage
    if (localStorage.getItem('scheduleParams')) {
        const savedParams = JSON.parse(localStorage.getItem('scheduleParams'));
        if (savedParams.eventsPerDay) eventsInput.value = savedParams.eventsPerDay;
        if (savedParams.language) languageSelect.value = savedParams.language;
        if (savedParams.weekType) weekTypeSelect.value = savedParams.weekType;
        if (savedParams.leisure) {
            leisureInputs.forEach(input => {
                input.checked = savedParams.leisure.includes(input.value);
            });
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Собираем выбранные досуги
        const selectedLeisure = Array.from(document.querySelectorAll('input[name="leisure"]:checked'))
            .map(el => el.value);
        if (selectedLeisure.length === 0) {
            alert(languageSelect.value === 'ru'
                ? "Пожалуйста, выберите хотя бы одно мероприятие."
                : "Please select at least one event.");
            return;
        }

        // Сохраняем параметры в localStorage
        const params = {
            eventsPerDay: eventsInput.value,
            language: languageSelect.value,
            weekType: weekTypeSelect.value,
            leisure: selectedLeisure
        };
        localStorage.setItem('scheduleParams', JSON.stringify(params));

        // Получаем значения из формы
        const maxEventsPerDay = parseInt(eventsInput.value, 10);
        const language = languageSelect.value;
        const weekDaysCount = parseInt(weekTypeSelect.value, 10);

        // Задаём список дней в зависимости от выбранного типа недели
        const days = language === 'ru'
            ? (weekDaysCount === 5
                ? ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
                : ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'])
            : (weekDaysCount === 5
                ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

        const timesOfDay = language === 'ru'
            ? ['Утро', 'День', 'Вечер', 'Ночь']
            : ['Morning', 'Afternoon', 'Evening', 'Night'];

        // Названия мероприятий для каждого ключа
        const eventNames = {
            spa: language === 'ru' ? 'Спа‑процедуры' : 'Spa Session',
            yoga: language === 'ru' ? 'Йога на террасе' : 'Yoga on the Terrace',
            tour: language === 'ru' ? 'Экскурсия по городу' : 'City Tour',
            cooking: language === 'ru' ? 'Мастер‑класс по кулинарии' : 'Cooking Masterclass',
            pool: language === 'ru' ? 'Бассейн и сауна' : 'Pool & Sauna'
        };

        // Очищаем контейнер с результатом
        container.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('schedule-table');

        // Заголовок таблицы (времена суток)
        const headerRow = document.createElement('tr');
        const emptyHeader = document.createElement('td');
        headerRow.appendChild(emptyHeader);
        timesOfDay.forEach(time => {
            const timeCell = document.createElement('td');
            timeCell.textContent = time;
            headerRow.appendChild(timeCell);
        });
        table.appendChild(headerRow);

        // Генерация строк для каждого дня
        days.forEach(day => {
            const row = document.createElement('tr');
            const dayCell = document.createElement('td');
            dayCell.textContent = day;
            row.appendChild(dayCell);

            // Перемешиваем времена суток и выбираем нужное количество (максимум maxEventsPerDay)
            const shuffledTimes = [...timesOfDay]
                .sort(() => Math.random() - 0.5)
                .slice(0, maxEventsPerDay);

            timesOfDay.forEach(time => {
                const eventCell = document.createElement('td');
                if (shuffledTimes.includes(time)) {
                    // Выбираем случайное мероприятие из выбранных пользователем
                    const randomEvent = selectedLeisure[Math.floor(Math.random() * selectedLeisure.length)];
                    eventCell.textContent = eventNames[randomEvent];
                }
                row.appendChild(eventCell);
            });

            table.appendChild(row);
        });

        container.appendChild(table);
    });
});
