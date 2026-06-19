// Automatic developer-mode page reload helper when dev server restarts or crashes.
// This is compiled out in production builds automatically.

if (import.meta.env.DEV && import.meta.hot) {
  let isChecking = false;
  let overlay: HTMLDivElement | null = null;

  const showOverlay = () => {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.id = 'dev-server-status-overlay';

    const style = document.createElement('style');
    style.id = 'dev-server-status-style';
    style.textContent = `
      #dev-server-status-overlay {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(15, 23, 42, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(239, 68, 68, 0.45);
        padding: 14px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 8px 16px -6px rgba(0, 0, 0, 0.5);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 13.5px;
        font-weight: 600;
        color: #f8fafc;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: devSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #dev-server-status-overlay .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ef4444;
        box-shadow: 0 0 12px #ef4444;
        animation: devPulse 1.5s infinite;
      }

      #dev-server-status-overlay.connected {
        border-color: rgba(34, 197, 94, 0.55);
      }

      #dev-server-status-overlay.connected .status-dot {
        background-color: #22c55e;
        box-shadow: 0 0 12px #22c55e;
        animation: none;
      }

      @keyframes devPulse {
        0% { transform: scale(0.95); opacity: 0.5; }
        50% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.5; }
      }

      @keyframes devSlideIn {
        from { transform: translateY(20px) scale(0.95); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
    `;

    document.head.appendChild(style);

    const dot = document.createElement('div');
    dot.className = 'status-dot';

    const text = document.createElement('span');
    text.textContent = 'Vite Dev Server Offline. Reconnecting...';

    overlay.appendChild(dot);
    overlay.appendChild(text);
    document.body.appendChild(overlay);
  };

  const updateOverlayToConnected = () => {
    if (!overlay) return;
    overlay.className = 'connected';
    const text = overlay.querySelector('span');
    if (text) text.textContent = 'Server Online! Reloading page...';
  };

  const removeOverlay = () => {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    const style = document.getElementById('dev-server-status-style');
    if (style) style.remove();
  };

  const checkServerAndReload = async () => {
    if (isChecking) return;
    isChecking = true;

    showOverlay();

    const poll = async () => {
      try {
        const response = await fetch('/?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
        // If the server replies at all (even 200 or 404, it means the server is back online)
        if (response.status || response.ok) {
          updateOverlayToConnected();
          setTimeout(() => {
            removeOverlay();
            window.location.reload();
          }, 800);
          return;
        }
      } catch (err) {
        // Still down
      }
      setTimeout(poll, 1000);
    };

    poll();
  };

  // Listen to Vite's websocket disconnect
  import.meta.hot.on('vite:ws:disconnect', () => {
    console.warn('[Dev Auto-Reload] Lost connection to dev server. Monitoring status...');
    checkServerAndReload();
  });

  // Listen to reconnect event (if HMR client manages to reconnect directly)
  import.meta.hot.on('vite:ws:connect', () => {
    console.log('[Dev Auto-Reload] Reconnected to dev server. Reloading...');
    window.location.reload();
  });
}

export {};
