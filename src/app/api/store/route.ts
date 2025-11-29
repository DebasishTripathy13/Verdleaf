import { NextRequest, NextResponse } from 'next/server';
import { getProductById, ECO_PRODUCTS } from '@/constants/store';
import { PurchaseRequest, PurchaseResponse, StoreOrder } from '@/types/store';

// In-memory store for demo (would use database in production)
const orders: StoreOrder[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  
  let products = [...ECO_PRODUCTS];
  
  // Filter by product ID
  if (productId) {
    const product = getProductById(productId);
    if (product) {
      return NextResponse.json({ product });
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  // Filter by category
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  // Filter featured products
  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }
  
  return NextResponse.json({ 
    products,
    total: products.length,
    categories: Array.from(new Set(ECO_PRODUCTS.map(p => p.category)))
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: PurchaseRequest = await request.json();
    const { productId, quantity = 1, paymentMethod, walletAddress, shippingAddress } = body;
    
    // Validate product
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json<PurchaseResponse>({
        success: false,
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      }, { status: 404 });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json<PurchaseResponse>({
        success: false,
        message: 'Insufficient stock',
        error: 'OUT_OF_STOCK'
      }, { status: 400 });
    }
    
    // Calculate totals
    const totalPoints = product.price * quantity;
    const totalETH = (parseFloat(product.priceInETH) * quantity).toFixed(6);
    
    // Validate payment method
    if (paymentMethod === 'crypto' && !walletAddress) {
      return NextResponse.json<PurchaseResponse>({
        success: false,
        message: 'Wallet address required for crypto payments',
        error: 'WALLET_REQUIRED'
      }, { status: 400 });
    }
    
    // Create order
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order: StoreOrder = {
      id: orderId,
      userId: 'demo-user', // Would come from auth in production
      productId: product.id,
      productName: product.name,
      quantity,
      totalPoints,
      totalETH,
      paymentMethod,
      status: paymentMethod === 'crypto' ? 'pending' : 'confirmed',
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // For crypto payments, we would initiate blockchain transaction here
    // This is a simplified demo version
    if (paymentMethod === 'crypto') {
      // In production: Use wagmi/viem to create and send transaction
      // For demo, simulate transaction hash
      order.transactionHash = `0x${Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      order.status = 'confirmed';
    }
    
    // Save order (in-memory for demo)
    orders.push(order);
    
    // Calculate new points balance (demo)
    const newPointsBalance = paymentMethod === 'points' ? 1250 - totalPoints : undefined;
    
    return NextResponse.json<PurchaseResponse>({
      success: true,
      orderId: order.id,
      message: `Successfully purchased ${quantity}x ${product.name}`,
      transactionHash: order.transactionHash,
      newPointsBalance,
    });
    
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json<PurchaseResponse>({
      success: false,
      message: 'Failed to process purchase',
      error: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

// Get order history
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    const userOrders = orders.filter(o => o.userId === userId || userId === 'demo-user');
    
    return NextResponse.json({
      orders: userOrders,
      total: userOrders.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
