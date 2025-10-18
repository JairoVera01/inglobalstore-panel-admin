export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
};

export type ImageData = {
  url: string;
  isPrimary: boolean;
  order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  created_at: string;
  images?: ImageData[]; // Array de imágenes en formato JSONB
  product_images?: ProductImage[]; // Relación con tabla product_images
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "product_images">;
        Update: Partial<Omit<Product, "id" | "created_at" | "product_images">>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ProductImage, "id" | "created_at" | "updated_at">>;
      };
    };
  };
};
