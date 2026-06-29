/**
 * Cyber-Conversion Portfolio — Main App
 * ======================================
 * Scroll animations, nav, glow effects, counters
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavScroll();
  initHamburger();
  initReveal();
  initHeroAnimations();
  initTiltInteractive();
  initSmoothScroll();
  initCounters();
  initVideoLoop();
  initPortfolioCarousel();
  initModalGallery();
  initAuditForm();
  initGlowHover();
  initFAQ();
  initDynamicYear();
  initProcessTimeline();
  initBeforeAfterSlider();
  initHeroParallax();
});

/* ─── Nav glass on scroll ─── */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Hamburger menu (mobile) ─── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ─── IntersectionObserver — smooth reveals ─── */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ─── Hero Initial Animations (Non-cyclical) ─── */
function initHeroAnimations() {
  // Trigger animations shortly after load for smooth feel
  setTimeout(() => {
    document.querySelectorAll('.reveal-once, .mask-reveal').forEach(el => {
      el.classList.add('animate');
    });
  }, 100);
}

/* ─── 3D Tilt Effect for Photo (Interactive, non-cyclical) ─── */
function initTiltInteractive() {
  const cards = document.querySelectorAll('.tilt-interactive');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
      const tiltY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.6s var(--ease-out-expo)';
    });
  });
}

/* ─── Smooth scroll to anchors ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 90; // nav height + bar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─── Animated counters ─── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ─── Video Loop Transition ─── */
function initVideoLoop() {
  const introVideo = document.getElementById('introVideo');
  const loopVideo = document.getElementById('loopVideo');

  if (!introVideo || !loopVideo) return;

  introVideo.addEventListener('ended', () => {
    // Start loop video
    loopVideo.play();
    // Crossfade: bring loop video up and intro video down
    loopVideo.style.opacity = '0.5'; 
    introVideo.style.opacity = '0';
  });
}

