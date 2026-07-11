import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Users, LayoutDashboard, Menu, X, BookOpen } from 'lucide-react';

const links = [
  { to: '/',              label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/eventos',       label: 'Eventos',        icon: CalendarDays    },
  { to: '/participantes', label: 'Participantes',  icon: Users           },
  { to: '/inscripciones', label: 'Inscripciones',  icon: BookOpen        },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-purple-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-md border-2 border-purple-300">
              <img
                src="/logo-uc.png"
                alt="Logo UC"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-purple-800 font-black text-sm">UC</span>';
                  }
                }}
              />
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm sm:text-base leading-none">Universidad Continental</p>
              <p className="text-purple-200 text-xs">Gestión de Eventos</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-purple-800 shadow-md'
                      : 'text-purple-100 hover:bg-purple-700 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-purple-700 transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-purple-900 border-t border-purple-700 animate-fadeIn">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium border-b border-purple-800 transition ${
                  isActive ? 'bg-purple-700 text-white' : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
