const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");

const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "projects");
const logoPath = path.join(rootDir, "brand-assets", "logo.png");

function normalizeName(rawName) {
  return String(rawName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseRequestedProject(args) {
  const values = args.filter(Boolean);

  if (values[0] === "--project") {
    if (values.length !== 3) {
      throw new Error("Usage: make PROJECT=oriol thesis or make oriol thesis");
    }

    return {
      namespace: normalizeName(values[1]),
      projectName: normalizeName(values[2]),
    };
  }

  if (values.length === 2) {
    return {
      namespace: normalizeName(values[0]),
      projectName: normalizeName(values[1]),
    };
  }

  if (values.length === 1) {
    return {
      namespace: "",
      projectName: normalizeName(values[0]),
    };
  }

  throw new Error("Usage: make <name> | make PROJECT=oriol <name> | make oriol <name>");
}

function projectKeyFromParts(namespace, projectName) {
  return namespace ? `${namespace}/${projectName}` : projectName;
}

function titleFromName(projectName) {
  return projectName
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function projectExists(projectName) {
  return fs.existsSync(path.join(projectsDir, ...String(projectName).split("/")));
}

async function requestUniqueName(initialProject) {
  let namespace = initialProject.namespace;
  let projectName = initialProject.projectName;

  if (!projectName) {
    throw new Error("Project name is required. Example: make thesis-2026");
  }

  while (projectExists(projectKeyFromParts(namespace, projectName))) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw new Error(`Project "${projectKeyFromParts(namespace, projectName)}" already exists. Run make <new-name>.`);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await rl.question(
      `Project "${projectKeyFromParts(namespace, projectName)}" already exists. Enter a new project name: `
    );
    rl.close();

    const nextName = normalizeName(answer);
    if (!nextName) {
      console.error("Project name cannot be empty.");
      continue;
    }

    projectName = nextName;
  }

  return {
    namespace,
    projectName,
    projectKey: projectKeyFromParts(namespace, projectName),
  };
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function writeExecutable(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  fs.chmodSync(filePath, 0o755);
}

function localMakefile() {
  return `DOC ?= $(notdir $(CURDIR))

.PHONY: pdf watch clean

pdf:
\tlatexmk -pdf $(DOC).tex

watch:
\tlatexmk -pdf -pvc $(DOC).tex

clean:
\tlatexmk -C $(DOC).tex
`;
}

function latexmkrc() {
  return `# .latexmkrc — latexmk configuration
$pdf_mode = 1;
$bibtex_use = 2;
$pdf_previewer = 'okular %O %S';
$pdf_update_method = 0;
$pdflatex = 'pdflatex -interaction=nonstopmode -synctex=1 %O %S';
$clean_ext = 'synctex.gz synctex.gz(busy) run.xml tex.bak bbl bcf fdb_latexmk run tdo %R-blx.bib';
`;
}

function projectGitignore() {
  return `*.aux
*.bbl
*.bcf
*.blg
*.fdb_latexmk
*.fls
*.lof
*.log
*.lot
*.loe
*.out
*.run.xml
*.synctex.gz
*.toc
`;
}

function referencesBib() {
  return `% ============================================================
%  references.bib — Standard BibLaTeX / Biber database
% ============================================================

@misc{upc_ects,
  title  = {Sistema de Evaluación y Créditos},
  author = {{Universitat Politècnica de Catalunya}},
  year   = {2026},
  url    = {https://www.upc.edu/sri/es/movilidad/movilidad-estudiantes/incomings/estudiar-en-la-upc/copy_of_sistema-de-evaluacion-y-creditos},
  note   = {Accessed: 10th March 2026.}
}

@book{pmbok_guide,
  title     = {{A Guide to the Project Management Body of Knowledge (PMBOK® Guide) – Seventh Edition}},
  author    = {{Project Management Institute}},
  year      = {2021},
  publisher = {Project Management Institute},
  isbn      = {978-1628256642}
}

@article{trivedi2023ircot,
  author  = {Trivedi, Harsh and others},
  title   = {Interleaving Retrieval and Chain-of-Thought Reasoning for Knowledge-Intensive NLP},
  journal = {ACL 2023},
  year    = {2023},
  note    = {[Online]. Available: \\url{https://arxiv.org/abs/2212.10509}. [Accessed: 21st February 2026]}
}
`;
}

function mainTex(projectName) {
  const title = titleFromName(projectName);
  return `%% ============================================================
%%  ${projectName}.tex — Root document
%%  Build:  latexmk -pdf ${projectName}.tex
%% ============================================================
\\documentclass[12pt, a4paper, twoside]{report}

%% ── Encoding & fonts ─────────────────────────────────────────
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{siunitx}

%% ── Language ─────────────────────────────────────────────────
\\usepackage[english]{babel}

%% ── Page geometry ────────────────────────────────────────────
\\usepackage[
  top=2.5cm, bottom=2.5cm,
  inner=3cm,  outer=2cm
]{geometry}

%% ── Graphics ─────────────────────────────────────────────────
\\usepackage{graphicx}
\\graphicspath{
  {./}
  {chapters/chapter01/figures/}
  {chapters/chapter02/figures/}
  {chapters/chapter03/figures/}
  {chapters/chapter04/figures/}
  {chapters/chapter05/figures/}
  {chapters/chapter06/figures/}
  {chapters/chapter07/figures/}
}

%% ── Miscellaneous utilities ──────────────────────────────────
\\usepackage{amsmath, amssymb}
\\usepackage{booktabs}
\\usepackage[nopatch=footnote]{microtype}
\\usepackage[table]{xcolor}
\\usepackage{tikz}
\\usetikzlibrary{positioning, arrows.meta}
\\usepackage{float}
\\usepackage{pgfgantt}
\\usepackage{pdflscape}
\\usepackage[most]{tcolorbox}
\\usepackage{enumitem}
\\usepackage[official]{eurosym}
\\usepackage{setspace}

\\setstretch{1.2}
\\setlength{\\parskip}{0.6em plus 0.2em minus 0.1em}
\\setlength{\\parindent}{17pt}

%% ── Chapter formatting (titlesec) ────────────────────────────
\\usepackage{xcolor}
\\usepackage{titlesec}

\\definecolor{chaptergray}{gray}{0.75}
\\definecolor{upcblue}{RGB}{0,51,153}
\\definecolor{fibred}{RGB}{190,30,45}
\\definecolor{linkblue}{RGB}{0,84,166}

\\titleformat{\\chapter}[hang]
  {\\Huge\\bfseries}
  {\\thechapter\\hspace{15pt}\\textcolor{chaptergray}{|}\\hspace{15pt}}
  {0pt}
  {\\Huge\\bfseries}

\\titlespacing*{\\chapter}{0pt}{-20pt}{30pt}

%% ── Header / footer (fancyhdr) ───────────────────────────────
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\setlength{\\headheight}{14.5pt}
\\renewcommand{\\headrulewidth}{0.4pt}
\\renewcommand{\\footrulewidth}{0pt}
\\fancyhead[LE]{\\nouppercase{\\scshape\\leftmark}}
\\fancyhead[LO]{\\nouppercase{\\scshape\\rightmark}}
\\fancyhead[RE,RO]{UPC-FIB}
\\fancyfoot[C]{\\textbf{\\thepage}}

\\fancypagestyle{plain}{
  \\fancyhf{}
  \\fancyfoot[C]{\\textbf{\\thepage}}
  \\renewcommand{\\headrulewidth}{0pt}
}

%% ── Bibliography (biblatex + biber) ──────────────────────────
\\usepackage{csquotes}
\\usepackage[
  backend  = biber,
  style    = ieee,
  sorting  = none
]{biblatex}
\\addbibresource{references.bib}

\\usepackage{amsthm}
\\usepackage{thmtools}

%% ── Hyperlinks ───────────────────────────────────────────────
\\usepackage[
  colorlinks = true,
  linkcolor  = blue,
  citecolor  = blue,
  urlcolor   = blue
]{hyperref}

\\usepackage{cleveref}

\\declaretheoremstyle[
  headfont=\\bfseries,
  bodyfont=\\normalfont,
  spaceabove=6pt,
  spacebelow=6pt,
  notefont=\\normalfont\\small\\itshape,
  notebraces={}{},
]{thmstyle}

\\declaretheorem[style=thmstyle, name=Theorem,
  refname={theorem,theorems},
  Refname={Theorem,Theorems}]{theorem}
\\declaretheorem[style=thmstyle, name=Proposition, sibling=theorem]{proposition}
\\declaretheorem[style=thmstyle, name=Lemma, sibling=theorem]{lemma}
\\declaretheorem[style=thmstyle, name=Corollary, sibling=theorem]{corollary}
\\declaretheorem[style=thmstyle, name=Definition, sibling=theorem]{definition}

\\newcommand{\\DocumentTitle}{${title}}
\\newcommand{\\DocumentAuthor}{Student Name}
\\newcommand{\\ThesisSupervisor}{Supervisor Name}
\\newcommand{\\GeTutorNames}{Tutor Name}
\\newcommand{\\DocumentDate}{\\today}

%% ============================================================
\\begin{document}

\\begin{titlepage}
  \\thispagestyle{empty}
  \\newgeometry{top=2cm, bottom=2cm, left=2.5cm, right=2.5cm}

  \\noindent
  \\begin{minipage}[c]{0.62\\textwidth}
    \\includegraphics[height=2cm]{logo}
  \\end{minipage}%
  \\hfill
  \\begin{minipage}[c]{0.3\\textwidth}
    \\raggedleft
  \\end{minipage}

  \\vspace{0.35cm}
  {\\color{upcblue}\\noindent\\rule{\\linewidth}{1.2pt}}
  \\vspace{0.1cm}

  \\vfill

  \\begin{center}
    {\\LARGE\\bfseries \\DocumentTitle\\par}
  \\end{center}

  \\vspace{2.2cm}

  \\begin{center}
    {\\large\\bfseries \\DocumentAuthor\\par}
  \\end{center}

  \\vfill

  \\begin{center}
    {\\small Thesis supervisor\\par}
    \\vspace{2pt}
    {\\small\\textcolor{upcblue}{\\ThesisSupervisor}\\par}

    \\vspace{10pt}

    {\\small GEP tutor(s)\\par}
    \\vspace{2pt}
    {\\small\\textcolor{upcblue}{\\GeTutorNames}\\par}

    \\vspace{10pt}

    {\\small Degree\\par}
    \\vspace{2pt}
    {\\small{Bachelor's Degree in Informatics Engineering (Computing)}\\par}
  \\end{center}

  \\vspace{1.2cm}

  \\begin{center}
    {\\normalsize\\bfseries GEP Final Deliverable: Project Management Report\\par
      \\vspace{0.3cm}
      \\DocumentDate\\par
    }
  \\end{center}

  \\vfill

  {\\color{upcblue}\\noindent\\rule{\\linewidth}{0.6pt}}
  \\vspace{0.3cm}

  \\begin{center}
    {\\normalsize\\bfseries
      Facultat d'Inform\\\\\`atica de Barcelona (FIB)\\\\[2pt]
      Universitat Polit\\\\\`ecnica de Catalunya (UPC) --- BarcelonaTech\\par}
  \\end{center}

  \\restoregeometry
\\end{titlepage}

\\pagenumbering{roman}
\\tableofcontents
\\listoffigures
\\listoftables

\\DeclareRobustCommand{\\loesource}[1]{\\newline \\textit{\\small #1}}
\\listoftheorems
\\DeclareRobustCommand{\\loesource}[1]{}

\\clearpage
\\pagenumbering{arabic}

\\include{chapters/chapter01/chapter01}
\\include{chapters/chapter02/chapter02}
\\include{chapters/chapter03/chapter03}
%\\include{chapters/chapter04/chapter04}
%\\include{chapters/chapter05/chapter05}
%\\include{chapters/chapter06/chapter06}
%\\include{chapters/chapter07/chapter07}

\\printbibliography[heading=bibintoc]

\\end{document}
`;
}

function chapterFile(title, label, inputs) {
  return `%% ============================================================
%%  ${path.basename(label)}.tex
%% ============================================================
\\chapter{${title}}
\\label{${label}}

${inputs.map((entry) => `\\input{${entry}}`).join("\n")}
`;
}

function filesForProject(projectName) {
  return {
    [`${projectName}.tex`]: mainTex(projectName),
    ".latexmkrc": latexmkrc(),
    ".gitignore": projectGitignore(),
    "Makefile": localMakefile(),
    "references.bib": referencesBib(),
    "chapters/chapter01/chapter01.tex": chapterFile("Introduction", "chap:introduction", [
      "chapters/chapter01/sec01_introduction_and_context",
      "chapters/chapter01/sec02_justification",
      "chapters/chapter01/sec03_project_scope",
      "chapters/chapter01/sec04_methodology_and_rigor",
    ]),
    "chapters/chapter01/sec01_introduction_and_context.tex": `\\section{Introduction and Contextualization}
\\label{sec:introduction-and-contextualization}

This generated project follows the same chaptered academic structure as the reference GEP report. The scaffold keeps the document split into chapter folders, uses the same report class and bibliography backend, and is intended to serve as a reusable starting point for UPC-FIB style project management documentation.

The document is organized to remain readable as it grows: front matter first, then main chapters, then the bibliography. Citations use \\texttt{biblatex} with the \\texttt{biber} backend, matching the analyzed setup\\cite{trivedi2023ircot}.

\\subsection{Academic and Professional Context}
\\label{subsec:context}

This boilerplate is designed for formal university deliverables and keeps the same visual discipline as the source project: generous margins, explicit chapter starts, structured headers, and a thesis-style title page.
`,
    "chapters/chapter01/sec02_justification.tex": `\\section{Justification}
\\label{sec:justification}

The generator standardizes the setup work that otherwise gets repeated manually for every report.

\\begin{table}[H]
  \\centering
  \\begin{tabular}{@{}lll@{}}
    \\toprule
    Component & Decision & Motivation \\\\
    \\midrule
    Document class & report & Chapter-oriented thesis layout \\\\
    Bibliography & biblatex + biber & Stable citation workflow \\\\
    Build tool & latexmk & Correct multi-pass compilation \\\\
    Source layout & chapter folders & Maintainable long-form writing \\\\
    \\bottomrule
  \\end{tabular}
  \\caption{Key document decisions inherited from the reference project. \\textit{Source: Compiled by the author.}}
  \\label{tab:template-decisions}
\\end{table}

\\begin{definition}
  A reusable LaTeX scaffold is a project skeleton that preserves formatting and build conventions while minimizing setup cost.
\\end{definition}
\\loesource{Compiled by the author.}

\\begin{figure}[H]
  \\centering
  \\begin{tikzpicture}[node distance=2.3cm, >=Latex]
    \\node[draw, rounded corners, fill=blue!5, minimum width=3.1cm, minimum height=1cm] (template) {Builder};
    \\node[draw, rounded corners, fill=red!5, right=of template, minimum width=3.3cm, minimum height=1cm] (generator) {Scaffold Script};
    \\node[draw, rounded corners, fill=green!5, right=of generator, minimum width=3.1cm, minimum height=1cm] (project) {New Report};
    \\draw[->, thick] (template) -- (generator);
    \\draw[->, thick] (generator) -- (project);
  \\end{tikzpicture}
  \\caption{Flow from reusable builder to generated LaTeX project. \\textit{Source: Compiled by the author.}}
  \\label{fig:scaffold-flow}
\\end{figure}
`,
    "chapters/chapter01/sec03_project_scope.tex": `\\section{Project Scope}
\\label{sec:project-scope}

This scaffold standardizes project initialization while leaving the report content fully editable.

\\subsection{Requirements}
\\label{subsec:requirements}

\\begin{itemize}
  \\item The front matter includes a Table of Contents, List of Figures, and List of Tables.
  \\item Bibliography management matches the analyzed project through \\texttt{biblatex} with \\texttt{biber}.
  \\item The source tree remains chapter-oriented and uses \\texttt{\\textbackslash input} and \\texttt{\\textbackslash include}.
  \\item Compilation is reproducible through a local Makefile and \\texttt{latexmk}.
\\end{itemize}
`,
    "chapters/chapter01/sec04_methodology_and_rigor.tex": `\\section{Methodology and Rigor}
\\label{sec:methodology-and-rigor}

\\begin{tcolorbox}[colback=blue!3, colframe=upcblue, title=Validation checklist]
The generated project should compile with \\texttt{make pdf} inside the project directory. A successful build confirms that the TOC, LOF, LOT, theorem list, and bibliography passes are wired correctly.
\\end{tcolorbox}
`,
    "chapters/chapter02/chapter02.tex": chapterFile("Project Planning", "chap:project-planning", [
      "chapters/chapter02/sec01_description_of_tasks",
      "chapters/chapter02/sec02_estimates_and_gantt",
      "chapters/chapter02/sec03_risk_management",
    ]),
    "chapters/chapter02/sec01_description_of_tasks.tex": `\\section{Description of Tasks}
\\label{sec:description-of-tasks}

The builder decomposes the report into independently editable chapter files so the writing process stays modular as the project grows.
`,
    "chapters/chapter02/sec02_estimates_and_gantt.tex": `\\section{Estimates and the Gantt Chart}
\\label{sec:estimates-and-the-gantt-chart}

\\begin{table}[H]
  \\centering
  \\begin{tabular}{@{}lcc@{}}
    \\toprule
    Task & Estimated Hours & Output \\\\
    \\midrule
    Analyze reference structure & 4 & Formatting notes \\\\
    Create LaTeX scaffold & 6 & Reusable project template \\\\
    Validate build chain & 2 & Working PDF generation \\\\
    \\bottomrule
  \\end{tabular}
  \\caption{Illustrative task summary. \\textit{Source: Compiled by the author.}}
  \\label{tab:task-summary}
\\end{table}

\\begin{landscape}
\\begin{figure}[p]
  \\centering
  \\begin{ganttchart}[
    x unit=0.7cm,
    y unit chart=0.8cm,
    vgrid,
    hgrid,
    title height=1,
    bar/.style={fill=upcblue!60},
    title/.style={fill=upcblue!10}
  ]{1}{6}
    \\gantttitle{Illustrative Work Plan}{6} \\\\
    \\gantttitlelist{1,...,6}{1} \\\\
    \\ganttbar{Structure analysis}{1}{2} \\\\
    \\ganttbar{Project scaffolding}{3}{5} \\\\
    \\ganttbar{Compilation validation}{6}{6}
  \\end{ganttchart}
  \\caption{Illustrative Gantt chart included to preserve the same planning-oriented package stack as the reference report. \\textit{Source: Compiled by the author.}}
  \\label{fig:gantt-chart}
\\end{figure}
\\end{landscape}
`,
    "chapters/chapter02/sec03_risk_management.tex": `\\section{Risk Management, Alternative Plans, and Obstacles}
\\label{sec:risk-management-alternative-plans-and-obstacles}

\\begin{tcolorbox}[colback=red!3, colframe=fibred, title=Representative risks]
\\begin{itemize}
  \\item Missing LaTeX dependencies in the local TeX distribution.
  \\item Manual edits that break the generated chapter include paths.
  \\item Divergence between figure locations and \\texttt{\\textbackslash graphicspath}.
\\end{itemize}
\\end{tcolorbox}
`,
    "chapters/chapter03/chapter03.tex": chapterFile("Budget and Sustainability", "chap:budget-sustainability", [
      "chapters/chapter03/sec01_budget",
      "chapters/chapter03/sec02_sustainability",
    ]),
    "chapters/chapter03/sec01_budget.tex": `\\section{Budget}
\\label{sec:budget}

\\begin{table}[H]
  \\centering
  \\begin{tabular}{@{}lrr@{}}
    \\toprule
    Item & Units & Cost \\\\
    \\midrule
    Structural design time & 10 h & 300.00 \\euro \\\\
    Build automation time & 3 h & 90.00 \\euro \\\\
    Validation & 2 h & 60.00 \\euro \\\\
    \\midrule
    Total & 15 h & 450.00 \\euro \\\\
    \\bottomrule
  \\end{tabular}
  \\caption{Illustrative budget table in the same report style. \\textit{Source: Compiled by the author.}}
  \\label{tab:budget-summary}
\\end{table}
`,
    "chapters/chapter03/sec02_sustainability.tex": `\\section{Sustainability}
\\label{sec:sustainability}

Consistent project initialization reduces formatting churn, lowers maintenance overhead across reports, and improves readability for supervisors and evaluators\\cite{pmbok_guide}.
`,
    "chapters/chapter04/chapter04.tex": `\\chapter{Design}
\\label{chap:design}

\\section{Architecture}
\\label{sec:architecture}

Use this chapter for the formal system or methodology design.
`,
    "chapters/chapter05/chapter05.tex": `\\chapter{Implementation}
\\label{chap:implementation}

\\section{Implementation Details}
\\label{sec:impldetails}

Use this chapter for implementation details and reproducibility notes.
`,
    "chapters/chapter06/chapter06.tex": `\\chapter{Testing and Validation}
\\label{chap:testing}

\\section{Evaluation}
\\label{sec:evaluation}

Use this chapter for experiments, validation, and testing results.
`,
    "chapters/chapter07/chapter07.tex": `\\chapter{Conclusions}
\\label{chap:conclusions}

\\section{Conclusions}
\\label{sec:conclusions}

Use this chapter for conclusions and future work.
`,
  };
}

function scaffoldFiles(projectKey, projectName) {
  const projectDir = path.join(projectsDir, ...projectKey.split("/"));
  const files = filesForProject(projectName);

  for (const relativePath of Object.keys(files)) {
    const targetPath = path.join(projectDir, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    writeFile(targetPath, files[relativePath]);
  }

  const figureDirs = [
    "chapters/chapter01/figures",
    "chapters/chapter02/figures",
    "chapters/chapter03/figures",
    "chapters/chapter04/figures",
    "chapters/chapter05/figures",
    "chapters/chapter06/figures",
    "chapters/chapter07/figures",
  ];

  for (const dir of figureDirs) {
    const absDir = path.join(projectDir, dir);
    fs.mkdirSync(absDir, { recursive: true });
    writeFile(path.join(absDir, ".gitkeep"), "");
  }

  if (!fs.existsSync(logoPath)) {
    throw new Error(`Missing logo asset at ${logoPath}`);
  }

  fs.copyFileSync(logoPath, path.join(projectDir, "logo.png"));

  writeExecutable(
    path.join(projectDir, "update.sh"),
    `#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

cd "$PROJECT_DIR"
latexmk -pdf "$PROJECT_NAME.tex"
echo "Updated $PROJECT_DIR/$PROJECT_NAME.pdf"
`
  );

  return projectDir;
}

async function main() {
  const requestedProject = parseRequestedProject(process.argv.slice(2));
  const project = await requestUniqueName(requestedProject);
  const projectDir = scaffoldFiles(project.projectKey, project.projectName);
  console.log(`Created ${path.relative(rootDir, projectDir)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
