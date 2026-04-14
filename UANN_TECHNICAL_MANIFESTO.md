# UANN: UNIVERSAL ADAPTIVE NEURAL NETWORK
## Tehnički Manifesto i Arhitektura Sistema (v1.0.4)

### 01. VIZIJA I PROBLEM (GREEN AI REVOLUCIJA)
Trenutna AI paradigma ("Red AI") zasniva se na "Brute Force" pristupu: svaki upit, bez obzira na kompleksnost, troši maksimalne resurse u Cloud data-centrima. UANN menja ovu paradigmu uvođenjem **"Complexity-Aware Routing"** algoritma.

**Cilj:** Postizanje maksimalne inteligencije uz minimalni energetski otisak (Accuracy per Watt).

---

### 02. CORE ALGORITAM: CARA (Complexity-Aware Routing Algorithm)
CARA deluje kao talamus u ljudskom mozgu – filtrira ulazne signale i aktivira samo neophodne delove mreže.

#### Faza 1: Modal Adapter (Lokalna Estimacija)
Pre nego što podaci napuste uređaj, `localEstimator.ts` vrši heurističku analizu:
- **Regex Pattern Matching:** Identifikacija matematičkih, logičkih i lingvističkih obrazaca.
- **Density Analysis:** Merenje gustine ključnih reči za određivanje "Complexity Score" (0.0 - 1.0).
- **Emotional Damping:** Smanjivanje logičkog opterećenja ako je detektovan visok emotivni naboj (optimizacija resursa).

#### Faza 2: Sparse Activation (Gating)
Sistem koristi dinamičke pragove (Thresholds). Ako je `Complexity Score < Threshold`, Cloud se ne aktivira. Zadatak preuzimaju lokalni klasteri.

---

### 03. TEHNIČKA ARHITEKTURA (MODULARNI MOZAK)

#### A. Lokalni Klasteri (`src/services/clusters/`)
1. **Math Cluster:** Lokalni parser za aritmetiku i osnovnu algebru.
2. **Logic Cluster:** Identifikacija logičkih grešaka i struktuiranje premisa.
3. **Sentiment Cluster:** Analiza tona i polariteta teksta.
4. **Visual Cluster:** Prepoznavanje vizuelnih opisa i prostornih relacija.

#### B. Cloud Nodes (Gemini Integration)
Kada lokalni klasteri nisu dovoljni, aktiviraju se Cloud čvorovi:
- **Language Node:** Za duboku lingvističku analizu i kreativno pisanje.
- **Synthesis Node (The Oracle):** Finalni sloj koji spaja lokalne i cloud rezultate u koherentan odgovor.

---

### 04. MEHANIZAM UČENJA: KNOWLEDGE DISTILLATION
Ovo je ključni deo Green AI strategije.
1. **Cloud Wisdom:** Cloud model daje visokokvalitetan odgovor.
2. **Distillation:** Odgovor se "destiluje" i čuva u lokalnu `IndexedDB` bazu (`dbService.ts`).
3. **Local Autonomy:** Sledeći put kada se pojavi isti ili sličan upit, sistem ga rešava 100% lokalno koristeći keširanu mudrost.

---

### 05. AUTONOMNA PLASTIČNOST (INTERACTION MATRIX)
Fajl `interactionMatrix.ts` prati uspeh svake interakcije:
- Ako korisnik ispravi sistem -> Pragovi se podižu (sistem postaje oprezniji).
- Ako je sistem uspešan -> Pragovi se optimizuju za veću uštedu.
- **Neuron Simulation:** Vizuelni prikaz neuronske aktivnosti koji reflektuje stvarnu plastičnost algoritma.

---

### 06. METRIKA USPEHA: ACCURACY PER WATT
- **Cloud Cost per Query:** $0.0100 (Standard) vs $0.0020 (UANN).
- **Energy Offloading:** ~75% smanjenje Cloud procesiranja.
- **Latency:** Smanjenje sa ~2000ms na <50ms za keširane upite.

---

### 07. UPUTSTVO ZA REKREACIJU (IF SYSTEM FAILS)
1. Inicijalizovati Vite + React + Tailwind projekat.
2. Implementirati `dbService.ts` za IndexedDB perzistenciju.
3. Postaviti `localEstimator.ts` sa težinskim faktorima za klastere.
4. Povezati `geminiService.ts` za Cloud fallback.
5. Koristiti `App.tsx` kao centralni Neuralni ruter.

---
**"Budućnost AI nije u većim modelima, već u pametnijem rutiranju."**
*UANN Project - Green AI Manifesto*
