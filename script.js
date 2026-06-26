/**
 * script.js — Invitación Primera Comunión de Saúl Santiago
 *
 * Responsabilidades:
 *  1. Fade-in de la tarjeta al cargar la página.
 *  2. Cuenta regresiva hasta el día del evento.
 *  3. Pequeña animación de "pulse" en los botones de acción
 *     para llamar la atención en la primera visita.
 */

// ── 1. FADE-IN DE ENTRADA ──────────────────────────────────────────────────
(function initFadeIn() {
  const wrapper = document.querySelector('.wrapper, .card-wrapper');
  if (!wrapper) return;

  // Respetamos la preferencia de reduced-motion del sistema
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Si el usuario prefiere menos movimiento, mostramos directamente
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'translateY(0)';
    return;
  }

  // Pequeño delay para que el navegador pinte el estado inicial (opacity: 0)
  // antes de iniciar la transición
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrapper.classList.add('is-visible');
    });
  });
})();


// ── 2. CUENTA REGRESIVA ────────────────────────────────────────────────────
(function initCountdown() {
  // Fecha del evento: 8 de agosto de 2026, 1:30 pm (hora local)
  const eventDate = new Date('2026-08-08T13:30:00');

  // Solo insertamos el contador si el evento aún no ha pasado
  const now = new Date();
  if (now >= eventDate) return;

  // Creamos el contenedor del contador e insertamos antes de los botones
  const actionsEl = document.querySelector('.card__actions');
  if (!actionsEl) return;

  const countdownEl = document.createElement('div');
  countdownEl.className = 'countdown';
  countdownEl.setAttribute('aria-live', 'polite');
  countdownEl.setAttribute('aria-label', 'Cuenta regresiva al evento');

  // Etiquetas para las unidades
  const units = ['días', 'horas', 'min', 'seg'];
  const ids    = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];

  countdownEl.innerHTML = `
    <p class="countdown__label">Faltan</p>
    <div class="countdown__grid">
      ${ids.map((id, i) => `
        <div class="countdown__unit">
          <span class="countdown__value" id="${id}">--</span>
          <span class="countdown__name">${units[i]}</span>
        </div>
      `).join('')}
    </div>
  `;

  // Estilos inline (evita añadir otro archivo CSS solo para esto)
  const style = document.createElement('style');
  style.textContent = `
    .countdown {
      text-align: center;
      margin: 0 0 20px;
    }
    .countdown__label {
      font-family: 'Lato', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #7A8E6E;
      margin-bottom: 8px;
    }
    .countdown__grid {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .countdown__unit {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(201, 168, 106, 0.08);
      border: 1px solid rgba(201, 168, 106, 0.3);
      border-radius: 6px;
      padding: 8px 10px;
      min-width: 54px;
    }
    .countdown__value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem;
      font-weight: 600;
      color: #4A4035;
      line-height: 1;
    }
    .countdown__name {
      font-family: 'Lato', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #7A8E6E;
      margin-top: 3px;
    }
  `;
  document.head.appendChild(style);

  // Insertamos el contador justo antes de los botones
  actionsEl.parentNode.insertBefore(countdownEl, actionsEl);

  // Función que actualiza los valores
  function updateCountdown() {
    const diff = eventDate - new Date();
    if (diff <= 0) {
      clearInterval(timer);
      countdownEl.remove();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('cd-days').textContent    = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown(); // Primer render inmediato
  const timer = setInterval(updateCountdown, 1000);
})();


// ── 3. PULSE EN BOTÓN PRIMARIO (primera visita) ───────────────────────────
(function initPulse() {
  // Solo animamos si el usuario no ha visitado antes (sessionStorage)
  if (sessionStorage.getItem('saul-visited')) return;
  sessionStorage.setItem('saul-visited', '1');

  const primaryBtn = document.querySelector('.btn--primary');
  if (!primaryBtn) return;

  // Añadimos la animación de pulse con un pequeño delay
  // para que no compita con el fade-in de entrada
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const pulseStyle = document.createElement('style');
  pulseStyle.textContent = `
    @keyframes pulseBtn {
      0%   { box-shadow: 0 4px 16px rgba(122, 142, 110, 0.35); }
      50%  { box-shadow: 0 4px 28px rgba(122, 142, 110, 0.65), 0 0 0 8px rgba(122, 142, 110, 0.1); }
      100% { box-shadow: 0 4px 16px rgba(122, 142, 110, 0.35); }
    }
    .btn--primary.pulse-once {
      animation: pulseBtn 1.4s ease 1.2s 2;
    }
  `;
  document.head.appendChild(pulseStyle);

  setTimeout(() => {
    primaryBtn.classList.add('pulse-once');
    primaryBtn.addEventListener('animationend', () => {
      primaryBtn.classList.remove('pulse-once');
    }, { once: true });
  }, 1200);
})();
