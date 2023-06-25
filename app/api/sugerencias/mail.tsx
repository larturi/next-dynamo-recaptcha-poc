import { BodyObject } from '@/app/types';
import { SES } from 'aws-sdk';

const ses = new SES();

export const sendEmail = async (body: BodyObject) => {

   try {
      const params = {
         Destination: {
            ToAddresses: [body.email],
         },
         Message: {
            Body: {
               Text: {
                  Data: `Gracias por completar el formulario. Tu sugerencia quedó registrada bajo el N°. ${body.id}`,
               },
            },
            Subject: {
               Data: 'Gracias por tu mensaje',
            },
         },
         Source: 'lnarturi.teco@gmail.com', // Remitente
      };

      await ses.sendEmail(params).promise();
   } catch (error) {
      throw new Error('Error al enviar el email');
   }
};
