// FitFlex AI Exercise Database & Smart Load Engine
// Rich set of exercises categorised by muscle group, equipment, and compatible methodologies

export const MUSCLE_SPANISH_NAMES = {
  chest: 'Pecho',
  back: 'Espalda',
  shoulders: 'Hombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  quads: 'Cuádriceps',
  hamstrings: 'Isquios',
  abs: 'Abdomen',
  glutes: 'Glúteos',
  calves: 'Gemelos'
};

export function getMuscleSpanishName(key) {
  if (!key) return '';
  return MUSCLE_SPANISH_NAMES[key.toLowerCase()] || key;
}

export const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Pectorales', icon: 'Dumbbell', category: 'Upper' },
  { id: 'back', name: 'Espalda', icon: 'Activity', category: 'Upper' },
  { id: 'shoulders', name: 'Hombros', icon: 'Zap', category: 'Upper' },
  { id: 'biceps', name: 'Bíceps', icon: 'Flame', category: 'Arms' },
  { id: 'triceps', name: 'Tríceps', icon: 'Shield', category: 'Arms' },
  { id: 'quads', name: 'Cuádriceps', icon: 'Footprints', category: 'Legs' },
  { id: 'hamstrings', name: 'Isquios & Glúteos', icon: 'TrendingUp', category: 'Legs' },
  { id: 'abs', name: 'Abdominales / Core', icon: 'Target', category: 'Core' }
];

export const METHODOLOGIES = [
  {
    id: 'classic',
    name: 'Hipertrofia Clásica',
    shortName: 'Clásico',
    badge: '3-4 Series',
    description: 'Series tradicionales con descanso completo fijo de 60-90 segundos para máxima tensión mecánica.',
    color: 'cyan',
    defaultRestBetweenPairsSec: 75,
    defaultRestBetweenExercisesSec: 75
  },
  {
    id: 'biseries',
    name: 'Biseries Antagonistas',
    shortName: 'Biserie',
    badge: 'A1 + A2',
    description: 'Combina 2 ejercicios de grupos opuestos (ej. Pecho + Espalda) con 10s de descanso entre ellos.',
    color: 'emerald',
    defaultRestBetweenPairsSec: 90,
    defaultRestBetweenExercisesSec: 10
  },
  {
    id: 'circuit',
    name: 'Circuito Funcional / EMOM',
    shortName: 'Circuito',
    badge: 'Alta Intensidad',
    description: 'Rondas por tiempo o reps continuas con mínimo descanso para máximo gasto calórico.',
    color: 'amber',
    defaultRestBetweenPairsSec: 45,
    defaultRestBetweenExercisesSec: 15
  },
  {
    id: 'dropset',
    name: 'Drop-Sets & Rest-Pause',
    shortName: 'Drop-Set',
    badge: 'Modo Desafío',
    description: 'Remate de sesión: serie principal hasta el fallo + bajada de peso inmediata o descansos de 15s.',
    color: 'purple',
    defaultRestBetweenPairsSec: 60,
    defaultRestBetweenExercisesSec: 15
  }
];

// Smart Time-Based Methodology Recommendation Engine
export function getRecommendedMethodologyForTime(sessionTimeMinutes = 45) {
  const mins = parseInt(sessionTimeMinutes) || 45;
  if (mins <= 30) {
    return 'circuit'; // EMOM / Circuito Funcional for short express sessions
  } else if (mins >= 60) {
    return 'classic'; // Hipertrofia Clásica for extended full sessions
  } else {
    return 'biseries'; // Biseries Antagonistas for 45 min standard sessions
  }
}

