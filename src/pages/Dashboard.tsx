import { Link } from 'react-router-dom';
import { CalendarDays, Users, BookOpen, TrendingUp, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Badge, { categoryVariant, statusVariant } from '../components/Badge';

export default function Dashboard() {
  const { eventos, participantes, inscripciones } = useApp();

  const totalEventos      = eventos.length;
  const totalParticipantes = participantes.length;
  const totalInscripciones = inscripciones.length;
  const proximosEventos   = eventos.filter(e => e.estado === 'Próximo').length;

  const stats = [
    { label: 'Eventos Totales',    value: totalEventos,       icon: CalendarDays, color: 'text-purple-700', bg: 'bg-purple-100' },
    { label: 'Participantes',      value: totalParticipantes, icon: Users,        color: 'text-blue-700',   bg: 'bg-blue-100'   },
    { label: 'Inscripciones',      value: totalInscripciones, icon: BookOpen,     color: 'text-green-700',  bg: 'bg-green-100'  },
    { label: 'Próximos Eventos',   value: proximosEventos,    icon: TrendingUp,   color: 'text-orange-700', bg: 'bg-orange-100' },
  ];

  const recientes = [...eventos].reverse().slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-800 to-purple-600 text-white p-8 mb-8 shadow-xl">
        <p className="text-purple-200 text-sm font-medium mb-1 uppercase tracking-wider">Plataforma de Gestión</p>
        <h1 className="text-3xl font-extrabold mb-2">Eventos Universitarios</h1>
        <p className="text-purple-100 text-sm max-w-xl">
          Administra conferencias, talleres, seminarios y eventos académicos de la Universidad Continental desde un solo lugar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/eventos/nuevo" className="inline-flex items-center gap-2 bg-white text-purple-800 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-purple-50 transition shadow-md">
            <CalendarDays size={16} /> Crear Evento
          </Link>
          <Link to="/participantes" className="inline-flex items-center gap-2 bg-purple-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-purple-600 border border-purple-500 transition">
            <Users size={16} /> Ver Participantes
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={22} className={color} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Eventos recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Eventos Recientes</h2>
          <Link to="/eventos" className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center gap-1 transition">
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>
        {recientes.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No hay eventos registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recientes.map(ev => {
              const inscritos = inscripciones.filter(i => i.eventoId === ev.id).length;
              return (
                <div key={ev.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={20} className="text-purple-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{ev.titulo}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12} />{ev.fecha} · {ev.hora}</span>
                      <span className="flex items-center gap-1 truncate"><MapPin size={12} />{ev.lugar}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge label={ev.estado} variant={statusVariant(ev.estado)} />
                    <Badge label={ev.categoria} variant={categoryVariant(ev.categoria)} />
                  </div>
                  <div className="text-right text-xs text-gray-500 ml-2 hidden sm:block">
                    <p className="font-bold text-gray-900 text-sm">{inscritos}</p>
                    <p>inscritos</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
