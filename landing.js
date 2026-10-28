(() => {
  const translations = [...document.querySelectorAll('[data-en][data-zh]')];
  const langButton = document.getElementById('language-toggle');
  const screen = document.getElementById('preview-screen');
  const arrow = document.getElementById('demo-arrow');
  const number = document.getElementById('demo-number');
  const next = document.getElementById('next-cue');
  const announcement = document.getElementById('preview-announcement');
  let language = 'en', mode = 'arrow', angle = 0, currentNumber = 3, colorIndex = -1;
  const colors = ['#245fbd', '#d83842', '#16816b', '#f3cf46'];
  try { const saved = JSON.parse(localStorage.getItem('arrow-flow') || '{}').language; if (saved === 'zh' || saved === 'en') language = saved; } catch {}
  function applyLanguage() {
    document.documentElement.lang = language;
    document.title = language === 'en' ? 'Arrow Flow — Visual cues for movement practice' : 'Arrow Flow — 视觉提示与移动练习';
    translations.forEach(el => { if (el.hasAttribute('data-html')) el.innerHTML = el.dataset[language]; else el.textContent = el.dataset[language]; });
    langButton.textContent = language === 'en' ? '中文' : 'EN';
    langButton.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : '切换到英文');
    document.querySelector('.site-header nav').setAttribute('aria-label', language === 'en' ? 'Main navigation' : '主导航');
    document.querySelector('.brand').setAttribute('aria-label', language === 'en' ? 'Arrow Flow home' : 'Arrow Flow 首页');
    announcement.textContent = '';
    next.setAttribute('aria-label', language === 'en' ? 'Show another cue' : '显示下一个提示');
    document.querySelector('.mode-switch').setAttribute('aria-label', language === 'en' ? 'Preview mode' : '预览模式');
  }
  langButton.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    try { const settings = JSON.parse(localStorage.getItem('arrow-flow') || '{}'); settings.language = language; localStorage.setItem('arrow-flow', JSON.stringify(settings)); } catch {}
    applyLanguage();
  });
  function cue() {
    if (mode === 'arrow') {
      angle += 45 * (1 + Math.floor(Math.random() * 7));
      arrow.style.transform = `rotate(${angle}deg)`;
      announcement.textContent = language === 'en' ? 'New arrow cue' : '新的箭头提示';
    } else {
      currentNumber = 1 + Math.floor(Math.random() * 5);
      colorIndex = (colorIndex + 1 + Math.floor(Math.random() * 3)) % colors.length;
      number.textContent = currentNumber;
      screen.style.background = colors[colorIndex];
      screen.style.color = colorIndex === 3 ? '#17221b' : '#fff';
      announcement.textContent = (language === 'en' ? 'Number ' : '数字 ') + currentNumber;
    }
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    arrow.toggleAttribute('hidden', mode !== 'arrow'); number.toggleAttribute('hidden', mode !== 'number');
    if (mode === 'arrow') { screen.style.background = ''; screen.style.color = ''; }
    cue();
  }));
  next.addEventListener('click', cue);
  applyLanguage();
})();
