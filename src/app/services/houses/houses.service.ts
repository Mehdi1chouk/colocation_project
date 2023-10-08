import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataFormService } from '../data-form.service';
import { catchError, throwError } from 'rxjs';
import { ImageCompressor } from 'image-compressor';


@Injectable({
  providedIn: 'root',
})
export class HousesService {
  constructor(private http: HttpClient) { }

  async AddHouse(house: any) {
    console.log('houseservice', house);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const requestBody = JSON.stringify(house);

    const response = await this.http
      .post('http://localhost:3030/AddHouse', requestBody, {
        headers,
      })
      .toPromise();
    return response;
  }
  HousesList() {
    return this.http.get('http://localhost:3030/HousesList/');
  }
  GetHouse(id: any) {
    return this.http.get('http://localhost:3030/GetHouse/' + id);
  }
  UpdateHouse(id: any, house: any) {
    return this.http.put('http://localhost:3030/UpdateHouse/' + id, house);
  }

  DeleteHouse(id: any) {
    return this.http.delete('http://localhost:3030/DeleteHouse/' + id);
  }


  createReservation(reservationRequest: any) {
    return this.http.post('http://localhost:3030/reservation', reservationRequest).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
