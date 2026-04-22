# La Lliga de Nacions — Torneig de Bots (L2)

Mòdul de backend per al **Lliurable 2** del curs de Programació (1r Batxillerat).

Els alumnes programen un bot en Python que competeix en un joc d'interaccions bilaterals
entre 4 països simultanis. El joc és un dilema de cooperació multi-jugador disfressat
de negociació diplomàtica; els alumnes no han de saber-ho.

---

## El joc: mecànica central

Cada partida enfronta **4 països** (el bot de l'alumne + 3 bots de referència).
La partida dura un nombre de rondes **desconegut per als jugadors** (entre 80 i 120,
samplejat uniformement al començament). Aquesta incertesa és deliberada: evita
estratègies de traïció al final de la partida.

Cada ronda, cada país decideix simultàniament una acció per a cadascun dels seus
tres rivals:

| Valor | Acció | Descripció |
|-------|-------|-----------|
| `0` | **PAU** | Oferta de cooperació plena |
| `1` | **TREGUA** | Posició neutral / semi-cooperativa |
| `2` | **GUERRA** | Defecció / posició agressiva |

Les decisions son simultànies i secretes. Un cop revelades, es calculen els punts
bilaterals per a cada parell.

### Matriu de payoff bilateral

Puntuació del jugador A per cada interacció (simètrica en B):

```
           B = PAU   B = TREGUA   B = GUERRA
A = PAU       3          1            0
A = TREGUA    4          2            0.5
A = GUERRA    5          3            1
```

La puntuació total d'un jugador en una ronda és la **suma de les tres interaccions
bilaterals** (una per cada rival). La puntuació acumulada al final de la partida
determina la classificació.

Propietats del disseny:
- `GUERRA` domina en ronda única (incentiu local a defeccionar).
- La cooperació mútua (`PAU`/`PAU` = 3+3 = 6) supera la defecció mútua (`GUERRA`/`GUERRA` = 1+1 = 2).
- `TREGUA` és una tercera opció que obre estratègies graduals d'escalada i desescalada
  impossibles en el dilema binari clàssic.

---

## Interfície del bot (fitxer que reben els alumnes)

L'alumne rep un fitxer `bot.py` amb una única funció a implementar:

```python
def decideix(historial: dict, ronda: int) -> dict:
    """
    Paràmetres
    ----------
    historial : dict
        Clau = ID del rival ('P1', 'P2', 'P3')
        Valor = dict amb:
          'contra_mi'  : list[tuple[int, int]]
              Historial bilateral (la_meva_acció, acció_del_rival) per a cada
              ronda passada. Sempre present.
          'contra_P?'  : list[tuple[int, int]]
              Acció del rival contra un altre jugador (acció_rival, acció_altre).
              NOMÉS present en nivells amb visibilitat plena (L1–L4).
              No existeix en L5 (visibilitat parcial).

    ronda : int
        Índex de la ronda actual, comença en 0.
        La durada total de la partida és desconeguda.

    Retorna
    -------
    dict : {'P1': int, 'P2': int, 'P3': int}
        Una acció (0, 1 o 2) per a cada rival.
    """
    return {rival: 0 for rival in historial}
```

### Restriccions del fitxer

- L'alumne **pot** afegir funcions auxiliars, constants, classes, etc. sota `decideix`.
- L'alumne **pot** importar: `random`, `math`, `collections`, `itertools`, `functools`,
  `statistics`, `copy`.
- L'alumne **no pot** importar: `os`, `sys`, `subprocess`, `socket`, `requests`,
  `shutil`, `pathlib`, `importlib`, ni cap mòdul de xarxa o fitxers.
- La signatura de `decideix(historial, ronda)` és **intocable**.
- Si `decideix` tarda més d'**1 segon** en retornar, la ronda es puntua com a
  `GUERRA` contra tots els rivals (penalització per timeout).

---

## Bots de referència (pool de 6)

Tots els bots de referència implementen la mateixa interfície `decideix`.
Internament utilitzen les tres accions en les versions ternàries (L3–L5).

| Codi intern | Nom de guerra | Comportament |
|-------------|--------------|-------------|
| `colom` | *El Pacifista* | Sempre `PAU` (0) amb tothom |
| `aguila` | *El Bel·licista* | Sempre `GUERRA` (2) amb tothom |
| `aleatori` | *El Caòtic* | Acció aleatòria uniforme (0/1/2 en ternari, 0/2 en binari) |
| `mirall` | *L'Espill* | Copia l'última acció del rival contra ell. Primera ronda: `PAU` |
| `rancoros` | *El Vindicatiu* | `PAU` fins la primera `GUERRA` del rival; llavors `GUERRA` per sempre. `TREGUA` no activa el rancor |
| `reputacio` | *El Jutge* | Calcula la mitjana de totes les accions de cada rival contra tots els jugadors (visibilitat plena) o contra ell (visibilitat parcial). Respon proporcionalment: mitjana < 0.8 → `PAU`, 0.8–1.5 → `TREGUA`, > 1.5 → `GUERRA` |

---

## Configuració dels 5 nivells

Cada nivell enfronta el bot de l'alumne contra 3 bots de referència específics,
amb paràmetres de joc que incrementen la complexitat.

| Nivell | Rivals | Accions | Visibilitat | Rondes |
|--------|--------|---------|-------------|--------|
| **L1** | `colom` + `aleatori` + `aguila` | Binàries {0, 2} | Plena | 80–120 |
| **L2** | `colom` + `mirall` + `aleatori` | Binàries {0, 2} | Plena | 80–120 |
| **L3** | `mirall` + `rancoros` + `aleatori` | **Ternàries {0,1,2}** | Plena | 80–120 |
| **L4** | `mirall` + `rancoros` + `reputacio` | Ternàries | Plena | 80–120 |
| **L5** | `aguila` + `rancoros` + `reputacio` | Ternàries | **Parcial** | 80–120 |

**Condició de superar el nivell:** la puntuació acumulada del bot de l'alumne ha de
ser **estrictament superior a la mitjana** dels tres bots de referència.

**Accions binàries (L1–L2):** l'alumne pot retornar 0 o 2 (els bots tracten 1 com 0).

**Visibilitat parcial (L5):** les claus `contra_P?` no existeixen al diccionari
`historial`. Un bot que les intenta llegir sense `.get()` llançarà `KeyError`.

---

## Fórmula de complexitat dels nivells

Serveix com a justificació formal del disseny progressiu.

### Complexitat individual de cada bot: κ(b)

Tres atributs per bot:

- **ρ(b) ∈ {0,1}** — reactiu: el bot canvia comportament en funció del teu historial
- **m(b) ∈ {0,1,2,3}** — profunditat de memòria: 0=cap, 1=curta (1 ronda), 2=llarga (acumulada bilateral), 3=global (acumulada tots els jugadors)
- **α(b) ∈ {0,1}** — pressió coercitiva: l'òptim aïllat contra aquest bot és GUERRA

```
κ(b) = ρ(b) · m(b) + α(b)
```

| Bot | ρ | m | α | κ |
|-----|---|---|---|---|
| `colom` | 0 | 0 | 0 | **0** |
| `aleatori` | 0 | 0 | 0 | **0** |
| `aguila` | 0 | 0 | 1 | **1** |
| `mirall` | 1 | 1 | 0 | **1** |
| `rancoros` | 1 | 2 | 0 | **2** |
| `reputacio` | 1 | 3 | 0 | **3** |

### Tensió estratègica del nivell: τ(B)

Mesura la fracció de parells de bots amb estratègies òptimes contradictòries.

Accions òptimes aïllades (π*):
- π* = **PAU** → `mirall`, `rancoros`, `reputacio`
- π* = **GUERRA** → `colom`, `aguila`, `aleatori`

```
τ(B) = 2 · n_PAU · n_GUERRA / |B|²
```

### Complexitat del joc: Φ(L)

Captura els paràmetres a nivell de partida:

- **γ(L) ∈ {0,1}** — accions ternàries actives
- **δ(L) ∈ {0,1}** — visibilitat parcial activa

```
Φ(L) = γ(L)/2 + δ(L)/4
```

### Complexitat total del nivell

```
C(L) = (1/|B|) · Σ κ(b) + τ(B) + Φ(L)
```

| Nivell | κ̄ | τ | Φ | **C(L)** |
|--------|---|---|---|----------|
| L1 | 1/3 | 0 | 0 | **0.33** |
| L2 | 1/3 | 4/9 | 0 | **0.78** |
| L3 | 1 | 4/9 | 1/2 | **1.94** |
| L4 | 2 | 0 | 1/2 | **2.50** |
| L5 | 2 | 4/9 | 3/4 | **3.19** |

---

## Estructura del torneig

### Fase 1 — Fase de nivells (nota base L2)

- Cada alumne executa el seu bot contra els 5 nivells de forma independent.
- Cada nivell superat val **2 punts** sobre 10.
- **Condició de llindar:** cal superar **≥ 3 nivells** per obtenir qualsevol nota.
  Menys de 3 nivells → nota L2 = 0.
- Nota base = `nivells_superats × 2` (màxim 10).

### Fase 2 — Fase competitiva (bonus)

Accedeixen els alumnes que superen el llindar de 3 nivells. Els bots qualificats
juguen entre ells en rondes d'eliminació:

- Cada ronda, tots els bots classificats juguen simultàniament una partida
  multi-jugador (tots contra tots, 4 a 4 o en blocs si hi ha molts classificats).
- El bot amb la puntuació acumulada més baixa és eliminat.
- Quan queden **4 bots**, es disputen unes semifinals per fixar la classificació
  final (posicions 1–4).

**Bonus b(i)** en funció de la posició final i (1 = guanyador):

Definicions:
- K = conjunt d'alumnes classificats al torneig (|K| variable)
- W = top 4 (|W| = 4)

```
        1                          si i ∈ W
b(i) =  (|K| − r(i) + 1)          si i ∈ K \ W
        ────────────────
          (|K| − |W| + 1)
        0                          si i ∉ K
```

on r(i) és la posició final de l'alumne i al torneig.

### Nota final L2

```
nota_L2 = nota_base + b(i)
nota_final_curs += nota_L2 × 0.25   (pes del lliurable)
```

---

## Arquitectura tècnica prevista

```
backend/app/tournament/
├── README.md           ← aquest fitxer
├── config.py           # LEVEL_CONFIG, PAYOFF_MATRIX, ROUNDS_MIN/MAX
├── game.py             # run_round(), compute_scores(), build_historial()
├── runner.py           # run_match(bots, level_config) → MatchResult
├── sandbox.py          # validate_source(), load_bot(), safe_call()
├── scoring.py          # passed_level(), bonus_b(), final_grade_l2()
└── reference_bots/
    ├── colom.py
    ├── aguila.py
    ├── aleatori.py
    ├── mirall.py
    ├── rancoros.py
    └── reputacio.py
```

### Nous models de base de dades

| Model | Camps principals |
|-------|-----------------|
| `BotSubmission` | `student_id`, `file_path`, `uploaded_at`, `is_active` |
| `LevelResult` | `student_id`, `level`, `student_score`, `avg_bot_score`, `passed`, `run_at` |
| `TournamentMatch` | `round_number`, `players_json`, `scores_json`, `run_at` |
| `TournamentStanding` | `student_id`, `final_position`, `bonus` |

### Nous endpoints API

| Mètode | Ruta | Actor | Descripció |
|--------|------|-------|-----------|
| `POST` | `/tournament/bot` | Alumne | Puja `bot.py` |
| `GET` | `/tournament/bot/me` | Alumne | Estat del bot actiu |
| `GET` | `/tournament/results/me` | Alumne | Nivells superats + nota provisional |
| `POST` | `/tournament/levels/run` | Admin | Executa la fase de nivells (tots els alumnes) |
| `POST` | `/tournament/bracket/run` | Admin | Executa la fase competitiva |
| `GET` | `/tournament/bracket` | Ambdós | Estat del bracket |
| `POST` | `/tournament/finalize` | Admin | Escriu nota L2 definitiva a grades |

---

## Seguretat d'execució

Els bots dels alumnes s'executen amb les següents salvaguardes:

1. **Validació estàtica (AST):** es comprova el codi font abans de guardar. Qualsevol
   `import` de mòduls de sistema llança un error de validació i el fitxer és rebutjat.

2. **Timeout per crida:** cada invocació de `decideix` s'executa en un thread amb
   límit d'1 segon. Si el bot no retorna a temps, la ronda comptabilitza `GUERRA`
   contra tots els rivals.

3. **Validació del resultat:** si `decideix` retorna un dict amb claus incorrectes,
   valors fora de {0,1,2}, o llança una excepció, la ronda comptabilitza `GUERRA`.

Per a una classe de ~18 alumnes, la combinació `importlib` + `threading.Timer` és
suficient. Un entorn Docker per bot seria més segur però és innecessari a aquesta escala.

---

## Flux operatiu (visió del professor)

```
1. Publicar bot_template.py i el document del lliurable als alumnes
2. Alumnes pugen bot.py via frontend (espai L2 del seu tauler)
3. [Admin] "Executar fase de nivells" → processa tots els bots contra els 5 nivells
4. Alumnes veuen quins nivells han superat i la nota provisional
5. [Admin] "Executar torneig" → rodes d'eliminació fins a semifinals
6. [Admin] "Finalitzar" → calcula bonus b(i) i escriu nota definitiva L2
```
