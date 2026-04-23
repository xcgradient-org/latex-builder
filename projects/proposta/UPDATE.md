# UPDATE — Santander X Spain Awards 2026
**Data:** 22 d'abril de 2026  
**Autor:** Oriol (CEO)  
**Destinataris:** Arnau, Adam  
**Propòsit:** Briefing complet del que cal canviar als documents abans de la submission. El pitch (vídeo + script) ho gestiono jo.

---

## Idioma — Decisió final

**Submissió en castellà + anglès. Eliminar el català d'aquesta aplicació.**

| Idioma | Per a | Raó |
|---|---|---|
| **Castellà** | Submissió Santander X Spain | Competició nacional espanyola. El jurat no garanteix entendre català. |
| **Anglès** | Fase global Santander X + inversors | Si passem la fase nacional anem al global. L'anglès ha d'estar llest. |
| ~~Català~~ | ~~Explorer UPC (ja fet)~~ | Era per a un programa de la UPC. Aquí no aporta puntuació i crea treball extra. |

**Directori de treball:** `proposta/castellano/` per a la submission i `proposta/english/` com a backup/global.  
El root (`proposta/*.tex`) és el draft original — no tocar.

---

## Estat de documents — Resum

| # | Document requerit | Fitxer | Estat | Qui actua |
|---|---|---|---|---|
| 1 | Pitch vídeo (3 min) | `pitch.md` (script) | Oriol ho gestiona | Oriol |
| 2 | Pitch deck (PDF) | `XCGradient.pdf` (CEO folder) | Oriol ho gestiona | Oriol |
| 3 | One Pager Executive Summary | `02_One_Pager_Resum_Executiu.tex` | Quasi llest — 2 canvis menors | Arnau/Adam llegir |
| 4 | Business Plan | `03_Pla_de_Negoci.tex` | Canvis importants necessaris | Arnau/Adam |
| 5 | Technical Architecture Overview | `04_Arquitectura_Tecnica.tex` | 2 canvis — Arnau principal | Arnau |
| 6 | Team CVs + BIOs + LinkedIn + Contacte | `05_Equip_Fundador.tex` | **Gaps crítics** — dades personals | Arnau + Adam cadascú el seu |
| 7 | One Pager Impact Statement | `07_Declaracio_Impacte.tex` | Canvis menors | Adam |

**NO submetre:**
- `01_Revisio_Document_Corporatiu.tex` — és un document d'auditoria interna
- `06_Diferenciadors_Competitius.tex` — no requerit (bo com a suplement si el portal ho permet)

---

## Qui és el Santander X Spain Awards

Competició d'emprenedoria universitaria organitzada per Santander. Dues categories:

- **Projectes Emprenedors Universitaris** — fase prototip/MVP → premi €2.000
- **Startup Universitaria** — empresa constituïda amb activitat econòmica → premi €4.000

Winners → fase nacional → **Santander X Global** (competició internacional).

**Criteris d'avaluació** (pes igual entre els cinc):
1. Impacte potencial
2. Escalabilitat
3. Avantatge competitiu
4. Equip
5. Qualitat del pitch

> El nostre punt fort és l'avantatge competitiu i l'equip tècnic. El punt feble actual és l'impacte sense mètriques quantificades i l'equip sense dades personals reals.

---

## Tasques per document

---

### Doc 3 — One Pager Executive Summary
`proposta/castellano/02_One_Pager_Resum_Executiu.tex`

**Canvis menors — cap de vosaltres ha d'editar el contingut tècnic, però:**

- [ ] **Footer:** substituir `No public website yet · Confidential` per el nostre email de contacte real. Exemple: `oriol@xcgradient.com · arnau@xcgradient.com · confidencial`
- [ ] **Secció Early Traction:** afegir una línia: *"Seleccionados para el programa Explorer UPC (2026) — validación externa del modelo de negocio."*

---

### Doc 4 — Business Plan
`proposta/castellano/03_Pla_de_Negoci.tex`

Aquests canvis els ha de fer algú de vosaltres (o tots junts en una sessió de 30 min):

**Canvis importants:**

- [ ] **Secció 4.1 — Projecció d'ingressos:** les columnes d'ARPC diuen "En validació" a tot arreu. Substituir per un rang estimat conservador. Proposta:
  - *"€400–700/màquina/mes (estimació preliminar, pendent validació PoC)"*
  - Si no voleu posar per-màquina, podeu posar tiered: *"€800–2.000/mes per empresa (tier bàsic a avançat)"*
  - Qualsevol número és millor que res. El jurat llegeix buit com "no hi han pensat."

