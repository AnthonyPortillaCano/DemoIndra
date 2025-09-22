import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppointmentService } from '../services/appointment.service';

const service = new AppointmentService();

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === 'POST') {
    return service.createAppointment(event);
  }
  if (event.httpMethod === 'GET') {
    return service.listAppointments(event);
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
