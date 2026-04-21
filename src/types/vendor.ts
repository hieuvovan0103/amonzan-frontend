export type VendorProductStatus = "ENABLE" | "DISABLE" | "IN_USE";

export type VendorProduct = {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  shop: string;
  status: VendorProductStatus;
  stock: number;
};

export type VendorCalendarEvent = {
  id: number;
  title: string;
  start: number;
  end: number;
  color: string;
};

export type VendorTab = "vendor_listings" | "vendor_detail" | "rentals_calendar";