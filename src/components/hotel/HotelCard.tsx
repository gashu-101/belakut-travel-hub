
import { Hotel } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

interface HotelCardProps {
  hotel: Hotel & {
    hotel_images?: Array<{
      id: string;
      image_url: string;
      image_type: string;
      sort_order: number;
    }>;
  };
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  // Get the main image from hotel_images or fall back to hotel.image
  const getMainImage = () => {
    if (hotel.hotel_images && hotel.hotel_images.length > 0) {
      // First try to find a main image
      const mainImage = hotel.hotel_images.find(img => img.image_type === 'main');
      if (mainImage) return mainImage.image_url;
      
      // Otherwise use the first image sorted by sort_order
      const sortedImages = hotel.hotel_images.sort((a, b) => a.sort_order - b.sort_order);
      return sortedImages[0].image_url;
    }
    
    return hotel.image || '/placeholder.svg';
  };

  const imageUrl = getMainImage();
  console.log('HotelCard rendering hotel:', hotel.name, 'with image:', imageUrl);
  
  return (
    <div className="group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur transform hover:scale-105">
        <CardContent className="p-0">
          <div className="relative">
            <Link to={`/hotels/${hotel.id}`}>
              <img 
                src={imageUrl} 
                alt={hotel.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  console.log('Image failed to load for hotel:', hotel.name);
                  e.currentTarget.src = '/placeholder.svg';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully for hotel:', hotel.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            {/* Heart button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur shadow-lg hover:bg-white transition-all duration-300 group"
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked 
                    ? 'text-red-500 fill-current scale-110' 
                    : 'text-gray-600 hover:text-red-500 group-hover:scale-110'
                }`} 
              />
            </button>

            {/* Rating badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-lg">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-gray-800">{hotel.rating || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <Link to={`/hotels/${hotel.id}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-800 truncate group-hover:text-primary transition-colors">
                  {hotel.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-sm">{hotel.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                  🏨 {hotel.type || 'Stay'}
                </span>
                <span className="text-lg font-bold text-green-600">
                  From ETB 2,500/night
                </span>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelCard;
