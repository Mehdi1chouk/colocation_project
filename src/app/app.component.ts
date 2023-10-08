import { Component, OnInit } from '@angular/core';
import { SocketioService } from './services/socketio/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pfe';
  showImageCover = true;

  constructor(private socketService: SocketioService) { }


  ngOnInit() {

  }

}
