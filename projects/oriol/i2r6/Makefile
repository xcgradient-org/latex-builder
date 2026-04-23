DOC ?= $(notdir $(CURDIR))

.PHONY: all pdf watch clean

all: pdf

pdf:
	latexmk -pdf $(DOC).tex

watch:
	latexmk -pdf -pvc $(DOC).tex

clean:
	latexmk -C $(DOC).tex
