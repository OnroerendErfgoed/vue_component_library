export interface OeSideNavigationProps {
  autoExpand?: boolean;
  sideNavigation: SideNavigationSection[];
  routeMatches: SideNavigationRoute[];
  onNavigate: (routeName: string) => void;
}

export interface SideNavigationSection {
  // Unique identifier for the section
  ref: string;
  // Text to display in the section header
  text: string;
  // Array of links in the section
  links: SideNavigationRoute[];
}

export interface SideNavigationRoute {
  // Name of the route, used for identification
  name: string;
  // Label to display in the navigation
  label?: string;
}