- [ ] **Secció nova — Validació Externa (afegir després de Secció 5):** 
  ```
  \section{6. Validació i Reconeixement}
  XC Gradient ha estat seleccionat al programa Explorer UPC (2026), 
  el programa d'emprenedoria de referència de la Facultat d'Informàtica 
  de Barcelona (UPC-FIB). Durant el programa hem executat el pivot 
  estratègic clau: de "ChatGPT de documentació" a "eliminació del temps 
  de diagnòstic", basat en entrevistes directes amb CEOs del sector 
  manufacturer. Resultat: 2 empreses pilot actives (Decfa i Paver).
  ```

- [ ] **Secció 4.2 — Estructura de costos, fila Infraestructura Any 1:** eliminar la referència a "cost elèctric ~0". No és rellevant per al jurat i sembla detall intern.

- [ ] **Afegir a Secció 2.1 (Mercat):** si teniu les xifres de Decfa (quants documents ingestats, quantes màquines), afegir-les aquí com a prova de tracció real. Format: *"PoC Decfa: X documents ingestats, Y màquines cobertes."*

---

### Doc 5 — Technical Architecture
`proposta/castellano/04_Arquitectura_Tecnica.tex`

**Propietari principal: Arnau**

- [ ] **Afegir una secció introductòria "Resum per a no tècnics" (mig paràgraf, al top):**
  ```
  El sistema llegeix tota la documentació de la fàbrica (manuals, logs 
  de manteniment, incidents anteriors), construeix una base de coneixement 
  privada, i respon preguntes tècniques de l'operari en segons. Cap dada 
  surt de les instal·lacions del client. Tecnologia equivalent a la dels 
  grans fabricants, a preu de PIME.
  ```
  La resta del document tècnic pot quedar com està — és per als evaluadors tècnics.