// Smart Algorithmic Personalised Load & Reps Calculator with Methodology Tuning
export function calculatePersonalizedLoad(
  exercise,
  gender = 'Hombre',
  bodyWeightKg = 70,
  experienceLevel = 'intermediate',
  goal = 'Hipertrofia',
  methodology = 'classic'
) {
  const isFemale = gender === 'Mujer';
  const bw = parseFloat(bodyWeightKg) || 70;

  // Experience level multiplier
  let expMultiplier = 0.85; // default intermediate
  if (experienceLevel === 'beginner') expMultiplier = 0.55;
  if (experienceLevel === 'advanced') expMultiplier = 1.2;

  // Methodology multiplier & reps tuning
  let methMultiplier = 1.0;
  let targetReps = '8-10';
  let defaultRepsNum = 10;

  if (methodology === 'classic') {
    methMultiplier = 1.0;
    targetReps = '8-10';
    defaultRepsNum = 10;
  } else if (methodology === 'biseries') {
    methMultiplier = 0.85;
    targetReps = '10-12';
    defaultRepsNum = 10;
  } else if (methodology === 'circuit') {
    methMultiplier = 0.70;
    targetReps = '12-15';
    defaultRepsNum = 12;
  } else if (methodology === 'dropset') {
    methMultiplier = 0.95;
    targetReps = '6-8';
    defaultRepsNum = 8;
  }

  // Base strength ratio by exercise category & equipment
  let baseRatio = 0.5;

  if (exercise.equipment === 'bodyweight') {
    return {
      suggestedWeightKg: 0,
      targetReps,
      defaultRepsNum
    };
  }

  // Upper Body Push (Bench Press, Press Militar)
  if (exercise.muscleGroup === 'chest' || exercise.muscleGroup === 'shoulders') {
    baseRatio = isFemale ? 0.35 : 0.65;
  }
  // Upper Body Pull (Remo, Jalón, Bíceps)
  else if (exercise.muscleGroup === 'back' || exercise.muscleGroup === 'biceps') {
    baseRatio = isFemale ? 0.4 : 0.6;
  }
  // Triceps / Arms Isolations
  else if (exercise.muscleGroup === 'triceps') {
    baseRatio = isFemale ? 0.25 : 0.4;
  }
  // Lower Body (Sentadillas, Peso Muerto, Hip Thrust, Prensa, Máquinas Guiadas)
  else if (exercise.muscleGroup === 'quads' || exercise.muscleGroup === 'hamstrings') {
    if (exercise.id === 'ex-quads-4' || exercise.id === 'ex-hams-6') {
      baseRatio = isFemale ? 1.2 : 1.6; // Leg press allows higher relative loads
    } else if (exercise.id === 'ex-quads-5' || exercise.id === 'ex-hams-4' || exercise.id === 'ex-hams-5') {
      baseRatio = isFemale ? 0.45 : 0.6; // Isolation machines
    } else {
      baseRatio = isFemale ? 0.7 : 0.9;
    }
  }

  // Equipment correction (Dumbbells are per hand, so ratio is halved)
  if (exercise.equipment === 'dumbbells') {
    baseRatio = baseRatio * 0.4;
  }

  let calculatedKg = bw * baseRatio * expMultiplier * methMultiplier;

  // Round to nearest 2.5kg step
  calculatedKg = Math.max(2.5, Math.round(calculatedKg / 2.5) * 2.5);

  return {
    suggestedWeightKg: calculatedKg,
    targetReps,
    defaultRepsNum
  };
}

