import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DataFormService } from 'src/app/services/data-form.service';
import { HousesService } from 'src/app/services/houses/houses.service';
import * as mapboxgl from 'mapbox-gl';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { DatePipe } from '@angular/common';
import { SocketioService } from 'src/app/services/socketio/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Console } from 'console';
import { ChatMessage } from 'back-end/model/chat';
import { Observable, map } from 'rxjs';
import { User } from 'back-end/model/user';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NonAuthentifieComponent } from '../../pop-up_Modals/NonAuth/non-authentifie/non-authentifie.component';
import { MsgReservationComponent } from '../../pop-up_Modals/reservation/msg-reservation/msg-reservation.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 3000, noPause: true } },
  ],
})
export class DetailsComponent implements OnInit {
  form: FormGroup;
  currentYear: number;
  currentMonth: string;
  calendarData: number[];
  years: number[];
  currentMonthIndex: number;
  currentMonthDays: number;
  availableDays: boolean[] = [];
  //aaa
  house: any;
  owner: any;
  map: mapboxgl.Map;
  selectedDays: number[][] = [];
  selectedDates: number[][] = [];
  selectedDatespro: string[] = [];
  eldate: string[] = [];

  messages: any[] = [];
  newMessage: string;
  receivedMessages: any[] = [];
  chatMessages: ChatMessage[] = [];

  icons = [
    { src: 'assets/icons/machine.png', selected: false, name: 'machinealaver' },
    { src: 'assets/icons/frigidaire.png', selected: false, name: 'Réfrigérateur' },
    { src: 'assets/icons/micro_onde.png', selected: false, name: 'Micro_onde' },
    { src: 'assets/icons/vaisselle.png', selected: false, name: 'Vaisselle' },
    { src: 'assets/icons/four.png', selected: false, name: 'Four' },
    { src: 'assets/icons/chauffe_eau.png', selected: false, name: 'Chauffage' },
    { src: 'assets/icons/clim.png', selected: false, name: 'Climatiseur' },
    { src: 'assets/icons/camera.png', selected: false, name: 'Sécurité' },
    { src: 'assets/icons/tv.png', selected: false, name: 'Tv' },
    { src: 'assets/icons/wifi.png', selected: false, name: 'Wifi' },
    { src: 'assets/icons/garde.png', selected: false, name: 'Concierge' },
    { src: 'assets/icons/ascenseur.png', selected: false, name: 'Asenceur' },
    { src: 'assets/icons/balcon.png', selected: false, name: 'Balcon' },
    { src: 'assets/icons/fleur.png', selected: false, name: 'Jardin' },
    { src: 'assets/icons/piscine.png', selected: false, name: 'Piscine' },
  ];
  showIcon: any[];


  constructor(
    private route: ActivatedRoute,
    private DataFormService: DataFormService,
    private HousesService: HousesService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private socketService: SocketioService,
    private http: HttpClient,
    private dialog: MatDialog

  ) {
    this.form = this.formBuilder.group({});
    this.currentYear = new Date().getFullYear();
    this.currentMonth = '';
    this.calendarData = [];
    this.years = [this.currentYear, this.currentYear + 1, this.currentYear + 2];

  }

  ngOnInit(): void {


    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      this.currentYear = +storedYear;
    }

    const today = new Date();
    this.currentMonth = this.getMonthName(today.getMonth());
    this.currentMonthIndex = today.getMonth();
    this.updateCalendar();

