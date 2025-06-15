
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Wifi, Car, Utensils, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BookingDialog from '@/components/booking/BookingDialog';
import ReviewDialog from '@/components/reviews/ReviewDialog';

const HotelDetail = () => {
  const { id } = useParams();

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id!),
    enabled: !!id,
  });

  if (!id) {
    return <Navigate to="/hotels" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-4">The hotel you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    );
  }

  console.log('HotelDetail rendering hotel:', hotel.name, 'with image:', hotel.image);

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Restaurant': Utensils,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/hotels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotels
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={hotel.image || '/placeholder.svg'}
              alt={hotel.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-4"
              onError={(e) => {
                console.log('Main image failed to load for hotel:', hotel.name);
                e.currentTarget.src = '/placeholder.svg';
              }}
              onLoad={() => {
                console.log('Main image loaded successfully for hotel:', hotel.name);
              }}
            />
            
            {hotel.gallery && hotel.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {hotel.gallery.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${hotel.name} gallery ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                    onError={(e) => {
                      console.log(`Gallery image ${index + 1} failed to load for hotel:`, hotel.name);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-current" />
                  <span className="text-lg font-medium">{hotel.rating || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{hotel.location}</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                {hotel.type && <Badge variant="outline">{hotel.type}</Badge>}
                {hotel.price_range && <Badge variant="secondary">{hotel.price_range}</Badge>}
              </div>
            </div>

            {hotel.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
                </CardContent>
              </Card>
            )}

            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {hotel.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || Star;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <BookingDialog hotel={hotel}>
                <Button size="lg" className="flex-1">Book Now</Button>
              </BookingDialog>
              <ReviewDialog hotel={hotel}>
                <Button variant="outline" size="lg">Add Review</Button>
              </ReviewDialog>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        {hotel.hotel_rooms && hotel.hotel_rooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotel.hotel_rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{room.room_type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Available: {room.total_numbers} rooms
                      </p>
                      {room.price && (
                        <p className="text-lg font-semibold text-primary">
                          ${room.price}/night
                        </p>
                      )}
                      {room.features && room.features.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {room.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Services Section */}
        {hotel.hotel_services && hotel.hotel_services.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.hotel_services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.service_name}</CardTitle>
                    <Badge variant="outline">{service.service_category}</Badge>
                  </CardHeader>
                  <CardContent>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                    )}
                    {service.price && (
                      <p className="font-semibold text-primary">${service.price}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetail;
