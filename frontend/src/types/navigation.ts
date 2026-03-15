import type { Role } from "./account";

export type { Role };

/**
 * A single navigation item linking to one route.
 * `roles` lists which roles can see this item.
 * Leave `roles` undefined to show to all roles.
 */
export interface NavItem {
  href: string;
  label: string;
  /** Lucide icon component */
  icon: React.ElementType;
  /** Optional: mark routes that are not yet implemented */
  todo?: boolean;
  /** Which roles this item is visible to. Undefined = all roles. */
  roles?: Role[];
}

/**
 * A group of navigation items rendered under a section label in the sidebar.
 */
export interface NavGroup {
  label: string;
  items: NavItem[];
  /** Which roles this group is visible to. Undefined = all roles. */
  roles?: Role[];
}

/**
 * Returns items visible to the given role.
 * When `role` is null/undefined (e.g. not yet loaded), shows all items.
 */
export function filterNavGroups(groups: NavGroup[], role?: Role | null): NavGroup[] {
  return groups
    .filter((g) => !g.roles || !role || g.roles.includes(role))
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) => !item.roles || !role || item.roles.includes(role),
      ),
    }))
    .filter((g) => g.items.length > 0);
}
