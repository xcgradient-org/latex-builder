# .latexmkrc
$pdf_mode = 1;
$bibtex_use = 2;
$pdf_previewer = 'okular %O %S';
$pdf_update_method = 0;
$pdflatex = 'pdflatex -interaction=nonstopmode -synctex=1 %O %S';
$clean_ext = 'synctex.gz synctex.gz(busy) run.xml tex.bak bbl bcf fdb_latexmk run tdo %R-blx.bib';
