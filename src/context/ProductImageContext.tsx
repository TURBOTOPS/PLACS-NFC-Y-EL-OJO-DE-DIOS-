import React, { createContext, useContext, useState, useEffect } from 'react';
import cosmicAsteroidImage from '../assets/images/placa_cosmica_asteroide_1791051926556.jpg';
import spacePedestalImage from '../assets/images/placa_espacio_pedestal_1790887108177.jpg';

export interface ProductImageItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
}

export const OFFICIAL_PRODUCT_IMAGES: ProductImageItem[] = [
  {
    id: 'cosmic-asteroid',
    title: 'Perspectiva Asteroide Cósmico',
    subtitle: 'Placa acrílica sobre asteroide con halo dorado y Tierra',
    src: cosmicAsteroidImage,
  },
  {
    id: 'space-pedestal',
    title: 'Frontal Pedestal Orbital',
    subtitle: 'Placa acrílica frontal sobre pedestal circular iluminado',
    src: spacePedestalImage,
  },
];

interface ProductImageContextType {
  imageSrc: string;
  activeImage: ProductImageItem;
  allImages: ProductImageItem[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  openManagerModal: () => void;
  closeManagerModal: () => void;
  isManagerModalOpen: boolean;
}

const ProductImageContext = createContext<ProductImageContextType | undefined>(undefined);

const STORAGE_CUSTOM_KEY = 'atlas_user_custom_images';
const STORAGE_SINGLE_KEY = 'atlas_placa_custom_image';
const STORAGE_SELECTED_ID_KEY = 'atlas_selected_image_id';
const STORAGE_USER_SELECTED_KEY = 'atlas_user_selected_image_id';

export function ProductImageProvider({ children }: { children: React.ReactNode }) {
  // Read custom images uploaded by the user from localStorage
  const [customImages] = useState<ProductImageItem[]>(() => {
    const list: ProductImageItem[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list.push(...parsed);
        }
      }
    } catch (e) {
      console.warn('Error al leer imágenes personalizadas de localStorage:', e);
    }

    try {
      const single = localStorage.getItem(STORAGE_SINGLE_KEY);
      if (single && !list.some((img) => img.src === single)) {
        list.unshift({
          id: 'custom-uploaded-user',
          title: 'Tu Foto Personalizada',
          subtitle: 'Imagen subida por el usuario',
          src: single,
        });
      }
    } catch {
      // Ignore
    }

    return list;
  });

  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  // If the user uploaded images, they come first!
  const allImages = [...customImages, ...OFFICIAL_PRODUCT_IMAGES];

  const [selectedId, setSelectedIdState] = useState<string>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_USER_SELECTED_KEY) ||
        localStorage.getItem(STORAGE_SELECTED_ID_KEY);
      if (saved && allImages.some((img) => img.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore
    }
    // Default to the first image (the user's uploaded image if exists, else official)
    return allImages[0]?.id || OFFICIAL_PRODUCT_IMAGES[0].id;
  });

  const setSelectedId = (id: string) => {
    setSelectedIdState(id);
    try {
      localStorage.setItem(STORAGE_SELECTED_ID_KEY, id);
      localStorage.setItem(STORAGE_USER_SELECTED_KEY, id);
    } catch {
      // Ignore
    }
  };

  const activeImage =
    allImages.find((img) => img.id === selectedId) || allImages[0] || OFFICIAL_PRODUCT_IMAGES[0];
  const imageSrc = activeImage.src;

  return (
    <ProductImageContext.Provider
      value={{
        imageSrc,
        activeImage,
        allImages,
        selectedId,
        setSelectedId,
        openManagerModal: () => setIsManagerModalOpen(true),
        closeManagerModal: () => setIsManagerModalOpen(false),
        isManagerModalOpen,
      }}
    >
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
