import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Resultado } from '../../../shared/models/resultado.model';
import { Customer } from '../interfaces/ICustomer.interface';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly apiUrl = `${environment.apiBaseUrl}/customer`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Customer[]> {    
    return this.http
      .get<Resultado<Customer[]>>(this.apiUrl)
      .pipe(map((res) => res.valor));
  }
}