
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  RefreshCw, 
  LogOut, 
  HelpCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { section: 'MAIN', path: '', label: '', icon: null },
    { path: '/account/personal-info', label: 'Personal info', icon: <User className="h-5 w-5" /> },
    { path: '/account/addresses', label: 'Addresses', icon: <MapPin className="h-5 w-5" /> },
    { path: '/account/wishlist', label: 'Wishlists', icon: <Heart className="h-5 w-5" /> },
    { path: '/account/orders', label: 'Orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/account/returns', label: 'Returns', icon: <RefreshCw className="h-5 w-5" /> },
  ];

  const secondaryNavItems: NavItem[] = [
    { section: 'OTHER', path: '', label: '', icon: null },
    { path: '/help', label: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
    { path: '/logout', label: 'Sign Out', icon: <LogOut className="h-5 w-5 text-red-500" /> },
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

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Account Sidebar */}
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
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border rounded-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
