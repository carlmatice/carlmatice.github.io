const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const page = document.body.dataset.page;
document.querySelectorAll('[data-page-link]').forEach((link) => {
  if (link.dataset.pageLink === page) {
    link.classList.add('active');
  }
});

const yearTargets = document.querySelectorAll('.js-year');
const currentYear = new Date().getFullYear();
yearTargets.forEach((node) => {
  node.textContent = String(currentYear);
});

const revealNodes = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 35, 320)}ms`;
    observer.observe(node);
  });
} else {
  revealNodes.forEach((node) => node.classList.add('visible'));
}
