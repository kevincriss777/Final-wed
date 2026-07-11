import { createContext, useContext, useState, ReactNode } from 'react';

export type EventCategory = 'Conferencia' | 'Taller' | 'Seminario' | 'Académico' | 'Otro';
export type EventStatus   = 'Próximo' | 'En curso' | 'Finalizado' | 'Cancelado';

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: EventCategory;
  estado: EventStatus;
  fecha: string;
  hora: string;
  lugar: string;
  capacidad: number;
  imagen?: string;
  organizador: string;
}

export interface Participante {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  codigo: string;
  tipo: 'Estudiante' | 'Docente' | 'Externo';
}

export interface Inscripcion {
  id: string;
  eventoId: string;
  participanteId: string;
  fechaInscripcion: string;
}

interface AppContextType {
  eventos: Evento[];
  participantes: Participante[];
  inscripciones: Inscripcion[];
  addEvento: (e: Omit<Evento, 'id'>) => void;
  updateEvento: (e: Evento) => void;
  deleteEvento: (id: string) => void;
  addParticipante: (p: Omit<Participante, 'id'>) => void;
  updateParticipante: (p: Participante) => void;
  deleteParticipante: (id: string) => void;
  addInscripcion: (eventoId: string, participanteId: string) => boolean;
  deleteInscripcion: (id: string) => void;
  getInscriptosPorEvento: (eventoId: string) => Participante[];
  getEventosPorParticipante: (participanteId: string) => Evento[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const uid = () => Math.random().toString(36).slice(2, 9);

const EVENTOS_INICIALES: Evento[] = [
  {
    id: uid(),
    titulo: 'Congreso Internacional de Ingeniería',
    descripcion: 'Espacio para compartir avances en ingeniería de sistemas, civil y mecánica con ponentes nacionales e internacionales.',
    categoria: 'Conferencia',
    estado: 'Próximo',
    fecha: '2025-08-15',
    hora: '09:00',
    lugar: 'Auditorio Principal – Campus Huancayo',
    capacidad: 300,
    organizador: 'Fac. de Ingeniería',
  },
  {
    id: uid(),
    titulo: 'Taller de React Avanzado',
    descripcion: 'Aprende hooks, context, testing y buenas prácticas en React con expertos de la industria.',
    categoria: 'Taller',
    estado: 'Próximo',
    fecha: '2025-07-28',
    hora: '14:00',
    lugar: 'Lab. de Cómputo 3 – Pabellón C',
    capacidad: 40,
    organizador: 'Sistemas de Información',
  },
  {
    id: uid(),
    titulo: 'Seminario de Emprendimiento Universitario',
    descripcion: 'Casos de éxito y metodologías ágiles para emprender desde la universidad.',
    categoria: 'Seminario',
    estado: 'En curso',
    fecha: '2025-07-20',
    hora: '10:00',
    lugar: 'Sala de Conferencias – Edificio A',
    capacidad: 80,
    organizador: 'Centro de Emprendimiento UC',
  },
  {
    id: uid(),
    titulo: 'Jornada Académica de Investigación',
    descripcion: 'Presentación de proyectos de investigación de pre y posgrado.',
    categoria: 'Académico',
    estado: 'Finalizado',
    fecha: '2025-06-10',
    hora: '08:00',
    lugar: 'Pabellón de Ciencias',
    capacidad: 150,
    organizador: 'Dirección de Investigación',
  },
];

const PARTICIPANTES_INICIALES: Participante[] = [
  { id: uid(), nombres: 'María', apellidos: 'García López', email: 'maria.garcia@continental.edu.pe', codigo: 'U20210001', tipo: 'Estudiante' },
  { id: uid(), nombres: 'Carlos', apellidos: 'Ríos Huamán', email: 'carlos.rios@continental.edu.pe', codigo: 'U20190045', tipo: 'Estudiante' },
  { id: uid(), nombres: 'Dr. Pedro', apellidos: 'Vargas Mendoza', email: 'p.vargas@continental.edu.pe', codigo: 'D001', tipo: 'Docente' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIALES);
  const [participantes, setParticipantes] = useState<Participante[]>(PARTICIPANTES_INICIALES);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  const addEvento = (e: Omit<Evento, 'id'>) =>
    setEventos(prev => [...prev, { ...e, id: uid() }]);

  const updateEvento = (e: Evento) =>
    setEventos(prev => prev.map(ev => ev.id === e.id ? e : ev));

  const deleteEvento = (id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id));
    setInscripciones(prev => prev.filter(i => i.eventoId !== id));
  };

  const addParticipante = (p: Omit<Participante, 'id'>) =>
    setParticipantes(prev => [...prev, { ...p, id: uid() }]);

  const updateParticipante = (p: Participante) =>
    setParticipantes(prev => prev.map(pa => pa.id === p.id ? p : pa));

  const deleteParticipante = (id: string) => {
    setParticipantes(prev => prev.filter(p => p.id !== id));
    setInscripciones(prev => prev.filter(i => i.participanteId !== id));
  };

  const addInscripcion = (eventoId: string, participanteId: string): boolean => {
    const existe = inscripciones.some(i => i.eventoId === eventoId && i.participanteId === participanteId);
    if (existe) return false;
    const evento = eventos.find(e => e.id === eventoId);
    const inscritos = inscripciones.filter(i => i.eventoId === eventoId).length;
    if (evento && inscritos >= evento.capacidad) return false;
    setInscripciones(prev => [...prev, {
      id: uid(),
      eventoId,
      participanteId,
      fechaInscripcion: new Date().toISOString().split('T')[0],
    }]);
    return true;
  };

  const deleteInscripcion = (id: string) =>
    setInscripciones(prev => prev.filter(i => i.id !== id));

  const getInscriptosPorEvento = (eventoId: string): Participante[] => {
    const ids = inscripciones.filter(i => i.eventoId === eventoId).map(i => i.participanteId);
    return participantes.filter(p => ids.includes(p.id));
  };

  const getEventosPorParticipante = (participanteId: string): Evento[] => {
    const ids = inscripciones.filter(i => i.participanteId === participanteId).map(i => i.eventoId);
    return eventos.filter(e => ids.includes(e.id));
  };

  return (
    <AppContext.Provider value={{
      eventos, participantes, inscripciones,
      addEvento, updateEvento, deleteEvento,
      addParticipante, updateParticipante, deleteParticipante,
      addInscripcion, deleteInscripcion,
      getInscriptosPorEvento, getEventosPorParticipante,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
