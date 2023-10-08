import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataFormService } from 'src/app/services/data-form.service';
import { HousesService } from 'src/app/services/houses/houses.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[];


  constructor(private route: ActivatedRoute, private DataFormService: DataFormService, private router: Router, private HousesService: HousesService) { }


  ngOnInit(): void {
    this.DataFormService.getallusers().subscribe(
      (users: any[]) => {
        this.users = users;
        console.log(this.users); // You can do further processing with the users here
      },
      (error) => {
        console.error('Failed to retrieve users:', error);
      }
    );
  }


  deleteUser(userId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.DataFormService.deleteUser(userId).subscribe(
        () => {
          // User deleted successfully, perform any necessary actions
          console.log('User deleted successfully');
          // Refresh the users list
          this.refreshUsers();
        },
        (error) => {
          console.error('Failed to delete user:', error);
        }
      );
    }
  }


  refreshUsers() {
    // Refresh the users list by making the API call again
    this.DataFormService.getallusers().subscribe(
      (users: any[]) => {
        this.users = users;
        console.log(this.users); // You can do further processing with the users here
      },
      (error) => {
        console.error('Failed to retrieve users:', error);
      }
    );
  }



  gotoUsers() {
    this.router.navigate(['/Admin/Users']);
  }

  gotoLogements() {
    this.router.navigate(['/Admin/Logements']);
  }

}
