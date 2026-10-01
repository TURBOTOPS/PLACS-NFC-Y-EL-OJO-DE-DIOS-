import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultPoster from '../assets/images/placa_espacio_pedestal_1790887108177.jpg';

interface ProductImageContextType {
  imageSrc: string;
}

const ProductImageContext = createContext<ProductImageContextType | undefined>(undefined);

const STORAGE_KEY = 'atlas_placa_custom_image';

export function ProductImageProvider({ children }: { children: React.ReactNode }) {
  // Use user's uploaded image if present in localStorage, otherwise fallback to the space pedestal poster
  const [imageSrc, setImageSrc] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || defaultPoster;
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setImageSrc(stored);
    }
  }, []);

  return (
    <ProductImageContext.Provider value={{ imageSrc }}>
      {children}
    </ProductImageContext.Provider>
  );
}

export function useProductImage() {
  const context = useContext(ProductImageContext);
  if (!context) {
    throw new Error('useProductImage debe usarse dentro de ProductImageProvider');
  }
  return context;
}
