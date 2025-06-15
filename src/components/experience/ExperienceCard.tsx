
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star } from "lucide-react";
import { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={experience.image || "/placeholder.svg"}
          alt={experience.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight">{experience.name}</h3>
          {experience.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{experience.rating}</span>
            </div>
          )}
        </div>
        
        {experience.location && (
          <div className="mb-2 flex items-center text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-sm">{experience.location}</span>
          </div>
        )}

        <div className="mb-3 flex flex-wrap gap-2">
          {experience.category && (
            <Badge variant="secondary" className="text-xs">
              {experience.category}
            </Badge>
          )}
          {experience.duration && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span className="text-xs">{experience.duration}</span>
            </div>
          )}
        </div>

        {experience.description && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {experience.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {experience.provider && (
            <span className="text-sm text-muted-foreground">
              by {experience.provider}
            </span>
          )}
          {experience.price_per_guest && (
            <span className="font-semibold text-primary">
              ${experience.price_per_guest}/person
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
