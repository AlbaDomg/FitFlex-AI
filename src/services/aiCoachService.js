// FitFlex AI Coach Generative Engine (Real-Time Open-Ended Fitness LLM)
// Connects to Generative AI APIs with user context injection and high-detail fallback.

import { CoachFitFlexAgent } from './coachAgent';

export async function askAICoach(userQuery, userProfile = {}, activeSession = null) {
  const agent = new CoachFitFlexAgent(userProfile, activeSession);
  return await agent.ask(userQuery);
}

function getComprehensiveFallbackResponse(queryText, userProfile, activeExerciseName) {
  const q = queryText.toLowerCase().trim();
  const goal = userProfile.goal || 'Hipertrofia';
  const weight = userProfile.weight || 70;
  const protectedZones = userProfile.protectedZones || [];

  // 1. Creatine & Supplements
  if (q.includes('creatina') || q.includes('suplemento') || q.includes('proteina en polvo') || q.includes('pre entreno') || q.includes('bcaa') || q.includes('glutamina') || q.includes('multivitamin')) {
    const dose = (weight * 0.08).toFixed(1);
    return {
      reply: `🧪 **Análisis de Suplementación Deportiva para tus ${weight} kg**\n\n` +
             `• **Creatina Monohidrato:** La dosis idónea para tus ${weight} kg es de **${dose}g diarios**. Se debe tomar a diario (incluso en días de descanso) para mantener saturados los depósitos de fosfocreatina.\n` +
             `• **Proteína Whey:** Toma 1 cazo (25-30g) si tras tus comidas principales no llegas a tu meta diaria (~${Math.round(weight * 2)}g de proteína).\n` +
             `• **Pre-Entreno / Cafeína:** 150-200mg tomados 30-40 minutos antes del entrenamiento incrementan el rendimiento en series pesadas.\n` +
             `💡 *Consejo:* Ningún suplemento sustituye la sobrecarga progresiva ni el descanso nocturno.`
    };
  }

  // 2. Discomfort, Pain, Injuries
  if (q.includes('dolor') || q.includes('molestia') || q.includes('hombro') || q.includes('rodilla') || q.includes('espalda') || q.includes('codo') || q.includes('muñeca') || q.includes('lesion') || q.includes('pinzam') || q.includes('daño')) {
    return {
      reply: `🩹 **Protocolo Fisioterapéutico de Seguridad Articular**\n\n` +
             `Zonas registradas en tu perfil: **${protectedZones.length > 0 ? protectedZones.join(', ') : 'Sin lesiones previas'}**.\n\n` +
             `1. **Evaluación de la Molestia:** Si sientes quemazón en el vientre muscular es normal; si es un pellizco agudo en la articulación o tendón, **detén el movimiento inmediatamente**.\n` +
             `2. **Ajuste de Ángulo y Agarre:** Pasa de agarre prono a agarre neutro (palmas mirándose). En empujes (Press), coloca los codos a 45° con respecto al torso.\n` +
             `3. **Variante Isométrica:** Si la contracción dinámica molesta, mantén el peso estático en una zona cómoda durante 15-20 segundos sin rebotar.`
    };
  }

  // 3. Nutrition, Meals, Deficit, Surplus, Macros
  if (q.includes('comer') || q.includes('nutric') || q.includes('dieta') || q.includes('desayuno') || q.includes('cenar') || q.includes('caloria') || q.includes('deficit') || q.includes('volumen') || q.includes('engordar') || q.includes('adelgazar') || q.includes('macro')) {
    const proteinGram = Math.round(weight * 2.2);
    const waterLiter = (weight * 0.04).toFixed(1);
    const estMaintenance = Math.round(weight * 32);
    const targetCalories = goal.toLowerCase().includes('defin') ? estMaintenance - 400 : estMaintenance + 350;

    return {
      reply: `🥗 **Estrategia Nutricional y Cálculo de Macros para ${weight} kg (${goal})**\n\n` +
             `• **Calorías Diarias:** **~${targetCalories} kcal** (Mantenimiento estimado: ~${estMaintenance} kcal).\n` +
             `• **Proteínas:** **${proteinGram}g al día** (~2.2g por kg de peso corporal).\n` +
             `• **Hidratación:** Mínimo **${waterLiter} Litros de agua** repartidos a lo largo del día.\n` +
             `• **Reparto de Comidas:** Realiza 3 a 4 ingestas al día asegurando al menos 30g de proteína en cada una (pollo, pavo, huevos, pescado o queso batido) junto con carbohidratos complejos (arroz, avena o patata).`
    };
  }

  // 4. Rest, Sleep, Sets, Reps, Recovery
  if (q.includes('descanso') || q.includes('dormir') || q.includes('sueño') || q.includes('tiempo') || q.includes('recupera') || q.includes('serie') || q.includes('repeticion') || q.includes('cuanto descansar') || q.includes('frecuencia')) {
    return {
      reply: `⏱️ **Optimización de Descansos y RIR/RPE**\n\n` +
             `• **Descanso entre Series:**\n` +
             `  - Ejercicios Multiarticulares (Sentadilla, Press Banca, Peso Muerto, Remos): **2 a 3 minutos**.\n` +
             `  - Ejercicios de Aislamiento (Bíceps, Tríceps, Elevaciones, Gemelos): **60 a 90 segundos**.\n` +
             `• **Carácter de Esfuerzo (RIR):** En tus series efectivas, quédate a **RIR 1-2** (dejar 1 o 2 repeticiones antes de alcanzar el fallo muscular completo).\n` +
             `• **Recuperación Nocturna:** Apunta a **7.5 - 8 horas de sueño**. El 80% de la síntesis proteica ocurre durante la fase REM y sueño profundo.`
    };
  }

  // 5. Specific Exercises (Bench press, Squat, Deadlift, Pullups, Rows, Curls, Lat Pulldown, Extensions, etc.)
  if (q.includes('sentadilla') || q.includes('banca') || q.includes('peso muerto') || q.includes('jalon') || q.includes('remo') || q.includes('curl') || q.includes('elevacion') || q.includes('prensa') || q.includes('zancada') || q.includes('triceps') || q.includes('biceps') || q.includes('pecho') || q.includes('espalda') || q.includes('hombro') || q.includes('pierna')) {
    return {
      reply: `🎯 **Guía Biomecánica Específica de Ejecución** ${activeExerciseName !== 'Consulta general' ? `(Ejercicio en curso: **${activeExerciseName}**)` : ''}:\n\n` +
             `• **Colocación (Setup):** Junta las escápulas atrás y abajo para proteger los hombros. Activa la pared abdominal (bracing).\n` +
             `• **Fase Excéntrica (Bajada):** Desciende el peso frenando la gravedad en **2 a 3 segundos**. Siente la tensión muscular sin rebotar en las articulaciones.\n` +
             `• **Fase Concéntrica (Empuje/Tirón):** Aplica fuerza de forma potente en 1 segundo expirando el aire.\n` +
             `• **Rango de Movimiento:** Busca el máximo estiramiento cómodo sin perder la curvatura fisiológica de la columna.`
    };
  }

  // 6. Cardio & Fat Loss
  if (q.includes('cardio') || q.includes('correr') || q.includes('grasa') || q.includes('perder') || q.includes('pasos') || q.includes('camin') || q.includes('hiit')) {
    return {
      reply: `🏃‍♂️ **Estrategia de Pérdida de Grasa y Cardio Eficiente**\n\n` +
             `• **Preservación Muscular:** Realiza primero tu sesión de entrenamiento de fuerza con pesas para dar la señal de conservar la masa muscular.\n` +
             `• **NEAT (Pasos Diarios):** Apunta a realizar entre **8.000 y 10.000 pasos al día**. El movimiento continuo a lo largo del día quema más calorías que 30 minutos de cinta intensa.\n` +
             `• **Cardio Moderado (Zona 2):** Realiza 20-30 minutos de caminata inclinada o bicicleta estática al finalizar las pesas.`
    };
  }

  // 7. General Dynamic Specific Response acknowledging exact query
  const words = queryText.split(' ').filter(w => w.length > 3).slice(0, 4).join(' ');
  return {
    reply: `🤖 **Coach FitFlex IA - Asesoramiento Personalizado**\n\n` +
           `Sobre tu pregunta sobre **"${words || queryText}"**:\n\n` +
           `• **Análisis para tu objetivo de ${goal} (${weight} kg):**\n` +
           `  1. **Sobrecarga Progresiva:** Asegúrate de anotar y progresar semanalmente en repeticiones o peso para que tu cuerpo siga adaptándose.\n` +
           `  2. **Calidad de Movimiento:** Prioriza la tensión mecánica en el rango articular medio por encima de mover excesivo peso con mala técnica.\n` +
           `  3. **Ajuste Nutricional:** Asegura al menos **${Math.round(weight * 2)}g de proteína** al día para sustentar la reparación de tejidos musculares.\n\n` +
           `¿Tienes alguna otra consulta sobre la ejecución de un ejercicio, suplementación o tu plan semanal? ¡Escríbeme!`
  };
}
