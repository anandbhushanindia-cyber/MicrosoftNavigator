import { useEffect } from 'react'
import { NavigatorPage } from './pages/NavigatorPage'
import { enableKioskMode, disableKioskMode } from './utils/kiosk'

function App() {
  useEffect(() => {
    enableKioskMode();
    return () => disableKioskMode();
  }, []);

  return <NavigatorPage />
}

export default App