    const id = this.route.snapshot.paramMap.get('id');
    this.HousesService.GetHouse(id).subscribe((house) => {
      this.house = house;


      const array = new Array();
      this.house.icons[0].selectedIcons.forEach((element) => {
        const src = this.icons.find((e) => {
          return e.name == element;
        }).src;

        array.push(src);
      });
      this.showIcon = array;

      this.initializeMap();
      this.getOwnerDetails(this.house.owner); // Fetch owner details
      this.eldate = this.house.calendrier;
      this.splitDates();

      console.log('eldate', this.eldate);
      console.log('house calendar', this.house.calendrier);
      console.log('id house', this.house._id);


      const currentUserID = localStorage.getItem('userId');
      const houseOwnerID = this.house.owner;

      console.log('this is the id of the owner of the house', houseOwnerID);
      console.log('this is the id of the current user', currentUserID);


      this.socketService.joinChat(currentUserID, houseOwnerID);

      this.socketService.listen('message').subscribe((data) => {
        console.log('Received Message:', data);
        const senderID = data.sender;
        const messageContent = data.message;

        console.log('senderid:', senderID);

        // Display messages only for the currently logged-in user
        if (senderID === currentUserID || senderID === houseOwnerID) {
          this.receivedMessages.push({ senderID, messageContent });
          console.log('Received Message:', messageContent);
        }
      });

      this.socketService.listen('newMessage').subscribe((data) => {
        // Handle new message received by the owner
        const senderID = data.sender;
        const messageContent = data.message;
      });


      this.getallmsgs();


      for (let i = 0; i < this.house.icons; i++) {
        const house = this.house[i];
        const icons = house.icons;
        console.log('icons fe details page', icons);
      }
    });

