import { Server } from 'socket.io';
export declare class EventsGateway {
    server: Server;
    notifyNewBooking(booking: any): void;
    notifyStatusChanged(booking: any): void;
}
