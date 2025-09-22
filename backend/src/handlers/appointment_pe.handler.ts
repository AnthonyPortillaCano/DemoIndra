import { SQSEvent } from 'aws-lambda';
import { AppointmentCountryService } from '../services/appointment_country.service';

const service = new AppointmentCountryService('PE');

export const handler = async (event: SQSEvent) => {
  await service.processCountryAppointments(event);
};
