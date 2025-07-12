import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Resultado } from '../../../shared/models/resultado.model';
import { Product } from '../interfaces/IProduct.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiBaseUrl}/product`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {    
    return this.http
      .get<Resultado<Product[]>>(this.apiUrl)
      .pipe(map((res) => res.valor));
  }
}