import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataFormService } from 'src/app/services/data-form.service';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent {
  oldPassword: string;
  newPassword: string;
  userId: string;
  successMessage: string;
  showModal: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private DataFormService: DataFormService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
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
  gotocompte() {
    this.router.navigate(['/compte/logements']);
  }


  showSuccessModal() {
    this.successMessage = 'votre mot de passe est changé avec succées!';
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }

  changePassword() {
    this.DataFormService.changePassword(this.userId, this.oldPassword, this.newPassword).subscribe(
      () => {
        // Password changed successfully, perform any necessary actions
        console.log('votre mot de passe est changé avec succées');
        // Reset the form
        this.oldPassword = '';
        this.newPassword = '';
        // Show success modal
        this.showSuccessModal();
      },
      (error) => {
        console.error('Failed to change password:', error);
      }
    );
  }


}
