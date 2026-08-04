export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method not allowed' });
    }

    const { amount, email, reference } = req.body;

    if (!amount || !email || !reference) {
        return res.status(400).json({ status: false, message: 'Missing required parameters' });
    }

    const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

    if (!KORAPAY_SECRET_KEY) {
        return res.status(500).json({ status: false, message: 'Server configuration error: Missing Secret Key' });
    }

    try {
        const koraResponse = await fetch('https://api.korapay.com/merchant/api/v1/charges/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KORAPAY_SECRET_KEY}`
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'NGN',
                reference: reference,
                customer: { email: email },
                notification_url: "https://hkdm-smm-panel.vercel.app/api/webhook",
                redirect_url: "https://hkdm-smm-panel.vercel.app"
            })
        });

        const data = await koraResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

