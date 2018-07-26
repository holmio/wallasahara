
/**
 * A generic model of our Item pages list, create, and delete.
 *
 */

export interface ItemList {
  name: string;
  uuid: string;
  price: number;
  currency: string;
  profileItem?: string;
  timestamp?: any;
  // extraStatus: TypeExtra;
}

// *Future feature
// export type TypeExtra = 'price_negotiable' | 'changeable';
export interface CreateItem {
  uuid?: string;
  uuidUser?: string;
  name: string;
  about: string;
  category: Array<string>;
  price: number;
  currency: string;
  profileItem?: string;
  timestamp?: any;
  isSold: boolean;
  isEnabled: boolean;
  imagesItem: Array<string>;
  // extraStatus: TypeExtra;
}

export interface DetailsItem {
  uuid?: string;
  name: string;
  about: string;
  price: number;
  currency: string;
  timestamp?: any;
  isSold?: boolean;
  isEnabled?: boolean;
  imagesItem: Array<string>;
  imagesPathDirectory: Array<string>;
}

export interface UpdateItem {
  name: string;
  about: string;
  category: Array<string>;
  currency: string;
  price: number;
  isSold?: boolean;
  isEnabled?: boolean;
  profileItem?: string;
}

export interface ItemImage {
  base64List: Array<string>;
  uidItem?: string;
}
