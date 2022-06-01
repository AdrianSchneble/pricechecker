import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductListing } from '../DatabaseProduct';
import { Product } from '../Product';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) {
  }

  private async request(method: string, url: string, data?: any): Promise<any> {
    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body'
    });
    return new Promise((resolve, reject) => {
      result.subscribe(resolve, reject);
    });
  }

  getProducts(): Promise<ProductListing[]> {
    let url: string = `${environment.serverUrl}/products`;
    console.log(`Querying data from ${url} ...`);
    return this.request('GET', url);
  }

  refreshProductPrices(): void {
    let url: string = `${environment.serverUrl}/refresh`;
    console.log(`Triggered product price refresh at ${url} ...`);
    this.request('GET', url)
  }
}
