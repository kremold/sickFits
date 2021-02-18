import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const StyledRemoveButton = styled.span`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
  });
  return (
    <StyledRemoveButton
      title="Remove this item from the Cart"
      disabled={loading}
      type="button"
      onClick={removeFromCart}
    >
      &times;
    </StyledRemoveButton>
  );
}
