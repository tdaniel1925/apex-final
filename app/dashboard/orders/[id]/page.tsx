'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Package,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  commission: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  commission: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: OrderItem[]
  stripePaymentIntentId?: string
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // TODO: Fetch real order data from database using params.id
  const [order] = useState<Order>({
    id: params.id,
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1 (555) 123-4567',
    date: '2025-11-22T10:30:00',
    status: 'processing',
    paymentStatus: 'paid',
    subtotal: 149.99,
    tax: 12.00,
    shipping: 8.00,
    total: 169.99,
    commission: 37.50,
    shippingAddress: {
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    items: [
      {
        id: '1',
        name: 'Premium Health Supplement',
        quantity: 2,
        price: 74.99,
        commission: 18.75,
      },
      {
        id: '2',
        name: 'Wellness Pack',
        quantity: 1,
        price: 75.00,
        commission: 18.75,
      },
    ],
    stripePaymentIntentId: 'pi_1234567890',
  })

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 hover:bg-green-100'
      case 'shipped':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
      case 'pending':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
      case 'cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 hover:bg-green-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
      case 'failed':
        return 'bg-red-100 text-red-700 hover:bg-red-100'
      case 'refunded':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(order.status)} variant="secondary">
            {order.status}
          </Badge>
          <Badge className={getPaymentStatusColor(order.paymentStatus)} variant="secondary">
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded flex-shrink-0" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Your commission: ${item.commission.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(item.price / item.quantity).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-green-600">
                  <span>Your Commission (25%)</span>
                  <span>${order.commission.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)} variant="secondary">
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span>Credit Card</span>
                </div>
                {order.stripePaymentIntentId && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                      {order.stripePaymentIntentId}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {order.paymentStatus === 'paid' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Confirmed</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Processing</p>
                      <p className="text-xs text-muted-foreground">In progress</p>
                    </div>
                  </div>
                )}
                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Shipped</p>
                      <p className="text-xs text-muted-foreground">Expected delivery: 3-5 days</p>
                    </div>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Delivered</p>
                      <p className="text-xs text-muted-foreground">Order completed</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
