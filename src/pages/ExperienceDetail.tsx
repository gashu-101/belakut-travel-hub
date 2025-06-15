
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Star, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const ExperienceDetail = () => {
  const { id } = useParams();

  const { data: experience, isLoading, error } = useQuery({
    queryKey: ['experience', id],
    queryFn: async () => {
      if (!id) throw new Error('Experience ID is required');
      
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (!id) {
    return <Navigate to="/experiences" replace />;
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

  if (error || !experience) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience Not Found</h1>
          <p className="text-muted-foreground mb-4">The experience you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/experiences">Back to Experiences</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/experiences">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Experiences
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={experience.image || '/placeholder.svg'}
              alt={experience.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{experience.name}</h1>
              {experience.location && (
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{experience.location}</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.category && (
                  <Badge variant="secondary">{experience.category}</Badge>
                )}
                {experience.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{experience.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {experience.duration && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{experience.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {experience.price_per_guest && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Price per guest</p>
                        <p className="font-medium">${experience.price_per_guest}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {experience.provider && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{experience.provider}</p>
                </CardContent>
              </Card>
            )}

            {experience.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {experience.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
