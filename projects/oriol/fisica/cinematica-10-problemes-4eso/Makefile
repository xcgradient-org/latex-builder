DOC ?= $(notdir $(CURDIR))

.PHONY: pdf watch clean

pdf:
	latexmk -pdf $(DOC).tex

watch:
	latexmk -pdf -pvc $(DOC).tex

clean:
	latexmk -C $(DOC).tex
