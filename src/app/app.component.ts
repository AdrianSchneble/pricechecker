import { Component } from '@angular/core';
import { Product } from './Product';
import { DatabaseService } from './database/database.service';
import { Store } from './Stores';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  stores: string[] = Object.keys(Store);

  products: Product[] = [];

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.databaseService.getProducts().then(productListings => {
      for (let productListing of productListings) {
        let product: Product | undefined = this.products.find(search => productListing.ProductName === search.name);
        if (product == undefined) {
          product = new Product(productListing.ProductName);
          this.products.push(product);
        }
        product.setPrice(productListing.StoreName, productListing.PricePerLiter, productListing.URL);
      }
      console.log(this.products)
    });
  }

  refresh(): void {
    this.databaseService.refreshProductPrices();
  }

}
