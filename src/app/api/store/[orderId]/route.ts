import { NextRequest, NextResponse } from 'next/server';

// Demo orders storage (shared with parent route in production via database)
const demoOrders = [
  {
    id: 'ORD-demo-001',
    userId: 'demo-user',
    productId: 'prod-001',
    productName: 'Bamboo Water Bottle',
    quantity: 1,
    totalPoints: 150,
    totalETH: '0.005',
    paymentMethod: 'points',
    status: 'delivered',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ORD-demo-002',
    userId: 'demo-user',
    productId: 'prod-010',
    productName: 'Portable Solar Charger',
    quantity: 1,
    totalPoints: 350,
    totalETH: '0.012',
    paymentMethod: 'crypto',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'shipped',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  const order = demoOrders.find(o => o.id === orderId);
  
  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  const body = await request.json();
  
  const orderIndex = demoOrders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  
  // Update order status
  if (body.status) {
    demoOrders[orderIndex] = {
      ...demoOrders[orderIndex],
      status: body.status,
      updatedAt: new Date(),
    };
  }
  
  return NextResponse.json({ 
    success: true,
    order: demoOrders[orderIndex]
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  const orderIndex = demoOrders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  
  const order = demoOrders[orderIndex];
  
  // Can only cancel pending orders
  if (order.status !== 'pending' && order.status !== 'confirmed') {
    return NextResponse.json(
      { error: 'Cannot cancel order in current status' },
      { status: 400 }
    );
  }
  
  demoOrders[orderIndex] = {
    ...order,
    status: 'cancelled',
    updatedAt: new Date(),
  };
  
  return NextResponse.json({ 
    success: true,
    message: 'Order cancelled successfully'
  });
}
