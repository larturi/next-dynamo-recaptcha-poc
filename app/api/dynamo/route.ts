import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { config } from 'dotenv';

config();

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

      const item = {
         PK: "SUGERENCIAS",
         SK: "SUGERENCIAS#" + formattedDate,
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

      // Guarda los datos en DynamoDB
      await dynamoDB.put(params).promise();

      return NextResponse.json({ message: 'Datos guardados en DynamoDB' });
   } catch (error) {
      console.error('Error al guardar los datos en DynamoDB:', error);
      return NextResponse.json({
         message: 'Error al guardar los datos en DynamoDB',
      });
   }
}
