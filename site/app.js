const tabButtons = document.querySelectorAll('[data-tab]');
const tabPanels = document.querySelectorAll('[data-panel]');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    tabPanels.forEach((panel) => { panel.hidden = panel.id !== button.dataset.tab; });
  });
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const index = [...tabButtons].indexOf(button);
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    tabButtons[(index + offset + tabButtons.length) % tabButtons.length].click();
    tabButtons[(index + offset + tabButtons.length) % tabButtons.length].focus();
  });
});

const toast = document.querySelector('[data-toast]');
let toastTimer;
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const oldText = button.textContent;
      button.textContent = '已复制';
      toast.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('visible'), 1800);
      setTimeout(() => { button.textContent = oldText; }, 1800);
    } catch {
      window.prompt('复制下面的内容：', button.dataset.copy);
    }
  });
});

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
});