/* ─── Portfolio Carousel ─── */
function initPortfolioCarousel() {
  const wrapper = document.querySelector('.portfolio-carousel-wrapper');
  const track = document.getElementById('portfolioCarousel');
  if (!wrapper || !track) return;

  let isDown = false;
  let startX;
  let dragScrollLeft; 
  let autoScrollAnimation;
  let exactScrollLeft = 0;
  let isHovering = false;

  // Clone slides to ensure the track is wide enough for infinite scroll on large screens
  const originalSlides = Array.from(track.children);
  // We need enough sets so that track.scrollWidth/2 is guaranteed to be reachable.
  // Appending 2 more full sets of the original items.
  originalSlides.forEach(slide => {
    const clone1 = slide.cloneNode(true);
    track.appendChild(clone1);
  });
  
  // Now we have plenty of width.
  // The 'halfWidth' wrap point is exactly half of the new track's scrollWidth.
  // BUT wait, it's safer to just define wrap width as exactly half.
  // isDragging tracker prevents click when user meant to drag
  let isDragging = false;
  wrapper.addEventListener('mousemove', (e) => {
    if (e.buttons > 0) isDragging = true;
  });
  wrapper.addEventListener('mousedown', () => { isDragging = false; });

  // Re-attach click listeners to ALL slides (including clones)
  document.querySelectorAll('.portfolio-slide').forEach(slide => {
    // Add click hint indicator
    if (!slide.querySelector('.portfolio-slide__click-hint')) {
      const hint = document.createElement('span');
      hint.className = 'portfolio-slide__click-hint';
      hint.textContent = 'Нажми чтобы посмотреть';
      slide.appendChild(hint);
    }

    slide.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        return;
      }
      if (window.openModal) window.openModal(slide.dataset.case);
    });
  });

  // Infinite Scroll Logic
  let autoScrollPaused = false;
  let pauseTimeout;

  const startAutoScroll = () => {
    if (autoScrollAnimation) cancelAnimationFrame(autoScrollAnimation);
    exactScrollLeft = wrapper.scrollLeft;
    
    const scroll = () => {
      if (autoScrollPaused || isDown) {
        exactScrollLeft = wrapper.scrollLeft;
      } else {
        exactScrollLeft += 0.5;
        wrapper.scrollLeft = exactScrollLeft;
      }
      
      const halfWidth = track.scrollWidth / 2;
      
      if (wrapper.scrollLeft >= halfWidth) {
        exactScrollLeft -= halfWidth;
        wrapper.scrollLeft = exactScrollLeft;
        if (isDown) dragScrollLeft -= halfWidth;
      } else if (wrapper.scrollLeft <= 0 && isDown) {
        exactScrollLeft += halfWidth;
        wrapper.scrollLeft = exactScrollLeft;
        dragScrollLeft += halfWidth;
      }

      autoScrollAnimation = requestAnimationFrame(scroll);
    };
    autoScrollAnimation = requestAnimationFrame(scroll);
  };

  // Pause auto-scroll on touch/mouse, resume after 3s
  const pauseAutoScroll = () => {
    autoScrollPaused = true;
    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => {
      autoScrollPaused = false;
      exactScrollLeft = wrapper.scrollLeft;
    }, 3000);
  };

  wrapper.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  wrapper.addEventListener('mousedown', pauseAutoScroll);
  wrapper.addEventListener('wheel', pauseAutoScroll, { passive: true });

  // Wait for the reveal animation to finish before starting auto-scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(startAutoScroll, 2500); // Wait 2.5s for stagger entrance animation to complete
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(wrapper);

  // Mouse drag logic
  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    wrapper.style.cursor = 'grabbing';
    startX = e.pageX - wrapper.offsetLeft;
    dragScrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => {
    isDown = false;
    wrapper.style.cursor = 'grab';
    isHovering = false;
  });
  wrapper.addEventListener('mouseenter', () => {
    isHovering = true;
  });
  wrapper.addEventListener('mouseup', () => {
    isDown = false;
    wrapper.style.cursor = 'grab';
  });
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    wrapper.scrollLeft = dragScrollLeft - walk;
  });

  // Touch logic
  wrapper.addEventListener('touchstart', () => { isHovering = true; }, {passive: true});
  wrapper.addEventListener('touchend', () => { isHovering = false; }, {passive: true});
}

