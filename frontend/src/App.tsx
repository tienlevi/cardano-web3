import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { routers } from '@/routes/routes'
import QueryContext from './context/QueryContext'
import MeshContext from './context/MeshContext'

function App() {
  return (
    <QueryContext>
      <MeshContext>
        <BrowserRouter>
          <Routes>
            <Route>
              {routers.map((route) => (
                <Route key={route.id} path={route.href} element={route.element} />
              ))}
              <Route path='*' element={<Navigate to='/' replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MeshContext>
    </QueryContext>
  )
}

export default App
