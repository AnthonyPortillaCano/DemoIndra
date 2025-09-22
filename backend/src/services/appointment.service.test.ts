import { AppointmentService } from './appointment.service';
jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({ Items: [] }),
  };
  const mSNS = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({}),
  };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mDocumentClient) },
    SNS: jest.fn(() => mSNS),
    SQS: jest.fn(),
    EventBridge: jest.fn(),
  };
});

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    service = new AppointmentService();
  });

  it('should create an appointment and return accepted', async () => {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        insuredId: '01234',
        scheduleId: 100,
        countryISO: 'PE',
      }),
    };
    const result = await service.createAppointment(event);
    expect(result.statusCode).toBe(202);
    expect(JSON.parse(result.body).message).toBe('Agendamiento en proceso');
    expect(JSON.parse(result.body).appointmentId).toBeDefined();
  });

  it('should list appointments for insuredId', async () => {
    const event = {
      httpMethod: 'GET',
      pathParameters: { insuredId: '01234' },
    };
    const result = await service.listAppointments(event);
    expect(result.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(result.body))).toBe(true);
  });
});
