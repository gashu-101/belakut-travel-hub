
import { Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Visitopia</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Visitopia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
