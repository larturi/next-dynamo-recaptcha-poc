import { BodyObject } from '@/app/types';
import AWS from 'aws-sdk';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const saveDynamoDB = async (body: BodyObject) => {
   try {
      AWS.config.update({
         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
         region: process.env.AWS_REGION,
      });

      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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
   } catch (error) {
      throw new Error('Error al intentar insertar en DynamoDB');
   }
};
