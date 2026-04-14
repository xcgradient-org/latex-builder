.DEFAULT_GOAL := help

.PHONY: help build clean build-all clean-all

help:
	@echo "make <name>                 Create a new LaTeX project under projects/<name>"
	@echo "make PROJECT=x <name>       Create projects/<project>/<name>"
	@echo "make <project> <name>       Shorthand for namespaced creation"
	@echo "make build NAME=x           Compile projects/<name>/<leaf>.tex"
	@echo "make build NAME=a/b         Compile projects/<project>/<name>/<name>.tex"
	@echo "make build-all              Compile all root LaTeX documents in this repository"
	@echo "make clean NAME=x           Clean LaTeX build artifacts inside projects/<name>"
	@echo "make clean-all              Clean artifacts for all root LaTeX documents"
	@echo "cd projects/<name> && ./update.sh  Rebuild the PDF locally"

build:
ifndef NAME
	$(error NAME is required. Usage: make build NAME=my-thesis)
endif
	@$(MAKE) -C projects/$(NAME) pdf

clean:
ifndef NAME
	$(error NAME is required. Usage: make clean NAME=my-thesis)
endif
	@$(MAKE) -C projects/$(NAME) clean

build-all:
	@bash scripts/build-all.sh

clean-all:
	@bash scripts/build-all.sh --clean

%:
	@if [ "$@" = "$(firstword $(MAKECMDGOALS))" ]; then \
		if [ -n "$(PROJECT)" ]; then \
			node scripts/scaffold-project.js --project "$(PROJECT)" "$@"; \
		elif [ "$(words $(MAKECMDGOALS))" -eq 2 ]; then \
			node scripts/scaffold-project.js "$(word 1,$(MAKECMDGOALS))" "$(word 2,$(MAKECMDGOALS))"; \
		elif [ "$(words $(MAKECMDGOALS))" -eq 1 ]; then \
			node scripts/scaffold-project.js "$@"; \
		else \
			echo "Usage: make <name> | make PROJECT=<project> <name> | make <project> <name>" >&2; \
			exit 1; \
		fi; \
	fi
