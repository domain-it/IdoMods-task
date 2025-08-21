export interface PriceFilter {
  $gte?: number;
  $lte?: number;
}

export interface OrderFilter {
  totalPrice?: PriceFilter;
  orderId?: string;
  [key: string]: any;
}

export interface Product {
  productId: string;
  quantity: number;
  netPrice: number;
  vat: number;
}

export interface OrderTable {
  orderId: string;
  orderChangeDate: Date;
  products: Product[];
  totalNet: number;
  totalVat: number;
  totalPrice: number;
}

export interface OrderAPI {
  Results: Result[];
  resultsNumberAll: number;
}

export interface Result {
  errors: any[];
  orderId: string;
  orderSerialNumber: number;
  orderType: OrderType;
  orderDetails: OrderDetails;
  clientResult: ClientResult;
  orderBridgeNote: OrderBridgeNote;
}

export interface ClientResult {
  clientPickupPointAddress?: ClientPickupPointAddress;
  endClientAccount: ClientAccount;
  clientBillingAddress: ClientBillingAddress;
  clientDeliveryAddress: ClientDeliveryAddress;
  clientAccount: ClientAccount;
}

export interface ClientAccount {
  clientId: number;
  clientLogin: string;
  clientEmail: string;
  clientPhone1: string;
  clientPhone2: string;
  clientCodeExternal: ClientCodeExternal;
}

export enum ClientCodeExternal {}

export interface ClientBillingAddress {
  clientFirstName: string;
  clientLastName: string;
  clientNip: string;
  clientFirm: string;
  clientStreet: string;
  clientZipCode: string;
  clientCity: string;
  clientCountryId: ClientCountryID;
  clientPhone1: string;
  clientPhone2: string;
  clientProvinceId: ClientProvince;
  clientProvince: ClientProvince;
  clientCountryName: Client;
}

export enum ClientCountryID {}

export enum Client {}

export enum ClientProvince {}

export interface ClientDeliveryAddress {
  clientDeliveryAddressFirm: ClientDeliveryAddressFirm;
  clientDeliveryAddressType: ClientDeliveryAddressType;
  clientDeliveryAddressPickupPointInternalId: number;
  clientDeliveryAddressId: string;
  clientDeliveryAddressFirstName: string;
  clientDeliveryAddressLastName: string;
  clientDeliveryAddressStreet: string;
  clientDeliveryAddressZipCode: string;
  clientDeliveryAddressCity: string;
  clientDeliveryAddressCountry: Client;
  clientDeliveryAddressCountryId: ClientCountryID;
  clientDeliveryAddressPhone1: string;
  clientDeliveryAddressPhone2: string;
  clientDeliveryAddressProvinceId: string;
  clientDeliveryAddressProvince: string;
}

export enum ClientDeliveryAddressFirm {}

export enum ClientDeliveryAddressType {}

export interface ClientPickupPointAddress {
  pickupPointId: number | string;
  externalPickupPointId: string;
  city: string;
  street: string;
  zipCode: string;
  description: string;
  latitude: number;
  longitude: number;
  name: string;
}

export enum OrderBridgeNote {}

export interface OrderDetails {
  orderChangeDate: Date;
  receivedDate: string;
  payments: Payments;
  dispatch: Dispatch;
  prepaids: Prepaid[];
  purchaseDate: Date;
  subscriptionId: number;
  orderStatus: string;
  orderOperatorLogin: string;
  orderPackingPersonLogin: null;
  apiFlag: APIFlag;
  orderConfirmation: APIFlag;
  orderAddDate: Date;
  orderDispatchDate: Date | null;
  orderPrepareTime: number | null;
  clientNoteToOrder: string;
  clientNoteToCourier: string;
  orderNote: string;
  stockId: number;
  clientRequestInvoice: ClientRequestInvoice;
  clientDeliveryAddressId: number;
  productRemovedInStock: ProductRemovedInStock;
  orderSourceResults: OrderSourceResults;
  auctionInfo: AuctionInfo;
  productsResults: ProductsResult[];
  dropshippingOrderStatus: APIFlag;
  discountCode?: DiscountCode;
}

export enum APIFlag {}

export interface AuctionInfo {}

export enum ClientRequestInvoice {}

export interface DiscountCode {
  campaignId: string;
  discountCodeValue: string;
  discountCodeName: string;
}

