
import { useAuth } from '@/providers/AuthProvider';
import ComprehensiveHotelForm from '@/components/hotel/ComprehensiveHotelForm';
import { Navigate } from 'react-router-dom';

const AddHotel = () => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Your Hotel Property</h1>
        <p className="text-muted-foreground mb-8">
          Create a comprehensive listing for your hotel with rooms, halls, services, and images.
        </p>
        <ComprehensiveHotelForm />
      </div>
    </div>
  );
};

export default AddHotel;
