import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataFormService } from 'src/app/services/data-form.service';
import { HousesService } from 'src/app/services/houses/houses.service';


@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent {
  public ProfilImage: string = 'assets/UserImage/profil.png'
  public userFullName: string;
  public userid: string;
  houses: any[];
  OwnerHouses: any[];
  formData: any = {};
  house: any;
  isClicked: boolean = false;

  isLoggedIn: boolean = false;

  changeColor() {
    this.isClicked = true;
  }

  constructor(private route: ActivatedRoute, private DataFormService: DataFormService, private router: Router, private HousesService: HousesService) { }

  ngOnInit(): void {
    this.DataFormService.getHouses().subscribe((houses) => {
      this.houses = houses;
      console.log('houses fel useraccount', houses);

      this.userid = localStorage.getItem('userId');
      console.log('id : ', this.userid);

      this.OwnerHouses = this.houses.filter(house => house.owner === this.userid);
      console.log('OwnerHouses:', this.OwnerHouses);
    });

    this.userFullName = localStorage.getItem('userName');

    this.isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  }

  showDetails(house: any) {
    const id = house._id;
    console.log(id)
    if (id) {
      this.router.navigate(['/details_annonce', id]);
    }
  }



  ModifierAnnonce(house: any) {
    const id = house._id;
    if (id) {
      this.HousesService.UpdateHouse(id, house).subscribe(
        () => {
          // Handle success, if needed
          console.log('House updated successfully!');
        },
        (error) => {
          // Handle error, if needed
          console.error('Error updating house:', error);
        }
      );
    }
  }

  SupprimerAnnonce(house: any) {
    const id = house._id;
    if (id) {
      const confirmDelete = confirm('Are you sure you want to delete the announcement?');
      if (confirmDelete) {
        this.HousesService.DeleteHouse(id).subscribe(
          () => {
            // Handle success, if needed
            console.log('House deleted successfully!');
          },
          (error) => {
            // Handle error, if needed
            console.error('Error deleting house:', error);
          }
        );
      }
    }
  }

  gotonotification() {
    this.router.navigate(['/compte/Notifications']);
  }
  gotofavoris() {
    this.router.navigate(['/compte/Messages']);
  }
  gotoparametres() {
    this.router.navigate(['/compte/Parametres']);
  }


  goto_add_announcement() {
    if (!this.isLoggedIn) {
      alert('You must be authenticated to add an announcement.');
    } else {
      this.router.navigate(['/Add/Ajouter_annonce']);
    }
  }


}
