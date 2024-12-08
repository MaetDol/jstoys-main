import React, { useEffect } from 'react';
import { processEnvService } from '../services/ProcessEnv';

export const GoogleAnalytics4 = React.memo(() => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DT9Y6614LF';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const isDebug = !processEnvService.isProducton();
    if (isDebug) {
      console.log('GA4 Running on DEBUG mode.');
    }

    const script = document.createElement('script');
    script.async = true;
    script.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-DT9Y6614LF', { 'debug_mode': ${isDebug} });   
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
});
