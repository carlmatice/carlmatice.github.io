const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');

if (navToggle && siteNav) {
  const closeNav = (restoreFocus = false) => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      closeNav();
      if (link.hash && link.pathname === window.location.pathname) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          event.preventDefault();
          history.pushState(null, '', link.hash);
          target.focus({ preventScroll: true });
          target.scrollIntoView();
        }
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('open')) {
      closeNav(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav(siteNav.contains(document.activeElement));
    }
  });

  siteNav.addEventListener('focusout', (event) => {
    if (!siteNav.contains(event.relatedTarget) && event.relatedTarget !== navToggle) closeNav();
  });

  window.matchMedia('(min-width: 861px)').addEventListener('change', () => {
    closeNav(siteNav.contains(document.activeElement));
  });
}

const page = document.body.dataset.page;
document.querySelectorAll('[data-page-link]').forEach((link) => {
  if (link.dataset.pageLink === page) {
    link.classList.add('active');
  }
});

if (siteNav) {
  const sectionLinks = Array.from(siteNav.querySelectorAll('a[href^="#"]'), (link) => ({
    link,
    target: document.getElementById(link.hash.slice(1))
  })).filter((entry) => entry.target).sort((first, second) => (
    first.target.compareDocumentPosition(second.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  ));

  if (sectionLinks.length > 0) {
    const header = document.querySelector('.site-header');
    let updateScheduled = false;

    const updateActiveSection = () => {
      updateScheduled = false;
      const marker = (header?.getBoundingClientRect().bottom ?? 0) + 24;
      let activeEntry = sectionLinks[0];

      sectionLinks.forEach((entry) => {
        if (entry.target.getBoundingClientRect().top <= marker) activeEntry = entry;
      });

      if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
        activeEntry = sectionLinks[sectionLinks.length - 1];
      }

      sectionLinks.forEach(({ link }) => {
        const isActive = link === activeEntry.link;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const scheduleUpdate = () => {
      if (updateScheduled) return;
      updateScheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(document.body);
    updateActiveSection();
  }
}

const yearTargets = document.querySelectorAll('.js-year');
const currentYear = new Date().getFullYear();
yearTargets.forEach((node) => {
  node.textContent = String(currentYear);
});

const revealNodes = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealNodes.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