export const EXERCISE_DATABASE = [
  // CHEST
  {
    id: 'ex-chest-1',
    name: 'Press de Banca con Barra',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'gym',
    difficulty: 'Intermedio',
    movementType: 'Push',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultWeightKg: 60,
    tips: 'Junta tus escápulas, mantén los pies firmes en el suelo y baja la barra de forma controlada al esternón.',
    biseriesPairId: 'ex-back-1'
  },
  {
    id: 'ex-chest-2',
    name: 'Press Inclinado con Mancuernas',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbells',
    difficulty: 'Principiante',
    movementType: 'Push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeightKg: 20,
    tips: 'Banca a 30 grados. Empuja en arco suave juntando las mancuernas en la parte superior sin chocar.',
    biseriesPairId: 'ex-back-2'
  },
  {
    id: 'ex-chest-3',
    name: 'Flexiones de Pecho (Push-Ups)',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'abs'],
    equipment: 'bodyweight',
    difficulty: 'Principiante',
    movementType: 'Push',
    defaultSets: 4,
    defaultReps: '15-20',
    defaultWeightKg: 0,
    tips: 'Cuerpo completamente bloqueado en plancha. Codos a 45° respecto al torso.',
    biseriesPairId: 'ex-back-3'
  },
  {
    id: 'ex-chest-4',
    name: 'Aperturas en Polea Alta / Cruces',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'gym',
    difficulty: 'Intermedio',
    movementType: 'Push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultWeightKg: 15,
    tips: 'Enfócate en exprimir la parte central del pecho al cruzar las manos.',
    biseriesPairId: 'ex-back-4'
  },

  // BACK
  {
    id: 'ex-back-1',
    name: 'Remo con Barra Pronomó',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps', 'abs'],
    equipment: 'gym',
    difficulty: 'Intermedio',
    movementType: 'Pull',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultWeightKg: 55,
    tips: 'Torso a 45°, lleva la barra hacia tu ombligo tirando de codos hacia atrás.',
    biseriesPairId: 'ex-chest-1'
  },
  {
    id: 'ex-back-2',
    name: 'Remo Unilateral con Mancuerna',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'dumbbells',
    difficulty: 'Principiante',
    movementType: 'Pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeightKg: 22,
    tips: 'Apoya rodilla y mano en banco. Tira del codo rasgando el costado hacia la cadera.',
    biseriesPairId: 'ex-chest-2'
  },
  {
    id: 'ex-back-3',
    name: 'Dominadas Pronadas / Australian Push-Ups',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'bodyweight',
    difficulty: 'Avanzado',
    movementType: 'Pull',
    defaultSets: 4,
    defaultReps: '6-10',
    defaultWeightKg: 0,
    tips: 'Subida explosiva pasando la barbilla por encima de la barra, bajada frenada en 2 segundos.',
    biseriesPairId: 'ex-chest-3'
  },
  {
    id: 'ex-back-4',
    name: 'Jalón al Pecho en Polea',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeightKg: 45,
    tips: 'Saca el pecho hacia afuera y lleva el agarre al esternón sin balancear la espalda.',
    biseriesPairId: 'ex-chest-4'
  },

  // SHOULDERS
  {
    id: 'ex-shoulders-1',
    name: 'Press Militar de Hombros con Barra',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'gym',
    difficulty: 'Intermedio',
    movementType: 'Push',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultWeightKg: 40,
    tips: 'Aprieta glúteos y abdomen, empuja verticalmente bloqueando los codos arriba.',
    biseriesPairId: 'ex-biceps-1'
  },
  {
    id: 'ex-shoulders-2',
    name: 'Elevaciones Laterales con Mancuernas',
    muscleGroup: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbells',
    difficulty: 'Principiante',
    movementType: 'Push',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultWeightKg: 10,
    tips: 'Leve inclinación hacia adelante, eleva los codos guiando el movimiento como si vertieras agua de una jarra.',
    biseriesPairId: 'ex-triceps-2'
  },
  {
    id: 'ex-shoulders-3',
    name: 'Pike Push-Ups (Flexiones en A)',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'bodyweight',
    difficulty: 'Intermedio',
    movementType: 'Push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeightKg: 0,
    tips: 'Forma una V invertida con el cuerpo y baja la coronilla en diagonal hacia el suelo.',
    biseriesPairId: 'ex-biceps-3'
  },

  // BICEPS
  {
    id: 'ex-biceps-1',
    name: 'Curl de Bíceps con Barra Z',
    muscleGroup: 'biceps',
    secondaryMuscles: [],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Pull',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeightKg: 25,
    tips: 'Mantén los codos pegados a los costados y evita impulsarte con la zona lumbar.',
    biseriesPairId: 'ex-triceps-1'
  },
  {
    id: 'ex-biceps-2',
    name: 'Curl Martillo con Mancuernas',
    muscleGroup: 'biceps',
    secondaryMuscles: [],
    equipment: 'dumbbells',
    difficulty: 'Principiante',
    movementType: 'Pull',
    defaultSets: 3,
    defaultReps: '12',
    defaultWeightKg: 12,
    tips: 'Agarre neutro (palmas mirándose). Trabaja el braquial para mayor grosor en el brazo.',
    biseriesPairId: 'ex-triceps-2'
  },
  {
    id: 'ex-biceps-3',
    name: 'Curl Isométrico / Dominada Supina Inversa',
    muscleGroup: 'biceps',
    secondaryMuscles: ['back'],
    equipment: 'bodyweight',
    difficulty: 'Intermedio',
    movementType: 'Pull',
    defaultSets: 3,
    defaultReps: '10',
    defaultWeightKg: 0,
    tips: 'Agarre supino bajo barra baja o TRX. Tira llevando la barra al mentón.',
    biseriesPairId: 'ex-triceps-3'
  },

  // TRICEPS
  {
    id: 'ex-triceps-1',
    name: 'Press Francés con Barra Z en Banco',
    muscleGroup: 'triceps',
    secondaryMuscles: ['shoulders'],
    equipment: 'gym',
    difficulty: 'Intermedio',
    movementType: 'Push',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultWeightKg: 25,
    tips: 'Flexiona solo codos llevando la barra hacia la frente con control total.',
    biseriesPairId: 'ex-biceps-1'
  },
  {
    id: 'ex-triceps-2',
    name: 'Extensión en Polea Alta con Cuerda',
    muscleGroup: 'triceps',
    secondaryMuscles: [],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultWeightKg: 20,
    tips: 'Abre la cuerda al final de la extensión abriendo los puños hacia afuera.',
    biseriesPairId: 'ex-biceps-2'
  },
  {
    id: 'ex-triceps-3',
    name: 'Fondos de Tríceps en Banco / Paralelas',
    muscleGroup: 'triceps',
    secondaryMuscles: ['chest'],
    equipment: 'bodyweight',
    difficulty: 'Principiante',
    movementType: 'Push',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultWeightKg: 0,
    tips: 'Espalda pegada al banco, baja hasta formar un ángulo de 90° en los codos.',
    biseriesPairId: 'ex-biceps-3'
  },

  // QUADS
  {
    id: 'ex-quads-1',
    name: 'Sentadilla Trasera con Barra',
    muscleGroup: 'quads',
    secondaryMuscles: ['hamstrings', 'abs'],
    equipment: 'gym',
    difficulty: 'Avanzado',
    movementType: 'Leg',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultWeightKg: 80,
    tips: 'Pies a la anchura de hombros, desciende empujando rodillas hacia afuera y manteniendo el pecho erguido.',
    biseriesPairId: 'ex-hams-1'
  },
  {
    id: 'ex-quads-2',
    name: 'Zancadas Búlgaras con Mancuernas',
    muscleGroup: 'quads',
    secondaryMuscles: ['hamstrings'],
    equipment: 'dumbbells',
    difficulty: 'Intermedio',
    movementType: 'Leg',
    defaultSets: 3,
    defaultReps: '10 cada pierna',
    defaultWeightKg: 14,
    tips: 'Un pie apoyado atrás en banco. Desciende la rodilla trasera hacia el suelo con apoyo en el talón delantero.',
    biseriesPairId: 'ex-hams-2'
  },
  {
    id: 'ex-quads-3',
    name: 'Sentadilla Aire Profunda / Zancadas',
    muscleGroup: 'quads',
    secondaryMuscles: ['hamstrings'],
    equipment: 'bodyweight',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 4,
    defaultReps: '20',
    defaultWeightKg: 0,
    tips: 'Rango de movimiento completo bajando cadera por debajo del paralelo de rodillas.',
    biseriesPairId: 'ex-hams-3'
  },
  {
    id: 'ex-quads-4',
    name: 'Prensa de Piernas Inclinada 45°',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultWeightKg: 100,
    tips: 'Apoya toda la espalda en el respaldo, coloca los pies a la anchura de caderas y baja la plataforma con control sin despegar la pelvis.',
    biseriesPairId: 'ex-hams-4'
  },
  {
    id: 'ex-quads-5',
    name: 'Extensión de Cuádriceps en Máquina',
    muscleGroup: 'quads',
    secondaryMuscles: [],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultWeightKg: 40,
    tips: 'Ajusta el rodillo justo por encima de los tobillos. Extiende las rodillas completamente aguantando 1 segundo la contracción arriba.',
    biseriesPairId: 'ex-hams-5'
  },

  // HAMSTRINGS
  {
    id: 'ex-hams-1',
    name: 'Peso Muerto Rumano con Barra',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['back', 'abs'],
    equipment: 'gym',
    difficulty: 'Intermedio',
    movementType: 'Leg',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultWeightKg: 70,
    tips: 'Empuja la cadera hacia atrás manteniendo leve flexión de rodilla. Siente el estiramiento profundo en isquios.',
    biseriesPairId: 'ex-quads-1'
  },
  {
    id: 'ex-hams-2',
    name: 'Hip Thrust con Mancuerna / Barra',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['quads'],
    equipment: 'dumbbells',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 4,
    defaultReps: '12',
    defaultWeightKg: 24,
    tips: 'Espalda apoyada en banco, empuja con los talones y aprieta glúteos arriba durante 1 segundo.',
    biseriesPairId: 'ex-quads-2'
  },
  {
    id: 'ex-hams-3',
    name: 'Glute Bridge a una Pierna (Puente)',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['abs'],
    equipment: 'bodyweight',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 3,
    defaultReps: '15',
    defaultWeightKg: 0,
    tips: 'En el suelo, eleva una pierna estirada y empuja la cadera con el talón apoyado.',
    biseriesPairId: 'ex-quads-3'
  },
  {
    id: 'ex-hams-4',
    name: 'Curl Femoral Tumbado en Máquina',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['glutes'],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultWeightKg: 35,
    tips: 'Flexiona las rodillas llevando el rodillo hacia los glúteos de forma fluida sin levantar la cadera del banco.',
    biseriesPairId: 'ex-quads-4'
  },
  {
    id: 'ex-hams-5',
    name: 'Máquina de Aductores / Abductores de Cadera',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['glutes', 'quads'],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultWeightKg: 30,
    tips: 'Espalda bien pegada al respaldo, realiza aperturas/cierres controlados enfocando el trabajo en glúteos e ingle.',
    biseriesPairId: 'ex-quads-5'
  },
  {
    id: 'ex-hams-6',
    name: 'Elevación de Gemelos en Prensa / Máquina',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['quads'],
    equipment: 'gym',
    difficulty: 'Principiante',
    movementType: 'Leg',
    defaultSets: 3,
    defaultReps: '15-20',
    defaultWeightKg: 50,
    tips: 'Apoya solo los metatarsos en el borde de la plataforma. Desciende profundamente para estirar y eleva los talones al máximo.',
    biseriesPairId: null
  },

  // ABS / CORE
  {
    id: 'ex-abs-1',
    name: 'Rueda Abdominal / Roll-Out',
    muscleGroup: 'abs',
    secondaryMuscles: ['shoulders'],
    equipment: 'gym',
    difficulty: 'Avanzado',
    movementType: 'Core',
    defaultSets: 3,
    defaultReps: '12',
    defaultWeightKg: 0,
    tips: 'Retroversión pélvica activa (aprieta abdomen). Estírate sin curvar la zona lumbar.',
    biseriesPairId: null
  },
  {
    id: 'ex-abs-2',
    name: 'Crunch con Mancuerna en Pecho',
    muscleGroup: 'abs',
    secondaryMuscles: [],
    equipment: 'dumbbells',
    difficulty: 'Principiante',
    movementType: 'Core',
    defaultSets: 3,
    defaultReps: '15',
    defaultWeightKg: 10,
    tips: 'Eleva solo las escápulas del suelo exhalando todo el aire arriba.',
    biseriesPairId: null
  },
  {
    id: 'ex-abs-3',
    name: 'Plancha Isométrica con Elevación de Pierna',
    muscleGroup: 'abs',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    difficulty: 'Principiante',
    movementType: 'Core',
    defaultSets: 3,
    defaultReps: '45 segundos',
    defaultWeightKg: 0,
    tips: 'Mantén línea recta desde la cabeza a los talones sin hundir la cadera.',
    biseriesPairId: null
  }
];

