import { PAGINATION_QUERY } from '../components/Pagination';

export default function PaginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // console.log({ existing, args, cache });
      // First thing it does is asks the read function for those items
      const { skip, first } = args;

      // read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      // console.log(data);
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if are numbers
      // and there are not enough items to satisfy the amount request
      // and if on last page then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // check if not existing items and then send to network
        return false;
      }

      // if are items then return and not go to network
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache! Gonna send them to apollo.`
        // );
        return items;
      }

      return false; // fallback to network
      // can do one of 2 things

      // first thing we can do is return the items because tey are already in the cache

      // the other thing we can do is to return false from here, (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the Apollo client comes back from the network with our product- how and where to add into cache
      // console.log(`Merging items from the network ${incoming.length}`);
      // console.log(incoming);
      const merged = existing ? existing.slice(0) : [];
      // can't just do a merged.push(incoming)
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // finally we return the merged items from the cache
      return merged;
    },
  };
}
