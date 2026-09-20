const tabButtons = [...document.querySelectorAll('[data-tab]')];
const tabPanels = document.querySelectorAll('[data-panel]');
function selectTab(button) {
  tabButtons.forEach(item => {
    item.setAttribute('aria-selected', String(item === button));
    item.tabIndex = item === button ? 0 : -1;
  });
  tabPanels.forEach(panel => { panel.hidden = panel.id !== button.dataset.tab; });
}
tabButtons.forEach(button => {
  button.addEventListener('click', () => selectTab(button));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabButtons.length - 1 : (tabButtons.indexOf(button) + offset + tabButtons.length) % tabButtons.length;
    selectTab(tabButtons[index]);
    tabButtons[index].focus();
  });
});

const toast = document.querySelector('[data-toast]');
let toastTimer;
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      toast.textContent = document.body.dataset.copied;
      toast.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
        toast.textContent = '';
      }, 1800);
    } catch {
      window.prompt(document.body.dataset.copyFallback, button.dataset.copy);
    }
  });
});

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
function closeNav() {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeNav();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeNav();
    navToggle.focus();
  }
});
// Each language has a stable URL; keep the current section when switching.
document.querySelectorAll('[data-language]').forEach(link => {
  link.addEventListener('click', () => {
    link.hash = window.location.hash;
  });
});

const languageMenu = document.querySelector('[data-language-menu]');
document.addEventListener('click', event => {
  if (!languageMenu.contains(event.target)) languageMenu.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && languageMenu.open) {
    languageMenu.open = false;
    languageMenu.querySelector('summary').focus();
  }
});
