// FitFlex AI Dedicated Coach Agent ("CoachFitFlexAgent")
// Powered by Google Gemini 1.5 Flash API & OpenAI API with mandatory 5-step biomechanical execution protocol.

export class CoachFitFlexAgent {
  constructor(userProfile = {}, activeSession = null) {
    this.userProfile = userProfile;
    this.activeSession = activeSession;
    this.weight = userProfile.weight || 70;
    this.goal = userProfile.goal || 'Hipertrofia & Fuerza';
    this.equipment = userProfile.equipment || 'Gimnasio completo';
    this.protectedZones = userProfile.protectedZones?.length > 0 ? userProfile.protectedZones.join(', ') : 'Ninguna';
    this.currentExercise = activeSession?.exercises?.[activeSession?.currentExerciseIndex]?.name || 'Ninguno (Consulta general)';
  }

  getSystemPrompt() {
    return (
      `Eres "Coach FitFlex IA", Entrenador Personal de Élite, Kinesiólogo Fisioterapeuta y Nutricionista Deportivo de Alto Rendimiento.\n` +
      `DATOS REALES DEL ATLETA: Peso: ${this.weight} kg | Objetivo: ${this.goal} | Equipo: ${this.equipment} | Lesiones a proteger: ${this.protectedZones} | Ejercicio activo: ${this.currentExercise}\n\n` +
      `REGLA MANDATORIA DE TÉCNICA:\n` +
      `Cada vez que el atleta pregunte por la TÉCNICA O EJECUCIÓN DE CUALQUIER EJERCICIO (con barra, mancuernas, polea, máquina o peso corporal), DEBES RESPONDER OBLIGATORIAMENTE CON LA SIGUIENTE ESTRUCTURA PASO A PASO:\n\n` +
      `📌 **[Nombre del Ejercicio] - Equipamiento: [Barra/Mancuernas/Polea/Máquina/Corporal]**\n\n` +
      `🧘 **Paso 1: Posición Inicial & Setup**\n` +
      `• Ajuste de pies, agarre, postura de columna, retracción escapular y bloqueo de abdomen (bracing).\n\n` +
      `🚀 **Paso 2: Fase Concéntrica (Positiva / Esfuerzo)**\n` +
      `• Trayectoria exacta del movimiento, aceleración controlada (1 segundo) y punto de máxima contracción.\n\n` +
      `⏱️ **Paso 3: Fase Excéntrica (Negativa / Descenso)**\n` +
      `• Control de la carga en 2 a 3 segundos sintiendo el estiramiento de las fibras musculares sin rebotar.\n\n` +
      `🫁 **Paso 4: Respiración & Estabilidad**\n` +
      `• Cuándo inhalar y cuándo exhalar durante la repetición.\n\n` +
      `💡 **Paso 5: Tip Biomecánico Pro & Error a Evitar**\n` +
      `• Ángulo idóneo de codos/rodillas y el error común más peligroso a evitar.`
    );
  }

