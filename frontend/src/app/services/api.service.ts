import {Injectable} from '@angular/core';
//import this to make http requests
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {environment} from "../../environments/environment";
import {Product} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * This method returns products
   */
  getAllProducts(params: any): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}products`, {params});
  }

  /**
   * This method returns selected products
   */
  getAllSelectedProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}selection`);
  }
}
