import { SNS, SQS, EventBridge } from 'aws-sdk';

const sns = new SNS();
const sqs = new SQS();
const eventBridge = new EventBridge();

export class AWSIntegrationService {
  async publishToSNS(countryISO: string, message: any) {
    const topicArn = countryISO === 'PE' ? process.env.SNS_TOPIC_PE : process.env.SNS_TOPIC_CL;
    await sns.publish({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
    }).promise();
  }

  async sendToSQS(queueUrl: string, message: any) {
    await sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    }).promise();
  }

  async sendEventBridge(detail: any) {
    await eventBridge.putEvents({
      Entries: [
        {
          EventBusName: process.env.EVENT_BRIDGE,
          Source: 'appointment-backend',
          DetailType: 'AppointmentConfirmation',
          Detail: JSON.stringify(detail),
        },
      ],
    }).promise();
  }
}
