import { NextResponse } from 'next/server';

import { config as dotenvConfig } from 'dotenv';
import { sendEmail } from './mail';
import { saveDynamoDB } from './dynamo';
import { recaptchaValidator } from './recaptcha';
import { BodyObject } from '@/app/types';

dotenvConfig();

export async function POST(request: Request) {
   try {
      const body: BodyObject = await request.json();

      if (body.name === '' || body.email === '' || body.message === '') {
         throw new Error('Todos los campos son requeridos');
      }

      // Validacion ReCaptcha
      await recaptchaValidator(body.recaptchaToken);

      // Guarda en la DynamoDB
      await saveDynamoDB(body);

      // Envio de Email con AWS SMS
      await sendEmail(body);

      return NextResponse.json({ message: 'Datos guardados en DynamoDB' });
   } catch (error: any) {
      const errorMessage = error.message.includes(':') ? error.message.split(': ')[1] : error.message;
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}
