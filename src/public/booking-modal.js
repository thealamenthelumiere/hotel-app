document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const bookBtn = document.getElementById('bookButton');
  const closeBtn = modal?.querySelector('.close-button');
  const form = document.getElementById('booking-form');
  const authMsg = document.getElementById('modal-auth-msg');
  const roomSelect = document.getElementById('booking-room');
  const errorBox = document.getElementById('booking-error');
  const successBox = document.getElementById('booking-success');
  const submitBtn = document.getElementById('booking-submit');

  if (!modal || !bookBtn) return;

  async function openModal() {
    modal.style.display = 'flex';
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const token = window.api.getToken();
    if (!token) {
      authMsg.style.display = 'block';
      form.style.display = 'none';
      return;
    }

    authMsg.style.display = 'none';
    form.style.display = 'block';

    // Загружаем список номеров через публичный GET (токен добавляется автоматически)
    try {
      const res = await window.api.fetch('/api/rooms');
      const rooms = await res.json();
      roomSelect.innerHTML = '<option value="">— Выберите номер —</option>';
      (rooms.data ?? rooms).forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = `№${r.number} — ${r.type}, ${r.pricePerNight} руб/ночь`;
        roomSelect.appendChild(opt);
      });
    } catch {
      roomSelect.innerHTML = '<option value="">Ошибка загрузки номеров</option>';
    }
  }

  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    submitBtn.disabled = true;

    try {
      // Получаем или создаём профиль гостя для текущего пользователя
      const meRes = await window.api.fetch('/api/guests/me');
      if (!meRes.ok) throw new Error('Не удалось получить профиль гостя');
      const guest = await meRes.json();

      // Создаём бронирование — токен подставляется автоматически
      const bookRes = await window.api.fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          guestId: guest.id,
          roomId: roomSelect.value,
          checkInDate: document.getElementById('booking-checkin').value,
          checkOutDate: document.getElementById('booking-checkout').value,
        }),
      });

      if (!bookRes.ok) {
        const err = await bookRes.json().catch(() => ({}));
        throw new Error(err.message ?? 'Ошибка при бронировании');
      }

      successBox.textContent = 'Бронирование успешно создано! Статус: ожидает подтверждения.';
      successBox.style.display = 'block';
      form.reset();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
    }
  });
});
