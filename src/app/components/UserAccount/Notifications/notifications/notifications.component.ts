import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio/socketio.service';
import { DataFormService } from 'src/app/services/data-form.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteNotifComponent } from '../../DeleteNotif/delete-notif/delete-notif.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  reservations: any[];
  users: any[];
  houses: any[];
  dialogRef: MatDialogRef<DeleteNotifComponent>;
  successMessage: string;
  showModal: boolean = false;

  isConfirmationModalVisible = false; // Flag to control the visibility of the confirmation modal
  reservationToDelete: any;
  constructor(private router: Router, private SocketioService: SocketioService, private DataFormService: DataFormService, private dialog: MatDialog,) { }
  ngOnInit(): void {

    this.DataFormService.getHouses().subscribe((houses) => {
      this.houses = houses;
      console.log('houses fel useraccount', houses);
    });

    this.loadReservations();
  }


  reservation() {
    this.SocketioService.getReservations()
      .subscribe(reservations => {
        this.reservations = reservations;
        console.log('All reservations:', this.reservations);
        this.loadUsers(); // Call loadUsers() after retrieving reservations
      }, error => {
        console.error('Error getting reservations:', error);
      });
  }

  loadUsers() {
    this.DataFormService.getallusers()
      .subscribe(users => {
        this.users = users;
        console.log('userrrr', users)
        this.replaceSenderIDWithName();
      }, error => {
        console.error('Error getting users:', error);
      });
  }

  replaceSenderIDWithName() {
    for (const reservation of this.reservations) {
      const sender = this.users.find(user => user._id === reservation.sender);
      if (sender) {
        reservation.sender = sender.nom; // Replace sender ID with the sender's name
      }

      const house = this.houses.find(house => house._id === reservation.house);
      if (house) {
        reservation.house = house.titre; // Replace house ID with the house's title
      }
    }
  }
  loadReservations() {
    this.SocketioService.getReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        console.log('All reservations:', this.reservations);
        this.loadUsers();
      },
      (error) => {
        console.error('Error getting reservations:', error);
      }
    );
  }
  deleteReservation(reservationId: string) {
    this.SocketioService.DeleteReservation(reservationId).subscribe(
      () => {
        console.log('Reservation deleted successfully');
        // Call loadReservations() again to update the reservations list
        this.loadReservations();
      },
      (error) => {
        console.error('Failed to delete reservation:', error);
      }
    );
  }



  showConfirmationModal(reservation: any) {
    const dialogRef = this.dialog.open(DeleteNotifComponent, {
      width: '400px',
      data: reservation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Delete the reservation
        this.deleteReservation(reservation._id);
      }
    });
  }


  cancelDeletion() {
    this.isConfirmationModalVisible = false;
  }





  showSuccessModal() {
    this.successMessage = 'Reservation Accepté!';
    this.showModal = true;
  }


  onConfirm(): void {
    this.showSuccessModal();
  }

  hideModal() {
    this.showModal = false;
  }

  gotonotification() {
    this.router.navigate(['/compte/Notifications']);
  }
  gotoMessage() {
    this.router.navigate(['/compte/Messages']);
  }
  gotoparametres() {
    this.router.navigate(['/compte/Parametres']);
  }
  gotocompte() {
    this.router.navigate(['/compte/logements']);
  }



}
