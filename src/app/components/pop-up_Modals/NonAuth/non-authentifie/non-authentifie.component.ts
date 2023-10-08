import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-non-authentifie',
  templateUrl: './non-authentifie.component.html',
  styleUrls: ['./non-authentifie.component.css']
})
export class NonAuthentifieComponent {


  constructor(

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
