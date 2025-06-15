
import { Hotel } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Link to={`/hotels/${hotel.id}`} className="group">
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={hotel.image || '/placeholder.svg'} 
              alt={hotel.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-lg truncate">{hotel.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="text-sm font-medium">{hotel.rating || 'N/A'}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{hotel.location}</p>
            <p className="text-sm text-muted-foreground mt-2">{hotel.type || 'Stay'}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;
