import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-notif',
  templateUrl: './delete-notif.component.html',
  styleUrls: ['./delete-notif.component.css']
})
export class DeleteNotifComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteNotifComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
