import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CitiesService } from 'src/app/services/cities.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataFormService } from 'src/app/services/data-form.service';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-add1',
  templateUrl: './add1.component.html',
  styleUrls: ['./add1.component.css'],
})
export class Add1Component implements OnInit {

  calendarData: number[] = [];
  currentMonthIndex: number;
  currentYear: number;
  currentMonth: string;
  currentMonthDays: number;
  years: number[] = [];
  selectedDays: { [monthIndex: number]: number[] } = {}; // Separate selected days for each month
  //      aaaa
  form: FormGroup;
  house: any = {};
  cities: any[];
  localites: string[] = [];
  disableSelectForm = false;
  markerLngLat: mapboxgl.LngLat | undefined;
  selectedType: string = '';

  constructor(private route: Router, public citiesService: CitiesService, private fb: FormBuilder, private DataFormService: DataFormService) {

    this.form = this.fb.group({
      selectedtype: [''],
      etage: [''],
      etat: [''],
      region: [''],
      delegation: [''],
      localite: [''],
      cp: [''],
      localisation: [''],
      calendrier: [''],
      asenceur: [''],
      garage: [''],
      piscine: [''],

    });

    this.form.controls['region'].valueChanges.subscribe(selectedRegion => {
      this.cities = this.getCitiesByRegion(selectedRegion);
    });
  }

  onSubmit() {
    this.selectedType = this.form.value.selectedtype;

    const house = {
      selectedtype: this.form.value.selectedtype,
      etage: this.form.value.etage,
      etat: this.form.value.etat,
      asenceur: this.form.value.asenceur,
      garage: this.form.value.garage,
      piscine: this.form.value.piscine,
      calendrier: this.form.value.calendrier,
      region: this.form.value.region,
      delegation: this.form.value.delegation,
      localite: this.form.value.localite,
      cp: this.form.value.cp,
      localisation: this.markerLngLat ? { lat: this.markerLngLat.lat, lng: this.markerLngLat.lng } : null,
    };
    this.DataFormService.formData1 = this.form.value;

    console.log('test', typeof (this.form.value.calendrier))
    this.route.navigate(['/Add/Ajouter_annonce2'])
  }

  onNext() {
    this.onSubmit();
    this.route.navigate(['/Add/Ajouter_annonce2'])
  }

