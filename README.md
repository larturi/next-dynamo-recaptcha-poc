# PoC Next.js Form

## Tecnologias

- Next.js v13
- AWS DynamoDB
- AWS Simple Email Service
- Google Recaptcha
- Node v16 o superior

## Get Started

1. Copiar .env.template y crear el .env con las variables de Google Recaptcha y AWS IAM
2. Instalar las dependencias

```bash
 yarn
```

3. Iniciar la app

```bash
 yarn dev
```

## AWS

Crear un usuario de aplicación desde AWS IAM y otorgar los permisos de Dynamo y SMS

- AmazonSESFullAccess
- AmazonDynamoDBFullAccess
- AmazonDynamoDBFullAccesswithDataPipeline
- AWSCloudFormationFullAccess
