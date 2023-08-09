import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import 'dotenv/config';

@Injectable()
export class RabbitService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async init() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);

    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange('user_created', 'fanout', {
      durable: true,
    });
  }

  async sendMessage(message: any) {
    await this.channel.assertQueue('user_created');

    this.channel.sendToQueue(
      'user_created',
      Buffer.from(JSON.stringify(message)),
    );
  }

  // async getMessage() {
  //   await this.channel.consume('user_created', async (responseMensage) => {
  //     console.log(
  //       'chegouuu-->',
  //       Buffer.from(responseMensage.content).toString(),
  //     );
  //   });
  // }
}
