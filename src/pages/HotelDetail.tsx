
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { MapPin, Star, Wifi, ParkingSquare, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  const { data: hotel, isLoading, isError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id!),
    enabled: !!id && id !== ':id',
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid grid-cols-1 mb-12">
          <Skeleton className="w-full h-[500px] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/4" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !hotel) {
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
            <span className="font-medium">{hotel.rating || 'N/A'}</span>
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
            <img src={hotel.image || '/placeholder.svg'} alt={hotel.name} className="w-full h-[500px] object-cover rounded-lg" />
        </div>
        {/* Add more gallery images here if available */}
      </div>

      {/* Info & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About this {hotel.type || 'Stay'}</h2>
          <p className="text-muted-foreground leading-relaxed">{hotel.description || 'No description provided.'}</p>
          
          <h3 className="text-xl font-bold mt-8 mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-4">
            {hotel.amenities?.map(amenity => (
              <Badge key={amenity} variant="secondary" className="p-2 gap-2">
                {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-lg p-6 shadow-lg">
                <p className="text-2xl font-bold mb-4">Starting from <span className="text-primary">{hotel.price_range || 'N/A'}</span></p>
                <p className="text-sm text-muted-foreground mb-6">Price varies based on room type and season.</p>
                <Button size="lg" className="w-full">Book Now</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
