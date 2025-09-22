import { SQSEvent } from 'aws-lambda';
// import mysql from 'mysql2/promise'; // Uncomment and configure for real RDS
import { AWSIntegrationService } from './aws.integration';

export class AppointmentCountryService {
  constructor(private countryISO: string) {}

  async processCountryAppointments(event: SQSEvent) {
    const awsIntegration = new AWSIntegrationService();
    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      // Save to RDS (MySQL) - placeholder
      // Enviar conformidad a EventBridge
      await awsIntegration.sendEventBridge({
        insuredId: body.insuredId,
        scheduleId: body.scheduleId,
        countryISO: body.countryISO,
        status: 'completed',
        appointmentId: body.appointmentId,
      });
    }
  }
}
