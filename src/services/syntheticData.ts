import { ComplexityProfile, ClusterType } from '../types';

/**
 * Synthetic Data Generator for Mass Training
 * Generates thousands of labeled examples to train the local estimator.
 */

interface TrainingExample {
  input: string;
  targetProfile: ComplexityProfile;
}

export const generateSyntheticData = (count: number): TrainingExample[] => {
  const examples: TrainingExample[] = [];
  
  const mathTemplates = [
    "Koliko je {n1} + {n2}?",
    "Reši jednačinu x^2 + {n1}x + {n2} = 0",
    "Izračunaj integral funkcije sin({n1}x)",
    "Koji je koren iz {n1}?",
    "Vektorski proizvod {n1} i {n2}"
  ];

  const logicTemplates = [
    "Ako je {p} istinito, a {q} lažno, šta je {p} AND {q}?",
    "Paradoks: {text}",
    "Napravi plan za {text}",
    "Zašto je {text} logički nemoguće?",
    "Dokaži da je {text} tačno"
  ];

  const visualTemplates = [
    "Opiši boju {text}",
    "Gde se nalazi {text} u odnosu na {text2}?",
    "Nacrtaj krug oko {text}",
    "Kakvog je oblika {text}?",
    "Vizuelizuj {text} na levoj strani"
  ];

  const sentimentTemplates = [
    "Mrzim ovaj problem, previše je težak!",
    "Super si ovo uradio, hvala puno!",
    "HITNO mi treba rešenje za ovo odmah!",
    "Ovo je jako loše i ne valja ništa.",
    "Volim kako ovaj sistem radi, odlično je."
  ];

  for (let i = 0; i < count; i++) {
    const type = Math.random();
    
    if (type < 0.2) { // Math
      const n1 = Math.floor(Math.random() * 100);
      const n2 = Math.floor(Math.random() * 100);
      const template = mathTemplates[Math.floor(Math.random() * mathTemplates.length)];
      examples.push({
        input: template.replace('{n1}', n1.toString()).replace('{n2}', n2.toString()),
        targetProfile: { default: 1, math: 0.8, language: 0.3, visual: 0.1, logic: 0.4, sentiment: 0.2 }
      });
    } else if (type < 0.4) { // Logic
      const template = logicTemplates[Math.floor(Math.random() * logicTemplates.length)];
      examples.push({
        input: template.replace('{p}', 'A').replace('{q}', 'B').replace('{text}', 'Tezejev brod'),
        targetProfile: { default: 1, math: 0.2, language: 0.5, visual: 0.2, logic: 0.9, sentiment: 0.3 }
      });
    } else if (type < 0.6) { // Visual
      const template = visualTemplates[Math.floor(Math.random() * visualTemplates.length)];
      examples.push({
        input: template.replace('{text}', 'jabuka').replace('{text2}', 'kruška'),
        targetProfile: { default: 1, math: 0.1, language: 0.4, visual: 0.9, logic: 0.2, sentiment: 0.2 }
      });
    } else if (type < 0.8) { // Sentiment
      const template = sentimentTemplates[Math.floor(Math.random() * sentimentTemplates.length)];
      examples.push({
        input: template,
        targetProfile: { default: 1, math: 0.1, language: 0.6, visual: 0.2, logic: 0.3, sentiment: 0.9 }
      });
    } else if (type < 0.9) { // Mixed (Math + Logic + Language)
      examples.push({
        input: "Ako je x + 5 = 10, dokaži logički da je x = 5 i objasni to na srpskom jeziku.",
        targetProfile: { default: 1, math: 0.7, language: 0.8, visual: 0.1, logic: 0.8, sentiment: 0.2 }
      });
    } else if (type < 0.95) { // Mixed (Visual + Sentiment + Logic)
      examples.push({
        input: "Analiziraj ovu mračnu sliku i reci mi da li je logično da izaziva strah kod posmatrača.",
        targetProfile: { default: 1, math: 0.1, language: 0.6, visual: 0.8, logic: 0.7, sentiment: 0.8 }
      });
    } else if (type < 0.98) { // Deep Math (Calculus/Physics)
      examples.push({
        input: "Izračunaj brzinu objekta koji pada sa visine od {n1} metara koristeći gravitaciju g=9.81.",
        targetProfile: { default: 1, math: 0.95, language: 0.4, visual: 0.3, logic: 0.6, sentiment: 0.1 }
      });
    } else { // Complex Sentiment (Sarcasm/Nuance)
      examples.push({
        input: "Baš ti hvala što si mi srušio ceo sistem, stvarno si genije.",
        targetProfile: { default: 1, math: 0.1, language: 0.7, visual: 0.1, logic: 0.4, sentiment: 0.95 }
      });
    }
  }

  return examples;
};
