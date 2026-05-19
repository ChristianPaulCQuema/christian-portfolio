const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const backTop = document.getElementById('backTop');
    const contactForm = document.getElementById('contactForm');
    const typedText = document.getElementById('typedText');
    const themeToggle = document.getElementById('themeToggle');
    const preloader = document.getElementById('preloader');
    const profileCard = document.getElementById('profileCard');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    const revealItems = document.querySelectorAll('.reveal');
    const cards = document.querySelectorAll('.card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const galleryModal = document.getElementById('lakbaygoGallery');
    const galleryOpenButtons = document.querySelectorAll('[data-gallery-open]');
    const galleryCloseButtons = document.querySelectorAll('[data-gallery-close]');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const galleryPreviewImage = document.getElementById('galleryPreviewImage');
    const galleryPreviewCaption = document.getElementById('galleryPreviewCaption');

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hide');
      }, 600);
    });

    const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
    if (savedTheme === 'light') {
      document.body.classList.add('light');
      themeToggle.textContent = '\u2600';
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      themeToggle.textContent = isLight ? '\u2600' : '\u263e';
      localStorage.setItem('portfolioTheme', isLight ? 'light' : 'dark');
    });

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach(card => {
          const category = card.dataset.category || '';
          const show = filter === 'all' || category.includes(filter);
          card.style.display = show ? 'block' : 'none';
        });
      });
    });

    function openGallery() {
      if (!galleryModal) return;
      galleryModal.classList.add('show');
      galleryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
      if (!galleryModal) return;
      galleryModal.classList.remove('show');
      galleryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    galleryOpenButtons.forEach(button => {
      button.addEventListener('click', openGallery);
    });

    galleryCloseButtons.forEach(button => {
      button.addEventListener('click', closeGallery);
    });

    if (galleryModal) {
      galleryModal.addEventListener('click', event => {
        if (event.target === galleryModal) {
          closeGallery();
        }
      });
    }

    galleryThumbs.forEach(button => {
      button.addEventListener('click', () => {
        galleryThumbs.forEach(thumb => thumb.classList.remove('active'));
        button.classList.add('active');
        galleryPreviewImage.src = button.dataset.gallerySrc;
        galleryPreviewImage.alt = button.dataset.galleryTitle + ' screenshot';
        galleryPreviewCaption.textContent = button.dataset.galleryTitle;
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && galleryModal && galleryModal.classList.contains('show')) {
        closeGallery();
      }
    });

    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    const typingPhrases = [
      'PHP + MySQL Web Systems',
      'C# ASP.NET Core Web Apps',
      'Admin Dashboards and CRUD Systems',
      'School, HR, and Barangay Systems'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const current = typingPhrases[phraseIndex];
      typedText.textContent = current.substring(0, charIndex);

      if (!isDeleting && charIndex < current.length) {
        charIndex++;
        setTimeout(typeEffect, 70);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 35);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        }
        setTimeout(typeEffect, isDeleting ? 1200 : 300);
      }
    }

    typeEffect();

    function revealOnScroll() {
      revealItems.forEach(item => {
        const top = item.getBoundingClientRect().top;
        const trigger = window.innerHeight * 0.86;
        if (top < trigger) {
          item.classList.add('active');
        }
      });
    }

    function updateBackTopAndNav() {
      if (window.scrollY > 400) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }

      let current = 'home';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', () => {
      revealOnScroll();
      updateBackTopAndNav();
    });

    revealOnScroll();
    updateBackTopAndNav();

    cards.forEach(card => {
      card.addEventListener('mousemove', event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
    });

    profileCard.addEventListener('mousemove', event => {
      const rect = profileCard.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    const counters = document.querySelectorAll('[data-count]');
    let counted = false;

    function animateCounters() {
      if (counted) return;
      const stats = document.querySelector('.stats');
      if (!stats) return;
      const top = stats.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.9) {
        counters.forEach(counter => {
          const target = Number(counter.dataset.count);
          let current = 0;
          const increment = Math.max(1, Math.ceil(target / 40));
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = target === 100 ? current + '%' : current + '+';
          }, 24);
        });
        counted = true;
      }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    
const sendBtn = document.getElementById('sendBtn');
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');

contactForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      contactForm.reset();
      popupOverlay.classList.add('show');
    } else {
      alert('Something went wrong. Please check your Formspree setup.');
    }
  } catch (error) {
    alert('Message failed. Please check your internet connection.');
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send Inquiry';
});

closePopup.addEventListener('click', () => {
  popupOverlay.classList.remove('show');
});

popupOverlay.addEventListener('click', (event) => {
  if (event.target === popupOverlay) {
    popupOverlay.classList.remove('show');
  }
});
document.getElementById('year').textContent = new Date().getFullYear();
