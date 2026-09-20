import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import zh from './locales/zh-CN.mjs';
import en from './locales/en.mjs';
import ja from './locales/ja.mjs';

export const locales = [zh, en, ja];
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const repo = 'https://github.com/cloud-oc/GameQuestDesignerSkill';
const base = 'https://cloud-oc.github.io/GameQuestDesignerSkill/';
const install = 'npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install';
const names = ['game-quest-designer', 'quest-understand', 'quest-design', 'quest-flow', 'quest-spec', 'quest-prototype', 'quest-requirements', 'quest-collab', 'quest-review', 'quest-docs'];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function render(t) {
  const e = escape;
  const copy = text => `<button type="button" class="copy-button" data-copy="${e(text)}" aria-label="${e(t.copyCommand)}">${e(t.copy)}</button>`;
  const languages = locales.map(locale => `<a href="${locale.file}" lang="${locale.lang}" hreflang="${locale.lang}" data-language${locale.lang === t.lang ? ' aria-current="page"' : ''}>${locale.name}</a>`).join('');
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${e(t.description)}">
  <meta name="theme-color" content="#171a17">
  <link rel="canonical" href="${base}${t.file === 'index.html' ? '' : t.file}">
  ${locales.map(locale => `<link rel="alternate" hreflang="${locale.lang}" href="${base}${locale.file === 'index.html' ? '' : locale.file}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${base}">
  <link rel="icon" href="assets/quest-icon.svg" type="image/svg+xml">
  ${['styles', 'sections', 'responsive', 'order', 'readability'].map(name => `<link rel="stylesheet" href="${name}.css">`).join('\n  ')}
  <title>${e(t.title)}</title>
</head>
<body data-copied="${e(t.copied)}" data-copy-fallback="${e(t.copyFallback)}">
  <a class="skip-link" href="#main">${e(t.skip)}</a>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="${e(t.home)}"><img src="assets/quest-icon.svg" alt="" width="38" height="38"><span><b>Game Quest</b><small>Designer Skill</small></span></a>
    <nav id="site-nav" class="site-nav" aria-label="${e(t.navigation)}" data-nav>${['start', 'skills', 'contract', 'faq'].map((id, i) => `<a href="#${id}">${e(t.nav[i])}</a>`).join('')}</nav>
    <div class="header-actions">
      <a class="github-icon" href="${repo}" aria-label="${e(t.github)}" title="${e(t.github)}"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.64 1.22 3.28.93.1-.73.4-1.22.72-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.63 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z"/></svg></a>
    <details class="language-switch" data-language-menu><summary aria-label="${e(t.language)}">${e(t.name)}<span aria-hidden="true">⌄</span></summary><nav class="language-options" aria-label="${e(t.language)}">${languages}</nav></details>
      <button class="nav-toggle" type="button" aria-label="${e(t.menu)}" aria-expanded="false" aria-controls="site-nav" data-nav-toggle><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
  </header>
  <main id="main">
    <section class="hero" id="top">
      <div class="hero-copy">
        <p class="eyebrow">Game Quest Designer · v${version}</p>
        <h1>${e(t.hero[0])}<br><em>${e(t.hero[1])}</em></h1>
        <p class="hero-lead">${e(t.lead)}</p>
        <div class="install-box">
          <div class="tab-list" role="tablist" aria-label="${e(t.install)}">
            <button role="tab" aria-selected="true" aria-controls="npm-panel" id="npm-tab" data-tab="npm-panel">npm</button>
            <button role="tab" aria-selected="false" aria-controls="agent-panel" id="agent-tab" tabindex="-1" data-tab="agent-panel">${e(t.agentLabel)}</button>
          </div>
          <div id="npm-panel" role="tabpanel" aria-labelledby="npm-tab" data-panel><code>${e(install)}</code>${copy(install)}</div>
          <div id="agent-panel" role="tabpanel" aria-labelledby="agent-tab" data-panel hidden><code>${e(t.agent)}</code><button type="button" class="copy-button" data-copy="${e(t.agent)}">${e(t.copy)}</button></div>
        </div>
        <div class="hero-actions"><a class="button primary" href="#start">${e(t.startAction)} ↓</a><a class="button ghost" href="${repo}">${e(t.source)} ↗</a></div>
      </div>
      <div class="quest-map"><div class="map-title"><span>${e(t.mapTitle)}</span><small>${e(t.mapNote)}</small></div><ol>${t.map.map(([title, text], i) => `<li><span>${i + 1}</span><div><b>${e(title)}</b><small>${e(text)}</small></div></li>`).join('')}</ol></div>
    </section>
    <section class="section quick-start" id="start">
      <div class="section-heading"><h2>${e(t.startTitle)}</h2><p>${e(t.startLead)}</p></div>
      <div class="steps-grid">${t.steps.map(([title, text], i) => `<article><span class="step-no">0${i + 1}</span><h3>${e(title)}</h3><p>${e(text)}</p>${i === 0 ? `<div class="mini-code"><code>${e(install)}</code>${copy(install)}</div>` : `<blockquote>${e(t.prompts[i - 1])}</blockquote>`}</article>`).join('')}</div>
    </section>
    <section class="section skills-section" id="skills">
      <div class="section-heading"><h2>${e(t.skillsTitle)}</h2><p>${e(t.skillsLead)}</p></div>
      <div class="skill-grid">${t.skills.map(([title, text], i) => `<article class="skill-card${i === 0 ? ' featured' : ''}"><h3>${e(title)}</h3><p>${e(text)}</p><code>$${names[i]}</code></article>`).join('')}</div>
    </section>
    <section class="section contract-section" id="contract">
      <div class="section-heading"><h2>${e(t.exampleTitle)}</h2><p>${e(t.exampleLead)}</p></div>
      <div class="contract-demo"><div class="contract-sheet"><h3>${e(t.rulesTitle)}</h3><dl>${t.rules.map(([key, value]) => `<div><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></div>
      <div class="contract-result"><h3>${e(t.exampleHeading)}</h3><ul>${t.exampleSteps.map(([title, text], i) => `<li><span>0${i + 1}</span><p><b>${e(title)}</b>${e(text)}</p></li>`).join('')}</ul><p class="example-note">${e(t.exampleNote)}</p></div></div>
    </section>
    <section class="section delivery-section" id="delivery">
      <div class="section-heading"><h2>${e(t.deliveryTitle)}</h2><p>${e(t.deliveryLead)}</p></div>
      <div class="deliverable-grid">${t.deliverables.map(([title, text]) => `<article><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('')}</div>
      <div class="validator-block"><div class="validator-copy"><h3>${e(t.validatorTitle)}</h3><p>${e(t.validatorText)}</p></div><div class="terminal" aria-label="${e(t.validatorLabel)}"><div><span>quest-package-validate</span></div><pre>npx --yes --package=game-quest-designer-skills@latest \\\n  -- quest-package-validate ./quest-package.json</pre></div></div>
    </section>
    <section class="section faq-section" id="faq"><div class="section-heading"><h2>${e(t.faqTitle)}</h2></div><div class="faq-list">${t.faq.map(([question, answer]) => `<details><summary>${e(question)}<span aria-hidden="true">+</span></summary><p>${e(answer)}</p></details>`).join('')}</div></section>
    <section class="final-cta"><img src="assets/quest-icon.svg" alt="" width="64" height="64"><h2>${e(t.cta)}</h2><div><a class="button light" href="${repo}">${e(t.github)} ↗</a><button class="button outline-light" data-copy="${e(install)}">${e(t.copyCommand)}</button></div></section>
  </main>
  <footer><div class="footer-brand"><img src="assets/quest-icon.svg" alt="" width="42" height="42"><p><b>Game Quest Designer Skill</b><small>${e(t.footer)}</small></p></div><nav><a href="https://www.npmjs.com/package/game-quest-designer-skills">npm</a><a href="${repo}">GitHub</a></nav><p class="copyright">Apache-2.0 · v${version}</p></footer>
  <div class="toast" role="status" aria-live="polite" data-toast></div>
  <script src="app.js" defer></script>
</body>
</html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const locale of locales) await writeFile(new URL(locale.file, import.meta.url), render(locale));
  console.log('Built Chinese, English and Japanese pages.');
}
