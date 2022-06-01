import { Store } from "./Stores";

export class Product {
  name: string;
  private _prices: { store: Store, price: number | undefined, url: string | undefined }[] = [];

  constructor(name: string) {
    this.name = name;
    for (let store of Object.keys(Store) as Store[]) {
      this.addPrice(store);
    }
  }

  public get prices() {
    return this._prices;
  }

  private addPrice(store: Store): void {
    this._prices.push({
      store: store,
      price: undefined,
      url: undefined
    });
    this._prices.sort((a, b) => a.store.toString().localeCompare(b.store.toString()));
  }

  public setPrice(store: string, price: number, url: string): void {
    let pricing = this._prices.find(price => price.store.toString() === store);
    if (pricing) {
      pricing.price = price;
      pricing.url = url;
    } else {
      console.error('Attempting to set a price for an unknown store failed');
    }
  }
}