    this.siAsenceur();

  }

  sendername: any
  nom: string;

  getallmsgs() {
    this.socketService.getAllChatMessages()
      .subscribe(
        (messages) => {
          this.chatMessages = [];
          const userIds = messages.map((message) => message.sender);

          userIds.forEach((userId) => {
            this.getsenderName(userId)
              .subscribe((senderName) => {
                const message = messages.find((m) => m.sender === userId);
                this.chatMessages.push({
                  senderID: userId,
                  senderName: senderName,
                  messageContent: message.message
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

  sendMessage(message: string) {

    const currentUserID = localStorage.getItem('userId');
    if (!currentUserID) {
      const dialogRef: MatDialogRef<NonAuthentifieComponent> = this.dialog.open(NonAuthentifieComponent, {
        width: '400px',
        data: { message: "Vous devez être authentifié pour envoyer un message." }
      });

      return;
    }


    // const currentUserID = localStorage.getItem('userId');
    const houseOwnerID = this.house.owner;

    console.log('Sender ID:', currentUserID);
    console.log('Receiver ID:', houseOwnerID);
    console.log('Message:', message);

    this.socketService.sendMessage(currentUserID, houseOwnerID, message);
    this.newMessage = '';
  }





  formatDatedepublication(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  splitDates(): void {
    for (const date of this.eldate) {
      const [day, month, year] = date.split('/');
      const dayNumber = +day; // Convert day to a number

      console.log('adhouma les date', date);
      console.log('Day as a number:', dayNumber);

      // Call the selectDate function to highlight the dates

    }
  }

  isCrossed(day: number): boolean {
    const monthIndex = this.getMonthIndex(this.currentMonth);
    const selectedMonthDates = this.selectedDates[monthIndex];
    if (selectedMonthDates) {
      return selectedMonthDates.includes(day);
    }
    return false;
  }

  isDisabled(day: number): boolean {
    const monthIndex = this.getMonthIndex(this.currentMonth);
    const selectedMonthDates = this.selectedDates[monthIndex];
    if (selectedMonthDates) {
      return selectedMonthDates.includes(day);
    }
    return false;
  }

  isInElDate(day: number): boolean {
    return this.eldate.includes(day.toString());
  }

  getOwnerDetails(ownerId: string): void {
    this.DataFormService.getUser(ownerId).subscribe((user) => {
      this.owner = user;
    });
  }

  initializeMap(): void {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoibWVoZHkxMiIsImEiOiJjbGZ2cGxyc2wwOWo5M3BxaGtmaGNhczN4In0.c9e3Q7S9ZlMVBirYY79JQg';

    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.house.localisation.lng, this.house.localisation.lat], // starting position [lng, lat]
      zoom: 7, // starting zoom level
    });
    const marker = new mapboxgl.Marker()
      .setLngLat([this.house.localisation.lng, this.house.localisation.lat])
      .addTo(this.map);
  }

  //aaa

  prevMonth(): void {
    const currentMonthIndex = this.getMonthIndex(this.currentMonth);
    const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const previousYear = currentMonthIndex === 0 ? this.currentYear - 1 : this.currentYear;

    this.currentYear = previousYear;
    this.currentMonth = this.getMonthName(previousMonthIndex);
    this.updateCalendar();
  }

  nextMonth(): void {
    const currentMonthIndex = this.getMonthIndex(this.currentMonth);
    const nextMonthIndex = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
    const nextYear = currentMonthIndex === 11 ? this.currentYear + 1 : this.currentYear;

    this.currentYear = nextYear;
    this.currentMonth = this.getMonthName(nextMonthIndex);
    this.updateCalendar();
  }

  changeYear(year: number): void {
    this.currentYear = year;
    localStorage.setItem('selectedYear', year.toString());
    this.updateCalendar();
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Decembre'
    ];

    return months[monthIndex];
  }


  updateCalendar(): void {
    const currentMonthIndex = this.getMonthIndex(this.currentMonth);
    const currentYear = this.currentYear;

    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

    this.calendarData = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const prefixDays = Array.from({ length: firstDayOfWeek }, (_, index) => -1);
    this.calendarData = [...prefixDays, ...this.calendarData];
  }





  getMonthIndex(monthName: string): number {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Decembre'
    ];

    return months.indexOf(monthName);
  }



  isCurrentDay(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.getMonthIndex(this.currentMonth) === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  isSelected(day: number): boolean {
    const monthIndex = this.getMonthIndex(this.currentMonth);
    if (this.selectedDates[monthIndex]) {
      return this.selectedDates[monthIndex].includes(day);
    }
    return false;
  }


  toggleSelection(day: number): void {
    const monthIndex = this.getMonthIndex(this.currentMonth);
    const selectedMonthDates = this.selectedDates[monthIndex] || [];


    // Check if any dates are already selected in other months
    const areOtherMonthsSelected = this.selectedDates.some((dates, index) => index !== monthIndex && dates !== undefined && dates.length > 0);

    if (!areOtherMonthsSelected) {
      if (this.isSelected(day)) {
        // Deselect the date if it's already selected
        const lastSelectedDayIndex = selectedMonthDates.lastIndexOf(day);
        if (lastSelectedDayIndex !== -1) {
          this.selectedDates[monthIndex] = selectedMonthDates.slice(0, lastSelectedDayIndex);
        }
      } else {
        // Select the date if it's not already selected
        const previousDay = selectedMonthDates[selectedMonthDates.length - 1];
        if (previousDay === undefined || day === previousDay + 1 || day === previousDay - 1) {
          this.selectedDates[monthIndex] = [...selectedMonthDates, day];
        }
      }
    }
  }


  getFormattedYear(monthIndex: number): string {
    if (monthIndex < this.currentMonthIndex || (monthIndex === this.currentMonthIndex && this.currentMonthDays === this.currentMonthDays)) {
      return this.currentYear.toString();
    } else {
      return (this.currentYear).toString();
    }
  }
  formatDate(day: number): string {
    const formattedDay = day < 10 ? '0' + day : day.toString();
    const formattedMonth = this.currentMonthIndex + 1 < 10 ? '0' + (this.currentMonthIndex + 1) : (this.currentMonthIndex + 1).toString();
    return `${formattedDay}/${formattedMonth}/${this.currentYear}`;
  }


  getFormattedDates(): string[] {
    const formattedDates: string[] = [];
    for (const monthIndex in this.selectedDates) {
      const selectedDays = this.selectedDates[monthIndex];
      if (selectedDays) {
        const formattedMonth = +monthIndex + 1;
        const formattedYear = this.getFormattedYear(+monthIndex);

        const formattedMonthDates = selectedDays.map(day => {
          const formattedDay = day < 10 ? '0' + day : day.toString();
          return `${formattedDay}/${formattedMonth}/${formattedYear}`;
        });
        formattedDates.push(...formattedMonthDates);
      }
    }
    return formattedDates;
  }

  selectDay(day: number): void {
    const monthIndex = this.getMonthIndex(this.currentMonth);
    const selectedMonthDates = this.selectedDates[monthIndex] || [];

    if (selectedMonthDates.length === 0) {
      // No dates selected in the current month
      this.selectedDates[monthIndex] = [day];
    } else {
      // Dates already selected in the current month
      const previousDay = selectedMonthDates[selectedMonthDates.length - 1];
      if (previousDay === undefined || day === previousDay + 1) {
        this.selectedDates[monthIndex] = [...selectedMonthDates, day];
      }
    }
  }

  isPastDay(day: number): boolean {
    const today = new Date();
    const currentMonthIndex = this.getMonthIndex(this.currentMonth);
    const currentYear = this.currentYear;

    if (
      currentYear < today.getFullYear() ||
      (currentYear === today.getFullYear() && currentMonthIndex < today.getMonth()) ||
      (currentYear === today.getFullYear() && currentMonthIndex === today.getMonth() && day < today.getDate())
    ) {
      return true; // Day is in the past
    }

    return false; // Day is not in the past
  }


  reservation(): void {

    const currentUserID = localStorage.getItem('userId');
    if (!currentUserID) {
      const dialogRef: MatDialogRef<any> = this.dialog.open(NonAuthentifieComponent, {
        width: '400px',
        data: { message: "Vous devez être authentifié pour réserver un logement." }
      });

      return;
    }

    console.log('id house traw', this.house._id);
    const selectedDates: string[] = this.getFormattedDates();
    console.log('Selected Dates:', selectedDates);
    console.log('adhouma les Dates mte3k:', this.eldate);

    const conflictingDates = selectedDates.filter(date => this.eldate.includes(date));
    const unavailableDates = this.eldate.filter(date => !selectedDates.includes(date));

    console.log('confl:', conflictingDates);
    console.log('unavailableDates:', unavailableDates);

    const selectedDatesCount = selectedDates.length;
    console.log('number of nights:', selectedDatesCount);

    if (selectedDates.length === 0) {
      alert("Vous devez sélectionner une date de réservation.");
      return;
    }

    if (conflictingDates.length > 0 || unavailableDates.length > 0) {
      let message = '';
      if (conflictingDates.length > 0) {
        message += `Vous ne pouvez pas réserver ce logement car l'une ou plusieurs des dates que vous avez sélectionnées sont déjà réservées. Veuillez sélectionner des dates différentes. Dates réservées : ${this.house.calendrier}`;
      } else {
        message += `Le montant à payer est : ${this.house.prix * selectedDatesCount}dt.`;

        message += `\nUne notification a été envoyée au propriétaire pour votre demande de réservation.`;

        const currentUserID = localStorage.getItem('userId');
        const houseOwnerID = this.house.owner;
        const houseID = this.house._id;
        const dates = selectedDates;
        // Send the reservation request to the server
        this.socketService.makeReservation(currentUserID, houseOwnerID, houseID, dates);

        console.log('Reservation created successfully.');

        // Clear selected dates
        this.selectedDates = [];

        // Refresh the calendar
        this.updateCalendar();
      }

      const dialogRef: MatDialogRef<MsgReservationComponent> = this.dialog.open(MsgReservationComponent, {
        width: '400px',
        data: { message: message }
      });
    }

    // Refresh the calendar
    this.updateCalendar();
  }
  showAdditionalCode: boolean = false;
  siAsenceur() {
    // const selectedValue = this.form.get('selectedtype')?.value;
    if (this.house.selectedType === 'Appartement') {
      this.showAdditionalCode = true;
    } else {
      this.showAdditionalCode = false;
    }
  }
  siGarage() {
    // const selectedValue = this.form.get('selectedtype')?.value;
    if (this.house.selectedType === 'Maison') {
      this.showAdditionalCode = true;
    } else {
      this.showAdditionalCode = false;
    }
  }
  siPiscine() {
    // const selectedValue = this.form.get('selectedtype')?.value;
    if (this.house.selectedType === 'Villa') {
      this.showAdditionalCode = true;
    } else {
      this.showAdditionalCode = false;
    }
  }




}
