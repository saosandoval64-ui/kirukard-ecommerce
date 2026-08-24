export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  images?: string | string[] | null;
  description?: string | null;
  category?: string | null;
  stock?: number;
  sku?: string | null;
  supplier?: string | null;
  supplierUrl?: string | null;
  costPrice?: number | null;
}
