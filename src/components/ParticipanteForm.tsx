import { useState } from 'react';
import { Participante } from '../store/AppContext';

interface Props {
  initial?: Partial<Participante>;
  onSave: (data: Omit<Participante, 'id'>) => void;
  onCancel: () => void;
}

export default function ParticipanteForm({ initial = {}, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    nombres:   initial.nombres   ?? '',
    apellidos: initial.apellidos ?? '',
    email:     initial.email     ?? '',
    codigo:    initial.codigo    ?? '',
    tipo:      initial.tipo      ?? 'Estudiante' as Participante['tipo'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (key: string, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombres.trim())   e.nombres   = 'Los nombres son obligatorios';
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios';
    if (!form.email.trim())     e.email     = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.codigo.trim())    e.codigo    = 'El código es obligatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const inputClass = (key: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
      errors[key] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-400'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
          <input className={inputClass('nombres')} value={form.nombres} onChange={e => field('nombres', e.target.value)} placeholder="Nombres" />
          {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
          <input className={inputClass('apellidos')} value={form.apellidos} onChange={e => field('apellidos', e.target.value)} placeholder="Apellidos" />
          {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
        <input type="email" className={inputClass('email')} value={form.email} onChange={e => field('email', e.target.value)} placeholder="correo@continental.edu.pe" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <input className={inputClass('codigo')} value={form.codigo} onChange={e => field('codigo', e.target.value)} placeholder="U20210001" />
          {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.tipo} onChange={e => field('tipo', e.target.value)}>
            <option>Estudiante</option>
            <option>Docente</option>
            <option>Externo</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button type="submit" className="flex-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg py-2 text-sm font-medium transition shadow-sm">
          Guardar
        </button>
      </div>
    </form>
  );
}
