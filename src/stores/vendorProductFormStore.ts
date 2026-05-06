import { create } from "zustand";

export type VendorProductVariantForm = {
  size: string;
  sku: string;
  basePrice: string;
  stock: string;
  condition: "NEW" | "GOOD" | "FAIR" | "DAMAGED";
};

export type VendorProductImageDraft = {
  id: string;
  previewUrl: string;
  uploadedUrl?: string;
  isPrimary: boolean;
  isUploading: boolean;
  error?: string;
};

type VendorProductFormData = {
  name: string;
  description: string;
  categoryId: string;
  variants: VendorProductVariantForm[];
};

type VendorProductFormState = {
  isModalOpen: boolean;
  formData: VendorProductFormData;
  imageFiles: File[];
  previewUrls: string[];
  uploadedImageUrls: string[];
  images: VendorProductImageDraft[];
  setField: <K extends keyof Omit<VendorProductFormData, "variants">>(
    name: K,
    value: VendorProductFormData[K],
  ) => void;
  updateVariant: <K extends keyof VendorProductVariantForm>(
    index: number,
    field: K,
    value: VendorProductVariantForm[K],
  ) => void;
  addVariant: () => void;
  removeVariant: (index: number) => void;
  addImageFile: (file: File) => string;
  markImageUploading: (imageId: string) => void;
  markImageUploaded: (imageId: string, uploadedUrl: string) => void;
  markImageError: (imageId: string, error: string) => void;
  removeImage: (index: number) => void;
  openModal: () => void;
  closeModal: () => void;
  resetForm: () => void;
};

const createEmptyVariant = (index: number): VendorProductVariantForm => ({
  size: index === 0 ? "Mặc định" : "",
  sku: "",
  basePrice: "",
  stock: "1",
  condition: "NEW",
});

const initialFormData: VendorProductFormData = {
  name: "",
  description: "",
  categoryId: "",
  variants: [createEmptyVariant(0)],
};

function createImageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function revokePreview(url?: string) {
  if (url && typeof URL !== "undefined") {
    URL.revokeObjectURL(url);
  }
}

export const useVendorProductFormStore = create<VendorProductFormState>((set) => ({
  isModalOpen: false,
  formData: initialFormData,
  imageFiles: [],
  previewUrls: [],
  uploadedImageUrls: [],
  images: [],

  setField: (name, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    })),

  updateVariant: (index, field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        variants: state.formData.variants.map((variant, variantIndex) =>
          variantIndex === index ? { ...variant, [field]: value } : variant,
        ),
      },
    })),

  addVariant: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        variants: [
          ...state.formData.variants,
          createEmptyVariant(state.formData.variants.length),
        ],
      },
    })),

  removeVariant: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        variants: state.formData.variants.filter(
          (_, variantIndex) => variantIndex !== index,
        ),
      },
    })),

  addImageFile: (file) => {
    const imageId = createImageId();
    const previewUrl = URL.createObjectURL(file);

    set((state) => ({
      imageFiles: [...state.imageFiles, file],
      previewUrls: [...state.previewUrls, previewUrl],
      images: [
        ...state.images,
        {
          id: imageId,
          previewUrl,
          isPrimary: state.images.length === 0,
          isUploading: false,
        },
      ],
    }));

    return imageId;
  },

  markImageUploading: (imageId) =>
    set((state) => ({
      images: state.images.map((image) =>
        image.id === imageId
          ? { ...image, isUploading: true, error: undefined }
          : image,
      ),
    })),

  markImageUploaded: (imageId, uploadedUrl) =>
    set((state) => ({
      uploadedImageUrls: [...state.uploadedImageUrls, uploadedUrl],
      images: state.images.map((image) =>
        image.id === imageId
          ? { ...image, uploadedUrl, isUploading: false, error: undefined }
          : image,
      ),
    })),

  markImageError: (imageId, error) =>
    set((state) => ({
      images: state.images.map((image) =>
        image.id === imageId
          ? { ...image, isUploading: false, error }
          : image,
      ),
    })),

  removeImage: (index) =>
    set((state) => {
      const removed = state.images[index];
      revokePreview(removed?.previewUrl);

      const images = state.images.filter((_, imageIndex) => imageIndex !== index);
      const normalizedImages =
        removed?.isPrimary && images.length > 0
          ? images.map((image, imageIndex) => ({
              ...image,
              isPrimary: imageIndex === 0,
            }))
          : images;

      return {
        imageFiles: state.imageFiles.filter((_, imageIndex) => imageIndex !== index),
        previewUrls: state.previewUrls.filter((_, imageIndex) => imageIndex !== index),
        uploadedImageUrls: state.uploadedImageUrls.filter((uploadedUrl) =>
          normalizedImages.some((image) => image.uploadedUrl === uploadedUrl),
        ),
        images: normalizedImages,
      };
    }),

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set({ isModalOpen: false }),

  resetForm: () =>
    set((state) => {
      state.images.forEach((image) => revokePreview(image.previewUrl));

      return {
        isModalOpen: false,
        formData: {
          ...initialFormData,
          variants: [createEmptyVariant(0)],
        },
        imageFiles: [],
        previewUrls: [],
        uploadedImageUrls: [],
        images: [],
      };
    }),
}));
