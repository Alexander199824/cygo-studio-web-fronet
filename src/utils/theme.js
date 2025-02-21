/**
 * Nuevo esquema de colores elegante y sofisticado
 * Reemplaza el rosa intenso por tonos más oscuros y elegantes
 */

// Colores principales 
export const colors = {
    // Colores primarios
    primary: {
      light: '#8a6fbf', // Morado claro
      main: '#614b8f',  // Morado principal
      dark: '#3d325e',  // Morado oscuro
      contrast: '#ffffff' // Texto sobre morado
    },
    
    // Colores secundarios
    secondary: {
      light: '#6e8992', // Azul grisáceo claro
      main: '#4a6572',  // Azul grisáceo principal  
      dark: '#2c3e50',  // Azul grisáceo oscuro
      contrast: '#ffffff' // Texto sobre azul grisáceo
    },
    
    // Acentos
    accent: {
      gold: '#c9b18c',  // Dorado elegante
      copper: '#b87352', // Cobre
      emerald: '#2c7873' // Verde esmeralda
    },
    
    // Grises
    gray: {
      50: '#f8f9fa',
      100: '#f1f3f5',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#868e96',
      700: '#495057',
      800: '#343a40',
      900: '#212529'
    },
    
    // Funcionales
    success: '#386641',
    warning: '#bc6c25',
    error: '#ae2012',
    info: '#577590'
  };
  
  // Clases de utilidad para facilitar la conversión desde pink-600 y otros colores de Tailwind
  export const tailwindEquivalents = {
    // Reemplazos para clases "pink-"
    'pink-50': 'bg-purple-50',
    'pink-100': 'bg-purple-100',
    'pink-200': 'bg-purple-200',
    'pink-300': 'bg-purple-300',
    'pink-400': 'bg-purple-300',
    'pink-500': 'bg-purple-500',
    'pink-600': 'bg-indigo-800',
    'pink-700': 'bg-indigo-900',
    'pink-800': 'bg-indigo-900',
    
    // Reemplazos para hover
    'hover:bg-pink-50': 'hover:bg-purple-50',
    'hover:bg-pink-100': 'hover:bg-purple-100', 
    'hover:bg-pink-200': 'hover:bg-purple-200',
    'hover:bg-pink-500': 'hover:bg-indigo-600',
    'hover:bg-pink-600': 'hover:bg-indigo-700',
    'hover:bg-pink-700': 'hover:bg-indigo-800',
    
    // Reemplazos para texto
    'text-pink-50': 'text-purple-50',
    'text-pink-100': 'text-purple-100',
    'text-pink-500': 'text-indigo-500',
    'text-pink-600': 'text-indigo-600',
    'text-pink-700': 'text-indigo-700',
    'text-pink-800': 'text-indigo-800',
    
    // Reemplazos para bordes
    'border-pink-100': 'border-indigo-100',
    'border-pink-300': 'border-indigo-300',
    'border-pink-500': 'border-indigo-500',
    'border-pink-600': 'border-indigo-700',
    
    // Reemplazos hover para textos
    'hover:text-pink-600': 'hover:text-indigo-600',
    'hover:text-pink-700': 'hover:text-indigo-700',
    'hover:text-pink-800': 'hover:text-indigo-800',
    
    // Reemplazos para focus
    'focus:ring-pink-500': 'focus:ring-indigo-500',
    
    // Otros
    'from-pink-100': 'from-slate-200',
    'to-purple-50': 'to-indigo-100'
  };
  
  // Generar CSS Variables para el tema
  export const cssVariables = `
  :root {
    --color-primary: ${colors.primary.main};
    --color-primary-light: ${colors.primary.light};
    --color-primary-dark: ${colors.primary.dark};
    
    --color-secondary: ${colors.secondary.main};
    --color-secondary-light: ${colors.secondary.light};
    --color-secondary-dark: ${colors.secondary.dark};
    
    --color-accent-gold: ${colors.accent.gold};
    --color-accent-copper: ${colors.accent.copper};
    --color-accent-emerald: ${colors.accent.emerald};
    
    --color-success: ${colors.success};
    --color-warning: ${colors.warning};
    --color-error: ${colors.error};
    --color-info: ${colors.info};
  }
  `;