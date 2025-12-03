import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Auction from './pages/Auction'
import Summary from './pages/Summary'
import { seedIfEmpty } from './utils/seed'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    seedIfEmpty().catch((e) => console.error('seed', e))
  }, [])

 return (
  <BrowserRouter>
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col
          transition-all duration-100 ease-in-out
        `}
      >
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 overflow-auto bg-gradient-to-b from-white/60 dark:from-gray-900 via-white/5 dark:via-gray-800 to-white/60 dark:to-gray-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auction" element={<Auction />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </main>
      </div>
    </div>
  </BrowserRouter>
);

}
export default App;