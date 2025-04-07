
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryStyle } from "@/utils/categoryUtils";

interface Category {
  id: string;
  name: string;
  handle: string;
}

const CategoryCarousel = () => {
  const [api, setApi] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_category')
          .select('id, name, handle')
          .eq('is_active', true)
          .order('rank', { ascending: true });
        
        if (error) {
          console.error("Error fetching categories:", error);
          setCategories([]);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [api]);

  const fallbackCategories = [
    {
      id: "pcat_01",
      name: "Women's Collection",
      handle: "women"
    },
    {
      id: "pcat_02",
      name: "Men's Collection",
      handle: "men"
    },
    {
      id: "pcat_03",
      name: "Electronics",
      handle: "electronics"
    },
    {
      id: "pcat_04",
      name: "10K Shop",
      handle: "10k-shop"
    },
    {
      id: "pcat_05",
      name: "Home & Art",
      handle: "home-art"
    },
    {
      id: "pcat_06",
      name: "Phones & Accessories",
      handle: "phones-accessories"
    },
    {
      id: "pcat_07",
      name: "Sports & Outdoors",
      handle: "sports-outdoors"
    }
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;
  
  const getCategoryImage = (handle: string) => {
    const categoryStyle = getCategoryStyle(handle);
    return categoryStyle.image;
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending <span className="font-normal">Categories</span></h2>
          <Link to="/collections" className="text-primary flex items-center gap-1 hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="h-32 w-32 bg-slate-200 rounded"></div>
              <div className="h-32 w-32 bg-slate-200 rounded"></div>
              <div className="h-32 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {displayCategories.map((category) => (
                <CarouselItem key={category.id} className="md:basis-1/3 lg:basis-1/4 pt-1 pb-8">
                  <Link to={`/categories/${category.handle}`} className="block group">
                    <div className="flex flex-col h-full">
                      <div className="h-64 w-full overflow-hidden rounded-lg mb-3">
                        <img
                          src={getCategoryImage(category.handle)}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1472851294608-062f824d29cc"; // Fallback image
                            console.error(`Failed to load image for ${category.name}:`, category.handle);
                          }}
                        />
                      </div>
                      <h3 className="text-center text-lg font-medium">{category.name}</h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default CategoryCarousel;
