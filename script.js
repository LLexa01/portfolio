const header = document.getElementById('siteHeader');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const modal = document.getElementById('uiModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');

const splitText = (element) => {
  const text = element.textContent.trim();
  if (!text) return;
  element.textContent = '';
  [...text].forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.setProperty('--delay', `${index * 0.03}s`);
    span.innerHTML = char === ' ' ? '&nbsp;' : char;
    element.appendChild(span);
  });
};

document.querySelectorAll('[data-split]').forEach(splitText);

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
}

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    burger?.classList.remove('open');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const id = anchor.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  question?.addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

const parallaxItems = document.querySelectorAll('[data-parallax]');
let latestScroll = 0;
let ticking = false;

const handleParallax = () => {
  parallaxItems.forEach((item) => {
    const speed = parseFloat(item.dataset.parallax) || 0.1;
    item.style.setProperty('--parallax', `${latestScroll * speed}px`);
  });
  ticking = false;
};

window.addEventListener('scroll', () => {
  latestScroll = window.scrollY;
  if (header) header.classList.toggle('scrolled', latestScroll > 40);
  if (!ticking) {
    window.requestAnimationFrame(handleParallax);
    ticking = true;
  }
});

const openModal = (title, text) => {
  if (!modal) return;
  if (modalTitle) modalTitle.textContent = title || 'Готово';
  if (modalText) modalText.textContent = text || 'Спасибо! Мы свяжемся с вами.';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
};

modal?.addEventListener('click', (event) => {
  if (event.target && event.target.hasAttribute('data-close')) {
    closeModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

document.querySelectorAll('[data-modal-title]').forEach((button) => {
  button.addEventListener('click', () => {
    openModal(button.dataset.modalTitle, button.dataset.modalText);
  });
});

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = contactForm.querySelector('input[name="name"]')?.value || '';
  openModal('Заявка отправлена', name ? `Спасибо, ${name}! Я свяжусь с вами в ближайшее время.` : 'Спасибо! Я свяжусь с вами в ближайшее время.');
  contactForm.reset();
});

const buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
