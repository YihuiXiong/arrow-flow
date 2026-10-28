try{const t=JSON.parse(localStorage.getItem('arrow-flow')||'{}').theme;if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}

// Set before first paint; iOS also exposes the standalone flag.
try{document.documentElement.classList.toggle('standalone-app',matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)}catch{}
