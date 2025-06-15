
import { useQuery } from "@tanstack/react-query";
import { getExperiences, searchExperiences } from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ExperienceCard from "@/components/experience/ExperienceCard";

const Experiences = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data: experiences, isLoading, isError } = useQuery({
    queryKey: searchQuery ? ['search-experiences', searchQuery] : ['experiences'],
    queryFn: searchQuery ? () => searchExperiences(searchQuery) : getExperiences
  });

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">All Experiences</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">All Experiences</h1>
        <p>We couldn't fetch the experiences right now. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-4xl font-bold">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Experiences'}
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search experiences..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {searchQuery && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Found {experiences?.length || 0} results
            </span>
            <button
              onClick={clearSearch}
              className="text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {experiences?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No experiences found</h2>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "Try adjusting your search terms or browse all experiences."
              : "No experiences are available at the moment."
            }
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-primary hover:underline"
            >
              View all experiences
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {experiences?.map(experience => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Experiences;
