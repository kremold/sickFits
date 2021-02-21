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