  ngOnInit(): void {


    this.selectedType = this.form.value.selectedtype;


    this.setCurrentMonth();
    this.generateYears();

    setTimeout(() => {
      this.currentYear = new Date().getFullYear();
      const selectElement = document.getElementById('year') as HTMLSelectElement;
      selectElement.value = this.currentYear.toString();
      selectElement.dispatchEvent(new Event('change'));
    });



    if (this.DataFormService.formData1) {
      // Populate the form with the stored data
      this.form.patchValue(this.DataFormService.formData1);
    }

    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1IjoibWVoZHkxMiIsImEiOiJjbGZ2cGxyc2wwOWo5M3BxaGtmaGNhczN4In0.c9e3Q7S9ZlMVBirYY79JQg';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [9.5375, 33.8869], // starting position [lng, lat]
      zoom: 5.6, // starting zoom
    });

    let marker = new mapboxgl.Marker();

    map.on('click', (event) => {
      const lngLat = event.lngLat;

      // Check if the clicked coordinates are within the bounds of Tunisia
      const isWithinBounds = isCoordinatesWithinTunisia(lngLat);

      if (isWithinBounds) {
        // Remove existing marker, if any
        marker.remove();

        // Create a new marker at the clicked location
        marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

        this.markerLngLat = lngLat;

        this.form.controls['localisation'].setValue({
          lat: lngLat.lat,
          lng: lngLat.lng
        });


      }
    });

    function isCoordinatesWithinTunisia(lngLat) {
      const bounds = [
        [7.525, 30.236], // Southwest coordinates of Tunisia
        [11.598, 37.345] // Northeast coordinates of Tunisia
      ];

      return (
        lngLat.lng >= bounds[0][0] &&
        lngLat.lng <= bounds[1][0] &&
        lngLat.lat >= bounds[0][1] &&
        lngLat.lat <= bounds[1][1]
      );
    }

    const initialRegion = this.form.controls['region'].value;
    this.cities = this.getCitiesByRegion(initialRegion);


    this.form.get('delegation').valueChanges.subscribe(delegationName => {
      const governorate = this.citiesService.governorates.find(g => g.name === this.form.get('region').value);
      const delegation = governorate.cities.find(c => c.delegation === delegationName);
      this.localites = delegation.localite;
    });
  }

  getCitiesByRegion(regionName: string): any[] {
    const governorate = this.citiesService.governorates.find(g => g.name === regionName);

    if (governorate) {
      const cities = governorate.cities;
      const uniqueDelegations = this.citiesService.removeDuplicateDelegations(cities);
      return uniqueDelegations;
    } else {
      return [];
    }
  }
  showAdditionalCode: boolean = false;

  siAsenceur() {
    const selectedValue = this.form.get('selectedtype')?.value;
    if (selectedValue === 'Appartement') {
      this.showAdditionalCode = true;
    } else {
      this.showAdditionalCode = false;
    }
  }

  sigarage() {
    const selectedValue = this.form.get('selectedtype')?.value;
    if (selectedValue === 'Maison') {
      this.showAdditionalCode = true;
    } else {
      this.showAdditionalCode = false;
    }
  }

  onRadioChange() {
    const selectedValue = this.form.get('selectedtype')?.value;
    const etage = this.form.get('etage');
    if (selectedValue === 'Maison' || selectedValue === "maison d'hôte" || selectedValue === "Villa") {
      etage?.disable();
      etage?.setValue(0);
    } else {
      this.form.get('etage')?.enable();
    }
  }


  //calendar



  isSelected(day: number): boolean {
    const selectedDays = this.selectedDays[this.currentMonthIndex];
    const selectedYearDays = selectedDays?.filter(yearDay => {
      const formattedYear = this.getFormattedYear(this.currentMonthIndex);
      const isSameYear = formattedYear === this.currentYear.toString();
      return isSameYear ? yearDay === day : false;
    });
    return selectedYearDays && selectedYearDays.includes(day);
  }



  selectDay(day: number) {
    if (!this.selectedDays[this.currentMonthIndex]) {
      this.selectedDays[this.currentMonthIndex] = []; // Initialize array for the month if it doesn't exist
    }

    const selectedDays = this.selectedDays[this.currentMonthIndex];
    const selectedIndex = selectedDays.indexOf(day);

    if (selectedIndex === -1) {
      selectedDays.push(day); // Add the selected day for the current month
    } else {
      selectedDays.splice(selectedIndex, 1); // Remove the selected day from the current month
    }

    this.updateFormControlValue();
    //this.CalendarService.selectedDates = this.getFormattedDates();
  }

  changeYear(event: any) {
    const year = event.target.value;
    const previousYear = this.currentYear;

    this.currentYear = year;

    // Clear selected days for the current month if it exists
    delete this.selectedDays[this.currentMonthIndex];

    this.generateCalendarData(this.currentMonthIndex, this.currentYear);

    this.updateFormControlValue();
  }



  generateCalendarData(monthIndex: number, year: number) {
    const daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = daysInEachMonth[monthIndex];

    this.calendarData = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    for (let i = 0; i < firstDay; i++) {
      this.calendarData.unshift(-1);
    }
  }

  setCurrentMonth() {
    const date = new Date();
    this.currentMonthIndex = date.getMonth();
    this.currentYear = date.getFullYear();

    this.generateCalendarData(this.currentMonthIndex, this.currentYear);

    const monthNames = [
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

    this.currentMonth = monthNames[this.currentMonthIndex];
    this.currentMonthDays = this.calendarData.filter(day => day >= 0).length;

    this.updateFormControlValue();
  }




  prevMonth() {
    if (this.currentMonthIndex === 0) {
      this.currentYear--;
      this.currentMonthIndex = 11;
    } else {
      this.currentMonthIndex--;
    }

    this.currentMonth = this.getMonthName(this.currentMonthIndex);
    this.generateCalendarData(this.currentMonthIndex, this.currentYear);
    this.currentMonthDays = this.calendarData.filter(
      day => day >= 0 && day < this.getDaysInMonth(this.currentMonthIndex, this.currentYear)
    ).length;

    this.updateFormControlValue();
  }

  nextMonth() {
    if (this.currentMonthIndex === 11) {
      this.currentYear++;
      this.currentMonthIndex = 0;
    } else {
      this.currentMonthIndex++;
    }

    this.currentMonth = this.getMonthName(this.currentMonthIndex);
    this.generateCalendarData(this.currentMonthIndex, this.currentYear);
    this.currentMonthDays = this.calendarData.filter(
      day => day >= 0 && day < this.getDaysInMonth(this.currentMonthIndex, this.currentYear)
    ).length;

    this.updateFormControlValue();
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
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
    return monthNames[monthIndex];
  }

  getDaysInMonth(monthIndex: number, year: number): number {
    const date = new Date(year, monthIndex + 1, 0);
    return date.getDate();
  }

  generateYears() {
    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }


  getFormattedDates(): string[] {
    const formattedDates: string[] = [];
    for (const monthIndex in this.selectedDays) {
      const selectedDays = this.selectedDays[monthIndex];
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

  getFormattedYear(monthIndex: number): string {
    if (monthIndex <= this.currentMonthIndex) {
      return this.currentYear.toString();
    } else {
      return (this.currentYear - 1).toString();
    }
  }



  updateFormControlValue() {
    const selectedDates = this.getFormattedDates();
    this.form.patchValue({
      calendrier: selectedDates
    });
  }


  formatDate(day: number): string {
    const formattedDay = day < 10 ? '0' + day : day.toString();
    const formattedMonth = this.currentMonthIndex + 1 < 10 ? '0' + (this.currentMonthIndex + 1) : (this.currentMonthIndex + 1).toString();
    const formattedYear = this.currentYear.toString();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }

  isCurrentDay(day: number): boolean {
    const currentDate = new Date();
    return day === currentDate.getDate() && this.currentMonthIndex === currentDate.getMonth() && this.currentYear === currentDate.getFullYear();
  }



}
