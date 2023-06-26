'use client'

import React, { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaInvisibleProps {
   setRecaptchaToken: any;
}

const ReCaptchaInvisible: React.FC<ReCaptchaInvisibleProps> = ({ setRecaptchaToken }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    }
  }, []);

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaToken(token);
    }
  };

  return (
    <div className='relative'>
      <div className='absolute bottom-0 right-0'>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_ID!}
          onChange={handleRecaptchaChange}
          size='invisible'
          ref={recaptchaRef}
        />
      </div>
    </div>
  );
};

export default ReCaptchaInvisible;
