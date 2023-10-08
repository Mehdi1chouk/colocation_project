import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { share } from 'rxjs/operators';
import { ChatMessage } from 'back-end/model/chat';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  private apiUrl = 'http://localhost:3030';

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3030');
  }

  getAllChatMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/chat-messages`);
  }
  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Allreservations`);
  }
  DeleteReservation(reservationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteReservations/${reservationId}`);
  }


  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        console.log('Received event:', eventName);
        console.log('Received data:', data);
        subscriber.next(data);
      });
    }).pipe(share());
  }


  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }


  joinChat(currentUserID: string, houseOwnerID: string) {
    this.socket.emit('joinChat', { currentUserID, houseOwnerID });
  }

  sendMessage(currentUserID: string, houseOwnerID: string, message: string) {
    this.socket.emit('sendMessage', { currentUserID, houseOwnerID, message });
  }


  makeReservation(currentUserID: string, houseOwnerID: string, houseID: string, dates: any) {
    this.socket.emit('makeReservation', { currentUserID, houseOwnerID, houseID, dates });
  }

}
