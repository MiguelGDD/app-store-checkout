import { colors } from '../theme';
import type { FlowStep, Metric, Product } from '../types';

export const products: Product[] = [
  {
    id: 'adaptive-bag',
    name: 'Bolso adaptable',
    description: 'Listo para cabina, con secciones acolchadas y una cubierta resistente al clima.',
    price: 189000,
    stock: 7,
    badge: 'Destacado',
    accent: colors.primary,
  },
  {
    id: 'travel-pouch',
    name: 'Estuche de viaje',
    description: 'Organizador compacto para cables, tarjetas y esas piezas pequenas que se pierden.',
    price: 98000,
    stock: 12,
    badge: 'Nuevo',
    accent: colors.secondary,
  },
  {
    id: 'noise-buds',
    name: 'Auriculares silenciosos',
    description: 'Auriculares livianos con un perfil suave para jornadas largas de trabajo.',
    price: 242000,
    stock: 5,
    badge: 'Popular',
    accent: colors.info,
  },
  {
    id: 'laptop-sleeve',
    name: 'Funda para portatil',
    description: 'Funda con forro suave, pensada para el uso diario y revisiones rapidas.',
    price: 132000,
    stock: 9,
    badge: 'Esencial',
    accent: colors.warning,
  },
  {
    id: 'daily-tote',
    name: 'Tote diario',
    description: 'Bolso minimalista con asas reforzadas y una silueta limpia.',
    price: 89000,
    stock: 14,
    badge: 'Recomendado',
    accent: colors.success,
  },
];

export const metrics: Metric[] = [
  {
    label: 'Pantallas',
    value: '5',
    description: 'Inicio, catalogo, carrito, pago y confirmacion.',
  },
  {
    label: 'Estado',
    value: 'Listo para Redux',
    description: 'Las slices y el almacenamiento seguro de transacciones ya estan conectados.',
  },
  {
    label: 'Diseno',
    value: 'Responsivo',
    description: 'Pensado primero para pantallas compactas y listo para escalar en tamanos mayores.',
  },
];

export const flowSteps: FlowStep[] = [
  {
    title: 'Base',
    description: 'Abre la base de la app y revisa el layout responsivo.',
  },
  {
    title: 'Catalogo',
    description: 'Explora productos y salta a la pantalla de detalle.',
  },
  {
    title: 'Detalle',
    description: 'Inspecciona el producto seleccionado antes de agregarlo.',
  },
  {
    title: 'Carrito',
    description: 'Revisa cantidades y totales antes del pago.',
  },
  {
    title: 'Pago',
    description: 'Crea la transaccion pendiente y confirma el estado del pago.',
  },
  {
    title: 'Resultado',
    description: 'Muestra el resultado final de la transaccion en la pantalla de resultado.',
  },
];

export const featuredProductId = 'adaptive-bag';
