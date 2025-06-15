
export interface Hotel {
  id: string;
  name: string;
  type: 'Hotel' | 'Resort' | 'Lodge' | 'Guesthouse';
  location: string;
  priceRange: '$$' | '$$$' | '$$$$';
  rating: number;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
}

export interface Experience {
  id: string;
  name: string;
  provider: string;
  location: string;
  pricePerGuest: number;
  category: string;
  duration: string;
  rating: number;
  image: string;
}
