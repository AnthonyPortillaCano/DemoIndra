import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { AWSIntegrationService } from './aws.integration';
import AWS from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE || 'Appointments';
const awsIntegration = new AWSIntegrationService();

export class AppointmentService {
  private sns = new AWS.SNS();

  async createAppointment(event: any) {
    const body = JSON.parse(event.body);
    // Validations here
    const item = {
      insuredId: body.insuredId,
      scheduleId: body.scheduleId,
      countryISO: body.countryISO,
      status: 'pending',
      createdAt: new Date().toISOString(),
      appointmentId: uuidv4(),
    };
    // Solo usar mocks si IS_OFFLINE está activo
    if (process.env.IS_OFFLINE === 'true') {
      return {
        statusCode: 202,
        body: JSON.stringify({ message: 'Agendamiento en proceso (local)', appointmentId: item.appointmentId }),
      };
    }
    await dynamoDb.put({ TableName: tableName, Item: item }).promise();
    // Publicar en SNS según país
    const params = {
      Message: JSON.stringify({ insuredId: body.insuredId, scheduleId: body.scheduleId }),
      TopicArn: process.env.SNS_TOPIC_PE,
    };
    await this.sns.publish(params).promise();
    return {
      statusCode: 202,
      body: JSON.stringify({ message: 'Agendamiento en proceso', appointmentId: item.appointmentId }),
    };
  }

  async listAppointments(event: any) {
    const insuredId = event.pathParameters?.insuredId;
    if (process.env.IS_OFFLINE === 'true') {
      return {
        statusCode: 200,
        body: JSON.stringify([
          {
            insuredId,
            scheduleId: 100,
            countryISO: 'PE',
            status: 'pending',
            createdAt: new Date().toISOString(),
            appointmentId: 'local-id',
          },
        ]),
      };
    }
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    };
    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  }
}
