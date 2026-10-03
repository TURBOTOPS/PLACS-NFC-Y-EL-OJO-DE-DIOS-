import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Trash2,
  RotateCcw,
  Sparkles,
  Link,
  Plus,
} from 'lucide-react';
import { useProductImage } from '../context/ProductImageContext';

export default function ImageManagerModal() {
  const {
    isManagerModalOpen,
    closeManagerModal,
    allImages,
    selectedId,
    setSelectedId,
  } = useProductImage();

  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isManagerModalOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1400;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

          const newImage = {
            id: `custom-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, '') || 'Mi Foto Subida',
            subtitle: 'Foto personalizada subida por ti',
            src: dataUrl,
          };

          try {
            const saved = localStorage.getItem('atlas_user_custom_images');
            const current = saved ? JSON.parse(saved) : [];
            const updated = [newImage, ...current];
            localStorage.setItem('atlas_user_custom_images', JSON.stringify(updated));
            localStorage.setItem('atlas_user_selected_image_id', newImage.id);
            localStorage.setItem('atlas_placa_custom_image', dataUrl);
          } catch (err) {
            console.warn(err);
          }

          window.location.reload();
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocurrió un error al procesar la imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput);
      const newImage = {
        id: `custom-${Date.now()}`,
        title: urlTitle.trim() || 'Imagen Web Personalizada',
        subtitle: 'Cargada desde enlace directo',
        src: urlInput.trim(),
      };
      const saved = localStorage.getItem('atlas_user_custom_images');
      const current = saved ? JSON.parse(saved) : [];
      const updated = [newImage, ...current];
      localStorage.setItem('atlas_user_custom_images', JSON.stringify(updated));
      localStorage.setItem('atlas_user_selected_image_id', newImage.id);
      localStorage.setItem('atlas_placa_custom_image', urlInput.trim());
      window.location.reload();
    } catch {
      setErrorMessage('Por favor ingresa una URL válida');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Gestor de Imágenes de la Placa
              </h3>
              <p className="text-xs text-neutral-400">
                Selecciona o vuelve a colocar tus fotos personalizadas
              </p>
            </div>
          </div>

          <button
            onClick={closeManagerModal}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/30'
                : 'border-neutral-700 hover:border-cyan-500/60 bg-neutral-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {isProcessing ? 'Procesando tu imagen...' : 'Selecciona o arrastra tu foto aquí'}
              </p>
              <p className="text-xs text-neutral-400 mt-1">Soporta JPG, PNG y WebP.</p>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Explorar archivos</span>
            </button>
          </div>

          <form onSubmit={handleUrlSubmit} className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
              <Link className="w-3.5 h-3.5 text-cyan-400" />
              <span>O pegar enlace web directo (URL)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="url"
                placeholder="https://ejemplo.com/tu-foto.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!urlInput.trim()}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
              >
                Cargar URL
              </button>
            </div>
          </form>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Imágenes Disponibles ({allImages.length})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allImages.map((img) => {
                const isSelected = img.id === selectedId;
                return (
                  <div
                    key={img.id}
                    onClick={() => {
                      setSelectedId(img.id);
                      closeManagerModal();
                    }}
                    className={`relative rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-cyan-950/20'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={img.src}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-cyan-500 text-neutral-950 text-[10px] font-black flex items-center gap-1 shadow-lg">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>ACTIVA</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 text-left bg-neutral-900/90 border-t border-neutral-800">
                      <p className="text-xs font-bold text-white truncate">{img.title}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{img.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-end">
          <button
            onClick={closeManagerModal}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
