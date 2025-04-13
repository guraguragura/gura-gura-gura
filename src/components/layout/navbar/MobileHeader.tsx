import React from "react";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import NavIcons from "./NavIcons";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileHeaderProps {
  displayCategories: { id: string; name: string; handle: string }[];
  staticCategories: string[];
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeader = ({ 
  displayCategories, 
  staticCategories,
  showSearch,
  setShowSearch
}: MobileHeaderProps) => {
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  
  return (
    <div className="mx-auto w-full">
      <div className="flex items-center justify-between px-4 py-2">
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="mt-4 flex flex-col gap-4">
                <h3 className="text-lg font-bold">Categories</h3>
                <div className="space-y-3">
                  {displayCategories.map((category) => (
                    <Link 
                      key={category.id}
                      to={`/categories/${category.handle}`}
                      className="block py-2 hover:text-brand-teal"
                    >
                      {category.name}
                    </Link>
                  ))}
                  {staticCategories.map((category) => (
                    <Link 
                      key={category}
                      to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-2 hover:text-brand-teal"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-2">
                  <Link to="/business" className="block py-2 hover:text-brand-teal">
                    For Business
                  </Link>
                  <Link to="/faq" className="block py-2 hover:text-brand-teal">
                    Customer Service
                  </Link>
                  <Link to="/contact" className="block py-2 hover:text-brand-teal">
                    Contact Us
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex-1 flex justify-center">
          <Logo />
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
          >
            {showSearch ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
          <NavIcons />
        </div>
      </div>
      
      {showSearch && (
        <div className="border-t px-4 py-2 bg-white">
          <SearchBar />
          
          <div className="mt-2 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <Link 
                to="/collections"
                className="whitespace-nowrap rounded-full bg-blue-600 text-white px-3 py-1 text-xs"
              >
                All Categories
              </Link>
              {displayCategories.slice(0, 5).map((category) => (
                <Link 
                  key={category.id}
                  to={`/categories/${category.handle}`}
                  className="whitespace-nowrap rounded-full border border-gray-300 px-3 py-1 text-xs"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