- [ ] **Secció 3 (Framework d'Avaluació) — actualitzar l'objectiu A-score:**  
  Posar l'estat actual: *"Objectiu A-score >0.80 — en fase d'implementació al PoC de Decfa (target: 15 maig 2026)."*  
  Si ja tens resultats parcials, posa'ls. Qualsevol número parcial és millor que silenci.

- [ ] **Afegir nota de deployment status a Secció 5 (Stack):**  
  Substituir l'actual "Status: Planned" per l'estat real. Si alguna part del stack ja corre a Decfa (ingesta, retrieval, qualsevol cosa), dir-ho explícitament. Exemple: *"Ingesta i indexació: operatius al corpus Decfa (Q2 2026). Reranking i fine-tuning: en desenvolupament actiu."*

---

### Doc 6 — Equip Fundador
`proposta/castellano/05_Equip_Fundador.tex`

**Aquest és el document amb més gaps crítics. Cada fundador ha d'aportar les seves dades.**

#### Dades que cadascú ha de proporcionar (Arnau i Adam):

Per **Arnau**:
- [ ] URL de LinkedIn (format: `linkedin.com/in/...`)
- [ ] Email de contacte (el que voleu fer públic)
- [ ] 2-3 projectes o experiències rellevants a afegir a la seva secció (TFG, projectes de recerca, col·laboracions, hackathons, qualsevol cosa que mostri profunditat)
- [ ] GitHub o portfolio si en tens
- [ ] Idiomes (mínim: català, castellà, anglès + nivell)

Per **Adam**:
- [ ] URL de LinkedIn
- [ ] Email de contacte
- [ ] 2-3 projectes o experiències rellevants (TFG, projectes de seguretat, xarxes, qualsevol cosa)
- [ ] GitHub o portfolio si en tens
- [ ] Idiomes

Per **Oriol** (ho poso jo, però per tenir-ho tot al document):
- LinkedIn: a omplir
- Email: a omplir
- GitHub: a omplir

#### Canvis de contingut al `.tex` (qui tingui ganes d'editar LaTeX, sinó passa'm les dades i ho faig jo):

- [ ] **Afegir a cada profilebox:** una línia `\textbf{Contacte:} \href{mailto:...}{email} \quad \href{https://linkedin.com/in/...}{LinkedIn}`
- [ ] **Arnau — Contribucions destacades:** afegir 2-3 bullets sobre feina real feta fins ara (corpus Decfa, ingesta, el que sigui que tinguis)
- [ ] **Adam — Contribucions destacades:** afegir 2-3 bullets (topologia de xarxa, runbook, el que hagis avançat)
- [ ] **Afegir a la capçalera de cada profile:** `Idiomes: Català (natiu) · Castellà (natiu) · Anglès (B2/C1)`
- [ ] **Fotos:** idealment afegir una foto per fundador (format headshot, format JPG/PNG quadrat). Si tenim fotos decents les puc integrar jo. Si no, saltem-nos-ho — no és bloqueant.

---

### Doc 7 — Impact Statement
`proposta/castellano/07_Declaracio_Impacte.tex`

**Propietari suggerit: Adam (operacions / conformitat)**

- [ ] **Afegir mètriques concretes a la card "Competitivitat de les PIMEs":**
  Substituir la línia genèrica de reducció MTTR per una estimació basada en el que hem après als PoCs. Exemple:
  - *"El 90% del temps d'una avaria industrial es perd en diagnosi, no en reparació (basat en entrevistes amb CEOs durant el programa Explorer UPC, 2026)."*
  - *"Cada hora de màquina aturada a una PIME CNC representa entre €200–500 de producció perduda."*
  Si tens altres números de les converses amb Decfa o Paver, usa'ls.

- [ ] **Afegir una secció breu "Alineament SDG"** (petita taula, al final, abans del footer):
  ```
  ODS 8 — Treball decent i creixement econòmic: preservació de llocs de treball tècnics especialitzats
  ODS 9 — Indústria, innovació i infraestructura: digitalització de PIMEs manufactureres
  ODS 12 — Producció i consum responsables: eficiència operativa i reducció de residus per aturades
  ```
  Santander X avalua impacte social. Connectar-nos als ODS és ràpid i suma.

- [ ] **Afegir al footer o capçalera:** menció a Explorer UPC com a validació externa.
  *"Projecte seleccionat al programa Explorer UPC (2026)."*

---

## Resum de tasques per persona

### Arnau
- [ ] Doc 5 (Architecture): afegir resum no-tècnic, actualitzar A-score status, actualitzar deployment status
- [ ] Doc 6 (Equip): aportar les teves dades personals (LinkedIn, email, projectes, idiomes)
- [ ] Doc 4 (Business Plan): si tens números de Decfa (documents ingestats, màquines) → passar-los a Oriol

### Adam
- [ ] Doc 7 (Impact): afegir mètriques MTTR, taula ODS, menció Explorer
- [ ] Doc 6 (Equip): aportar les teves dades personals (LinkedIn, email, projectes, idiomes)
- [ ] Doc 4 (Business Plan): si vols, revisa la secció de riscos/mitigació (és la teva àrea — seguretat, desplegament)

### Oriol (no cal que feu res d'això)
- [ ] Pitch script: re-adaptar per a Santander X (criteris diferents que Explorer)
- [ ] Pitch deck PDF: revisar i adaptar
- [ ] Doc 3 (One Pager): afegir contact info i menció Explorer — ho faig jo
- [ ] Doc 4 (Business Plan): afegir secció Explorer i rang de preus — ho faig jo un cop tingueu el rang de preus parlat
- [ ] Doc 6 (Equip): integrar les dades de tots un cop me les passeu

---

## Termini intern suggerit

> El registre oficial era fins al 16 d'abril. Si estem en una fase de documentació post-registre o hi ha extensió, treballem contra aquell deadline.

| Tasca | Deadline suggerit |
|---|---|
| Arnau + Adam passen dades personals (LinkedIn, email, projectes) | **25 d'abril** |
| Arnau actualitza doc arquitectura | **27 d'abril** |
| Adam actualitza doc impacte | **27 d'abril** |
| Oriol integra tot i tanca versions castellà + anglès | **29 d'abril** |
| Revisió conjunta (30 min call) | **30 d'abril** |

---

## Notes finals

**Sobre `01_Revisio_Document_Corporatiu.tex`:** és un document d'auditoria interna que l'IA va generar sobre la primera versió del corporate doc. Útil com a referència però **NO s'ha de submetre mai.** El podeu ignorar.

**Sobre `06_Diferenciadors_Competitius.tex`:** és bona feina — la matriu competitiva és clara. Si el portal de Santander X permet pujar material addicional, el podem incloure com a suplement. Si no, no és requerit.

**Sobre el nom JOHN:** en algun document anterior apareixia "JOHN" com a nom de producte. Als documents actuals ja no apareix — bé. Si algú el veu en algun lloc, eliminar-lo. El producte no té nom propi de cara a l'exterior (és "XC Gradient").
