export class ProductPricing {
  name: string;
  conalcoPrice: number | undefined;
  metroPrice: number | undefined;

  constructor(name: string) {
    this.name = name;
  }
}