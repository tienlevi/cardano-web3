import { Routes } from '@/interface/route'
import Asset from '@/pages/Asset'
import Home from '@/pages/Home'
import Transaction from '@/pages/Transaction'

export const routers: Routes[] = [
  {
    href: '/',
    id: 'home',
    name: 'Home',
    element: <Home />,
  },
  {
    href: '/transaction',
    id: 'transaction',
    name: 'Transaction',
    element: <Transaction />,
  },
  {
    href: '/asset',
    id: 'asset',
    name: 'Asset',
    element: <Asset />,
  },
]
