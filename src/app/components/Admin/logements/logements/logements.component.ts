import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataFormService } from 'src/app/services/data-form.service';
import { HousesService } from 'src/app/services/houses/houses.service';
import { CitiesService } from 'src/app/services/cities.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-logements',
  templateUrl: './logements.component.html',
  styleUrls: ['./logements.component.css']
})
export class LogementsComponent implements OnInit {
  form: FormGroup;
  houses: any[] = [];
  cities: any[];
  localites: string[] = [];
  isFiltered: boolean = false;
  selectedHouse: any;
  constructor(private route: ActivatedRoute, private DataFormService: DataFormService, private router: Router,
    private HousesService: HousesService, public citiesService: CitiesService, private fb: FormBuilder) {


    this.form = this.fb.group({

      region: [''],

    });

    this.form.controls['region'].valueChanges.subscribe(selectedRegion => {
      this.cities = this.getCitiesByRegion(selectedRegion);
    });

  }



  ngOnInit(): void {

    this.DataFormService.getHouses().subscribe((houses) => {
      this.houses = houses;

      this.houses.forEach((house) => {
        house.favorite = false; // Add the favorite property and set it to false
      });
      console.log('houses in ngoninit admin', houses);
    });
    // console.log(localStorage.getItem('userId'))





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


  rechercher() {
    const selectedRegion = this.form.controls['region'].value;
    const filteredHouses = this.filterHousesByRegion(selectedRegion);
    this.houses = [...filteredHouses]; // Update the houses array with the filtered houses
    this.isFiltered = true;
    console.log('filtered houses:', this.houses);
  }


  filterHousesByRegion(region: string): any[] {
    return this.houses.filter(house => house.region === region);
  }

  showDetails(house: any) {
    console.log('house fel showdetails:', house);
    const id = house._id;
    console.log('id showdetails:', id);
    this.router.navigate(['/details_annonce', id]);
  }


  gotoUsers() {
    this.router.navigate(['/Admin/Users']);
  }

  gotoLogements() {
    this.router.navigate(['/Admin/Logements']);
  }

}
