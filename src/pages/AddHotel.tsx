
import { useAuth } from '@/providers/AuthProvider';
import AddHotelForm from '@/components/hotel/AddHotelForm';
import { Navigate } from 'react-router-dom';

const AddHotel = () => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Your Property</h1>
        <AddHotelForm />
      </div>
    </div>
  );
};

export default AddHotel;
