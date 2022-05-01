export class ProductPricing {
  name: string;
  conalcoPrice: number | undefined;
  metroPrice: number | undefined;
  amazonPrice: number | undefined;

  constructor(name: string) {
    this.name = name;
  }
}