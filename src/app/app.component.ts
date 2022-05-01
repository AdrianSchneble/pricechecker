import { Component } from '@angular/core';
import { METRO_PRICE_SELECTOR, CONALCO_PRICE_SELECTOR, AMAZON_PRICE_SELECTOR } from './products';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ProductPricing } from './ProductPricing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatabaseService } from './database/database.service';
import { Product } from './Product';
import { ProductListing } from './ProductURL';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  products: Array<ProductPricing> = [];

  private httpOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Origin": "*"
    }),
    'responseType': 'text'
  };

  constructor(private http: HttpClient, private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.parseProductsFromDatabase().then(productsFromDatabase => {
      for (let productData of productsFromDatabase) {
        let product = new ProductPricing(productData.name);
        this.products.push(product);
        // this.setConalcoPriceFromUrl(productData.Conalco, product);
        // The METRO website is unfortunately built dynamically with Javascript, such that we can't simply search the price with a CSS selector
        let metroPrice = undefined; //product.metro ? this.queryPriceFromUrl(product.metro, METRO_PRICE_SELECTOR) : undefined
        this.setAmazonPriceFromUrl(productData.Amazon, product);
      }
    });
  }

  setConalcoPriceFromUrl(urls: { amountInLiters: number; url: string; }[], product: ProductPricing): void {
    this.setPriceFromUrl(urls, product, CONALCO_PRICE_SELECTOR, 'conalcoPrice');
  }

  setMetroPriceFromUrl(urls: { amountInLiters: number; url: string; }[], product: ProductPricing): void {
    this.setPriceFromUrl(urls, product, METRO_PRICE_SELECTOR, 'metroPrice');
  }

  setAmazonPriceFromUrl(urls: { amountInLiters: number; url: string; }[], product: ProductPricing): void {
    this.setPriceFromUrl(urls, product, AMAZON_PRICE_SELECTOR, 'amazonPrice');
  }

  setPriceFromUrl(urls: { amountInLiters: number; url: string; }[], product: ProductPricing, selector: string, priceReference: 'conalcoPrice' | 'metroPrice' | 'amazonPrice'): void {
    for (let urlObject of urls) {
      const response = this.http.request("GET", urlObject.url, { responseType: 'text' });
      response.subscribe({
        next: (html) => {
          const $ = cheerio.load(html);
          const price = $(selector).attr("content") || $(selector).text();
          const pricePerLiter = Number(price.replace(/€/g, '').replace(/,/g, '.')) / urlObject.amountInLiters;
          product[priceReference] = this.roundToTwoDecimals(Math.min(product[priceReference] ?? Number.POSITIVE_INFINITY, pricePerLiter));
        },
        error: (error) => console.log(error)
      })
    }
  }

  private roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100;
  }
  
  /*
  Fetch and map the products as received from the database into a usable data format.
  */
  async parseProductsFromDatabase(): Promise<Product[]> {
    return this.databaseService.getProducts().then((response: any) => {
      console.log('Response:', response);
      let products: Product[] = [];
      for (let productFromDB of response) {
        let product: Product | undefined = products.find(search => productFromDB.ProductName === search.name);
        if (product == undefined) {
          product = this.getBlankProduct(productFromDB.ProductName);
          products.push(product);
        }
        let productListing: ProductListing = {
          amountInLiters: productFromDB.Amount,
          url: this.proxifyUrl(productFromDB.URL, productFromDB.StoreName)
        }
        product[productFromDB.StoreName as 'Conalco' | 'Metro'].push(productListing);
      }
      console.log('Discovered products from database:', products);
      return products;
    });
  }

  private getBlankProduct(productName: string): Product {
    return {
      name: productName,
      Metro: [],
      Conalco: [],
      Amazon: []
    }
  }

  /*
  To avoid getting CORS-blocked, we proxy requests to e.g. "conalco.de/etc" via localhost:4200/conalco/etc.
  See also proxy.conf.json for the respective settings.
  */
  private proxifyUrl(url: string, proxyReplacement: string): string {
    let proxifiedUrl = url.replace(/.*\.de/, `/${proxyReplacement.toLowerCase()}`);
    console.log('Proxified URL:', proxifiedUrl);
    return proxifiedUrl;
  }

}
