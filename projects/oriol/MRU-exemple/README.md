# Guia EXHAUSTIVA i RESTRICTIVA per a la Creació d'Exercicis de MRU en LaTeX

Aquest document és el reglament absolut per a qualsevol model d'IA o humà que hagi de generar o modificar un exercici de Moviment Rectilini Uniforme (MRU) en aquest espai de treball. **S'han d'obeir Totes i cadascuna d'aquestes regles sense excepció.**

## 1. Regles Globals i Estils Bàsics
*   **Idioma:** Tot el document ha de ser en **Català**.
*   **Gestió de Colors Bàsica:** 
    *   Tot el que sigui enunciat, estructura, títols i eixos gràfics ha de ser estrictament text **NEGRE** (`\color{black}`).
    *   Tota la lògica matemàtica, desenvolupament, resolució i fórmules manipulades ha de ser estrictament **BLAU** (`\color{blue}`).

## 2. Enunciat i Caixa "Passos a seguir"
*   **L'Enunciat del Problema:** Ha d'estar en **text pla** (fora de qualsevol caixa o taula).
*   **Subratllat Numèric:** Dins de l'enunciat de text pla, absolutament **TOTA dada numèrica i la seva unitat** ha d'estar subratllada i de color vermell. Plantilla exacta: `{\color{red}\underline{350\,\text{km}}}`.
*   **La "Cheat Sheet" / Passos a seguir:** Just sota l'enunciat, és OBLIGATORI un `tcolorbox` actuant com a recepta (Marc negre `colframe=black`, fons gris clar `colback=black!5`).
*   **Llista de Passos:** A dins del `tcolorbox`, els passos SÓN UNA LLISTA `enumerate` (no pas una taula). S'ha d'especificar l'ús de Ps (Preguntes, no pas Qs).

## 3. Identificació i Ús de Variables (Molt Restrictiu)
Sempre que es defineixin els trams, els intervals o bé les preguntes/incògnites (sobretot en les seccions 2, 3 i 4), s'han de seguir estàndards exactes:
*   **Nomenclatura Espaial:** Els trossos de distància s'anomenen per NÚMEROS: `Tram 1`, `Tram 2`.
*   **Nomenclatura Temporal:** Els trossos de temps s'anomenen per LLETRES: `Interval A`, `Interval B`.
*   **Inògnites:** Anomenades per `P1, P2, P3` i respostes per `R1, R2, R3`.
*   **FORMAT VISUAL DEL TEXT:** MAI s'han de pintar les variables amb fons de color (`\colorbox` totalment PROHIBIT). Les crides a variables en les llistes i textos s'han de marcar amb un **subratllat cian sobre text en negreta blau**.
    *   *Plantilla exacta:* `\textcolor{cyan}{\underline{\textcolor{blue}{\textbf{Tram 1 (BCN $\to$ GDL)}}}}`
    *   S'aplica també a `P1`, a `$t_{\text{conducció}}$`, a `$\Delta t_B$`, etc.

## 4. Fórmules (Apartat 1)
*   Ha de ser una taula on explicitin les divisions i deltes (`\Delta x`, `\Delta t`).
*   Text de la capçalera ("Fórmula", "Unitats SI") TOTALMENT **negre**. 
*   Variables dins la taula i unitats (`[m/s]`) TOTALMENT **blaus**.

## 5. Esquemes 1D (Espacial i Temporal)
S'han de dibuixar dos `tikzpicture` separats, un per la Distància i l'altre pel Temps.
*   **Eixos i lletres base:** NEGRE.
*   **Fletxes Distància/Temps:** Les sagetes que mesuren quant dura un interval (`<->`) han de ser CIAN i GRUIXUDES (`\draw[<->, thick, cyan]`).
*   **Text de les Mides:** El text indicador (ex: `Tram 1 \n \Delta x_1`) ha de ser BLAU, i ha d'anar **SEMPRE SOTA** la fletxa, MAI creuant-la o al bell mig tallant la línia. Obligatori ús de `align=center` i fer el salt de línia amb `\\`.

## 6. Gràfic Posició-Temps (x-t) en Pgfplots (CRÍTIC)
Aquest és l'element amb les restriccions més severes per l'estètica:
1.  **Sense Nombres Reals als Eixos:** Als eixos visuals només hi pot haver VARIABLES, mai nombres matemàtics referents a temps o espai.
    *   Exemple Eix X: `$t_0, t_1, t_2, t_{\text{total}}$`
    *   Exemple Eix Y: `$x_0, x_1, x_{final}$`
2.  **Línies Guia:** Grid principal en `blue!20` i secundari `blue!10`. Les línies dels eixos i els valors dels ticks TOTALMENT NEGRES. Cap rotació (MAI utilitzar `rotate=45` ni cap altre valor).
3.  **Fons de Seguretat per Variables:** Tot el text dels ticks (ex: `$t_1$`) a l'eix ha de tenir fons blanc per evitar que cap línia els talli (`text=black, fill=white, inner sep=2pt`).
4.  **Descripcions dels Esdeveniments (Fletxes Morades Puntejades):** 
    *   Des de cada marca d'eix ha de sortir una fletxa que expliqui l'esdeveniment (ex: `Lleva`, `Surt de Barcelona`).
    *   La fletxa ha de ser PORPRA, PUNTEJADA i GRUIXUDA: `\draw[->, purple, thick, dotted]`.
    *   **Prohibit Creuar Variables:** Les fletxes han d'arrencar mès a la vora del paper *sense creuar la variable alfanumèrica*. Cal usar desplaçaments com `[yshift=-0.5cm]`.
    *   **Asimetria / "Staggering":** Per garantir que les descripcions morades no es trepitgin horizontalment (eix X), la llargada d'aquestes fletxes s'ha d'alternar manualment jugant amb les coordenades finals de desplaçament (ex: una acaba a `yshift=-1.2cm` i la adjacent a `yshift=-2.2cm`).
5.  **Anotacions de Trams / Intervals sobre el Gràfic:** Com a marc decoratiu al voltant del propi gràfic, a la zona superior aniran les mides de temps en cian (`Int. A \\ \Delta t_A`) i a la zona dreta les de distància. També multi-línia en BLAU i Fletxa CIAN.

## 7. Caixa de Respostes Finals i Format de Temps
*   L'últim segment ha de ser la resolució per obtenir `P1, P2...` escrita en blau.
*   El text final on hi ha la sentència concloent va dins d'un repquadre vermell: `tcolorbox` amb `colframe=red!70!black`, `colback=red!5`, lletra blava i negreta per valors concrets.
*   **ESTA FORMAT ESTRICTE D'HORES (CRÍTIC):** Al donar els resultats temporals s'ha de donar primer l'equivalent en segons i després s'indica de manera obligatòria i explícita usant `\implies` la forma horària sota aquesta màscara OBLIGATÒRIA:
    *   **`HH:MM\,\text{h}\ (SS\,\text{s})`** -> Literalment, primer format hores/minuts, MÉS la `h` literal adosada, i al final entre parèntesis els segons restants literals.
    *   *Exemple Exigible:* `05:53\,\text{h}\ (25\,\text{s})`
    *   No es pot posar la "h" darrere o dins del parèntesis. Ha d'estar abans d'obrir el parèntesi.
