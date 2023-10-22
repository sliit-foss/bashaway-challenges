const crypto = require('crypto');
const { Kafka } = require('kafkajs')

jest.setTimeout(30000)

const kafka = new Kafka({
  clientId: crypto.randomBytes(16).toString('hex'),
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: crypto.randomUUID() });

test('should check if messages are being published to the topic SOS every second', async () => {
  let messageCount = 0;
  await consumer.connect();
  await consumer.subscribe({ topic: 'SOS' });
  await new Promise((resolve) => {
    consumer.run({
      eachMessage: async ({ message }) => {
        console.info(`received message - key: ${message.key.toString()} - value: ${message.value.toString()}`)
        messageCount++;
        expect(message.value.toString()).toBeTruthy();
        if (messageCount === 10) {
          resolve();
        }
      }
    });
  });
  await consumer.disconnect();
})