import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Product} from "../models/product.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  getAllProducts(params: any): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}products`, {params});
  }


  getAllSelectedProducts(): Observable<Array<Product>> {
    return this.httpClient
      .get<Array<Product>>(
        `${environment.baseURL}selection`
      )
      .pipe(map((products) => {
        return products || []
      }));
  }

  selectProduct(params: any): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.httpClient.post<any>(`${environment.baseURL}selection`, JSON.stringify(params), {headers: headers});
  }


  deselectProducts(params: any): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}selection/${params}`);
  }

}
