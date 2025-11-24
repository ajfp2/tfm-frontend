
export interface MenuItem {
  id: number;
  label: string;
  icon?: string;
  route?: string;
  order: number;
  children?: MenuItem[];
  expanded?: boolean;
}

export interface MenuResponse {
  data: MenuItem[];
}