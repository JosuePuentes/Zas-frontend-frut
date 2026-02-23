export interface MateriaPrima {
  _id: string;
  nombre: string;
  cantidad_total: number;
  costo_por_unidad: number;
  unidad_medida: string;
  stock_minimo: number;
  fecha_ingreso?: string;
  es_desechable?: boolean;
}

export interface IngredienteReceta {
  materia_prima_id: string;
  cantidad_gramos: number;
}

export interface Receta {
  _id: string;
  nombre_batido: string;
  ingredientes: IngredienteReceta[];
  precio_sugerido: number;
}

export interface BatidoDisponible {
  recipe_id: string;
  nombre_batido: string;
  stock_dosis: number;
  producibles_con_materia_prima: number;
  total_disponible: number;
  precio_sugerido: number;
}

export interface ItemVenta {
  recipe_id: string;
  nombre_batido: string;
  cantidad: number;
  precio_unitario: number;
  extras: { materia_prima_id: string; nombre: string; cantidad: number; precio_extra: number }[];
  costo_envase: number;
  envase_items: { materia_prima_id: string; cantidad: number }[];
}
