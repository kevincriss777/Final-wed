import { useState } from 'react';
import { Evento, EventCategory, EventStatus } from '../store/AppContext';

interface Props {
  initial?: Partial<Evento>;
  onSave: (data: Omit<Evento, 'id'>) => void;
  onCancel: () => void;
}

const categorias: EventCategory[] = ['Conferencia', 'Taller', 'Seminario', 'Académico', 'Otro'];
const estados: EventStatus[]       = ['Próximo', 'En curso', 'Finalizado', 'Cancelado'];

export default function EventoForm({ initial = {}, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    titulo:       initial.titulo       ?? '',
    descripcion:  initial.descripcion  ?? '',
    categoria:    initial.categoria    ?? 'Conferencia' as EventCategory,
    estado:       initial.estado       ?? 'Próximo'     as EventStatus,
    fecha:        initial.fecha        ?? '',
    hora:         initial.hora         ?? '',
    lugar:        initial.lugar        ?? '',
    capacidad:    initial.capacidad    ?? 50,
    organizador:  initial.organizador  ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (key: string, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.titulo.trim())       e.titulo      = 'El título es obligatorio';
    if (!form.fecha)               e.fecha       = 'La fecha es obligatoria';
    if (!form.hora)                e.hora        = 'La hora es obligatoria';
    if (!form.lugar.trim())        e.lugar       = 'El lugar es obligatorio';
    if (!form.organizador.trim())  e.organizador = 'El organizador es obligatorio';
    if (form.capacidad < 1)        e.capacidad   = 'Capacidad mínima: 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ ...form, capacidad: Number(form.capacidad) });
  };

  const inputClass = (key: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
      errors[key] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-400'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
        <input className={inputClass('titulo')} value={form.titulo} onChange={e => field('titulo', e.target.value)} placeholder="Nombre del evento" />
        {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" rows={3} value={form.descripcion} onChange={e => field('descripcion', e.target.value)} placeholder="Describe brevemente el evento..." />
      </div>

      {/* Categoría + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.categoria} onChange={e => field('categoria', e.target.value)}>
            {categorias.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.estado} onChange={e => field('estado', e.target.value)}>
            {estados.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Fecha + Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
          <input type="date" className={inputClass('fecha')} value={form.fecha} onChange={e => field('fecha', e.target.value)} />
          {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
          <input type="time" className={inputClass('hora')} value={form.hora} onChange={e => field('hora', e.target.value)} />
          {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
        </div>
      </div>

      {/* Lugar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lugar *</label>
        <input className={inputClass('lugar')} value={form.lugar} onChange={e => field('lugar', e.target.value)} placeholder="Auditorio, aula, sala..." />
        {errors.lugar && <p className="text-red-500 text-xs mt-1">{errors.lugar}</p>}
      </div>

      {/* Capacidad + Organizador */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
          <input type="number" min={1} className={inputClass('capacidad')} value={form.capacidad} onChange={e => field('capacidad', e.target.value)} />
          {errors.capacidad && <p className="text-red-500 text-xs mt-1">{errors.capacidad}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organizador *</label>
          <input className={inputClass('organizador')} value={form.organizador} onChange={e => field('organizador', e.target.value)} placeholder="Facultad / área" />
          {errors.organizador && <p className="text-red-500 text-xs mt-1">{errors.organizador}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button type="submit" className="flex-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg py-2 text-sm font-medium transition shadow-sm">
          Guardar Evento
        </button>
      </div>
    </form>
  );
}
