'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Leaf, 
  Star, 
  ShoppingCart,
  Wallet,
  Check,
  X,
  ArrowRight,
  Package,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useUserStore } from '@/store';
import { 
  ECO_PRODUCTS, 
  PRODUCT_CATEGORIES, 
  EcoProduct, 
  ProductCategory,
  getFeaturedProducts 
} from '@/constants/store';
import { useAccount } from 'wagmi';

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<EcoProduct | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<'points' | 'crypto'>('points');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [cart, setCart] = useState<EcoProduct[]>([]);
  
  const { user, setUser } = useUserStore();
  const { isConnected, address } = useAccount();
  
  const userPoints = user?.ecoPoints || 1250;
  
  const filteredProducts = useMemo(() => {
    return ECO_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);
  
  const featuredProducts = getFeaturedProducts();
  
  const handlePurchase = async () => {
    if (!selectedProduct) return;
    
    if (purchaseMode === 'points') {
      if (userPoints >= selectedProduct.price && user) {
        // Deduct points
        setUser({
          ...user,
          ecoPoints: user.ecoPoints - selectedProduct.price
        });
        setPurchaseSuccess(true);
        setTimeout(() => {
          setPurchaseSuccess(false);
          setSelectedProduct(null);
        }, 2000);
      }
    } else {
      // Crypto purchase - would integrate with wagmi/viem here
      // For demo, just show success
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedProduct(null);
      }, 2000);
    }
  };
  
  const addToCart = (product: EcoProduct) => {
    setCart(prev => [...prev, product]);
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };
  
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartTotalETH = cart.reduce((sum, item) => sum + parseFloat(item.priceInETH), 0);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-400" />
            Eco Store
          </h1>
          <p className="text-gray-400 mt-1">
            Shop sustainable products with eco-points or cryptocurrency
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <Coins className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-emerald-400">{userPoints}</span>
            <span className="text-gray-400 text-sm">points</span>
          </div>
          
          {cart.length > 0 && (
            <Button 
              variant="outline" 
              className="gap-2 border-emerald-500/50 text-emerald-400"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length}
            </Button>
          )}
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Search eco-friendly products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'border-gray-700 hover:border-emerald-500'
            }
          >
            All
          </Button>
          {PRODUCT_CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id as ProductCategory)}
              className={selectedCategory === cat.id 
                ? 'bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap' 
                : 'border-gray-700 hover:border-emerald-500 whitespace-nowrap'
              }
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Featured Products
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className="h-full bg-gradient-to-br from-emerald-900/30 to-gray-900/50 border-emerald-500/30 cursor-pointer hover:border-emerald-400 transition-colors"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-3 rounded-lg bg-gray-800/50 overflow-hidden">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-black z-10">Featured</Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-emerald-400">{product.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Leaf className="w-4 h-4" />
                        <span>{product.carbonOffset}kg CO₂</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      
      {/* All Products */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" />
          {selectedCategory === 'all' ? 'All Products' : PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
          <span className="text-sm text-gray-500">({filteredProducts.length} items)</span>
        </h2>
        
        {filteredProducts.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No products found matching your search.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className="h-full bg-gray-900/50 border-gray-800 cursor-pointer hover:border-emerald-500/50 transition-colors group"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-3 rounded-lg bg-gray-800/50 overflow-hidden group-hover:bg-gray-800 transition-colors">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock < 30 && (
                        <Badge variant="outline" className="absolute top-2 right-2 border-orange-500 text-orange-400 z-10">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-gray-700">
                        {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.emoji} {product.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                      <div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-emerald-400">{product.price}</span>
                        </div>
                        <span className="text-xs text-gray-500">{product.priceInETH} ETH</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.sustainabilityScore / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>
                  by {selectedProduct.vendor}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Product Image */}
                <div className="relative aspect-video rounded-lg bg-gray-800 overflow-hidden">
                  <Image 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Description */}
                <p className="text-gray-300">{selectedProduct.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Sustainability Info */}
                <Card className="bg-emerald-500/10 border-emerald-500/30">
                  <CardContent className="p-4 flex justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{selectedProduct.carbonOffset}kg</p>
                      <p className="text-xs text-gray-400">CO₂ Offset</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{selectedProduct.sustainabilityScore}/10</p>
                      <p className="text-xs text-gray-400">Sustainability</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{selectedProduct.stock}</p>
                      <p className="text-xs text-gray-400">In Stock</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Purchase Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-400">Purchase with:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={purchaseMode === 'points' ? 'default' : 'outline'}
                      className={purchaseMode === 'points' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'border-gray-700'
                      }
                      onClick={() => setPurchaseMode('points')}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {selectedProduct.price} Points
                    </Button>
                    <Button
                      variant={purchaseMode === 'crypto' ? 'default' : 'outline'}
                      className={purchaseMode === 'crypto' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'border-gray-700'
                      }
                      onClick={() => setPurchaseMode('crypto')}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      {selectedProduct.priceInETH} ETH
                    </Button>
                  </div>
                  
                  {purchaseMode === 'points' && userPoints < selectedProduct.price && (
                    <p className="text-sm text-orange-400">
                      Not enough points. You need {selectedProduct.price - userPoints} more points.
                    </p>
                  )}
                  
                  {purchaseMode === 'crypto' && !isConnected && (
                    <p className="text-sm text-blue-400">
                      Connect your wallet to purchase with crypto.
                    </p>
                  )}
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handlePurchase}
                  disabled={
                    (purchaseMode === 'points' && userPoints < selectedProduct.price) ||
                    (purchaseMode === 'crypto' && !isConnected) ||
                    purchaseSuccess
                  }
                >
                  {purchaseSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Purchased!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Shop with Purpose</h3>
                <p className="text-gray-400">Every purchase supports sustainable vendors and offsets carbon</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {ECO_PRODUCTS.reduce((sum, p) => sum + p.carbonOffset, 0).toLocaleString()}kg
                </p>
                <p className="text-xs text-gray-500">Total CO₂ Offset Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{ECO_PRODUCTS.length}</p>
                <p className="text-xs text-gray-500">Eco Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-400">
                  {new Set(ECO_PRODUCTS.map(p => p.vendor)).size}
                </p>
                <p className="text-xs text-gray-500">Ethical Vendors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
