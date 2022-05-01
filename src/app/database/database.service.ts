import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../Product';
import { ProductPricing } from '../ProductPricing';
import { ProductListing } from '../ProductURL';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) {
  }

  private async request(method: string, url: string, data?: any) {
    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body'
    });
    return new Promise((resolve, reject) => {
      result.subscribe(resolve, reject);
    });
  }

  getProducts() {
    let url: string = `${environment.serverUrl}/products`;
    console.log(`Querying data from ${url} ...`);
    return this.request('GET', url);
  }

}
