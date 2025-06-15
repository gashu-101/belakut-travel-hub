
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { MapPin, Star, Wifi, ParkingSquare, UtensilsCrossed, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getHotelById, getHotelReviews } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/AuthProvider';
import BookingDialog from '@/components/booking/BookingDialog';
import ReviewDialog from '@/components/reviews/ReviewDialog';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wi-Fi': <Wifi className="w-4 h-4" />,
  'Pool': <Star className="w-4 h-4" />,
  'Spa': <Star className="w-4 h-4" />,
  'Gym': <Star className="w-4 h-4" />,
  'Parking': <ParkingSquare className="w-4 h-4" />,
  'Restaurant': <UtensilsCrossed className="w-4 h-4" />,
};

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  
  const { data: hotel, isLoading, isError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id!),
    enabled: !!id && id !== ':id',
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['hotel-reviews', id],
    queryFn: () => getHotelReviews(id!),
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

  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : hotel.rating || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-primary fill-current" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            {reviews && <span className="text-sm">({reviews.length} reviews)</span>}
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
      </div>

      {/* Info & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About this {hotel.type || 'Stay'}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">{hotel.description || 'No description provided.'}</p>
          
          <h3 className="text-xl font-bold mt-8 mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            {hotel.amenities?.map(amenity => (
              <Badge key={amenity} variant="secondary" className="p-2 gap-2">
                {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                {amenity}
              </Badge>
            ))}
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Reviews ({reviews?.length || 0})</h3>
              {session && (
                <ReviewDialog hotel={hotel} onReviewAdded={refetchReviews}>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </ReviewDialog>
              )}
            </div>
            
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
                {reviews.length > 5 && (
                  <p className="text-center text-muted-foreground">
                    + {reviews.length - 5} more reviews
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet. Be the first to review this hotel!</p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-lg p-6 shadow-lg">
            <p className="text-2xl font-bold mb-4">Starting from <span className="text-primary">{hotel.price_range || 'N/A'}</span></p>
            <p className="text-sm text-muted-foreground mb-6">Price varies based on room type and season.</p>
            
            {session ? (
              <BookingDialog hotel={hotel}>
                <Button size="lg" className="w-full">Book Now</Button>
              </BookingDialog>
            ) : (
              <Button size="lg" className="w-full" asChild>
                <a href="/auth">Sign In to Book</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
