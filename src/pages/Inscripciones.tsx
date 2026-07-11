import { useState } from 'react';
import { BookOpen, Search, Plus, UserCheck, Trash2, CalendarDays, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Badge, { categoryVariant, statusVariant } from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Inscripciones() {
  const { eventos, participantes, inscripciones, addInscripcion, deleteInscripcion, getInscriptosPorEvento } = useApp();
  const [search, setSearch]           = useState('');
  const [selectedEvento, setSelectedEvento] = useState('');
  const [selectedPart, setSelectedPart]     = useState('');
  const [modalOpen, setModalOpen]           = useState(false);
  const [deleteId, setDeleteId]             = useState<string | null>(null);
  const [toast, setToast]                   = useState('');
  const [toastError, setToastError]         = useState('');
  const [expanded, setExpanded]             = useState<string | null>(null);

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setToastError(msg);
      setTimeout(() => setToastError(''), 3500);
    } else {
      setToast(msg);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleInscribir = () => {
    if (!selectedEvento || !selectedPart) {
      showToast('Selecciona un evento y un participante', true);
      return;
    }
    const ok = addInscripcion(selectedEvento, selectedPart);
    if (ok) {
      showToast('Inscripción realizada con éxito');
      setModalOpen(false);
      setSelectedEvento('');
      setSelectedPart('');
    } else {
      showToast('El participante ya está inscrito o el evento está lleno', true);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteInscripcion(deleteId);
      setDeleteId(null);
      showToast('Inscripción cancelada');
    }
  };

  // Filtrar eventos que tienen al menos algo o mostrar todos
  const filteredEventos = eventos.filter(ev => {
    const q = search.toLowerCase();
    return ev.titulo.toLowerCase().includes(q) || ev.lugar.toLowerCase().includes(q);
  });

  // Participantes no inscritos en el evento seleccionado para el modal
  const partNoInscritos = selectedEvento
    ? participantes.filter(p => !inscripciones.some(i => i.eventoId === selectedEvento && i.participanteId === p.id))
    : participantes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Toasts */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-purple-700 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}
      {toastError && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-fadeIn">
          {toastError}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inscripciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">{inscripciones.length} inscripción{inscripciones.length !== 1 ? 'es' : ''} en total</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md"
        >
          <Plus size={16} /> Nueva Inscripción
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-purple-700">{eventos.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Eventos</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-purple-700">{participantes.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Participantes</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-purple-700">{inscripciones.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Inscripciones</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Buscar eventos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Accordion by event */}
      <div className="space-y-3">
        {filteredEventos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No se encontraron eventos</p>
          </div>
        ) : (
          filteredEventos.map(ev => {
            const inscritos = getInscriptosPorEvento(ev.id);
            const isOpen    = expanded === ev.id;
            return (
              <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Event header */}
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-purple-50 transition text-left"
                  onClick={() => setExpanded(isOpen ? null : ev.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={18} className="text-purple-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="font-bold text-gray-900 text-sm">{ev.titulo}</p>
                      <Badge label={ev.categoria} variant={categoryVariant(ev.categoria)} />
                      <Badge label={ev.estado}    variant={statusVariant(ev.estado)} />
                    </div>
                    <p className="text-xs text-gray-500">{ev.fecha} · {ev.lugar}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                      <Users size={14} />
                      <span>{inscritos.length} / {ev.capacidad}</span>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </button>

                {/* Inscritos list */}
                {isOpen && (
                  <div className="border-t border-gray-100 animate-fadeIn">
                    {inscritos.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-400">
                        <UserCheck size={28} className="mx-auto mb-2 opacity-40" />
                        Sin inscritos aún
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {inscritos.map(p => {
                          const inscripcion = inscripciones.find(i => i.eventoId === ev.id && i.participanteId === p.id);
                          return (
                            <div key={p.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-700 font-bold text-xs">{p.nombres[0]}{p.apellidos[0]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">{p.nombres} {p.apellidos}</p>
                                <p className="text-xs text-gray-500">{p.email} · {p.tipo}</p>
                              </div>
                              <div className="text-xs text-gray-400 hidden sm:block">
                                Inscrito: {inscripcion?.fechaInscripcion}
                              </div>
                              <button
                                onClick={() => setDeleteId(inscripcion?.id ?? '')}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition ml-2"
                                title="Cancelar inscripción"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Inscription Modal */}
      <Modal open={modalOpen} title="Nueva Inscripción" onClose={() => { setModalOpen(false); setSelectedEvento(''); setSelectedPart(''); }}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Evento *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={selectedEvento}
              onChange={e => { setSelectedEvento(e.target.value); setSelectedPart(''); }}
            >
              <option value="">-- Elige un evento --</option>
              {eventos.map(ev => {
                const ocupados = inscripciones.filter(i => i.eventoId === ev.id).length;
                const lleno = ocupados >= ev.capacidad;
                return (
                  <option key={ev.id} value={ev.id} disabled={lleno}>
                    {ev.titulo} ({ocupados}/{ev.capacidad}){lleno ? ' – LLENO' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Participante *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={selectedPart}
              onChange={e => setSelectedPart(e.target.value)}
            >
              <option value="">-- Elige un participante --</option>
              {partNoInscritos.map(p => (
                <option key={p.id} value={p.id}>{p.nombres} {p.apellidos} ({p.tipo})</option>
              ))}
            </select>
            {selectedEvento && partNoInscritos.length === 0 && (
              <p className="text-xs text-orange-600 mt-1">Todos los participantes ya están inscritos en este evento.</p>
            )}
          </div>

          {selectedEvento && selectedPart && (
            <div className="bg-purple-50 rounded-xl p-4 text-sm">
              <p className="font-semibold text-purple-800 mb-1">Resumen</p>
              <p className="text-purple-700"><span className="font-medium">Evento:</span> {eventos.find(e => e.id === selectedEvento)?.titulo}</p>
              <p className="text-purple-700"><span className="font-medium">Participante:</span> {participantes.find(p => p.id === selectedPart)?.nombres} {participantes.find(p => p.id === selectedPart)?.apellidos}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={() => { setModalOpen(false); setSelectedEvento(''); setSelectedPart(''); }} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button onClick={handleInscribir} className="flex-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg py-2 text-sm font-medium transition shadow-sm">
              Inscribir
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        message="¿Deseas cancelar esta inscripción? El participante perderá su lugar en el evento."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
