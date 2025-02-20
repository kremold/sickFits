import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. make sure tney are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Must be signed in');
  }
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
        id
        name
        email
        cart{
            id
            quantity
            product{
                name
                price
                description
                id
                photo{
                    id
                    image{
                        id
                        publicUrlTransformed
                    }
                }
            }
        }
        `,
  });
  // 2. caclculate the total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);
  // console.log(amount);
  // 3. create the charge with the stripe lib
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  console.log(charge);
  // 4. convert the cartitems to orderitems
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
      // user: { connect: { id: userId } },
    };
    return orderItem;
  });
  // 5. create the order and return
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });
  // 6. Clean up any old cart item
  const cartItemIds = user.cart.map((cartitem) => cartitem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });
  return order;
}

export default checkout;