export function getRecommendedExercises({ equipment = 'gym', muscleGroups = [], protectedZones = [] }) {
  return EXERCISE_DATABASE.filter(ex => {
    if (equipment === 'bodyweight' && ex.equipment !== 'bodyweight') return false;
    if (equipment === 'dumbbells' && ex.equipment === 'gym') return false;

    if (protectedZones.includes('lumbar') && (ex.id === 'ex-quads-1' || ex.id === 'ex-hams-1')) return false;
    if (protectedZones.includes('hombros') && (ex.id === 'ex-shoulders-1' || ex.id === 'ex-triceps-3')) return false;
    if (protectedZones.includes('rodillas') && (ex.id === 'ex-quads-1' || ex.id === 'ex-quads-2')) return false;

    if (muscleGroups.length > 0 && !muscleGroups.includes(ex.muscleGroup)) return false;

    return true;
  });
}

export const UPPER_BODY_MUSCLES = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
export const LOWER_BODY_MUSCLES = ['quads', 'hamstrings', 'glutes', 'calves', 'abs'];

export function isUpperBodyExercise(exercise) {
  if (!exercise || !exercise.muscleGroup) return false;
  return UPPER_BODY_MUSCLES.includes(exercise.muscleGroup.toLowerCase());
}

export function isLowerBodyExercise(exercise) {
  if (!exercise || !exercise.muscleGroup) return false;
  return LOWER_BODY_MUSCLES.includes(exercise.muscleGroup.toLowerCase());
}

/**
 * Re-orders a list of exercises for a Full Body Biseries workout
 * so that each biserie pair alternates between Upper Body and Lower Body / Core.
 * Example: Pair 1: Upper + Lower, Pair 2: Upper + Lower, etc.
 */
export function organizeBiseriesForFullbody(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) return exercises;

  const upperList = exercises.filter(ex => isUpperBodyExercise(ex));
  const lowerList = exercises.filter(ex => !isUpperBodyExercise(ex));

  const result = [];
  const maxLength = Math.max(upperList.length, lowerList.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < upperList.length) {
      result.push(upperList[i]);
    }
    if (i < lowerList.length) {
      result.push(lowerList[i]);
    }
  }

  return result;
}

