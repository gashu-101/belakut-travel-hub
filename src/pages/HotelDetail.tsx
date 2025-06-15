
import { useParams } from 'react-router-dom';
import { hotels } from '@/data/mockData';
import NotFound from './NotFound';
import { MapPin, Star, Wifi, ParkingSquare, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wi-Fi': <Wifi className="w-4 h-4" />,
  'Pool': <Star className="w-4 h-4" />, // Placeholder
  'Spa': <Star className="w-4 h-4" />, // Placeholder
  'Gym': <Star className="w-4 h-4" />, // Placeholder
  'Parking': <ParkingSquare className="w-4 h-4" />,
  'Restaurant': <UtensilsCrossed className="w-4 h-4" />,
};

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const hotel = hotels.find(h => h.id === id);

  if (!hotel) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-primary fill-current" />
            <span className="font-medium">{hotel.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-5 h-5" />
            <span>{hotel.location}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-12">
        <div className="md:col-span-2">
            <img src={hotel.image} alt={hotel.name} className="w-full h-[500px] object-cover rounded-lg" />
        </div>
        {/* Add more gallery images here if available */}
      </div>

      {/* Info & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About this {hotel.type}</h2>
          <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
          
          <h3 className="text-xl font-bold mt-8 mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-4">
            {hotel.amenities.map(amenity => (
              <Badge key={amenity} variant="secondary" className="p-2 gap-2">
                {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-lg p-6 shadow-lg">
                <p className="text-2xl font-bold mb-4">Starting from <span className="text-primary">{hotel.priceRange}</span></p>
                <p className="text-sm text-muted-foreground mb-6">Price varies based on room type and season.</p>
                <Button size="lg" className="w-full">Book Now</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
