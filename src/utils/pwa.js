/**
 * Service Worker Registration
 * Handles PWA installation and offline support
 */

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}service-worker.js`;
    navigator.serviceWorker
      .register(swPath, { scope: import.meta.env.BASE_URL })
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available, show update prompt if needed
              console.log('New version available!');
              
              // Optional: Show update notification
              if ('serviceWorkerUpdateReady' in window) {
                window.serviceWorkerUpdateReady?.();
              }
            }
          });
        });

        // Periodically check for updates (every 60 seconds)
        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });

    // Listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
      window.location.reload();
    });
  });
};

/**
 * Request persistent storage permission
 * Allows the app to persist data and not be cleared by browser
 */
export const requestPersistentStorage = async () => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
    return isPersisted;
  }
  return false;
};

/**
 * Install prompt for PWA
 * Shows the "Install App" dialog to users
 */
export const setupPWAInstallPrompt = (callback) => {
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    callback(deferredPrompt);
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });

  return {
    prompt: async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
      }
    },
    isAvailable: () => !!deferredPrompt
  };
};

export default registerServiceWorker;
