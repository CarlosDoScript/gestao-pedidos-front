import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';
import { environment } from '../../../../environments/environment';
import { Pagina } from '../../../shared/models/pagina.model';
import { Resultado } from '../../../shared/models/resultado.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = `${environment.apiBaseUrl}/order`;

  constructor(private http: HttpClient) {}

  getAll(
    numeroPagina?: number,
    tamanhoPagina?: number,
    ordenarPor?: string,
    ordemAscendente?: string
  ) : Observable<Pagina<Order>>{
    
    let params  = new HttpParams();

    if (numeroPagina !== undefined) params = params.set('NumeroPagina', numeroPagina);
    if (tamanhoPagina !== undefined) params = params.set('TamanhoPagina', tamanhoPagina);
    if (ordenarPor) params = params.set('OrdenarPor', ordenarPor);
    if (ordemAscendente !== undefined) params = params.set('OrdemAscendente', ordemAscendente);

    return this.http
      .get<Resultado<Pagina<Order>>>(this.apiUrl, { params })
      .pipe(map((res) => res.valor));

  }
  
}