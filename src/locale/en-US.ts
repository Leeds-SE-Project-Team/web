import localeMessageBox from '@/components/message-box/locale/en-US'
import localeDashboard from '@/views/web/admin/dashboard/locale/en-US'
import localeSearchUserTable from '@/views/web/admin/search/search-user/locale/en-US'
import localeSearchVideoTable from '@/views/web/admin/search/search-tour/locale/en-US'
import localeSettings from './en-US/settings'

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...localeDashboard,
  ...localeSearchUserTable,
  ...localeSearchVideoTable
}