  async ask(userQuery) {
    const query = userQuery.trim();
    if (!query) return { reply: 'Por favor ingresa una consulta válida.' };

    const storedApiKey = localStorage.getItem('fitflex_custom_api_key') || '';

    // 1. Google Gemini Official API (If key starts with AIza)
    if (storedApiKey.startsWith('AIza')) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${storedApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: `${this.getSystemPrompt()}\n\nCONSULTA DEL ATLETA: ${query}` }]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) return { reply: replyText.trim(), engine: 'Google Gemini 1.5 Flash' };
        }
      } catch (err) {
        console.log('Gemini API Error:', err);
      }
    }

    // 2. OpenAI API (If key starts with sk-)
    if (storedApiKey.startsWith('sk-')) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: this.getSystemPrompt() },
              { role: 'user', content: query }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.choices?.[0]?.message?.content;
          if (replyText) return { reply: replyText.trim(), engine: 'OpenAI GPT-4o-mini' };
        }
      } catch (err) {
        console.log('OpenAI API Error:', err);
      }
    }

    // 3. Fast Public Cloud Gateway
    try {
      const promptText = `${this.getSystemPrompt()}\n\nPREGUNTA DEL ATLETA: ${query}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Eres Coach FitFlex IA, entrenador deportivo de elite. Responde siempre paso a paso en español fluido, claro y estructurado.' },
            { role: 'user', content: promptText }
          ],
          model: 'openai'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 30 && !text.toLowerCase().includes('rate limit') && !text.includes('504 Gateway')) {
          return { reply: text.trim(), engine: 'FitFlex Cloud Agent' };
        }
      }
    } catch (err) {
      console.log('Public LLM gateway error, using expert agent rules:', err);
    }

    // 4. Coherent Expert Kinesiology Agent Engine (Rock-Solid Fallback)
    return { reply: this.generateExpertKnowledgeReply(query), engine: 'FitFlex Expert Agent' };
  }

  generateExpertKnowledgeReply(queryText) {
    const q = queryText.toLowerCase().trim();

    // A. Actual Pain / Discomfort / Injuries (ONLY fire if explicit pain/injury words exist)
    const isInjuryQuery = q.includes('dolor') || q.includes('molestia') || q.includes('lesion') || q.includes('pinzam') || q.includes('daño') || q.includes('me duele') || q.includes('pinchazo');
    if (isInjuryQuery) {
      return `🩹 **Protocolo Fisioterapéutico de Seguridad Articular**\n\n` +
             `Zonas en riesgo registradas en tu perfil: **${this.protectedZones}**.\n\n` +
             `1. **Evaluación:** Distingue la congestión muscular (ardor sano) del pinchazo articular/tendinoso (peligroso).\n` +
             `2. **Ajuste de Agarre:** En empujes y tirones, cambia a agarre neutro (palmas mirándose) para descompresionar el manguito rotador.\n` +
             `3. **Rango de Movimiento (ROM):** Quédate a 2cm del punto donde aparece la punzada articular.\n` +
             `4. **Trabajo Isométrico:** Mantén la carga fija sin movimiento durante 20 segundos para fortalecer el tendón sin fricción.`;
    }

    // B. Creatine & Supplements
    if (q.includes('creatina') || q.includes('suplemento') || q.includes('proteina') || q.includes('pre entreno') || q.includes('bcaa')) {
      const dose = (this.weight * 0.08).toFixed(1);
      return `🧪 **Análisis del Especialista en Suplementación Deportivo**\n\n` +
             `• **Creatina Monohidrato:** Para tus **${this.weight} kg**, la dosis diaria óptima es de **${dose}g a ${Math.round(this.weight * 0.1)}g al día**.\n` +
             `• **Momento de Toma:** Tómala a diario a la misma hora con agua. La creatina actúa por saturación muscular acumulativa.\n` +
             `• **Beneficios en tu rendimiento:** Incrementa la fuerza máxima (+10-15%), mejora la hidratación celular y acelera la resíntesis de ATP.\n` +
             `💡 *Mito Desmentido:* No causa retención de líquidos en la piel ni caída del cabello.`;
    }

    // C. Nutrition / Calories / Macros
    if (q.includes('comer') || q.includes('nutric') || q.includes('dieta') || q.includes('desayuno') || q.includes('cenar') || q.includes('caloria') || q.includes('deficit') || q.includes('volumen') || q.includes('macro')) {
      const proteinGram = Math.round(this.weight * 2.2);
      const waterLiter = (this.weight * 0.04).toFixed(1);
      const maintenance = Math.round(this.weight * 32);
      const calories = this.goal.toLowerCase().includes('defin') ? maintenance - 400 : maintenance + 350;

      return `🥗 **Plan del Agente Nutricionista (${this.weight} kg - ${this.goal})**\n\n` +
             `• **Calorías Diarias:** **~${calories} kcal/día** (Mantenimiento estimado: ~${maintenance} kcal).\n` +
             `• **Proteínas:** **${proteinGram}g de proteína/día** (2.2g/kg repartidos en 3-4 tomas de ~${Math.round(proteinGram / 4)}g).\n` +
             `• **Hidratación:** Mínimo **${waterLiter} Litros de agua al día**.\n` +
             `• **Comida Post-Entreno:** 30g de proteína magra (pollo, pavo, pescado o huevos) con 50g de carbohidratos de asimilación rápida (arroz o patata).`;
    }

    // D. Exercise Order & Routine Planning Advice
    if (q.includes('orden') || q.includes('primero') || q.includes('empezar') || q.includes('secuencia') || q.includes('estructura') || q.includes('rutina') || q.includes('organizar')) {
      return `📊 **Guía de Ordenamiento Biomecánico del Entrenamiento**\n\n` +
             `Para maximizar la hipertrofia y fuerza sintiendo mínima fatiga del Sistema Nervioso Central (SNC):\n\n` +
             `1. 🏋️‍♂️ **1º Ejercicios Multiarticulares Pesados (Compuestos principales):**\n` +
             `   • Ej: Sentadilla, Press de Banca, Peso Muerto, Press Militar, Remos con barra.\n` +
             `   • *Motivo:* Demandan máxima coordinación y fuerza neurológica. Hazlos cuando estás 100% fresco.\n\n` +
             `2. 🏋️ **2º Ejercicios Secundarios (Semi-compuestos / Mancuernas):**\n` +
             `   • Ej: Press inclinado con mancuernas, Sentadilla búlgara, Jalón al pecho, Zancadas.\n\n` +
             `3. 🎯 **3º Ejercicios de Aislamiento (Monoarticulares / Poleas):**\n` +
             `   • Ej: Elevaciones laterales, Curl de bíceps, Extensión de tríceps en polea, Pec-Deck.\n\n` +
             `4. 🏃‍♂️ **4º Abdomen (Core) & Cardio:**\n` +
             `   • Al finalizar la sesión. Nunca hagas cardio o abdomen intenso al principio para no fatigar la faja abdominal que protege tu columna durante las pesas.`;
    }

    // E. Universal Step-by-Step Exercise Execution Formatter for ALL Exercise Queries
    return this.generateStepByStepTechnique(q, queryText);
  }

  generateStepByStepTechnique(q, originalQuery) {
    let exerciseName = 'Ejercicio Solicitado';
    let equipmentUsed = 'Gimnasio / Material seleccionado';

    if (q.includes('mancuerna')) equipmentUsed = 'Mancuernas';
    else if (q.includes('barra')) equipmentUsed = 'Barra Olímpica / Estándar';
    else if (q.includes('polea') || q.includes('cable')) equipmentUsed = 'Polea Ajustable / Cable';
    else if (q.includes('maquina') || q.includes('máquina')) equipmentUsed = 'Máquina Guiada de Placas';
    else if (q.includes('corporal') || q.includes('peso corporal')) equipmentUsed = 'Peso Corporal (Calistenia)';

    if (q.includes('hombro') || q.includes('press militar')) exerciseName = 'Press de Hombro / Press Militar';
    else if (q.includes('banca') || q.includes('pecho')) exerciseName = 'Press de Banca para Pecho';
    else if (q.includes('sentadilla')) exerciseName = 'Sentadilla (Squat)';
    else if (q.includes('peso muerto')) exerciseName = 'Peso Muerto (Deadlift)';
    else if (q.includes('jalon') || q.includes('espalda')) exerciseName = 'Jalón al Pecho / Dominadas';
    else if (q.includes('remo')) exerciseName = 'Remo para Espalda';
    else if (q.includes('biceps') || q.includes('curl')) exerciseName = 'Curl de Bíceps';
    else if (q.includes('triceps') || q.includes('extension')) exerciseName = 'Extensión de Tríceps';
    else if (q.includes('elevacion')) exerciseName = 'Elevaciones Laterales para Hombro';
    else {
      // Clean query to construct name
      const words = originalQuery.replace(/como|hacer|ejecutar|realizar|tecnica|de|con|en|la|el/gi, '').trim();
      exerciseName = words ? words.toUpperCase() : 'Técnica de Entrenamiento';
    }

    return `📌 **${exerciseName} - Variante: ${equipmentUsed}**\n\n` +
           `🧘 **Paso 1: Posición Inicial & Setup**\n` +
           `• Coloca los pies firmes a la anchura de hombros (o caderas).\n` +
           `• Junta las escápulas atrás y abajo (retracción escapular) y bloquea la faja abdominal (bracing diafragmático).\n` +
           `• Toma el agarre firme ajustando la distancia biomecánica adecuada.\n\n` +
           `🚀 **Paso 2: Fase Concéntrica (Positiva / Esfuerzo)**\n` +
           `• Aplica fuerza de forma potente y constante en **1 segundo** siguiendo el rango articular fisiológico.\n` +
           `• Lleva la carga hasta el punto de máxima contracción muscular sin tirar de inercia o balancear el cuerpo.\n\n` +
           `⏱️ **Paso 3: Fase Excéntrica (Negativa / Descenso)**\n` +
           `• Frena el peso lentamente durante **2 a 3 segundos** sintiendo cómo se estiran las fibras del músculo objetivo.\n` +
           `• No dejes caer la carga de golpe; mantén la tensión continua durante todo el recorrido.\n\n` +
           `🫁 **Paso 4: Respiración & Bloqueo de Espalda**\n` +
           `• Inhala aire profundo hacia el abdomen antes de la bajada (fase negativa).\n` +
           `• Exhala el aire con fuerza al completar el esfuerzo de la subida (fase positiva).\n\n` +
           `💡 **Paso 5: Tip Biomecánico Pro & Error a Evitar**\n` +
           `• **Tip:** Quédate a **RIR 1-2** (dejar 1 o 2 repeticiones antes del fallo técnico).\n` +
           `• **Error a Evitar:** Evita desalinear muñecas o codos y jamás despegues la zona lumbar ni fuerces las articulaciones sobre dolor.`;
  }
}

export async function askAICoach(userQuery, userProfile = {}, activeSession = null) {
  const agent = new CoachFitFlexAgent(userProfile, activeSession);
  return await agent.ask(userQuery);
}

