
import { useAuth } from '@/providers/AuthProvider';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserHotels, getHotelBookings } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel, MapPin, Calendar, Users, Eye, Trash2, Bell, Phone, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookingApprovalCard from '@/components/booking/BookingApprovalCard';
import { formatETB } from '@/lib/currency';

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

  // Get all pending bookings for property owner with detailed info
  const { data: allBookings = [] } = useQuery({
    queryKey: ['owner-all-bookings'],
    queryFn: async () => {
      if (!hotels) return [];
      
      const hotelIds = hotels.map(h => h.id);
      const bookingPromises = hotelIds.map(async (hotelId) => {
        // Get bookings with user profiles using a single query
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles!inner(first_name, last_name, email, phone)
          `)
          .eq('hotel_id', hotelId)
          .eq('status', 'pending')
          .eq('payment_approved', false);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          return [];
        }
        
        // Get hotel names
        const { data: hotelData, error: hotelError } = await supabase
          .from('hotels')
          .select('name')
          .eq('id', hotelId)
          .single();

        if (hotelError) {
          console.error('Error fetching hotel:', hotelError);
          return [];
        }

        // Transform the data to match the expected format
        return bookings.map((booking: any) => ({
          ...booking,
          hotel_name: hotelData?.name || 'Unknown Hotel',
          guest_count: booking.guests_count,
          booker_name: booking.profiles 
            ? `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim() || 'Unknown'
            : 'Unknown',
          booker_email: booking.profiles?.email || 'Not provided',
          booker_phone: booking.profiles?.phone || 'Not provided'
        }));
      });
      
      const bookingResults = await Promise.all(bookingPromises);
      return bookingResults.flat();
    },
    enabled: !!hotels,
  });

  if (hotelsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Manage Properties
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
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
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Property Management
        </h1>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transform hover:scale-105 transition-all duration-300">
          <a href="/add-hotel">Add New Property</a>
        </Button>
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg border-0 p-1 rounded-xl">
          <TabsTrigger value="properties" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
            My Properties
          </TabsTrigger>
          <TabsTrigger value="approvals" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
            Pending Approvals
            {allBookings.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-red-600 animate-pulse">
                {allBookings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="mt-6">
          {hotels?.length === 0 ? (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <CardContent className="pt-6 text-center">
                <Hotel className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold mb-2 text-slate-700">No Properties Yet</h3>
                <p className="text-slate-500 mb-4">
                  Start by adding your first property to the platform.
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
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
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50">
              <CardContent className="pt-6 text-center">
                <Bell className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold mb-2 text-slate-700">No Pending Approvals</h3>
                <p className="text-slate-500">
                  All payments are up to date. New bookings requiring approval will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <Bell className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-slate-800">Bookings Awaiting Payment Approval</h2>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">{allBookings.length}</Badge>
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
    queryFn: async () => {
      // Get bookings with user profiles using a single query
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!inner(first_name, last_name, email, phone)
        `)
        .eq('hotel_id', hotel.id);

      if (bookingsError) {
        console.error('Error fetching bookings for hotel:', bookingsError);
        return [];
      }
      
      // Transform the data to match the expected format
      return bookings.map((booking: any) => ({
        ...booking,
        booker_name: booking.profiles 
          ? `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim() || 'Unknown'
          : 'Unknown',
        booker_email: booking.profiles?.email || 'Not provided',
        booker_phone: booking.profiles?.phone || 'Not provided'
      }));
    },
  });

  const activeBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'pending') || [];
  const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-slate-800">{hotel.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <MapPin className="h-3 w-3" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <Badge variant={hotel.rating ? "default" : "secondary"} className={hotel.rating ? "bg-gradient-to-r from-green-500 to-green-600 text-white" : ""}>
            {hotel.rating ? `${hotel.rating} Stars` : 'No Rating'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {hotel.image && (
          <img 
            src={hotel.image} 
            alt={hotel.name}
            className="w-full h-32 object-cover rounded-lg mb-4 shadow-md"
          />
        )}
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">Overview</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{bookings?.length || 0}</div>
                <div className="text-xs text-blue-600">Total Bookings</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{formatETB(totalRevenue)}</div>
                <div className="text-xs text-green-600">Revenue</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 border-slate-300 hover:bg-slate-50" asChild>
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
                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-2">
            {activeBookings.length > 0 ? (
              <div className="space-y-3">
                {activeBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="p-3 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">{new Date(booking.check_in_date).toLocaleDateString()}</span>
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={booking.status === 'confirmed' ? "bg-green-100 text-green-700 border-green-300" : "bg-yellow-100 text-yellow-700 border-yellow-300"}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>{booking.guests_count} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Guest:</span>
                        <span>{booking.booker_name}</span>
                      </div>
                      {booking.booker_email !== 'Not provided' && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{booking.booker_email}</span>
                        </div>
                      )}
                      {booking.booker_phone !== 'Not provided' && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{booking.booker_phone}</span>
                        </div>
                      )}
                      <div className="font-semibold text-green-600">
                        {formatETB(booking.total_amount || 0)}
                      </div>
                    </div>
                  </div>
                ))}
                {activeBookings.length > 3 && (
                  <div className="text-center text-sm text-slate-500 p-2 bg-slate-50 rounded-lg">
                    +{activeBookings.length - 3} more bookings
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-slate-500 py-8 bg-slate-50 rounded-lg">
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
