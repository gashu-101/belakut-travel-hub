
import { useAuth } from '@/providers/AuthProvider';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserExperiences } from '@/lib/experienceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Eye, Star, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ManageExperiences = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['user-experiences'],
    queryFn: getUserExperiences,
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-experiences'] });
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Manage Experiences</h1>
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
        <h1 className="text-3xl font-bold">Manage Experiences</h1>
        <Button asChild>
          <Link to="/add-experience">Add New Experience</Link>
        </Button>
      </div>

      {experiences?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Experiences Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first experience to the platform.
            </p>
            <Button asChild>
              <Link to="/add-experience">Add Your First Experience</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {experiences?.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{experience.name}</CardTitle>
                    {experience.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={experience.rating ? "default" : "secondary"}>
                    {experience.rating ? `${experience.rating}★` : 'No Rating'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {experience.image && (
                  <img 
                    src={experience.image} 
                    alt={experience.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {experience.category && (
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium text-primary">{experience.category}</div>
                        <div className="text-xs text-muted-foreground">Category</div>
                      </div>
                    )}
                    {experience.price_per_guest && (
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm font-bold text-green-600">${experience.price_per_guest}</div>
                        <div className="text-xs text-muted-foreground">Per Guest</div>
                      </div>
                    )}
                  </div>
                  
                  {experience.duration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{experience.duration}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/experiences/${experience.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteExperienceMutation.mutate(experience.id)}
                      disabled={deleteExperienceMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageExperiences;
