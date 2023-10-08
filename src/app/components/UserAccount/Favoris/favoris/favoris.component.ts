import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SocketioService } from 'src/app/services/socketio/socketio.service';
import { DataFormService } from 'src/app/services/data-form.service';
import { ChatMessage } from 'back-end/model/chat';
import { User } from 'back-end/model/user';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent implements OnInit {
  receivedMessages: any[] = [];
  sendername: any
  nom: string;
  chatMessages: ChatMessage[] = [];
  newMessage: string;
  messages: any[] = [];
  house: any;
  houses: any;

  OwnerHouses: any[];
  public userid: string;
  public currentUserID: string;
  constructor(private router: Router, private SocketioService: SocketioService, private DataFormService: DataFormService) { }

  ngOnInit() {
    this.DataFormService.getHouses().subscribe((houses) => {
      this.houses = houses;
      console.log('houses fel useraccount', houses);

      this.userid = localStorage.getItem('userId');
      console.log('id : ', this.userid);

      this.OwnerHouses = this.houses.filter(house => house.owner === this.userid);
      console.log('OwnerHouses:', this.OwnerHouses);

      const currentUserID = localStorage.getItem('userId');
      const houseOwnerID = this.houses[0].owner;



      console.log('this is the id of the owner of the house', houseOwnerID);
      console.log('this is the id of the current user', currentUserID);


      this.SocketioService.joinChat(currentUserID, houseOwnerID);







      this.SocketioService.listen('message').subscribe((data) => {
        console.log('Received Message:', data);
        const senderID = data.sender;
        const messageContent = data.message;

        this.chatMessages.push({ senderID, senderName: 'Sender Name', messageContent });
        // Display messages in the other component
        this.receivedMessages.push({ senderID, messageContent });
      });




      this.SocketioService.listen('newMessage').subscribe((data) => {
        // Handle new message received by the owner
        const senderID = data.sender;
        const messageContent = data.message;
      });

    });








    this.getallmsgs();
  }


  sendMessage(message: string) {
    const currentUserID = localStorage.getItem('userId');
    const houseOwnerID = this.houses[0].owner;

    console.log('Sender ID:', currentUserID);
    console.log('Receiver ID:', houseOwnerID);
    console.log('Message:', message);

    this.SocketioService.sendMessage(currentUserID, houseOwnerID, message);


    this.chatMessages.push({
      senderID: currentUserID,
      senderName: 'Your Name', // Replace 'Your Name' with the actual sender name
      messageContent: message
    });


    this.newMessage = '';
  }



  getallmsgs() {
    this.SocketioService.getAllChatMessages().subscribe(
      (messages) => {
        this.chatMessages = [];

        const uniqueUserIds = Array.from(new Set(messages.map((message) => message.sender)));

        uniqueUserIds.forEach((userId) => {
          this.getsenderName(userId).subscribe((senderName) => {
            const userMessages = messages.filter((message) => message.sender === userId);
            userMessages.forEach((message) => {
              this.chatMessages.push({
                senderID: userId,
                senderName: senderName,
                messageContent: message.message
              });
            });
          });
        });

        console.log('All Chat Messages:', this.chatMessages);
      },
      (error) => {
        console.error('Failed to retrieve chat messages:', error);
      }
    );

  }


  getsenderName(userId: string): Observable<string> {
    return this.DataFormService.getUser(userId).pipe(
      map((user: User) => user.nom)
    );
  }












  gotonotification() {
    this.router.navigate(['/compte/Notifications']);
  }
  gotofavoris() {
    this.router.navigate(['/compte/Favoris']);
  }
  gotoparametres() {
    this.router.navigate(['/compte/Parametres']);
  }
  gotocompte() {
    this.router.navigate(['/compte/logements']);
  }


}
