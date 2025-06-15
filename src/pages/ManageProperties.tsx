import { useAuth } from '@/providers/AuthProvider';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserHotels, getHotelBookings } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel, MapPin, Calendar, Users, Eye, Trash2, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookingApprovalCard from '@/components/booking/BookingApprovalCard';

const ManageProperties = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const { data: hotels, isLoading: hotelsLoading } = useQuery({
    queryKey: ['user-hotels'],
    queryFn: getUserHotels,
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-hotels'] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    },
  });

  // Get all pending bookings for property owner
  const { data: allBookings = [] } = useQuery({
    queryKey: ['owner-all-bookings'],
    queryFn: async () => {
      if (!hotels) return [];
      
      const hotelIds = hotels.map(h => h.id);
      const bookingPromises = hotelIds.map(id => getHotelBookings(id));
      const bookingResults = await Promise.all(bookingPromises);
      
      return bookingResults.flat().filter(booking => 
        booking.status === 'pending' && !booking.payment_approved
      );
    },
    enabled: !!hotels,
  });

  if (hotelsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Manage Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Properties</h1>
        <Button asChild>
          <a href="/add-hotel">Add New Property</a>
        </Button>
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="approvals" className="relative">
            Pending Approvals
            {allBookings.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {allBookings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="mt-6">
          {hotels?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Hotel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first property to the platform.
                </p>
                <Button asChild>
                  <a href="/add-hotel">Add Your First Property</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels?.map((hotel) => (
                <PropertyCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onDelete={() => deleteHotelMutation.mutate(hotel.id)}
                  isDeleting={deleteHotelMutation.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approvals" className="mt-6">
          {allBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                <p className="text-muted-foreground">
                  All payments are up to date. New bookings requiring approval will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Bookings Awaiting Payment Approval</h2>
                <Badge variant="secondary">{allBookings.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allBookings.map((booking) => (
                  <BookingApprovalCard 
                    key={booking.id} 
                    booking={booking}
                    onApprove={() => {
                      queryClient.invalidateQueries({ queryKey: ['owner-all-bookings'] });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PropertyCard = ({ hotel, onDelete, isDeleting }: { 
  hotel: any; 
  onDelete: () => void;
  isDeleting: boolean;
}) => {
  const { data: bookings } = useQuery({
    queryKey: ['hotel-bookings', hotel.id],
    queryFn: () => getHotelBookings(hotel.id),
  });

  const activeBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'pending') || [];
  const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{hotel.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <Badge variant={hotel.rating ? "default" : "secondary"}>
            {hotel.rating ? `${hotel.rating}★` : 'No Rating'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {hotel.image && (
          <img 
            src={hotel.image} 
            alt={hotel.name}
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
        )}
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{bookings?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Total Bookings</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">${totalRevenue}</div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={`/hotels/${hotel.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-2">
            {activeBookings.length > 0 ? (
              <div className="space-y-2">
                {activeBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="p-2 border rounded text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(booking.check_in_date).toLocaleDateString()}</span>
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{booking.guests_count} guests</span>
                    </div>
                  </div>
                ))}
                {activeBookings.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{activeBookings.length - 3} more bookings
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                No active bookings
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManageProperties;
