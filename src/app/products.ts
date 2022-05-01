import { Product } from "./Product";

const SAMPLE_PRODUCTS: Product[] = [
  {
    name: "Needle",
    Conalco: [{ amountInLiters: 1, url: "/conalco/needle-blackforest-distilled-dry-gin-1-liter-40-vol" }],
    Metro: [],
    Amazon: []
  },
  {
    name: "Tanqueray",
    Conalco: [
      { amountInLiters: 1, url: "/conalco/tanqueray-london-dry-gin-1-liter-47-3-vol" },
      { amountInLiters: 0.7, url: "/conalco/tanqueray-london-dry-gin-0-7l-47-3-vol" }
    ],
    Metro: [{ amountInLiters: 0.7, url: "/metro/shop/pv/BTY-X782172/0032/0021/Tanqueray-London-Dry-Gin-47-3-Vol.-0-70-l-Flasche" }],
    Amazon: []
  }
];

export const METRO_PRICE_SELECTOR = '#main > div > div.content-container > div > div:nth-child(2) > div.mfcss_wrapper > div.PV.BTEV.fixed-width-container > div > div.ev-productview-details--container > div.row > div.ev-productview-details--right-col.right-tint.col-xs-6 > div.mfcss_article-detail--price-container > div:nth-child(1) > div.text-right.text-left-xs.col-sm-6.col-sm-push-6.col-xs-12 > div:nth-child(1) > span > span > span';
export const CONALCO_PRICE_SELECTOR = 'body > div.page-wrap > section > div > div > div > div.product--detail-upper.block-group > div.product--buybox.block > div > div.product--price.price--default > span > meta';
export const AMAZON_PRICE_SELECTOR = '#corePrice_feature_div > div > span.a-price > span.a-offscreen';
