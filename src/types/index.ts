// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'company' | 'admin';
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Waste Category Types
export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  guidelines: string;
  acceptedItems: string[];
  notAcceptedItems: string[];
}

// Pickup Request Types
export interface PickupRequest {
  id: string;
  userId: string;
  companyId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  wasteCategories: {
    categoryId: string;
    quantity: number;
    unit: 'kg' | 'lbs' | 'pieces';
  }[];
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  scheduledDate: Date;
  scheduledTimeSlot: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  serviceArea: {
    radius: number; // in kilometers
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  acceptedWasteCategories: string[]; // Array of category IDs
  rating: number;
  reviews: Review[];
  operatingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  companyId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  pickupRequestId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
} 