import { Routes } from '@/interface/route'
import Home from '@/pages/Home'

export const routers: Routes[] = [
  {
    href: '/',
    id: 'home',
    name: 'Home',
    element: <Home />,
  },
]
