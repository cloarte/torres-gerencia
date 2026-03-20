export const kpiCards = [
  { label: "Ventas Hoy", value: "S/ 12,480", change: "+8.2%", trend: "up" as const },
  { label: "Pedidos Pendientes", value: "14", change: "3 urgentes", trend: "warning" as const },
  { label: "Gastos del Mes", value: "S/ 34,200", change: "-2.1%", trend: "down" as const },
  { label: "Productos Vencidos", value: "7", change: "Acción requerida", trend: "danger" as const },
];

export const ventasSemana = [
  { dia: "Lun", ventas: 8200, meta: 9000 },
  { dia: "Mar", ventas: 9400, meta: 9000 },
  { dia: "Mié", ventas: 7800, meta: 9000 },
  { dia: "Jue", ventas: 11200, meta: 9000 },
  { dia: "Vie", ventas: 12480, meta: 9000 },
  { dia: "Sáb", ventas: 14300, meta: 9000 },
  { dia: "Dom", ventas: 6700, meta: 9000 },
];

export const ventasPorCategoria = [
  { categoria: "Pan Molde", porcentaje: 35, monto: "S/ 24,500" },
  { categoria: "Bollería", porcentaje: 25, monto: "S/ 17,500" },
  { categoria: "Pastelería", porcentaje: 20, monto: "S/ 14,000" },
  { categoria: "Pan Artesanal", porcentaje: 12, monto: "S/ 8,400" },
  { categoria: "Otros", porcentaje: 8, monto: "S/ 5,600" },
];

export const pedidosRecientes = [
  { id: "PED-1042", cliente: "Supermercados Metro", monto: "S/ 3,250", estado: "confirmado" },
  { id: "PED-1041", cliente: "Wong Cencosud", monto: "S/ 2,800", estado: "pendiente" },
  { id: "PED-1040", cliente: "Bodega Santa Rosa", monto: "S/ 480", estado: "entregado" },
  { id: "PED-1039", cliente: "Minimarket El Sol", monto: "S/ 1,120", estado: "pendiente" },
  { id: "PED-1038", cliente: "Tiendas Mass", monto: "S/ 5,600", estado: "confirmado" },
];

export const gastosAprobacion = [
  { id: "GAS-087", concepto: "Harina especial x 50 sacos", monto: "S/ 4,200", solicitante: "Carlos Mendoza" },
  { id: "GAS-086", concepto: "Mantenimiento horno #3", monto: "S/ 1,850", solicitante: "Ana Quispe" },
];
