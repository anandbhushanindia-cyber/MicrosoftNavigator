import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavigatorPage } from './pages/NavigatorPage'
import { DocumentationPage } from './pages/DocumentationPage'
import { enableKioskMode, disableKioskMode } from './utils/kiosk'
import { AdminProvider } from './contexts/AdminContext'

function KioskNavigator() {
  useEffect(() => {
    enableKioskMode();
    return () => disableKioskMode();
  }, []);

  return (
    <AdminProvider>
      <NavigatorPage />
    </AdminProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KioskNavigator />} />
        <Route path="/docs" element={<DocumentationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
