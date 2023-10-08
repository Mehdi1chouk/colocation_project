import { Component } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  latitude = 34.0;
  longitude = 9.0;

  constructor() { }

  ngOnInit(): void {
  }

}
