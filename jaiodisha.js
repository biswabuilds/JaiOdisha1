(function () {
  let loaderHidden = false;

  function hideLoader() {
    const loader = document.getElementById('loader');

    if (!loader || loaderHidden) {
      return;
    }

    loaderHidden = true;
    setTimeout(() => loader.classList.add('gone'), 600);
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll('.project-block, .test-card');

    if (!revealItems.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((el) => observer.observe(el));
  }

  function ensureLightbox() {
    let lightbox = document.getElementById('lightbox');

    if (lightbox) {
      return lightbox;
    }

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');

    const panel = document.createElement('div');
    panel.className = 'lightbox-panel';

    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close image preview');
    closeButton.textContent = 'x';

    const image = document.createElement('img');
    image.id = 'lb-img';
    image.alt = '';

    const caption = document.createElement('p');
    caption.id = 'lb-cap';

    panel.append(closeButton, image, caption);
    lightbox.appendChild(panel);
    document.body.appendChild(lightbox);

    closeButton.addEventListener('click', closeLB);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLB();
      }
    });

    return lightbox;
  }

  function openLB(el) {
    const img = el && el.querySelector('img');

    if (!img) {
      return;
    }

    const lightbox = ensureLightbox();
    const lightboxImage = document.getElementById('lb-img');
    const lightboxCaption = document.getElementById('lb-cap');
    const caption = img.dataset.cap || img.alt || '';

    lightboxImage.src = (img.currentSrc || img.src).replace('w=600', 'w=1200');
    lightboxImage.alt = img.alt || caption;
    lightboxCaption.textContent = caption;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLB() {
    const lightbox = document.getElementById('lightbox');

    if (!lightbox) {
      return;
    }

    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setupContactForm() {
    const form = document.querySelector('.contact-form-panel');

    if (!form) {
      return;
    }

    const status = form.querySelector('.contact-form-status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const formData = new FormData(form);
      const name = formData.get('name') || 'Website visitor';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const message = formData.get('message') || '';
      const subject = encodeURIComponent(`Contact message from ${name}`);
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          '',
          message
        ].join('\n')
      );

      if (status) {
        status.textContent = 'Opening your email app. If it does not open, email rudrajaiodisha@gmail.com directly.';
      }

      window.location.href = `mailto:rudrajaiodisha@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader, { once: true });
  } else {
    hideLoader();
  }

  window.addEventListener('load', hideLoader, { once: true });
  setTimeout(hideLoader, 2500);

  setupReveal();
  setupContactForm();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLB();
    }
  });

  window.openLB = openLB;
})();
