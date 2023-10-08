import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3030/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(this.apiUrl, { email, password });
  }
}
