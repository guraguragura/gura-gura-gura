
import React from "react";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Fallback static categories to use when no DB categories are available
const staticCategories = [
  {
    id: "electronics",
    name: "Electronics",
    handle: "electronics",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
    color: "bg-blue-100"
  },
  {
    id: "books",
    name: "Books & Media",
    handle: "books",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    color: "bg-green-100"
  },
  {
    id: "home",
    name: "Home & Kitchen",
    handle: "home-kitchen",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    color: "bg-yellow-100"
  },
  {
    id: "fashion",
    name: "Fashion",
    handle: "fashion",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    color: "bg-purple-100"
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    handle: "sports-outdoors",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    color: "bg-red-100"
  },
  {
    id: "beauty",
    name: "Health & Beauty",
    handle: "health-beauty",
    image: "https://images.unsplash.com/photo-1607006677169-a62beb975922",
    color: "bg-indigo-100"
  },
  {
    id: "kids",
    name: "Kids & Toys",
    handle: "kids-toys",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8",
    color: "bg-pink-100"
  },
  {
    id: "automotive",
    name: "Automotive",
    handle: "automotive",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753",
    color: "bg-gray-100"
  }
];

// A mapping of category handles to image URLs and colors
const categoryImageMap: Record<string, {image: string, color: string}> = {
  "electronics": { 
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03", 
    color: "bg-blue-100" 
  },
  "books": { 
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d", 
    color: "bg-green-100" 
  },
  "home-kitchen": { 
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6", 
    color: "bg-yellow-100" 
  },
  "fashion": { 
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", 
    color: "bg-purple-100" 
  },
  "sports-outdoors": { 
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b", 
    color: "bg-red-100" 
  },
  "health-beauty": { 
    image: "https://images.unsplash.com/photo-1607006677169-a62beb975922", 
    color: "bg-indigo-100" 
  },
  "kids-toys": { 
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8", 
    color: "bg-pink-100" 
  },
  "automotive": { 
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753", 
    color: "bg-gray-100" 
  },
  "10k-shop": { 
    image: "/lovable-uploads/140ba952-70e0-44c3-91c3-6464a0ba3e8b.png", 
    color: "bg-red-100" 
  },
  // Default for any category not in the mapping
  "default": { 
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc", 
    color: "bg-gray-100" 
  }
};

// Get category image and color
const getCategoryStyle = (handle: string) => {
  const category = categoryImageMap[handle] || categoryImageMap.default;
  return category;
};

// Generate random category color if none is specified
const getRandomColor = () => {
  const colors = [
    "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100",
    "bg-red-100", "bg-indigo-100", "bg-pink-100", "bg-gray-100"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface Category {
  id: string;
  name: string;
  handle: string;
  is_active?: boolean;
}

interface PopularCategoriesProps {
  dbCategories?: Category[];
  isLoading?: boolean;
}

const PopularCategories: React.FC<PopularCategoriesProps> = ({ 
  dbCategories = [], 
  isLoading = false 
}) => {
  const [api, setApi] = React.useState<any>(null);
  
  // Use DB categories if available, otherwise use static ones
  const displayCategories = dbCategories.length > 0 
    ? dbCategories.map(cat => {
        const style = getCategoryStyle(cat.handle);
        return {
          id: cat.id,
          name: cat.name,
          image: style.image,
          color: style.color,
          handle: cat.handle
        };
      })
    : staticCategories;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Our <span className="font-normal">Categories</span></h2>
        
        {isLoading ? (
          <div className="animate-pulse flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex-none w-1/4">
                <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-gray-300 mb-3"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
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
                <CarouselItem key={category.id} className="md:basis-1/4 lg:basis-1/5">
                  <Link 
                    to={`/categories/${category.handle}`}
                    className="group block"
                  >
                    <div className={`rounded-lg p-4 ${category.color || getRandomColor()} transition-all duration-300 group-hover:shadow-md flex flex-col items-center text-center`}>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden mb-3">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <h3 className="text-sm font-medium">{category.name}</h3>
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

export default PopularCategories;