export interface Dispatch {
  courierWebserviceOnly: boolean;
  deliveryWeight: number;
  courierName: string;
  courierId: number;
  deliveryPackageId: DeliveryPackageID;
  deliveryDate: string;
  estimatedDeliveryDate: Date | EstimatedDeliveryDateEnum;
  deliveryDateAdditional: DeliveryDateAdditional;
}

export enum DeliveryDateAdditional {}

export enum DeliveryPackageID {}

export enum EstimatedDeliveryDateEnum {}

export interface OrderSourceResults {
  preorderSourcesDetails: PreorderSourcesDetail[];
  orderSourceType: OrderSourceResultsOrderSourceType;
  shopId: number;
  auctionsServiceName: string;
  orderSourceDetails: OrderSourceDetails;
}

export interface OrderSourceDetails {
  fresh: ClientRequestInvoice;
  fulfillment: ClientRequestInvoice;
  sourcePageUrl?: string;
  orderSourceName: OrderSourceName;
  orderSourceTypeId: number;
  orderSourceType: OrderSourceDetailsOrderSourceType;
  orderSourceId: number;
  orderExternalId: null;
  entryProductIdBeforeOrder?: number;
}

export enum OrderSourceName {}

export enum OrderSourceDetailsOrderSourceType {}

export enum OrderSourceResultsOrderSourceType {}

export interface PreorderSourcesDetail {
  orderSourceTypeId: number;
  orderSourceType: OrderSourceDetailsOrderSourceType;
  orderSourceName: OrderSourceName;
  orderSourceId: number;
  entryDate: Date;
}

export interface Payments {
  orderPaymentDays: number;
  orderPaymentType: OrderPaymentType;
  orderRebatePercent: number;
  orderWorthCalculateType: OrderWorthCalculateType;
  orderVatExists: ProductRemovedInStock;
  orderCurrency: OrderCurrency;
  orderBaseCurrency: OrderBaseCurrency;
}

export interface OrderBaseCurrency {
  orderProductsCost: number;
  orderDeliveryCost: number;
  orderDeliveryVat: number;
  orderPayformCost: number;
  orderPayformVat: number;
  orderInsuranceCost: number;
  orderInsuranceVat: number;
  billingCurrency: BillingCurrency;
}

export enum BillingCurrency {}

export interface OrderCurrency {
  currencyId: BillingCurrency;
  orderCurrencyValue: number;
  billingCurrencyRate: number;
  orderProductsCost: number;
  orderDeliveryCost: number;
  orderPayformCost: number;
  orderInsuranceCost: number;
}

export enum OrderPaymentType {}

export enum ProductRemovedInStock {}

export enum OrderWorthCalculateType {}

export interface Prepaid {
  prepaidId: number;
  paymentOrdinalNumber: number;
  paymentNumber: string;
  paymentAddDate: Date;
  paymentModifiedDateByClient: Date | EstimatedDeliveryDateEnum;
  paymentModifiedDateByShop: Date | EstimatedDeliveryDateEnum;
  paymentStatus: ProductRemovedInStock;
  payformId: number;
  payformName: PayformName;
  payformAccount: string;
  paymentValue: number;
  currencyId: BillingCurrency;
  paymentType: PaymentType;
  voucherNumber?: string;
}

export enum PayformName {}

export enum PaymentType {}

export interface ProductsResult {
  productOrderPriceBaseCurrency: number;
  productOrderPriceNetBaseCurrency: number;
  label: null | string;
  productOrderAdditional: ProductOrderAdditional;
  basketPosition: number;
  productPriceLog: string;
  productId: number;
  productName: string;
  productCode: string;
  sizeId: string;
  sizePanelName: SizePanelName;
  productSizeCodeExternal: string;
  stockId: number;
  productQuantity: number;
  productWeight: number;
  productVat: number;
  productPanelPrice: number;
  productPanelPriceNet: number;
  remarksToProduct: string;
  productSerialNumbers: null;
  bundleId: number;
  productOrderPrice: number;
  productOrderPriceNet: number;
  orderSalesMode: OrderSalesMode;
  versionName?: string;
}

export enum OrderSalesMode {}

export enum ProductOrderAdditional {}

export enum SizePanelName {}

export enum OrderType {}
