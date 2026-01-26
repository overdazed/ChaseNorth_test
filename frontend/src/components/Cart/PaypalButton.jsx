import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRef, useState, useEffect } from 'react';

const PaypalButton = ({ amount, onSuccess, onError }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const paypalRef = useRef(null);

    useEffect(() => {
        // Only load the script once
        if (!window.paypal) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR`;
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            document.body.appendChild(script);
            paypalRef.current = script;
            
            return () => {
                // Cleanup
                if (paypalRef.current) {
                    document.body.removeChild(paypalRef.current);
                }
            };
        } else {
            setScriptLoaded(true);
        }
    }, []);

    if (!scriptLoaded) {
        return <div>Loading PayPal...</div>;
    }

    return (
        <PayPalScriptProvider
            options={{
                "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                currency: "EUR",
                components: "buttons",
                intent: "capture"
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical" }}
                forceReRender={[amount]}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "EUR",
                                    value: parseFloat(amount).toFixed(2)
                                }
                            }
                        ]
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(onSuccess);
                }}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
};

export default PaypalButton;

// in Checkout.jsx add PaypalButton