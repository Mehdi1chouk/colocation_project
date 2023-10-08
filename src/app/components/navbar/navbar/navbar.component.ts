import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  constructor(private route: Router) { }

  goto_add_announcement() {
    if (!this.isLoggedIn) {
      alert('You must be authenticated to add an announcement.');
    } else {
      this.route.navigate(['/Add/Ajouter_annonce']);
    }
  }
  ngOnInit(): void {



    this.isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  }
  auth() {
    if (this.isLoggedIn) {
      // Perform logout operation here
      this.logout();
    } else {
      this.route.navigate(['/login']);
    }
  }
  logout() {
    // Clear local storage or perform any other necessary logout operations
    localStorage.clear();
    this.isLoggedIn = false;
    // Redirect or perform any other necessary actions after logout
    this.route.navigateByUrl('');
  }
}
