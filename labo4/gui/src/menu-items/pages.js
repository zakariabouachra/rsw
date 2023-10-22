// assets
import { InboxOutlined, DatabaseOutlined } from '@ant-design/icons';

// icons
const icons = {
  InboxOutlined,
  DatabaseOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: '',
  title: '',
  type: 'group',
  children: [
    {
      id: 'warehouse',
      title: 'Warehouses',
      type: 'item',
      url: '/warehouse',
      icon: icons.InboxOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'database',
      title: 'Databases',
      type: 'item',
      url: '/database',
      icon: icons.DatabaseOutlined,
      target: false,
      breadcrumbs: false
    }
  ]
};

export default pages;
