import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body = await req.json();
    const { amount } = body; // amount in rupees

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be greater than 0.' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Amount too small. Minimum is ₹1.' },
        { status: 400 }
      );
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: 'tirth_rcpt_' + Date.now().toString(),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error.error?.description || error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
