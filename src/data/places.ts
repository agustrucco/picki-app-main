// src/data/places.ts
export interface Place {
  id: number;
  name: string;
  pos: [number, number];
  tag: "Sin TACC" | "Vegano" | "Certificado" | "Opciones";
  type: "Restaurante" | "Cafetería";
  img: string;
  rating: number;
  price: number; // 1 (Económico) a 5 (Lujo)
  distance: string; 
  info: string;
  barrio: string;
}

export const restaurantsData: Place[] = [
  // ==========================================
  // 🔥 RESTAURANTES (11)
  // ==========================================
  { id: 1, name: "Don Julio", pos: [-34.5863, -58.4244], tag: "Certificado", type: "Restaurante", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", rating: 4.9, price: 5, distance: "150m", info: "La mejor parrilla de Buenos Aires", barrio: "Palermo" },
  { id: 2, name: "Guerrín", pos: [-34.6041, -58.3859], tag: "Opciones", type: "Restaurante", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", rating: 4.8, price: 2, distance: "3.2km", info: "Pizza al molde histórica", barrio: "Centro" },
  { id: 3, name: "Sintaxis", pos: [-34.5845, -58.4395], tag: "Sin TACC", type: "Restaurante", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", rating: 4.8, price: 3, distance: "600m", info: "100% libre de gluten", barrio: "Palermo" },
  { id: 4, name: "El Preferido", pos: [-34.5852, -58.4239], tag: "Certificado", type: "Restaurante", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", rating: 4.7, price: 4, distance: "200m", info: "Bodegón de culto palermitano", barrio: "Palermo" },
  { id: 5, name: "Sacro", pos: [-34.5857, -58.4344], tag: "Vegano", type: "Restaurante", img: "https://images.unsplash.com/photo-1540914124281-342d8df481fe?w=400", rating: 4.8, price: 5, distance: "450m", info: "Alta cocina plant-based", barrio: "Palermo" },
  { id: 6, name: "Chuí", pos: [-34.5882, -58.4465], tag: "Vegano", type: "Restaurante", img: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=400", rating: 4.7, price: 4, distance: "1.1km", info: "Jardín gastronómico increíble", barrio: "Villa Crespo" },
  { id: 7, name: "Anchoita", pos: [-34.5843, -58.4447], tag: "Certificado", type: "Restaurante", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", rating: 4.9, price: 5, distance: "950m", info: "Cocina de autor impecable", barrio: "Chacarita" },
  { id: 8, name: "Sarkis", pos: [-34.5909, -58.4357], tag: "Opciones", type: "Restaurante", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", rating: 4.9, price: 2, distance: "1.5km", info: "El clásico armenio imbatible", barrio: "Palermo" },
  { id: 9, name: "Hierbabuena", pos: [-34.6262, -58.3712], tag: "Vegano", type: "Restaurante", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", rating: 4.6, price: 3, distance: "4.5km", info: "Healthy food en San Telmo", barrio: "San Telmo" },
  { id: 10, name: "Cucina Paradiso", pos: [-34.5614, -58.4542], tag: "Sin TACC", type: "Restaurante", img: "https://images.unsplash.com/photo-1473093226795-af9932fe5855?w=400", rating: 4.7, price: 4, distance: "3.1km", info: "Pastas frescas de Donato", barrio: "Belgrano" },
  { id: 11, name: "Fervor", pos: [-34.5891, -58.3885], tag: "Certificado", type: "Restaurante", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", rating: 4.7, price: 5, distance: "3.5km", info: "Brasas y mariscos", barrio: "Recoleta" },

  // ==========================================
  // ☕ CAFETERÍAS (11)
  // ==========================================
  { id: 50, name: "Lattente", pos: [-34.5887, -58.4315], tag: "Opciones", type: "Cafetería", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", rating: 4.8, price: 2, distance: "400m", info: "Café de especialidad puro", barrio: "Palermo" },
  { id: 51, name: "Cuervo Café", pos: [-34.5835, -58.4475], tag: "Vegano", type: "Cafetería", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", rating: 4.7, price: 2, distance: "1.2km", info: "Vibe increíble en Chacarita", barrio: "Chacarita" },
  { id: 52, name: "Gout Gluten Free", pos: [-34.5905, -58.3912], tag: "Sin TACC", type: "Cafetería", img: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400", rating: 4.9, price: 3, distance: "2.5km", info: "Pastelería 100% segura", barrio: "Recoleta" },
  { id: 53, name: "Surry Hills", pos: [-34.5865, -58.4322], tag: "Sin TACC", type: "Cafetería", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400", rating: 4.7, price: 3, distance: "300m", info: "Brunch estilo Sydney", barrio: "Palermo" },
  { id: 54, name: "Lab Tostadores", pos: [-34.5812, -58.4342], tag: "Opciones", type: "Cafetería", img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400", rating: 4.8, price: 2, distance: "600m", info: "Laboratorio de café", barrio: "Palermo" },
  { id: 55, name: "All Saints", pos: [-34.5562, -58.4525], tag: "Certificado", type: "Cafetería", img: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400", rating: 4.6, price: 3, distance: "3.8km", info: "Tostadores expertos", barrio: "Belgrano" },
  { id: 56, name: "Cigalia", pos: [-34.5925, -58.3955], tag: "Opciones", type: "Cafetería", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", rating: 4.5, price: 2, distance: "2.8km", info: "Café y ciclismo", barrio: "Recoleta" },
  { id: 57, name: "Usina Cafetera", pos: [-34.5818, -58.4355], tag: "Opciones", type: "Cafetería", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400", rating: 4.6, price: 2, distance: "850m", info: "Meriendas de otro planeta", barrio: "Villa Crespo" },
  { id: 58, name: "Full City Coffee", pos: [-34.5855, -58.4312], tag: "Certificado", type: "Cafetería", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400", rating: 4.7, price: 2, distance: "450m", info: "Grano colombiano premium", barrio: "Palermo" },
  { id: 59, name: "Birkin", pos: [-34.5831, -58.4112], tag: "Opciones", type: "Cafetería", img: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400", rating: 4.5, price: 3, distance: "1.9km", info: "El café más chic de la zona", barrio: "Palermo" },
  { id: 60, name: "Öss Kaffe", pos: [-34.5502, -58.4485], tag: "Opciones", type: "Cafetería", img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400", rating: 4.9, price: 3, distance: "4.2km", info: "La joya oculta de Belgrano", barrio: "Belgrano" }
];