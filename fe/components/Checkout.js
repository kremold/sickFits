import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import SickButton from './styles/SickButton';
const CheckoutFromStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Checkout() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('work todo yet');

    // 1. stop the form form submitting and turn the loader on
    // 2. start the page transition
    // 3. create the payment method via stripe- token comes back from stripe
    // 4. handle any errors from stripe
    // 5. send the token from step 3 to our keystone server via a custom mutation, creating an order
    // 6. change the page to view the order
    // 7. close the cart
    // 8. turn the loader off
  }

  return (
    <Elements stripe={stripeLib}>
      <CheckoutFromStyles onSubmit={handleSubmit}>
        <CardElement />
        <SickButton>Check Out Now</SickButton>
      </CheckoutFromStyles>
    </Elements>
  );
}
