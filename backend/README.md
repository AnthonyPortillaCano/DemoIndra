# Appointment Backend

Backend para agendamiento de citas médicas usando Serverless Framework, AWS, Node.js y TypeScript.

## Endpoints

- `POST /appointments`: Crea una cita médica (guarda en DynamoDB y dispara el flujo AWS).
- `GET /appointments/{insuredId}`: Lista las citas por código de asegurado, incluyendo el estado.

## Despliegue

1. Instala dependencias:
   ```powershell
   cd backend
   npm install
   ```
2. Compila TypeScript:
   ```powershell
   npm run build
   ```
3. Despliega en AWS:
   ```powershell
   npm run deploy
   ```

## Pruebas

```powershell
npm test
```

## Documentación OpenAPI/Swagger
- La documentación estará disponible en `/docs` (pendiente de implementación).

## Arquitectura
- SOLID, Clean Architecture, uso de patrones de diseño.
- AWS: Lambda, API Gateway, DynamoDB, SNS, SQS, EventBridge, RDS MySQL.

## Variables de entorno
- Configura los datos de conexión a MySQL en `serverless.yml`.

## Notas
- El RDS MySQL debe existir previamente.
- El asegurado ya está registrado en el backend.
- El envío de correo de confirmación no está incluido en este reto.
