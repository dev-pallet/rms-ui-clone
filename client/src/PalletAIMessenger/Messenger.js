import { useEffect } from 'react';
import './Messenger.css'; // Include custom CSS for styling
import { isSmallScreen } from '../layouts/ecommerce/Common/CommonFunction';

export default function PalletAIMessenger() {
  const orgId = localStorage.getItem('orgId');
  const isProduction = process.env.MY_ENV === 'production';
  const isMobileDevice = isSmallScreen();

  useEffect(() => {
    const addMessenger = () => {
      if (!document.querySelector('df-messenger')) {
        const messenger = document.createElement('df-messenger');
        messenger.setAttribute('location', 'us-central1');
        messenger.setAttribute('project-id', isProduction ? 'twinleaves-prod' : 'twinleaves-stage');
        messenger.setAttribute(
          'agent-id',
          isProduction ? 'b66e4f52-40bc-446e-a514-50b0bf1e99cf' : 'b75c45a6-b162-416a-9c66-3ec9d96b8fc9',
        );
        messenger.setAttribute('language-code', 'en');
        messenger.setAttribute('max-query-length', '-1');

        messenger.innerHTML = `
          <df-messenger-chat-bubble
            chat-title="Pallet IQ"
            chat-title-icon="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Youtube%20Channel%20Logo%20(1).png">
          </df-messenger-chat-bubble>
        `;

        document.body.appendChild(messenger);

        // Add Dialogflow script
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    const removeMessenger = () => {
      const messenger = document.querySelector('df-messenger');
      if (messenger) {
        messenger.remove();
      }
    };

    if (orgId && !isMobileDevice) {
      addMessenger();
    } else {
      removeMessenger();
    }

    // Watch for orgId changes in localStorage (optional)
    const storageListener = () => {
      const updatedOrgId = localStorage.getItem('orgId');
      if (updatedOrgId) {
        addMessenger();
      } else {
        removeMessenger();
      }
    };

    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, [orgId, isMobileDevice]);

  return null; // Nothing to render, we inject the widget
}
