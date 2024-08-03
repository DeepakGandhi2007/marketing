import React, { useEffect } from 'react';

export function Jsfile() {
  useEffect(() => {
    const addScript = (src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    addScript('/assets/libs/jquery/jquery.min.js');
    addScript('/assets/libs/bootstrap/js/bootstrap.bundle.min.js');
    addScript('/assets/libs/simplebar/simplebar.min.js');
    addScript('/assets/libs/node-waves/waves.min.js');

    return () => {
      // Cleanup script tags if component unmounts
      document.querySelectorAll('script').forEach((script) => {
        if (script.src.startsWith('/assets/libs/')) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return null; // Since this component is only responsible for adding scripts, it doesn't render any UI
}

export default Jsfile;