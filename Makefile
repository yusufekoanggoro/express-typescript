build: clean format build-dist

build-dist:
	@echo 'compiling typescript project'
	npm run build

format:
	@echo 'format code with prettier'
	npm run prettier-format

lint:
	@echo 'execute linter'
	npm run lint
	
clean:
	@echo 'cleaning current distribution folder'
	rm -rf dist/