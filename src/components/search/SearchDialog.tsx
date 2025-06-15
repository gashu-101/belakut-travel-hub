
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { searchHotels, searchExperiences } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchDialogProps {
  children: React.ReactNode;
}

const SearchDialog = ({ children }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: hotelResults, isLoading: hotelsLoading } = useQuery({
    queryKey: ['search-hotels', query],
    queryFn: () => searchHotels(query),
    enabled: query.length > 2,
  });

  const { data: experienceResults, isLoading: experiencesLoading } = useQuery({
    queryKey: ['search-experiences', query],
    queryFn: () => searchExperiences(query),
    enabled: query.length > 2,
  });

  const handleItemClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Stays & Experiences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search destinations, hotels, experiences..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          
          {query.length > 2 && (
            <Tabs defaultValue="hotels" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hotels">Stays ({hotelResults?.length || 0})</TabsTrigger>
                <TabsTrigger value="experiences">Experiences ({experienceResults?.length || 0})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hotels" className="max-h-96 overflow-y-auto">
                {hotelsLoading ? (
                  <div className="text-center py-8">Searching...</div>
                ) : hotelResults?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No stays found</div>
                ) : (
                  <div className="space-y-2">
                    {hotelResults?.map((hotel) => (
                      <Link key={hotel.id} to={`/hotels/${hotel.id}`} onClick={handleItemClick}>
                        <Card className="hover:bg-muted transition-colors">
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <img 
                                src={hotel.image || '/placeholder.svg'} 
                                alt={hotel.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{hotel.name}</h4>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {hotel.location}
                                </div>
                                {hotel.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-sm">{hotel.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="experiences" className="max-h-96 overflow-y-auto">
                {experiencesLoading ? (
                  <div className="text-center py-8">Searching...</div>
                ) : experienceResults?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No experiences found</div>
                ) : (
                  <div className="space-y-2">
                    {experienceResults?.map((experience) => (
                      <Card key={experience.id} className="hover:bg-muted transition-colors">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <img 
                              src={experience.image || '/placeholder.svg'} 
                              alt={experience.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{experience.name}</h4>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {experience.location}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {experience.category && (
                                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                                    {experience.category}
                                  </span>
                                )}
                                {experience.duration && (
                                  <span className="text-xs text-muted-foreground">
                                    {experience.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {query.length <= 2 && query.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Type at least 3 characters to search
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
