import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  notifyNewBooking(booking: any) {
    this.server.emit('booking:created', booking);
  }

  notifyStatusChanged(booking: any) {
    this.server.emit('booking:updated', booking);
  }
}