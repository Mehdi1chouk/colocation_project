import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-msg-reservation',
  templateUrl: './msg-reservation.component.html',
  styleUrls: ['./msg-reservation.component.css']
})
export class MsgReservationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
}
