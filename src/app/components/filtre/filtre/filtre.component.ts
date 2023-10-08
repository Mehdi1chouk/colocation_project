import { Component } from '@angular/core';
import { CitiesService } from 'src/app/services/cities.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataFormService } from 'src/app/services/data-form.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { FiltredHousesComponent } from '../../FiltredHouses/filtred-houses/filtred-houses.component';

@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.css']
})
export class FiltreComponent {
  form: FormGroup;
  localites: string[] = [];
  cities: any[];
  houses: Array<any> = []
  filtredHouses: Array<any> = []

  constructor(public citiesService: CitiesService, private fb: FormBuilder, private http: HttpClient,
    private DataFormService: DataFormService, private route: Router) {

    this.form = this.fb.group({
      prixmin: [''],
      prixmax: [''],
      region: [''],
      delegation: [''],
      localite: [''],

      maison: [''],
      maisondhotes: [''],
      chambrepartage: [''],
      appartement: [''],
      villa: [''],

      nbrechambre: [''],
      nbrelits: [''],
      nbresdb: [''],
    });

    this.form.controls['region'].valueChanges.subscribe(selectedRegion => {
      this.cities = this.getCitiesByRegion(selectedRegion);
    });
  }


  ngOnInit(): void {
    this.DataFormService.getHouses().subscribe((houses) => {
      this.houses = houses;
      console.log('houses fel filter', houses)
    });



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


  filtrer() {
    const minPrice = this.form.controls['prixmin'].value;
    const maxPrice = this.form.controls['prixmax'].value;

    const maison = this.form.controls['maison'].value;
    const maisondhotes = this.form.controls['maisondhotes'].value;
    const chambrepartage = this.form.controls['chambrepartage'].value;
    const appartement = this.form.controls['appartement'].value;
    const villa = this.form.controls['villa'].value;

    const region = this.form.controls['region'].value;
    const delegation = this.form.controls['delegation'].value;
    const localite = this.form.controls['localite'].value;

    const nbrechambre = Number(this.form.controls['nbrechambre'].value);
    const nbrelits = Number(this.form.controls['nbrelits'].value);
    const nbresdb = Number(this.form.controls['nbresdb'].value);


    for (let i = 0; i < this.houses.length; i++) {
      const house = this.houses[i];
      const prix = house.prix;
      const type = house.selectedtype;
      const regionhouse = house.region;
      const delegationhouse = house.delegation;
      const localitehouse = house.localite;
      const chambre = house.chambre;
      const lits = house.lits;
      const sdb = house.sdb;

      let passPriceFilter = true;
      let passTypeFilter = true;
      let passLocalisationFilter = true;
      let passNbreChambreFilter = true;

      if (minPrice && maxPrice) {
        passPriceFilter = prix >= minPrice && prix <= maxPrice;
      }

      if (maison || maisondhotes || chambrepartage || appartement || villa) {
        passTypeFilter =
          (maison && type === 'Maison') ||
          (maisondhotes && type === "maison d'hôte") ||
          (chambrepartage && type === 'chambre partagé') ||
          (appartement && type === 'Appartement') ||
          (villa && type === 'Villa');
      }

      if (region || delegation || localite) {
        passLocalisationFilter =
          (!region || region === regionhouse) &&
          (!delegation || delegation === delegationhouse) &&
          (!localite || localite === localitehouse);
      }

      if (nbrechambre || nbrelits || nbresdb) {
        passNbreChambreFilter =
          (!nbrechambre || nbrechambre === chambre) &&
          (!nbrelits || nbrelits === lits) &&
          (!nbresdb || nbresdb === sdb);
      }

      if (passPriceFilter && passTypeFilter && passLocalisationFilter && passNbreChambreFilter) {
        this.filtredHouses.push(house);
        this.DataFormService.updateFilteredHouses(this.filtredHouses);
      }
    }

    console.log('Filtered Houses:', this.filtredHouses);
    this.route.navigate(['/filtered_houses'], { queryParams: { houses: this.filtredHouses } });

  }



  /*
  filter by price   :
 
    for (let i = 0; i < this.houses.length; i++) {
      const house = this.houses[i];
      const prix = house.prix;
      //console.log(prix)
      if (prix >= minPrice && prix <= maxPrice) {
        this.filtredHouses.push(house);
      }
    }
    console.log('Filtered Houses:', this.filtredHouses);*/
  /*  

  filter by type  :
  
  console.log('maison : ', maison,
    'maisondhotes : ', maisondhotes,
    'chambrepartage : ', chambrepartage,
    'app : ', appartement,
    'villa : ', villa)
 
 
  for (let i = 0; i < this.houses.length; i++) {
    const house = this.houses[i];
    const type = house.selectedtype;
    console.log(type)
 
    if (
      (maison && type === 'Maison') ||
      (maisondhotes && type === "maison d'hôte") ||
      (chambrepartage && type === 'chambre partagé') ||
      (appartement && type === 'Appartement') ||
      (villa && type === 'Villa')
    ) {
      this.filtredHouses.push(house); // Add the house to the filteredHouses array
    }
  }

  /*
  filter by localisation
 
    for (let i = 0; i < this.houses.length; i++) {
      const house = this.houses[i];
      const regionhouse = house.region;
      const delegationhouse = house.delegation;
      const localitehouse = house.localite;
 
 
      if (region && !delegation && !localite) {
        // User has selected only the region
        if (region === regionhouse) {
          this.filtredHouses.push(house);
        }
      } else if (region && delegation && !localite) {
        // User has selected the region and delegation
        if (region === regionhouse && delegation === delegationhouse) {
          this.filtredHouses.push(house);
        }
      } else if (region && delegation && localite) {
        // User has selected the region, delegation, and localite
        if (region === regionhouse && delegation === delegationhouse && localite === localitehouse) {
          this.filtredHouses.push(house);
        }
      }
    }
  */

  /*
  filter by nbchambre lits and sdb


    for (let i = 0; i < this.houses.length; i++) {
    const house = this.houses[i];
    const chambre = house.chambre;
    const lits = house.lits;
    const sdb = house.sdb;


    if (nbrechambre && !nbrelits && !nbresdb) {
      // User has selected only the region
      if (nbrechambre === chambre) {
        this.filtredHouses.push(house);
      }
    } else if (nbrechambre && nbrelits && !nbresdb) {
      // User has selected the region and delegation
      if (nbrechambre === chambre && nbrelits === lits) {
        this.filtredHouses.push(house);
      }
    } else if (nbrechambre && nbrelits && nbresdb) {
      // User has selected the region, delegation, and localite
      if (nbrechambre === chambre && nbrelits === lits && nbresdb === sdb) {
        this.filtredHouses.push(house);
      }
    } else if (!nbrechambre && nbrelits && !nbresdb) {
      // User has selected the region, delegation, and localite
      if (nbrelits === lits) {
        this.filtredHouses.push(house);
      }

    } else if (!nbrechambre && nbrelits && nbresdb) {
      // User has selected the region, delegation, and localite
      if (nbrelits === lits && nbresdb === sdb) {
        this.filtredHouses.push(house);
      }

    }
    else if (!nbrechambre && !nbrelits && nbresdb) {
      // User has selected the region, delegation, and localite
      if (nbresdb === sdb) {
        this.filtredHouses.push(house);
      }
    }
    else if (nbrechambre && !nbrelits && nbresdb) {
      // User has selected the region, delegation, and localite
      if (nbrechambre === chambre && nbresdb === sdb) {
        this.filtredHouses.push(house);
      }
    }
  }
  console.log('Filtered Houses:', this.filtredHouses);
  
  */

}
