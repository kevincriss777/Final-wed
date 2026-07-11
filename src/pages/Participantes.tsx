import { useState } from 'react';
import { Plus, Search, User, Mail, Hash, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { useApp, Participante } from '../store/AppContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ParticipanteForm from '../components/ParticipanteForm';

const tipoVariant = (tipo: string) => {
  if (tipo === 'Docente')  return 'purple';
  if (tipo === 'Externo')  return 'gray';
  return 'blue';
};

export default function Participantes() {
  const { participantes, inscripciones, addParticipante, updateParticipante, deleteParticipante, getEventosPorParticipante } = useApp();
  const [search, setSearch]               = useState('');
  const [filterTipo, setFilterTipo]       = useState('');
  const [modalOpen, setModalOpen]         = useState(false);
  const [editPart, setEditPart]           = useState<Participante | null>(null);
  const [viewPart, setViewPart]           = useState<Participante | null>(null);
  const [deleteId, setDeleteId]           = useState<string | null>(null);
  const [toast, setToast]                 = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = participantes.filter(p => {
    const q = search.toLowerCase();
    const full = `${p.nombres} ${p.apellidos} ${p.email} ${p.codigo}`.toLowerCase();
    return full.includes(q) && (!filterTipo || p.tipo === filterTipo);
  });

  const handleSave = (data: Omit<Participante, 'id'>) => {
    if (editPart) {
      updateParticipante({ ...data, id: editPart.id });
      showToast('Participante actualizado');
    } else {
      addParticipante(data);
      showToast('Participante registrado');
    }
    setModalOpen(false);
    setEditPart(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteParticipante(deleteId);
      setDeleteId(null);
      showToast('Participante eliminado');
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
          <h1 className="text-2xl font-extrabold text-gray-900">Participantes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{participantes.length} participante{participantes.length !== 1 ? 's' : ''} registrado{participantes.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditPart(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md"
        >
          <Plus size={16} /> Nuevo Participante
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Buscar participantes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-600" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option>Estudiante</option>
          <option>Docente</option>
          <option>Externo</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
          <User size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No se encontraron participantes</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-50 text-left">
                  <th className="px-6 py-3.5 text-xs font-semibold text-purple-800 uppercase tracking-wider">Participante</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-purple-800 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-purple-800 uppercase tracking-wider hidden sm:table-cell">Código</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-purple-800 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-purple-800 uppercase tracking-wider hidden lg:table-cell">Eventos</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-purple-800 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => {
                  const numEventos = inscripciones.filter(i => i.participanteId === p.id).length;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-700 font-bold text-sm">{p.nombres[0]}{p.apellidos[0]}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{p.nombres} {p.apellidos}</p>
                            <p className="text-xs text-gray-500 md:hidden">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        <span className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400" />{p.email}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                        <span className="flex items-center gap-1.5"><Hash size={13} className="text-gray-400" />{p.codigo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge label={p.tipo} variant={tipoVariant(p.tipo) as any} />
                      </td>
                      <td className="px-6 py-4 text-sm hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          <GraduationCap size={14} className="text-purple-500" />
                          {numEventos} evento{numEventos !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewPart(p)} className="p-1.5 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition" title="Ver">
                            <GraduationCap size={15} />
                          </button>
                          <button onClick={() => { setEditPart(p); setModalOpen(true); }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition" title="Editar">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition" title="Eliminar">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editPart ? 'Editar Participante' : 'Nuevo Participante'}
        onClose={() => { setModalOpen(false); setEditPart(null); }}
      >
        <ParticipanteForm
          initial={editPart ?? {}}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditPart(null); }}
        />
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewPart} title="Detalle del Participante" onClose={() => setViewPart(null)} size="sm">
        {viewPart && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-black text-2xl">{viewPart.nombres[0]}{viewPart.apellidos[0]}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{viewPart.nombres} {viewPart.apellidos}</h3>
                <Badge label={viewPart.tipo} variant={tipoVariant(viewPart.tipo) as any} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><Mail size={14} className="text-purple-500" />{viewPart.email}</div>
              <div className="flex items-center gap-2 text-gray-700"><Hash size={14} className="text-purple-500" />Código: {viewPart.codigo}</div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Eventos inscritos</p>
              {getEventosPorParticipante(viewPart.id).length === 0
                ? <p className="text-sm text-gray-400 italic">Sin inscripciones</p>
                : getEventosPorParticipante(viewPart.id).map(ev => (
                  <div key={ev.id} className="text-sm text-gray-700 py-1.5 border-b border-gray-100 last:border-0">{ev.titulo}</div>
                ))
              }
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        message="Se eliminarán también todas sus inscripciones. Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
