
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CartButton } from '@/components/cart/CartButton';
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from '@/contexts/AuthContext';

const NavIcons = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <CartButton />
      <Button variant="ghost" size="icon" asChild>
        <Link to={user ? "/account" : "/auth"}>
          <User className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};

export default NavIcons;
