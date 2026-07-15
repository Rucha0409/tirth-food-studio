import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { order, adminPhone } = await req.json();

    const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;

    if (!instanceId || !token) {
      console.warn("[Tirth] Ultramsg API credentials not configured in environment variables.");
      return NextResponse.json(
        { error: 'Ultramsg credentials not configured on server.' },
        { status: 500 }
      );
    }

    // Helper to format messages with emojis and clean spacing
    const formatMessage = (isAdmin: boolean) => {
      let itemsText = '';
      order.items.forEach((i: any) => {
        itemsText += `• ${i.menuItem.name} (${i.menuItem.nameDevnagari}) x ${i.quantity} (₹${i.menuItem.price * i.quantity})\n`;
      });

      return `*तीर्थ – The Food Studio*\n` +
             `*ORDER ${isAdmin ? 'RECEIVED' : 'CONFIRMED'}!*\n\n` +
             `*Order ID:* ${order.id}\n` +
             `*Customer:* ${order.customerName}\n` +
             `*Phone:* ${order.customerPhone}\n` +
             `*Delivery Slot:* ${order.timeSlot}\n` +
             `*Notes:* ${order.customerNotes || 'None'}\n\n` +
             `*Items:*\n${itemsText}\n` +
             `*Grand Total:* ₹${order.total} (Paid via ${order.paymentMethod})\n\n` +
             `*Delivery Address:* ${order.customerAddress}\n\n` +
             `${isAdmin ? 'Please prepare the fresh Satvik dabba!' : 'Thank you for ordering! Your fresh Satvik dabba is being prepared.'} 🙏`;
    };

    // Clean and validate Indian phone number format for WhatsApp API
    const cleanPhone = (phoneStr: string) => {
      let clean = phoneStr.replace(/\D/g, ''); // strip non-numeric characters
      if (clean.length === 10) {
        clean = '91' + clean; // prefix default India country code
      }
      return clean;
    };

    const customerTo = cleanPhone(order.customerPhone);
    const adminTo = cleanPhone(adminPhone || '8380070757');

    const sendMsg = async (to: string, body: string) => {
      const params = new URLSearchParams();
      params.append('token', token);
      params.append('to', to);
      params.append('body', body);

      const res = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      return res.json();
    };

    // Send notifications concurrently
    const [customerRes, adminRes] = await Promise.all([
      sendMsg(customerTo, formatMessage(false)).catch(err => ({ error: err.message })),
      sendMsg(adminTo, formatMessage(true)).catch(err => ({ error: err.message }))
    ]);

    return NextResponse.json({
      success: true,
      customerRes,
      adminRes
    });
  } catch (error: any) {
    console.error('Ultramsg Send Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