/* ─── Modal Gallery ─── */
function initModalGallery() {
  const modal = document.getElementById('modalGallery');
  const scrollContainer = document.getElementById('modalScrollContent');
  const scrollContent = document.getElementById('modalGridContent') || scrollContainer;
  const closeBtn = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');

  const galleryData = {
    'case1': [
      { src: 'static/images/keis1/1.png', cap: 'Обложка: Контрастная презентация умного мультиметра с акцентом на подарок и авто-выбор режима.' },
      { src: 'static/images/keis1/2.png', cap: 'Простота: Разбор ключевых характеристик (4000 отсчетов, автодиапазон) для закрытия страха сложности.' },
      { src: 'static/images/keis1/3.png', cap: 'Защита: Демонстрация прорезиненного чехла для подтверждения ударопрочности и долговечности.' },
      { src: 'static/images/keis1/4.png', cap: 'Тест непрерывности: Визуализация работы индикатора и звукового сигнала для проверки проводки.' },
      { src: 'static/images/keis1/5.png', cap: 'Бесконтактный тест: Функция NCV для безопасного поиска скрытой проводки под напряжением.' },
      { src: 'static/images/keis1/6.png', cap: 'Умный режим: Автоматический выбор измеряемой величины без ручной настройки — триггер удобства.' }
    ],
    'case2': [
      { src: 'static/images/Keis2/1.png', cap: 'Обложка: Крупный 3D-рендер лазерного уровня с выносом главных УТП (японский излучатель SHARP).' },
      { src: 'static/images/Keis2/2.png', cap: 'Автовыравнивание: Наглядная инфографика работы компенсатора при наклонах корпуса нивелира.' },
      { src: 'static/images/Keis2/3.png', cap: 'Габариты: Компактный размер прибора в миллиметрах для демонстрации удобства работы.' },
      { src: 'static/images/Keis2/4.png', cap: 'Яркость: Презентация 4 режимов яркости луча (100%-25%) для работы при любом освещении.' },
      { src: 'static/images/Keis2/5.png', cap: 'Защита IP54: Демонстрация устойчивости корпуса прибора к воздействию брызг воды и пыли.' },
      { src: 'static/images/Keis2/6.png', cap: 'Комплектация: Четкая раскладка набора (нивелир, кронштейн, переходник, батарейки, инструкция).' }
    ],
    'case3': [
      { src: 'static/images/keis3/1.png', cap: 'Обложка: Премиальный дизайн какао-порошка с МСТ-маслом на кето-диете без сахара.' },
      { src: 'static/images/keis3/2.png', cap: 'Энергия: Слайд о быстром заряде энергии без скачков сахара за счет МСТ-масла из Кот-д\'Ивуара.' },
      { src: 'static/images/keis3/3.png', cap: 'Применение: Иллюстрация вариантов использования продукта (выпечка, смузи, напитки, десерты).' },
      { src: 'static/images/keis3/4.png', cap: 'Польза: Детальный разбор влияния компонентов на тонус, мозг и минеральный баланс.' },
      { src: 'static/images/keis3/5.png', cap: 'Качество: Преимущества алкализованного помола, вкуса и герметичной упаковки продукта.' }
    ],
    'case4': [
      { src: 'static/images/Keis4/1.png', cap: 'Обложка: Яркий игровой дизайн ретро-приставки с выносом УТП (45000 игр, 2 флеш-карты, батарейки).' },
      { src: 'static/images/Keis4/2.png', cap: 'Комплектация: Визуальный состав набора с беспроводными геймпадами для игры вдвоем.' },
      { src: 'static/images/Keis4/3.png', cap: 'Мощность: Акцент на быстродействии процессора нового поколения для стабильного геймплея.' }
    ],
    'case5': [
      { src: 'static/images/Keis5/1.png', cap: 'Обложка: Стильный минималистичный дизайн вытяжного вентилятора с выносом основных УТП.' },
      { src: 'static/images/Keis5/2.png', cap: 'Применение: Показ зон установки (ванная, кухня, туалет) и преимуществ удаления влаги.' },
      { src: 'static/images/Keis5/3.png', cap: 'Комплектация: Детальная взрыв-схема компонентов и комплекта креплений вентилятора.' },
      { src: 'static/images/Keis5/4.png', cap: 'Чертеж: Точные габариты и вес устройства для легкого планирования монтажа.' },
      { src: 'static/images/Keis5/5.png', cap: 'Надежность: Слайд с условиями гарантии 3 года и адресами сервисных центров.' }
    ],
    'case6': [
      { src: 'static/images/Keis6/1.png', cap: 'Обложка: Премиальная инфографика инверторного кондиционера с акцентом на площадь и бесшумность.' },
      { src: 'static/images/Keis6/2.png', cap: 'Площадь: Рекомендации по установке кондиционера в спальню, офис, гостиную или кабинет.' },
      { src: 'static/images/Keis6/3.png', cap: 'Универсальность: Описание 4 режимов работы (охлаждение, обогрев, осушение, вентиляция).' },
      { src: 'static/images/Keis6/4.png', cap: 'Инвертор: Объяснение преимуществ инверторной технологии (класс А, экономия до 40%).' },
      { src: 'static/images/Keis6/5.png', cap: 'Технология iFeel: Пояснение принципа работы датчика температуры в пульте управления.' },
      { src: 'static/images/Keis6/6.png', cap: 'Ночной режим: Демонстрация функции комфортного сна с минимальным уровнем шума.' },
      { src: 'static/images/Keis6/7.png', cap: 'Управление: Информативный русифицированный пульт с подсветкой и разбором всех кнопок.' }
    ],
    'case7': [
      { src: 'static/images/Keis7/1.png', cap: 'Обложка: Эмоциональный дизайн пищащей игрушки для собак с акцентом на прочность.' },
      { src: 'static/images/Keis7/2.png', cap: 'Польза: Иллюстрация преимуществ для питомца (чистка зубов, борьба со стрессом и скукой).' },
      { src: 'static/images/Keis7/3.png', cap: 'Применимость: Перечень подходящих пород и важные предупреждения по износостойкости.' },
      { src: 'static/images/Keis7/4.png', cap: 'Активность: Призыв к совместным играм для укрепления связи владельца и собаки.' },
      { src: 'static/images/Keis7/5.png', cap: 'Размеры: Наглядный чертеж габаритов игрушки (общая длина 49 см) для оценки размера.' },
      { src: 'static/images/Keis7/6.png', cap: 'Инструкция: Правила безопасного использования, ухода и стирки изделия.' },
      { src: 'static/images/Keis7/7.png', cap: 'Материалы: Разбор безопасных компонентов (кроличья шерсть, прочный канат, оксфорд 400D).' }
    ],
    'case8': [
      { src: 'static/images/keis8/1.png', cap: 'А/Б Тест (Вариант 1): Минималистичная композиция с акцентом на 6 насадок и мощность 1500 Вт.' },
      { src: 'static/images/keis8/2.png', cap: 'А/Б Тест (Вариант 2): Добавление контрастной плашки бренда и оптимизация читаемости текста.' },
      { src: 'static/images/keis8/3.png', cap: 'А/Б Тест (Вариант 3): Динамичный ракурс с легким наклоном прибора для привлечения взгляда.' },
      { src: 'static/images/keis8/4.png', cap: 'А/Б Тест (Вариант 4): Выделение комплектации насадок крупным планом как главного преимущества.' },
      { src: 'static/images/keis8/5.png', cap: 'А/Б Тест (Вариант 5): Вариант с крупным темным логотипом и фокусом на металлические части.' },
      { src: 'static/images/keis8/6.png', cap: 'А/Б Тест (Вариант 6): Композиция с яркими плашками тезисов для Ozon с высоким CTR.' },
      { src: 'static/images/keis8/7.png', cap: 'А/Б Тест (Вариант 7): Минималистичный светлый дизайн с выносом основных технических параметров.' },
      { src: 'static/images/keis8/8.png', cap: 'А/Б Тест (Вариант 8): Версия-победитель А/Б теста с оптимизированным визуальным балансом.' }
    ],
    'case9': [
      { src: 'static/images/Keis9/1.png', cap: 'А/Б Тест (Вариант 1): Обложка с акцентом на съемку от первого лица без рук и функции ИИ.' },
      { src: 'static/images/Keis9/2.png', cap: 'А/Б Тест (Вариант 2): Версия с крупной плашкой года и неоновой подсветкой для молодой аудитории.' },
      { src: 'static/images/Keis9/3.png', cap: 'А/Б Тест (Вариант 3): Концепт с выносом ИИ-ассистента и влагозащиты в трендовых цветах.' },
      { src: 'static/images/Keis9/4.png', cap: 'А/Б Тест (Вариант 4): Вариант с лаконичным перечислением ключевых характеристик устройства.' },
      { src: 'static/images/Keis9/5.png', cap: 'А/Б Тест (Вариант 5): Слайд-преимущество «Снимай как на iPhone без рук» — закрытие боли блогинга.' },
      { src: 'static/images/Keis9/6.png', cap: 'А/Б Тест (Вариант 6): Финальная обложка с оптимизированным расположением ИИ-бейджей.' }
    ],
    'case10': [
      { src: 'static/images/Keis10/1.png', cap: 'Обложка: Премиальный дизайн карточки смарт-очков с выносом ключевых УТП.' },
      { src: 'static/images/Keis10/2.png', cap: 'Функции: Детальный разбор возможностей устройства — звонки, музыка, спорт.' },
      { src: 'static/images/Keis10/3.png', cap: 'Дизайн: Акцент на стили и удобстве носки в повседневной жизни.' },
      { src: 'static/images/Keis10/4.png', cap: 'Звук: Инфографика качества звука и шумоподавления микрофонов.' },
      { src: 'static/images/Keis10/5.png', cap: 'Спорт: Презентация водозащиты и датчиков для тренировок.' },
      { src: 'static/images/Keis10/6.png', cap: 'Автономность: Время работы от аккумулятора и быстрая зарядка.' },
      { src: 'static/images/Keis10/7.png', cap: 'Совместимость: Поддержка iOS и Android, управление жестами.' },
      { src: 'static/images/Keis10/8.png', cap: 'Размеры: Габариты и вес для оценки удобства использования.' },
      { src: 'static/images/Keis10/9.png', cap: 'Комплектация: Полный набор — очки, чехол, кабель, документация.' },
      { src: 'static/images/Keis10/10.png', cap: 'Преимущества: Сравнение с конкурентами и ключевые отличия.' },
      { src: 'static/images/Keis10/11.png', cap: 'Отзывы: Реальные рекомендации покупателей на маркетплейсе.' },
      { src: 'static/images/Keis10/12.png', cap: 'Финальная обложка: Оптимизированный дизайн для максимального CTR.' }
    ],
    'case11': [
      { src: 'static/images/keis11/1.png', cap: 'Обложка: Яркая презентация вакуумной присоски с акцентом на прочность.' },
      { src: 'static/images/keis11/2.png', cap: 'Применение: Показ вариантов использования — ванна, кухня, стекло.' },
      { src: 'static/images/keis11/3.png', cap: 'Крепление: Инфографика системы установки без сверления и клея.' },
      { src: 'static/images/keis11/4.png', cap: 'Нагрузка: Демонстрация выносливости — до 15 кг на одну присоску.' },
      { src: 'static/images/keis11/5.png', cap: 'Материал: Разбор компонентов — силикон, нержавеющая сталь, ABS-пластик.' },
      { src: 'static/images/keis11/6.png', cap: 'Комплектация: Набор из 4/6/8 присосок с разными типами крючков.' },
      { src: 'static/images/keis11/7.png', cap: 'Сравнение: Преимущества перед клеевыми и винтовыми аналогами.' },
      { src: 'static/images/keis11/8.png', cap: 'Гарантия: Условия возврата и служба поддержки.' }
    ]
  };

  // Intersection Observer for scroll reveal animations with stagger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Staggered delay based on data attribute
        const delay = entry.target.dataset.stagger || 0;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { root: scrollContainer, threshold: 0.05 });

  // ─── ZOOM OVERLAY ───
  let zoomOverlay = document.querySelector('.modal-zoom-overlay');
  if (!zoomOverlay) {
    zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'modal-zoom-overlay';
    zoomOverlay.innerHTML = `
      <img class="modal-zoom-overlay__img" src="" alt="">
      <div class="modal-zoom-overlay__caption"><p></p></div>
      <span class="modal-zoom-overlay__close-hint">✕ Закрыть</span>
    `;
    document.body.appendChild(zoomOverlay);

    const closeZoom = () => {
      zoomOverlay.classList.remove('active');
      setTimeout(() => { zoomOverlay.style.display = 'none'; }, 350);
    };

    zoomOverlay.addEventListener('click', closeZoom);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zoomOverlay.classList.contains('active')) {
        closeZoom();
        e.stopPropagation();
      }
    });
  }

  const openZoom = (src, caption) => {
    const img = zoomOverlay.querySelector('.modal-zoom-overlay__img');
    const cap = zoomOverlay.querySelector('.modal-zoom-overlay__caption p');
    img.src = src;
    cap.textContent = caption || '';
    zoomOverlay.querySelector('.modal-zoom-overlay__caption').style.display = caption ? '' : 'none';
    zoomOverlay.style.display = 'flex';
    // Force reflow for animation
    void zoomOverlay.offsetWidth;
    zoomOverlay.classList.add('active');
  };

  const openModal = (caseId) => {
    if (!galleryData[caseId]) return;
    
    // Clear previous content
    scrollContent.innerHTML = '';
    
    const items = galleryData[caseId];
    const total = items.length;
    const row1Count = Math.ceil(total / 2);
    
    const row1 = document.createElement('div');
    row1.className = 'modal-gallery__row';
    const row2 = document.createElement('div');
    row2.className = 'modal-gallery__row';
    
    // Generate images and partition into two horizontal rows
    items.forEach((item, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'modal-gallery__scroll-item';
      wrapper.dataset.stagger = (index * 0.08).toFixed(2); // Stagger delay
      
      const img = document.createElement('img');
      img.src = item.src;
      img.className = 'modal-gallery__img';
      img.alt = item.cap || 'Case Image';
      img.loading = 'lazy';
      
      wrapper.appendChild(img);
      
      // Inject contextual annotation overlay if caption is defined
      if (item.cap) {
        const caption = document.createElement('div');
        caption.className = 'modal-gallery__caption';
        
        // Mark A/B tests with specialized category tags
        const isAB = item.cap.startsWith('А/Б Тест');
        const tag = isAB ? 'А/Б Аналитика' : 'Дизайн-Триггер';
        
        caption.innerHTML = `<span class="caption-tag ${isAB ? 'caption-tag--ab' : ''}">${tag}</span><p>${item.cap}</p>`;
        wrapper.appendChild(caption);
      }

      // Click to zoom
      wrapper.addEventListener('click', () => {
        openZoom(item.src, item.cap);
      });
      
      // Partition items: first half to row 1, second half to row 2
      if (index < row1Count) {
        row1.appendChild(wrapper);
      } else {
        row2.appendChild(wrapper);
      }
      
      // Observe for animation
      observer.observe(wrapper);
    });
    
    scrollContent.appendChild(row1);
    if (total > 1) {
      scrollContent.appendChild(row2);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent bg scroll
    scrollContainer.scrollLeft = 0; // reset scroll position for horizontal
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // We expose openModal to the window so the clones can use it
  window.openModal = openModal;

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
  });
}

