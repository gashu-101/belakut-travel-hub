
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById, getHotelReviews } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Star, Wifi, Car, Utensils, ArrowLeft, User, Heart, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BookingDialog from '@/components/booking/BookingDialog';
import ReviewDialog from '@/components/reviews/ReviewDialog';
import { formatETB } from '@/lib/currency';
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
      <div className="container mx-auto px-4 py-12 bg-background min-h-screen">
        <div className="animate-pulse">
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
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container mx-auto px-4 py-12 bg-background min-h-screen">
        <div className="text-center bg-card rounded-2xl p-12 border shadow-lg">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Oops! Hotel Not Found</h1>
          <p className="text-muted-foreground mb-6">The place you're looking for seems to have vanished!</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
    <div className="container mx-auto px-4 py-12 bg-background min-h-screen">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6 hover:bg-accent transition-all duration-300 group">
          <Link to="/hotels">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Hotels
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  <img
                    src={mainImageUrl}
                    alt={hotel.name}
                    className="w-full h-96 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-card border">
                <div className="relative">
                  <img
                    src={allImages[selectedImageIndex] || mainImageUrl}
                    alt={`${hotel.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  {allImages.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {allImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${hotel.name} thumbnail ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedImageIndex === index ? 'ring-4 ring-primary scale-110' : 'hover:scale-105'
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
                        className="w-full h-24 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md"
                        onClick={() => setSelectedImageIndex(index + 1)}
                      />
                    </DialogTrigger>
                  </Dialog>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <Card className="border shadow-lg bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-bold text-foreground">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                      {averageRating || hotel.rating || 'N/A'}
                    </span>
                    {reviews && reviews.length > 0 && (
                      <span className="text-sm text-yellow-600 dark:text-yellow-400 ml-1">
                        ({reviews.length} reviews)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-lg">{hotel.location}</span>
                </div>
                
                <div className="flex gap-3 mb-6">
                  {hotel.type && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                      {hotel.type}
                    </Badge>
                  )}
                  {hotel.price_range && (
                    <Badge variant="outline" className="border-primary/30 text-foreground px-3 py-1">
                      {hotel.price_range}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {hotel.description && (
              <Card className="border shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                    <Heart className="w-5 h-5 text-primary" />
                    About This Place
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{hotel.description}</p>
                </CardContent>
              </Card>
            )}

            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card className="border shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {hotel.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || Star;
                      return (
                        <div key={index} className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-foreground">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <BookingDialog hotel={hotel}>
                <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg text-lg py-3">
                  Book Now
                </Button>
              </BookingDialog>
              <ReviewDialog hotel={hotel} onReviewAdded={() => window.location.reload()}>
                <Button variant="outline" size="lg" className="border-2 border-primary/30 hover:bg-primary/5 hover:border-primary transition-all duration-300 text-foreground">
                  Add Review
                </Button>
              </ReviewDialog>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
              What Our Guests Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="border shadow-lg bg-card hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">Guest</span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-yellow-700 dark:text-yellow-300">{review.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
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
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
              Available Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotel.hotel_rooms.map((room) => (
                <Card key={room.id} className="border shadow-lg bg-card hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{room.room_type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        Available: {room.total_numbers} rooms
                      </p>
                      {room.price && (
                        <p className="text-xl font-bold text-primary">
                          {formatETB(room.price)}/night
                        </p>
                      )}
                      {room.features && room.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {room.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
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
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
              Special Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.hotel_services.map((service) => (
                <Card key={service.id} className="border shadow-lg bg-card hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{service.service_name}</CardTitle>
                    <Badge variant="outline" className="w-fit bg-primary/5 border-primary/20 text-primary">
                      {service.service_category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    {service.price && (
                      <p className="font-bold text-primary text-lg">{formatETB(service.price)}</p>
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
