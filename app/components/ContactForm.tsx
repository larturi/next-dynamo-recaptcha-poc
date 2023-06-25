'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { v4 as uuidv4 } from 'uuid';
import Input from './Input';
import TextArea from './TextArea';

const ContactForm = () => {
   const router = useRouter();

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [message, setMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('Todos los campos son requeridos');
   const [isSaving, setIsSaving] = useState(false);
   const [hasError, setHasError] = useState(false);
   const [recaptchaToken, setRecaptchaToken] = useState(null);

   const handleRecaptchaChange = (token: any) => {
      setRecaptchaToken(token);
    };

   const handleSubmit = async () => {
      setIsSaving(true);
      setHasError(false);

      if(name === '' || email === '' || message === '') {
         setHasError(true);
         setIsSaving(false);
         return false;
      }

      const id = uuidv4();

      localStorage.setItem('idSugerencia', id);
      
      axios.post('/api/sugerencias', {
         id, name, email, message, recaptchaToken
       })
       .then(() => {
         router.push('/thankyou');
       })
       .catch((error) => {
         setErrorMessage(error.response.data.error)
         setHasError(true);
       })
       .finally(() => {
         setIsSaving(false);
       });
   };

   return (
      <div
         className='
            relative 
            h-full 
            w-full 
            bg-no-repeat
            bg-center
            bg-fixed
            bg-cover
            p-3
            '
      >
         <div
            className='
            bg-white
              w-full
              h-full
              lg:pt-10
            '
         >
            <div className='flex justify-center'>
               <div
                  className='
                  bg-black 
                    bg-opacity-90
                    px-6
                    py-5
                    lg:px-12
                    lg:py-8
                    self-center 
                    lg:mt-2 
                    lg:w-2/5
                    lg:rounded-md
                    w-full
                 '
               >
                  <h1
                     className='
                     text-white
                     text-xl 
                     md:text-2xl 
                     mb-1 
                     font-light 
                  '
                  >
                     Completar el formulario
                  </h1>

                  <h2
                     className='
                     text-gray-500 
                     text-sm 
                     mb-4 
                     font-light
                  '
                  >
                     {`Se guardaran los datos en DynamoDB`}
                  </h2>

                  <hr className='h-px mb-6 bg-gray-500 border-0 w-11/12' />

                  <form>
                     <div className='flex flex-col gap-4 mt-4'>
                        <Input
                           id='name'
                           type='text'
                           label='Nombre completo'
                           value={name}
                           onChange={(ev: any) => setName(ev.target.value)}
                        />
                     </div>

                     <div className='flex flex-col gap-4 mt-4'>
                        <Input
                           id='email'
                           type='email'
                           label='Correo electrónico'
                           value={email}
                           onChange={(ev: any) => setEmail(ev.target.value)}
                        />
                     </div>

                     <div className='flex flex-col gap-4 mt-4'>
                        <TextArea
                           id='message'
                           label='Sugerencia o reclamo'
                           value={message}
                           onChange={(ev: any) => setMessage(ev.target.value)}
                        />
                     </div>
                  </form>

                  <div className="mt-4">
                     <ReCAPTCHA
                        sitekey="6LeXbR4gAAAAACEoWJd-fxWmIYCGN2fyVlvq9Ahi"
                        onChange={handleRecaptchaChange}
                     />
                  </div>

                  <button
                     onClick={handleSubmit}
                     disabled={isSaving || !recaptchaToken}
                     className='
                    bg-blue-600 
                      py-3 
                      text-white 
                      rounded-md 
                      w-full 
                      mt-6
                    hover:bg-blue-700 
                      transition
                   '
                  >
                     { isSaving ? 'Enviando...' : 'Enviar'}
                  </button>

                  <div className={`mt-4 ${hasError ? 'block' : 'hidden'}`}>
                     <p className='text-white text-center mt-3'>{errorMessage}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ContactForm;
