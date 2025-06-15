import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById, getHotelReviews } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Star, Wifi, Car, Utensils, ArrowLeft, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BookingDialog from '@/components/booking/BookingDialog';
import ReviewDialog from '@/components/reviews/ReviewDialog';
import { useState } from 'react';

const HotelDetail = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id!),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['hotel-reviews', id],
    queryFn: () => getHotelReviews(id!),
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

  // Get the main image from hotel_images or fall back to hotel.image
  const getMainImage = () => {
    if (hotel.hotel_images && hotel.hotel_images.length > 0) {
      const mainImage = hotel.hotel_images.find(img => img.image_type === 'main');
      if (mainImage) return mainImage.image_url;
      
      const sortedImages = hotel.hotel_images.sort((a, b) => a.sort_order - b.sort_order);
      return sortedImages[0].image_url;
    }
    
    return hotel.image || '/placeholder.svg';
  };

  // Get all images for gallery
  const getAllImages = () => {
    if (hotel.hotel_images && hotel.hotel_images.length > 0) {
      return hotel.hotel_images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url);
    }
    
    return hotel.gallery || [];
  };

  const mainImageUrl = getMainImage();
  const allImages = getAllImages();
  
  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Restaurant': Utensils,
  };

  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null;

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
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={mainImageUrl}
                  alt={hotel.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="relative">
                  <img
                    src={allImages[selectedImageIndex] || mainImageUrl}
                    alt={`${hotel.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {allImages.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {allImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${hotel.name} thumbnail ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer ${
                            selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(1, 5).map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <img
                        src={image}
                        alt={`${hotel.name} gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImageIndex(index + 1)}
                      />
                    </DialogTrigger>
                  </Dialog>
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
                  <span className="text-lg font-medium">
                    {averageRating || hotel.rating || 'N/A'}
                  </span>
                  {reviews && reviews.length > 0 && (
                    <span className="text-sm text-muted-foreground ml-1">
                      ({reviews.length} reviews)
                    </span>
                  )}
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
              <ReviewDialog hotel={hotel} onReviewAdded={() => window.location.reload()}>
                <Button variant="outline" size="lg">Add Review</Button>
              </ReviewDialog>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Guest</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
