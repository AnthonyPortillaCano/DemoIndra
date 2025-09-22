import { EventBridgeEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';

const sqs = new SQS();
const queueUrl = process.env.SQS_FINAL || '';

export const handler = async (event: EventBridgeEvent<string, any>) => {
  // Recibe evento de conformidad y lo envía a SQS final
  await sqs.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(event.detail),
  }).promise();
};