/* ─── Interactive CTR Audit Form Handler ─── */
function initAuditForm() {
  const form = document.getElementById('auditForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const linkInput = document.getElementById('auditLink');
    const contactInput = document.getElementById('auditContact');

    if (!linkInput || !contactInput) return;

    const link = linkInput.value;
    const contact = contactInput.value;

    const message = encodeURIComponent(
      `📊 Заявка на экспресс-аудит CTR\n\n` +
      `🔗 Ссылка на товар: ${link}\n` +
      `👤 Контакт: ${contact}\n\n` +
      `Жду подробный разбор!`
    );

    window.open(`https://t.me/Osip_Designer?text=${message}`, '_blank');
  });
}

/* ─── Preloader ─── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 300);
    setTimeout(() => preloader.remove(), 800);
  });
}

/* ─── Glow Hover Mouse Tracking ─── */
function initGlowHover() {
  document.querySelectorAll('.glow-hover').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}

/* ─── FAQ Toggle ─── */
function initFAQ() {
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
      btn.setAttribute('aria-expanded', !isActive);
    });
  });
}

/* ─── Dynamic Copyright Year ─── */
function initDynamicYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── Process Timeline Animation ─── */
function initProcessTimeline() {
  const timeline = document.querySelector('.process-timeline');
  if (!timeline) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(timeline);
}

/* ─── Before/After Slider ─── */
function initBeforeAfterSlider() {
  const slider = document.getElementById('baSlider');
  if (!slider) return;

  const afterEl = slider.querySelector('.ba-slider__after');
  const handle = slider.querySelector('.ba-slider__handle');
  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = `${pct}%`;
  }

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  slider.addEventListener('touchend', () => { isDragging = false; });
}

/* ─── Hero Video Parallax ─── */
function initHeroParallax() {
  const videos = document.querySelectorAll('.hero__video-bg');
  if (!videos.length) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const offset = scrollY * 0.15;
        videos.forEach(v => { v.style.transform = `translateY(${offset}px)`; });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

