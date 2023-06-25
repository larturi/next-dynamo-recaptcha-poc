import { NextResponse } from 'next/server';
import AWS, { config, SES } from "aws-sdk";

import axios from 'axios';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const ses = new SES();

const sendEmail = async (destinatario: string) => {
   try {
     const params = {
       Destination: {
         ToAddresses: [destinatario]
       },
       Message: {
         Body: {
           Text: {
             Data: `Gracias por completar el formulario. Tu mensaje ha sido recibido correctamente.`,
           },
         },
         Subject: {
           Data: "Gracias por tu mensaje",
         },
       },
       Source: "lnarturi.teco@gmail.com", // Remitente
     };
 
     await ses.sendEmail(params).promise();
     console.log("Correo electrónico enviado correctamente");
   } catch (error) {
     console.error("Error al enviar el correo electrónico:", error);
   }
 };

export async function POST(request: Request) {
   const body = await request.json();

   // Configura las credenciales y la región de AWS
   AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
   });

   // Crea una instancia del cliente de DynamoDB
   const dynamoDB = new AWS.DynamoDB.DocumentClient();

   try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      if (body.name === '' || body.email === '' || body.message === '') {
         return NextResponse.json({
            message: 'Todos los campos son requeridos',
         });
      }

      // Verifica el token de reCAPTCHA
      const recaptchaToken = body.recaptchaToken;
      const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

      try {
         const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`
         );

         if (!recaptchaResponse.data.success) {
            return NextResponse.json({
               message: 'La verificación de reCAPTCHA ha fallado',
            });
         }
      } catch (error) {
         console.error('Error al verificar reCAPTCHA:', error);
         return NextResponse.json({
            message: 'Error al verificar reCAPTCHA',
         });
      }

      // Guarda en la DynamoDB
      const item = {
         PK: 'SUGERENCIAS',
         SK: 'SUGERENCIAS#' + formattedDate,
         id: body.id,
         name: body.name,
         email: body.email,
         message: body.message,
         creationDate: formattedDate,
      };

      // Configura los parámetros para la operación de escritura en DynamoDB
      const params = {
         TableName: 'SUGERENCIAS',
         Item: item,
      };

      await dynamoDB.put(params).promise();

      // Envio de Email con AWS SMS
      await sendEmail(body.email);

      return NextResponse.json({ message: 'Datos guardados en DynamoDB' });
   } catch (error) {
      console.error('Error al guardar los datos en DynamoDB:', error);
      return NextResponse.json({
         message: 'Error al guardar los datos en DynamoDB',
      });
   }
}
