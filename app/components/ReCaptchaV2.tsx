'use client'

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaV2Props {
    setRecaptchaToken: any;
}

const ReCaptchaV2: React.FC<ReCaptchaV2Props> = ({setRecaptchaToken}) => {
   const handleRecaptchaChange = (token: any) => {
      setRecaptchaToken(token);
   };

   return (
      <div className='relative'>
         <div className='absolute bottom-0 right-0'>
            <ReCAPTCHA
               sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_ID || ''}
               onChange={handleRecaptchaChange}
            />
         </div>
      </div>
   );
};

export default ReCaptchaV2;
