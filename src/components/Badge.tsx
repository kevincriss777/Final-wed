import { cn } from '../utils/cn';

type Variant = 'purple' | 'green' | 'yellow' | 'red' | 'blue' | 'gray';

const variants: Record<Variant, string> = {
  purple: 'bg-purple-100 text-purple-800 border border-purple-200',
  green:  'bg-green-100  text-green-800  border border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  red:    'bg-red-100    text-red-800    border border-red-200',
  blue:   'bg-blue-100   text-blue-800   border border-blue-200',
  gray:   'bg-gray-100   text-gray-700   border border-gray-200',
};

interface Props {
  label: string;
  variant?: Variant;
  className?: string;
}

export default function Badge({ label, variant = 'purple', className }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {label}
    </span>
  );
}

export function categoryVariant(cat: string): Variant {
  switch (cat) {
    case 'Conferencia': return 'purple';
    case 'Taller':      return 'blue';
    case 'Seminario':   return 'green';
    case 'Académico':   return 'yellow';
    default:            return 'gray';
  }
}

export function statusVariant(st: string): Variant {
  switch (st) {
    case 'Próximo':    return 'blue';
    case 'En curso':   return 'green';
    case 'Finalizado': return 'gray';
    case 'Cancelado':  return 'red';
    default:           return 'gray';
  }
}
