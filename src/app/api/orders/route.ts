import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { services, pickupDate, address } = body;

    const order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      services: services.join(', '),
      pickupDate,
      address,
      total: 10.00,
      status: "Pending"
    };

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    orders: [
      { id: "ORD-1", status: "Pending", total: 10.00 }
    ]
  });
}
