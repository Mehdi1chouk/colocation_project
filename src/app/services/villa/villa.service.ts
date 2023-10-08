import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataFormService } from '../data-form.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VillaService {

  constructor(private http: HttpClient) { }
  AjouterVilla(villa: any) {
    return this.http.post('http://localhost:4000/AjouterVilla/', villa).pipe(catchError(error => {
      console.log(error);
      return throwError(error);
    }));

  }

  VillaList() {
    return this.http.get('http://localhost:4000/VillaList/');
  }

  SupprimerMaison(id: any) {
    return this.http.delete('http://localhost:4000/SupprimerVilla/' + id);
  }

  GetVilla(id: any) {
    return this.http.get('http://localhost:4000/GetVilla/' + id);

  }

  UpdatVilla(id: any, villa: any) {
    return this.http.put('http://localhost:4000/UpdateVilla/' + id, villa);

  }

}
