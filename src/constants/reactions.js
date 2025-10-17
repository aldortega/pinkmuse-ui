export const REACTION_TYPES = [
  { value: 'like', label: 'Me gusta', emoji: '\u{1F44D}', description: 'Expresa que te gusta el contenido.' },
  { value: 'love', label: 'Me encanta', emoji: '\u{1F60D}', description: 'Muestra entusiasmo o carino por la publicacion.' },
  { value: 'wow', label: 'Me sorprende', emoji: '\u{1F62E}', description: 'Indica asombro o sorpresa.' },
  { value: 'angry', label: 'Me enoja', emoji: '\u{1F620}', description: 'Expresa molestia o indignacion.' },
  { value: 'dislike', label: 'No me gusta', emoji: '\u{1F44E}', description: 'Permite mostrar desacuerdo con el contenido.' },
];

export const REACTION_MAP = REACTION_TYPES.reduce((acc, reaction) => {
  acc[reaction.value] = reaction;
  return acc;
}, {});

export const DEFAULT_REACTION_COUNTS = REACTION_TYPES.reduce((acc, reaction) => {
  acc[reaction.value] = 0;
  return acc;
}, {});
