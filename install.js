// Install prompt handler for KeffStation
let deferredPrompt = null;
const installBtn = document.createElement('button');
installBtn.id = 'install-btn';
installBtn.textContent = 'Installer KeffStation';
installBtn.style.cssText = `
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 0.75rem 1.5rem;
  padding-right: 0.75rem;
  background: #ffd23f;
  color: #070816;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  display: none;
  max-width: calc(100vw - 2rem);
  box-shadow: 0 4px 20px rgba(255, 210, 63, 0.4);
  touch-action: manipulation;
  min-height: 48px;
`;
installBtn.innerHTML = '<span>Installer KeffStation</span> <span id="install-dismiss" role="button" aria-label="Masquer" style="margin-left:8px;min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid rgba(0,0,0,.3)">✕</span>';
document.body.appendChild(installBtn);
function syncBodyPad(){ document.body.style.paddingBottom = (installBtn.style.display === 'block') ? 'calc(76px + env(safe-area-inset-bottom, 0px))' : ''; }
installBtn.querySelector('#install-dismiss').addEventListener('click', (ev) => {
  ev.stopPropagation();
  installBtn.style.display = 'none'; syncBodyPad();
  try { sessionStorage.setItem('keff-install-dismissed', '1'); } catch (e) {}
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  try { if (sessionStorage.getItem('keff-install-dismissed') === '1') { deferredPrompt = e; return; } } catch (err) {}
  deferredPrompt = e;
  installBtn.style.display = 'block'; syncBodyPad();
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  installBtn.style.display = 'none'; syncBodyPad();
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installBtn.style.display = 'none'; syncBodyPad();
  }
  deferredPrompt = null;
});

// Hide if already installed
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  installBtn.style.display = 'none';
}

// SW update detection
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (navigator.serviceWorker.controller) {
      const updateBanner = document.createElement('div');
      updateBanner.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        padding: 1rem 1.5rem;
        background: #1e6bff;
        color: white;
        border-radius: 999px;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(30, 107, 255, 0.4);
        animation: slideDown 0.3s ease;
      `;
      updateBanner.textContent = 'Nouvelle version disponible - Rechargez';
      document.body.appendChild(updateBanner);
      setTimeout(() => updateBanner.remove(), 5000);
    }
  });
}

// Add keyframe for slideDown animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-100%); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);