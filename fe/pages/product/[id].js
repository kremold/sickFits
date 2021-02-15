import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage({ query }) {
  //console.log({ data, loading, error }); // easier to read with using the {} wrapping these creates a readable object
  return <SingleProduct id={query.id} />;
}
