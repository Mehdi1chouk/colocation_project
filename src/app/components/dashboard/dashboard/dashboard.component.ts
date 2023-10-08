import { Component, OnInit } from '@angular/core';
import { DataFormService } from 'src/app/services/data-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltreComponent } from '../../filtre/filtre/filtre.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  form: FormGroup;
  sortedHouses: any[] = [];
  showSortedHouses: boolean = false;
  constructor(
    private DataFormService: DataFormService,
    private router: Router,
    public _DomSanitizationService: DomSanitizer,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {


    this.form = this.fb.group({
      trier: [''],
    });

  }
  house: any;
  houses: any[] = [];


  ngOnInit(): void {
    this.DataFormService.getHouses().subscribe((houses) => {
      this.houses = houses;

      this.houses.forEach((house) => {
        house.favorite = false; // Add the favorite property and set it to false
      });
      console.log('houses in ngoninit dash', houses);
    });
    // console.log(localStorage.getItem('userId'))
  }

  showDetails(house: any) {
    console.log('house fel showdetails:', house);
    const id = house._id;
    console.log('id showdetails:', id);
    this.router.navigate(['/details_annonce', id]);
  }
  filtrer() {
    this.dialog.open(FiltreComponent);
  }

  toggleFavorite(house: any) {
    house.favorite = !house.favorite;
  }


  triAnnonce(): void {
    const selectedValue = this.form.get('trier')?.value;

    if (selectedValue === 'prixminimum') {
      this.sortedHouses = this.houses.slice().sort((a, b) => a.prix - b.prix);
      this.showSortedHouses = true;
    } else if (selectedValue === 'prixmaximum') {
      this.sortedHouses = this.houses.slice().sort((a, b) => b.prix - a.prix);
      this.showSortedHouses = true;
    } else {
      this.showSortedHouses = false;
    }
  }


}
