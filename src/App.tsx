import { useEffect } from 'react'
import { NavigatorPage } from './pages/NavigatorPage'
import { enableKioskMode, disableKioskMode } from './utils/kiosk'
import { AdminProvider } from './contexts/AdminContext'

function App() {
  useEffect(() => {
    enableKioskMode();
    return () => disableKioskMode();
  }, []);

  return (
    <AdminProvider>
      <NavigatorPage />
    </AdminProvider>
  )
}

export default App
