import { Routes } from '@/interface/route'
import Asset from '@/pages/Asset'
import Home from '@/pages/Home'
import Mint from '@/pages/Mint'
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
    href: '/mint',
    id: 'mint',
    name: 'Mint',
    element: <Mint />,
  },
  {
    href: '/asset',
    id: 'asset',
    name: 'Asset',
    element: <Asset />,
  },
]
