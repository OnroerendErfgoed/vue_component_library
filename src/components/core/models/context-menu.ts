export interface MenuItem {
  label?: string;
  action?: string;
  type?: 'divider';
  submenu?: MenuItem[];
}
