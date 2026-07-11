import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, CalendarDays, MapPin, Clock, Users, Edit2, Trash2, Eye } from 'lucide-react';
import { useApp, Evento } from '../store/AppContext';
import Badge, { categoryVariant, statusVariant } from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EventoForm from '../components/EventoForm';

export default function Eventos() {
  const { eventos, inscripciones, addEvento, updateEvento, deleteEvento } = useApp();
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editEvento, setEditEvento]   = useState<Evento | null>(null);
  const [viewEvento, setViewEvento]   = useState<Evento | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [toast, setToast]             = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = eventos.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = e.titulo.toLowerCase().includes(q) || e.lugar.toLowerCase().includes(q) || e.organizador.toLowerCase().includes(q);
    const matchCat    = !filterCat    || e.categoria === filterCat;
    const matchStatus = !filterStatus || e.estado    === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = (data: Omit<Evento, 'id'>) => {
    if (editEvento) {
      updateEvento({ ...data, id: editEvento.id });
      showToast('Evento actualizado correctamente');
    } else {
      addEvento(data);
      showToast('Evento creado correctamente');
    }
    setModalOpen(false);
    setEditEvento(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteEvento(deleteId);
      setDeleteId(null);
      showToast('Evento eliminado');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-purple-700 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Gestión de Eventos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{eventos.length} evento{eventos.length !== 1 ? 's' : ''} registrado{eventos.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditEvento(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md"
        >
          <Plus size={16} /> Nuevo Evento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Buscar eventos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-600" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {['Conferencia','Taller','Seminario','Académico','Otro'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-600" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {['Próximo','En curso','Finalizado','Cancelado'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
          <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No se encontraron eventos</p>
          <p className="text-sm mt-1">Intenta ajustar los filtros o crea un nuevo evento</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(ev => {
            const inscritos = inscripciones.filter(i => i.eventoId === ev.id).length;
            const pct = ev.capacidad > 0 ? Math.min((inscritos / ev.capacidad) * 100, 100) : 0;
            return (
              <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
                {/* Color top bar */}
                <div className="h-1.5 bg-gradient-to-r from-purple-600 to-purple-400" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <Badge label={ev.categoria} variant={categoryVariant(ev.categoria)} />
                      <Badge label={ev.estado}    variant={statusVariant(ev.estado)} />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{ev.titulo}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{ev.descripcion || 'Sin descripción'}</p>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2"><Clock size={13} className="text-purple-500" />{ev.fecha} · {ev.hora}</div>
                    <div className="flex items-center gap-2"><MapPin size={13} className="text-purple-500" /><span className="truncate">{ev.lugar}</span></div>
                    <div className="flex items-center gap-2"><Users size={13} className="text-purple-500" />{inscritos} / {ev.capacidad} inscritos</div>
                  </div>

                  {/* Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Ocupación</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-purple-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button onClick={() => setViewEvento(ev)} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg py-2 transition">
                      <Eye size={13} /> Ver
                    </button>
                    <button onClick={() => { setEditEvento(ev); setModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg py-2 transition">
                      <Edit2 size={13} /> Editar
                    </button>
                    <button onClick={() => setDeleteId(ev.id)} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg py-2 transition">
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editEvento ? 'Editar Evento' : 'Nuevo Evento'}
        onClose={() => { setModalOpen(false); setEditEvento(null); }}
        size="lg"
      >
        <EventoForm
          initial={editEvento ?? {}}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditEvento(null); }}
        />
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewEvento} title="Detalle del Evento" onClose={() => setViewEvento(null)} size="md">
        {viewEvento && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge label={viewEvento.categoria} variant={categoryVariant(viewEvento.categoria)} />
              <Badge label={viewEvento.estado}    variant={statusVariant(viewEvento.estado)} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{viewEvento.titulo}</h2>
            {viewEvento.descripcion && <p className="text-sm text-gray-600">{viewEvento.descripcion}</p>}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Fecha y hora</p>
                <p className="font-semibold text-gray-800">{viewEvento.fecha}</p>
                <p className="text-gray-600">{viewEvento.hora} hrs.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Lugar</p>
                <p className="font-semibold text-gray-800">{viewEvento.lugar}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Capacidad</p>
                <p className="font-semibold text-gray-800">{inscripciones.filter(i => i.eventoId === viewEvento.id).length} / {viewEvento.capacidad}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Organizador</p>
                <p className="font-semibold text-gray-800">{viewEvento.organizador}</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/inscripciones"
                className="w-full block text-center bg-purple-700 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-purple-800 transition"
                onClick={() => setViewEvento(null)}
              >
                Gestionar Inscripciones
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        message="Se eliminarán también todas las inscripciones asociadas a este evento. Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
