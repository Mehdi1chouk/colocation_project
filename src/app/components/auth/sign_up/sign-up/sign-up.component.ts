import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register/register.service';
export function passwordMatchValidator(control: FormGroup) {
  const password1 = control.get('password1');
  const password2 = control.get('password2');
  if (password1.value !== password2.value) {
    password2.setErrors({ passwordMismatch: true });
  } else {
    password2.setErrors(null);
  }
  return null;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  authForm: FormGroup;

  constructor(
    private fb: FormBuilder, private route: Router,
    private RegisterService: RegisterService
  ) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      nom: ['', Validators.required, Validators.minLength(3)],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    }, { validator: passwordMatchValidator }
    );
  }
  gotologin() {
    this.route.navigate(['/login'])
  }

  CreateAccount() {
    // Check if the form is valid
    if (this.authForm.invalid) {
      return;
    }

    // Get form data
    const nom = this.authForm.get('nom').value;
    const email = this.authForm.get('email').value;
    const password1 = this.authForm.get('password1').value;
    const password2 = this.authForm.get('password2').value;

    // Call the register method of the RegisterService
    this.RegisterService.register(nom, email, password1, password2).subscribe(
      (response: any) => {
        console.log(response); // Handle successful response

        // Store the user ID in local storage
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userName', nom);

        // Redirect the user to the desired page
        this.route.navigate(['/compte/logements']);
      },
      error => {
        console.log(error); // Handle error response
      }
    );
  }


  get nom() {
    return this.authForm.get('nom')
  }
  get email() {
    return this.authForm.get('email')
  }
  get password1() {
    return this.authForm.get('password1')
  }
  get password2() {
    return this.authForm.get('password2')
  }

  restrictNumericInput(event: any): void {
    const pattern = /^[^\d]*$/; // Regular expression to allow only non-numeric characters
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/\d/g, ''); // Replace any numeric characters with an empty string
  }




}
