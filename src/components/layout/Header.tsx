
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Mountain, Plus, Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import UserNav from '@/components/auth/UserNav';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const NavItem = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
    }
  >
    {children}
  </NavLink>
);

const Header = () => {
  const { session } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Visitopia</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/hotels">Stays</NavItem>
            <NavItem to="/experiences">Experiences</NavItem>
            {session && (
              <NavItem to="/manage-properties">Manage Properties</NavItem>
            )}
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link to="/" className="mr-6 flex items-center space-x-2 mb-6">
                <Mountain className="h-6 w-6 text-primary" />
                <span className="font-bold">Visitopia</span>
              </Link>
              <div className="flex flex-col gap-4">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/hotels">Stays</NavItem>
                <NavItem to="/experiences">Experiences</NavItem>
                {session && (
                  <>
                    <NavItem to="/add-hotel">Add Property</NavItem>
                    <NavItem to="/manage-properties">Manage Properties</NavItem>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/add-hotel">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/manage-properties">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Link>
              </Button>
              <UserNav />
            </div>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
