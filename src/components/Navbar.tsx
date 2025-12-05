import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setTheme } from '../store/themeSlice'
import logo from '../../public/logo/mainlogo.jpeg'

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const mode = useAppSelector(state => state.theme.mode)
  const dispatch = useAppDispatch()
  const dark = mode === 'dark'

  // Base button classes to reduce repetition
  const themeButtonClasses = 'px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 font-medium'

  return (
    <header className={`${dark ? '!bg-gray-900/60 border-gray-800 text-white' : '!bg-white border-gray-200 text-gray-900'} app-navbar flex items-center justify-between px-6 py-3 backdrop-blur-sm`}>
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile only) */}
        <button
          onClick={toggleSidebar}
          className={`${dark ? '!bg-blue-400 text-white hover:bg-gray-700/30' : '!bg-orange-400 text-gray-900 hover:bg-gray-200/30'} text-2xl p-2 rounded transition`}
        >
          ☰
        </button>

            <img className='w-12 h-12' src={logo} alt="" />
        <div className="flex flex-col">
          <span className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
            
            Jhula Premiere League (JPL) Season 3</span>
          <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Manage auctions, teams and players</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Switch */}
        <div className="flex items-center gap-2 text-sm">
          <button
            aria-label="light"
            type="button"
            onClick={() => dispatch(setTheme('light'))}
            className={`${themeButtonClasses} border-gray-300 ${!dark ? '!bg-orange-400 text-black font-bold shadow' : '!bg-blue-100 text-gray-500 !hover:bg-gray-200 !hover:text-gray-800'}`}
          >
            ☀️ Light
          </button>
          <button
            aria-label="dark"
            type="button"
            onClick={() => dispatch(setTheme('dark'))}
            className={`${themeButtonClasses} border-gray-700 ${dark ? '!bg-blue-400 text-black font-bold shadow' : '!bg-orange-100 text-gray-500 !hover:bg-gray-200 !hover:text-gray-800'}`}
          >
            🌙 Dark
          </button>
        </div>

        {/* User Avatar */}
        <div className={`${dark ? 'bg-gray-700' : 'bg-gray-300'} w-9 h-9 rounded-full flex items-center justify-center text-sm text-white`}>
          U
        </div>
      </div>
    </header>
  )
}
