import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signin, { data, loading }] = useMutation(
    SIGNIN_MUTATION, // [name of mutation, {error , loading}]
    {
      variables: inputs,
      // refetch the currently logged in user
      refetchQueries: [{ query: CURRENT_USER_QUERY }], // will update the nav once refetched
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await signin();
    console.log(res);
    resetForm();
    // send the email and password to the graphql api
  }
  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;
  return (
    <Form method="Post" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <Error error={error} />
      <fieldset>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
