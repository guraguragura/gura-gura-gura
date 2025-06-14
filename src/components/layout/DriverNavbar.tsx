
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Package, 
  User, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DriverNavbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (isMobile) {
    return (
      <>
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/fee0a176-d29e-4bbd-9e57-4c3c62a0be2b.png" 
                alt="Gura Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {isMobileMenuOpen && (
            <div className="border-t bg-white">
              <div className="py-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm ${
                        isActive(item.href)
                          ? 'bg-[#84D1D3] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={signOut}
                  className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </header>
      </>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/fee0a176-d29e-4bbd-9e57-4c3c62a0be2b.png" 
                alt="Gura Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-[#84D1D3]">Driver Portal</span>
            </Link>
            
            <nav className="flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#84D1D3] text-white'
                        : 'text-gray-700 hover:text-[#84D1D3] hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.user_metadata?.first_name || 'Driver'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DriverNavbar;
