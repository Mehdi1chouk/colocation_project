import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFormService } from 'src/app/services/data-form.service';

@Component({
  selector: 'app-filtred-houses',
  templateUrl: './filtred-houses.component.html',
  styleUrls: ['./filtred-houses.component.css']
})
export class FiltredHousesComponent implements OnInit {
  form: FormGroup;
  filtredHouses: any[] = [];
  sortedHouses: any[] = [];
  constructor(private router: Router, private route: ActivatedRoute, private DataFormService: DataFormService, private fb: FormBuilder) {
    this.form = this.fb.group({
      trier: [''],
    });
  }
  ngOnInit(): void {
    this.filtredHouses = this.DataFormService.getFilteredHouses();
    this.sortedHouses = this.filtredHouses.slice();

  }
  showDetails(house: any) {
    const id = house._id;
    console.log(id)
    if (id) {
      this.router.navigate(['/details_annonce', id]);
    }
  }
  onOptionSelect(): void {
    const selectedValue = this.form.get('trier')?.value;
    console.log('Selected value:', selectedValue);

    if (selectedValue === 'prixminimum') {
      this.sortedHouses = this.filtredHouses.slice().sort((a, b) => a.prix - b.prix);
    } else if (selectedValue === 'prixmaximum') {
      this.sortedHouses = this.filtredHouses.slice().sort((a, b) => b.prix - a.prix);
    } else {
      // Default case: No sorting
      this.sortedHouses = this.filtredHouses.slice();
    }
  }
  //slice() ta3ml copy men filtrehouses array  to avoid modifying the original array during sorting.
  /*

 1)
  .sort((a, b) => a.prix - b.prix): The .sort() method is used to sort the array based on a comparison function. In this case,
   the comparison function (a, b) => a.prix - b.prix is provided.

 2) 
 (a, b) => a.prix - b.prix: This is an arrow function that defines the comparison logic for sorting the houses. The a and b parameters represent two houses being compared.
  a.prix and b.prix are the prices of the two houses:

  -If a.prix - b.prix is a negative value, it means that a should be placed before b in the sorted array.
  -If a.prix - b.prix is a positive value, it means that b should be placed before a in the sorted array.
  -If a.prix - b.prix is zero, it means that the prices of a and b are equal, so their relative order doesn't change.

 */

}
