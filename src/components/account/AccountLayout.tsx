import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  RefreshCw, 
  LogOut, 
  HelpCircle,
  Menu
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AccountBanner from './AccountBanner';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
  onClick?: () => void;
}

interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('You have been signed out');
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const navItems: NavItem[] = [
    { path: '/account/personal-info', label: 'Personal info', icon: <User className="h-5 w-5" /> },
    { path: '/account/addresses', label: 'Addresses', icon: <MapPin className="h-5 w-5" /> },
    { path: '/account/wishlist', label: 'Wishlists', icon: <Heart className="h-5 w-5" /> },
    { path: '/account/orders', label: 'Orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/account/returns', label: 'Returns', icon: <RefreshCw className="h-5 w-5" /> },
  ];

  const secondaryNavItems: NavItem[] = [
    { section: 'OTHER', path: '', label: '', icon: null },
    { path: '/faq', label: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
    { path: '#', label: 'Sign Out', icon: <LogOut className="h-5 w-5 text-red-500" />, 
      onClick: handleLogout },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => {
      if (item.section) {
        return (
          <div key={`section-${index}`} className="px-3 py-2 text-xs font-semibold text-gray-500">
            {item.section}
          </div>
        );
      }
      
      if (item.path === '#' && item.onClick) {
        return (
          <button
            key={`button-${index}`}
            onClick={item.onClick}
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      }
      
      return (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            isActive(item.path)
              ? 'bg-gray-100 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      );
    });
  };

  // Mobile sidebar menu
  const renderMobileSidebar = () => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 mb-4">
            <Menu className="h-4 w-4" />
            <span>Account Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] sm:w-[385px] pt-12">
          <div className="flex flex-col py-3 space-y-1">
            {renderNavItems(navItems)}
            <div className="border-t my-2"></div>
            {renderNavItems(secondaryNavItems)}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow py-4 sm:py-8">
          <div className="mx-auto w-full px-4 sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-7xl">
            <div className="bg-white shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-8 py-4 sm:py-8">
                {/* Account Sidebar - Hidden on mobile */}
                {!isMobile && (
                  <aside className="md:w-64 flex-shrink-0">
                    <div className="sticky top-8 border rounded-lg overflow-hidden">
                      {/* Main Navigation */}
                      <div className="flex flex-col py-3 space-y-1">
                        {renderNavItems(navItems)}
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t my-2"></div>
                      
                      {/* Secondary Navigation */}
                      <div className="flex flex-col py-3 space-y-1">
                        {renderNavItems(secondaryNavItems)}
                      </div>
                    </div>
                  </aside>
                )}
                
                {/* Content Area with Banner */}
                <div className="flex-1 min-w-0">
                  {/* Mobile menu button - Only visible on mobile */}
                  {isMobile && renderMobileSidebar()}
                  
                  {/* Add the banner component directly above the content */}
                  <AccountBanner />
                  
                  <div className="bg-white border rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};
