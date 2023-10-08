import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:3030/register';

  constructor(private http: HttpClient) { }

  register(nom: string, email: string, password1: string, password2: string) {
    return this.http.post(this.apiUrl, { nom, email, password1, password2 });
  }
}
