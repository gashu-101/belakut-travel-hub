import { Hotel } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

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
    <Link to={`/hotels/${hotel.id}`} className="group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={imageUrl} 
              alt={hotel.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.log('Image failed to load for hotel:', hotel.name);
                e.currentTarget.src = '/placeholder.svg';
              }}
              onLoad={() => {
                console.log('Image loaded successfully for hotel:', hotel.name);
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-lg truncate">{hotel.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="text-sm font-medium">{hotel.rating || 'N/A'}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{hotel.location}</p>
            <p className="text-sm text-muted-foreground mt-2">{hotel.type || 'Stay'}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;
