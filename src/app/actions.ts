'use server';

import db from '../lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Types matching our schema
export type Order = {
  id: string;
  userId: string;
  services: string;
  pickupDate: string;
  status: string;
  total: number;
  address: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

// Action to create an order
export async function createOrder(data: { services: string[]; date: string; address?: string }) {
  try {
    const cookieStore = await cookies();
    const phone = cookieStore.get('userPhone')?.value;

    if (!phone) {
      return { error: 'Not authenticated' };
    }

    // 1. Find user
    const user = await db.user.findUnique({ where: { phone } });

    if (!user) {
      return { error: 'User not found in database' };
    }

    // 2. Create order
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
    const total = 0; // Price to be determined by admin
    const finalAddress = data.address || user.address || '';
    
    await db.order.create({
      data: {
        id: orderId,
        userId: user.id,
        services: data.services.join(', '),
        pickupDate: data.date,
        address: finalAddress,
        total: total,
        status: 'Pending'
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/admin');
    
    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: 'Failed to create order' };
  }
}

// Action to get user orders
export async function getUserOrders(phone: string) {
  try {
    const user = await db.user.findUnique({ where: { phone }, select: { id: true } });
    if (!user) return [];

    const orders = await db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return orders.map(o => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      total: o.total || 0
    }));
  } catch (error) {
    console.error("Error getting user orders:", error);
    return [];
  }
}

// Action to get all orders (Admin)
export async function getAllOrders() {
  try {
    const orders = await db.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return orders.map(o => ({
      ...o,
      customerName: o.user.name,
      customerPhone: o.user.phone,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      total: o.total || 0
    }));
  } catch (error) {
    console.error("Error getting all orders:", error);
    return [];
  }
}

// Action to update order status
export async function updateOrderStatus(orderId: string, status: string, total?: number) {
  try {
    if (total !== undefined) {
      await db.order.update({
        where: { id: orderId },
        data: { status, total }
      });
    } else {
      await db.order.update({
        where: { id: orderId },
        data: { status }
      });
    }
    
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: 'Failed to update order status' };
  }
}

// Action to update user profile
export async function updateUserProfile(oldPhone: string, newPhone: string, name: string, address: string) {
  try {
    await db.user.update({
      where: { phone: oldPhone },
      data: { phone: newPhone, name, address }
    });
    
    // Update the session cookie
    const cookieStore = await cookies();
    cookieStore.set('userPhone', newPhone, { path: '/' });
    
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: 'Failed to update profile' };
  }
}

// Action to log in an existing user
export async function loginUser(phone: string) {
  try {
    const user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      return { error: 'Account not found. Please sign up first.' };
    }
    
    const cookieStore = await cookies();
    cookieStore.set('userPhone', phone, { path: '/' });
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: 'An error occurred during login' };
  }
}

// Action to sign up a new user
export async function signupUser(name: string, phone: string, address: string) {
  try {
    const existing = await db.user.findUnique({ where: { phone } });
    if (existing) {
      return { error: 'An account with this phone number already exists.' };
    }
    
    await db.user.create({
      data: { name, phone, address }
    });
    
    const cookieStore = await cookies();
    cookieStore.set('userPhone', phone, { path: '/' });
    
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: 'Failed to create account' };
  }
}

// Action to log out
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set('userPhone', '', { maxAge: 0, path: '/' });
  cookieStore.delete('userPhone');
}
