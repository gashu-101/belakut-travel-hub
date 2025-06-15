
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { hotels } from "@/data/mockData";
import HotelCard from "@/components/hotel/HotelCard";

const Index = () => {
  const featuredHotels = hotels.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1618231375334-a82d2b557d34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Simien Mountains, Ethiopia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Discover Ethiopia's Hidden Gems</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Book unique stays and authentic experiences, from the mountains of Tigray to the lakes of the Rift Valley.
          </p>
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm p-2 rounded-full">
            <form className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <Input
                  type="search"
                  placeholder="Search destinations, hotels, experiences..."
                  className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-300 pl-12 h-12 rounded-full"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-full">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Stays */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Stays</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Promo */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">More than a stay. An experience.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                From guided city tours to authentic cooking classes, discover unique local experiences hosted by Ethiopian creators.
            </p>
            <Button size="lg" variant="outline">Explore Experiences</Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
