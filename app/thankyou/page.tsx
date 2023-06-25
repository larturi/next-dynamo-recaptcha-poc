import React from 'react';
import Link from 'next/link';

const thankyou = () => {
   return (
      <div className='flex flex-col justify-center items-center h-screen'>
         <h1 className='text-4xl font-bold mb-4'>Gracias por tu contacto!</h1>
         <p className='text-lg'>El mismo quedo registrado bajo el N° XXXXX</p>
         <p className='text-sm mt-5'>
            <Link href='/'>
                  Volver a la página de inicio
            </Link>
         </p>
      </div>
   );
};

export default thankyou;
