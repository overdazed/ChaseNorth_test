import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalButton = ({amount, onSuccess, onError}) => {
    return (
        <PayPalScriptProvider
            // for now it's hardcoded, declare a variable in .env
            options={{"client-id":
                    import.meta.env.VITE_PAYPAL_CLIENT_ID
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical" }}
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
                    })
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(onSuccess)
                }}
                onError={onError}
            />

        </PayPalScriptProvider>
    )
}
export default PaypalButton

// in Checkout.jsx add PaypalButton