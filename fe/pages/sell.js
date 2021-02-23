import CreateProduct from '../components/CreateProduct';
import PleasSignIn from '../components/PleasSignIn';

// if not signed in will go to the sign in page after sign
export default function Sell() {
  return (
    <div>
      <PleasSignIn>
        <CreateProduct />
      </PleasSignIn>
    </div>
  );
}
