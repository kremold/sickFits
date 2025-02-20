import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { func } from 'prop-types';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  console.log(payload);
  console.log('running the update function after delete');
  cache.evict(cache.identify(payload.data.deleteProduct)); // got to find the item in the cache then remove it
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading, error }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: { id },
      update: update,
    }
  );

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if ((confirm = 'Are you sure you want to delete this item?')) {
          // then delete the item
          console.log('DELETE');
          deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}
