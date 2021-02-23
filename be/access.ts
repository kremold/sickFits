// At it's simplest, access is either a yes or no based on the user's session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session; // double bang in front then false, else if is a session returns true
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria- yes or no
export const permissions = {
  ...generatedPermissions,
  // could then add more permissions that were not in the keystone ui, see example below
  //   isAwesome({ session }): ListAccessArgs {
  //     return session?.data.name.includes('Kyle');
  //   },
};

// Rule based functions
// rule can return a bool or a filter which limits which products they can CRUD.
export const rules = {
  canManageProducts({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of canManageProduct
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // if not do they own this item?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // if not do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }): ListAccessArgs {
    console.log(session);
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // if not can the order's user edit/manage it?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // they can read everything
    }
    // otherwise they should onlt see available products (bassed on the product status field)
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of canManageUsers
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // otherwise they may only update themselves
    return { id: session.itemId };
  },
};
