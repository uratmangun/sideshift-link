import { NextRequest, NextResponse } from 'next/server';

const SIDESHIFT_API_URL = 'https://sideshift.ai/api/v2';

interface CheckoutRequest {
    settleCoin: string;
    settleNetwork: string;
    settleAmount: string;
    settleAddress: string;
    settleMemo?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: CheckoutRequest = await request.json();

        const sideshiftSecret = process.env.SIDESHIFT_SECRET;
        const affiliateId = process.env.AFFILIATE_ID;

        if (!sideshiftSecret || !affiliateId) {
            return NextResponse.json(
                { error: { message: 'Missing SideShift configuration' } },
                { status: 500 }
            );
        }

        // Get user IP for x-user-ip header
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const cfConnectingIp = request.headers.get('cf-connecting-ip');

        // Try multiple headers to get the real client IP
        const userIp =
            cfConnectingIp ||
            realIp ||
            forwardedFor?.split(',')[0]?.trim() ||
            request.headers.get('x-client-ip') ||
            '';

        if (!userIp) {
            return NextResponse.json(
                { error: { message: 'Could not determine client IP address' } },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        // Build checkout payload - only include callback URLs if we have a valid public base URL
        const checkoutPayload: Record<string, string | undefined> = {
            settleCoin: body.settleCoin,
            settleNetwork: body.settleNetwork,
            settleAmount: body.settleAmount,
            settleAddress: body.settleAddress,
            settleMemo: body.settleMemo,
            affiliateId,
        };

        // Only add callback URLs if base URL is a valid public HTTPS URL
        if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
            checkoutPayload.successUrl = `${baseUrl}/debug?status=success`;
            checkoutPayload.cancelUrl = `${baseUrl}/debug?status=cancelled`;
        }

        const response = await fetch(`${SIDESHIFT_API_URL}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'x-sideshift-secret': sideshiftSecret,
                'x-user-ip': userIp,
            },
            body: JSON.stringify(checkoutPayload),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || { message: 'Failed to create checkout' } },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
