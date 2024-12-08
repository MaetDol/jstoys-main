import React, { useEffect } from 'react';
import { ga4Service } from '../services/GA4';
import { processEnvService } from '../services/ProcessEnv';

export const GoogleAnalytics4 = React.memo(() => {
  useEffect(() => {
    // 테스트 하고자 한다면,
    // 아래 라인을 주석처리하세요.
    const isDebug = !processEnvService.isProducton();
    if (isDebug) {
      console.log('GA4 is Offline because of debug mode');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DT9Y6614LF';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
    `;
    document.body.appendChild(script);

    script.onload = () => {
      ga4Service.init();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
});
