import axios from 'axios';

export const recaptchaValidator = async (recaptchaToken: string) => {
   const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

   try {
      const recaptchaResponse = await axios.post(
         `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`
      );

      if (!recaptchaResponse.data.success) {
         throw new Error('La verificación de reCAPTCHA ha fallado');
      }
   } catch (error) {
      throw new Error('La verificación de reCAPTCHA ha fallado');
   }
};
