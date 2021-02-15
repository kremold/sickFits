import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

// which variables are getting passed in and what types are they
const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: 'Nice shirt',
    image: '',
    price: 34250,
    description: 'Best shoes ever',
  }); // destructuring the hook value here
  const [createProduct, { loading, error, data }] = useMutation(
    // the loading, error and data are react values and update, the data and const res response below are same
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
    }
  ); // destructuring what the mutation creates
  //console.log(createProduct);
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log(inputs);
        //submit input fields to backend
        //const res = await createProduct(); // res is same as data above so not needed
        await createProduct();
        // console.log(res);
        clearForm();
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}
