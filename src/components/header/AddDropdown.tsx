
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plus, Hotel, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
        <DropdownMenuItem asChild>
          <Link to="/add-hotel" className="flex items-center cursor-pointer">
            <Hotel className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/add-experience" className="flex items-center cursor-pointer">
            <MapPin className="h-4 w-4 mr-2" />
            Add Experience
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddDropdown;
