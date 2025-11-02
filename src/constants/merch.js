export const MERCH_CATEGORIES = [
  { id: "todos", label: "Todos", descripcion: "Ver todo el catalogo" },
  { id: "ropa", label: "Ropa", descripcion: "Remeras, buzos y otras prendas" },
  { id: "accesorios", label: "Accesorios", descripcion: "Gorras, pines y tote bags" },
  { id: "posters", label: "Posters", descripcion: "Arte oficial para tus espacios" },
  { id: "musica", label: "Musica", descripcion: "Vinilos, cassettes y CD" },
];

export const MERCH_PRODUCTS = [
  {
    _id: "676c0a2b21f1b1e0aa001101",
    slug: "remera-logo-pinkmuse",
    nombre: "REMERA LOGO PINKMUSE",
    resumen: "Remera de algodon premium con el logo bordado en relieve.",
    descripcion: `Remera confeccionada en algodon peruano de 200 gramos, con costuras reforzadas y un fit unisex. El logo oficial de PinkMuse se encuentra bordado en relieve con hilo rojo sobre el pecho. Incluye etiqueta interior impresa para mayor comodidad y un acabado anti-desteñido para extender su vida util.`,
    imagenPrincipal: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=1200&q=80",
    precio: 28999,
    estado: "Activo",
    categoria: "ropa",
    tipo: "remera",
    etiquetas: ["algodon premium", "unisex"],
    habilitarAcciones: "si",
    habilitarComentarios: true,
    stock: {
      total: 72,
      detalles: [
        {
          id: "REM-LOGO-NEGRO-S",
          cantidad: 6,
          atributos: [
            { nombre: "Color", valor: "Negro", colores: ["#111827"] },
            { nombre: "Talle", valor: "S" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "REM-LOGO-NEGRO-M",
          cantidad: 12,
          atributos: [
            { nombre: "Color", valor: "Negro", colores: ["#111827"] },
            { nombre: "Talle", valor: "M" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "REM-LOGO-NEGRO-L",
          cantidad: 12,
          atributos: [
            { nombre: "Color", valor: "Negro", colores: ["#111827"] },
            { nombre: "Talle", valor: "L" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "REM-LOGO-NEGRO-XL",
          cantidad: 12,
          atributos: [
            { nombre: "Color", valor: "Negro", colores: ["#111827"] },
            { nombre: "Talle", valor: "XL" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "REM-LOGO-BLANCO-M",
          cantidad: 15,
          atributos: [
            { nombre: "Color", valor: "Blanco", colores: ["#e2e8f0"] },
            { nombre: "Talle", valor: "M" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "REM-LOGO-BLANCO-L",
          cantidad: 15,
          atributos: [
            { nombre: "Color", valor: "Blanco", colores: ["#e2e8f0"] },
            { nombre: "Talle", valor: "L" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
          ],
        },
      ],
    },
  },
  {
    _id: "676c0a2b21f1b1e0aa001102",
    slug: "buzo-tour-2025",
    nombre: "BUZO TOUR 2025",
    resumen: "Buzo oversize con estampado frontal y listado de fechas en la espalda.",
    descripcion: `Buzo de friza liviana con interior perchado y terminaciones en rib elastico. El frente incluye una serigrafia de alta definicion con la grafica del tour 2025 mientras que la espalda lista todas las fechas del tour mundial. Disponible en tres colores con tintas solidas resistentes al lavado.`,
    imagenPrincipal: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
    precio: 46999,
    estado: "Activo",
    categoria: "ropa",
    tipo: "buzo",
    etiquetas: ["tour oficial", "edicion limitada"],
    habilitarAcciones: "si",
    habilitarComentarios: true,
    stock: {
      total: 54,
      detalles: [
        {
          id: "BUZO-TOUR-BURDEO-M",
          cantidad: 12,
          atributos: [
            { nombre: "Color", valor: "Burdeo", colores: ["#7f1d1d"] },
            { nombre: "Talle", valor: "M" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "BUZO-TOUR-BURDEO-L",
          cantidad: 12,
          atributos: [
            { nombre: "Color", valor: "Burdeo", colores: ["#7f1d1d"] },
            { nombre: "Talle", valor: "L" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "BUZO-TOUR-GRIS-M",
          cantidad: 10,
          atributos: [
            { nombre: "Color", valor: "Gris hielo", colores: ["#cbd5f5"] },
            { nombre: "Talle", valor: "M" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1610381969949-7d3c229a4bda?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "BUZO-TOUR-GRIS-L",
          cantidad: 8,
          atributos: [
            { nombre: "Color", valor: "Gris hielo", colores: ["#cbd5f5"] },
            { nombre: "Talle", valor: "L" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1610381969949-7d3c229a4bda?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "BUZO-TOUR-NAVY-S",
          cantidad: 6,
          atributos: [
            { nombre: "Color", valor: "Azul noche", colores: ["#1e293b"] },
            { nombre: "Talle", valor: "S" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1542293787938-4d2226c623f2?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "BUZO-TOUR-NAVY-M",
          cantidad: 6,
          atributos: [
            { nombre: "Color", valor: "Azul noche", colores: ["#1e293b"] },
            { nombre: "Talle", valor: "M" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1542293787938-4d2226c623f2?auto=format&fit=crop&w=800&q=80",
          ],
        },
      ],
    },
  },
  {
    _id: "676c0a2b21f1b1e0aa001103",
    slug: "gorra-curva-logo",
    nombre: "GORRA CURVA LOGO",
    resumen: "Gorra de paneles con logo bordado y correa regulable metálica.",
    descripcion: `Gorra de sarga premium con seis paneles y visera curva. El logo de PinkMuse se borda en relieve sobre el frente y se suma un bordado lateral con el icono de la banda. Incluye banda interior absorbente y ojalillos metalicos para ventilacion.`,
    imagenPrincipal: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    precio: 21999,
    estado: "Activo",
    categoria: "accesorios",
    tipo: "gorra",
    etiquetas: ["ajustable", "bordado"],
    habilitarAcciones: "si",
    habilitarComentarios: true,
    stock: {
      total: 30,
      detalles: [
        {
          id: "GORRA-LOGO-NEGRO",
          cantidad: 15,
          atributos: [
            { nombre: "Color", valor: "Negro", colores: ["#0f172a"] },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "GORRA-LOGO-VINO",
          cantidad: 10,
          atributos: [
            { nombre: "Color", valor: "Vino", colores: ["#991b1b"] },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1556302338-70784c6ab91f?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "GORRA-LOGO-GRIS",
          cantidad: 5,
          atributos: [
            { nombre: "Color", valor: "Gris topo", colores: ["#475569"] },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
          ],
        },
      ],
    },
  },
  {
    _id: "676c0a2b21f1b1e0aa001104",
    slug: "poster-tour-neon",
    nombre: "POSTER TOUR NEON",
    resumen: "Poster impreso en papel couché 300 gr con barniz sectorizado.",
    descripcion: `Poster coleccionable de la gira Neon Dreams con arte ilustrado por @visualbeats. Se imprime en papel couche 300 gramos a cuatro tintas, con barniz sectorizado sobre el logo y numeracion manual. Incluye tubo protector y certificado de autenticidad.`,
    imagenPrincipal: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    precio: 18999,
    estado: "Activo",
    categoria: "posters",
    tipo: "poster",
    etiquetas: ["edicion numerada", "arte oficial"],
    habilitarAcciones: "si",
    habilitarComentarios: true,
    stock: {
      total: 80,
      detalles: [
        {
          id: "POSTER-NEON-50x70",
          cantidad: 50,
          atributos: [
            { nombre: "Dimension", valor: "50 x 70 cm" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "POSTER-NEON-30x40",
          cantidad: 30,
          atributos: [
            { nombre: "Dimension", valor: "30 x 40 cm" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
          ],
        },
      ],
    },
  },
  {
    _id: "676c0a2b21f1b1e0aa001105",
    slug: "vinilo-edicion-deluxe",
    nombre: "VINILO EDICION DELUXE",
    resumen: "Vinilo doble de 180 gr con version extendida y booklet de 32 paginas.",
    descripcion: `Version deluxe del ultimo album de PinkMuse en doble vinilo de 180 gramos masterizado en Abbey Road. Incluye pistas ineditas, booklet de 32 paginas con letras y fotos del estudio, mas poster plegable y tarjeta para descarga digital en alta resolucion.`,
    imagenPrincipal: "https://images.unsplash.com/photo-1619983081593-ec3b35790302?auto=format&fit=crop&w=1200&q=80",
    precio: 54999,
    estado: "Activo",
    categoria: "musica",
    tipo: "vinilo",
    etiquetas: ["doble LP", "edicion deluxe"],
    habilitarAcciones: "si",
    habilitarComentarios: true,
    stock: {
      total: 120,
      detalles: [
        {
          id: "VIN-DELUXE-ROJO",
          cantidad: 60,
          atributos: [
            { nombre: "Color del vinilo", valor: "Rojo translucido" },
            { nombre: "Formato", valor: "LP 12 pulgadas" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1619983081593-ec3b35790302?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "VIN-DELUXE-NEGRO",
          cantidad: 60,
          atributos: [
            { nombre: "Color del vinilo", valor: "Negro clasico" },
            { nombre: "Formato", valor: "LP 12 pulgadas" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1619983081593-ec3b35790302?auto=format&fit=crop&w=800&q=80",
          ],
        },
      ],
    },
  },
  {
    _id: "676c0a2b21f1b1e0aa001106",
    slug: "tote-bag-sintonia",
    nombre: "TOTE BAG SINTONIA",
    resumen: "Bolso tote reutilizable de lona gruesa con serigrafia a dos colores.",
    descripcion: `Tote bag confeccionado en lona 100 por 100 algodon reciclado. Posee costuras reforzadas, bolsillo interior para telefono y asas extra largas. La grafica se imprime con tintas al agua resistentes al lavado.`,
    imagenPrincipal: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=1200&q=80",
    precio: 16499,
    estado: "Activo",
    categoria: "accesorios",
    tipo: "tote bag",
    etiquetas: ["eco friendly", "reutilizable"],
    habilitarAcciones: "si",
    habilitarComentarios: true,
    stock: {
      total: 40,
      detalles: [
        {
          id: "TOTE-SIN-CRUDO",
          cantidad: 20,
          atributos: [
            { nombre: "Color", valor: "Crudo" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=800&q=80",
          ],
        },
        {
          id: "TOTE-SIN-NEGRO",
          cantidad: 20,
          atributos: [
            { nombre: "Color", valor: "Negro" },
          ],
          imagenes: [
            "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=800&q=80",
          ],
        },
      ],
    },
  },
];

export const MERCH_BY_SLUG = MERCH_PRODUCTS.reduce((acc, product) => {
  acc[product.slug] = product;
  return acc;
}, {});
