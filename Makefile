.PHONY: install dev build preview test test-visual test-update-snapshots clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

test:
	npm run test:e2e

test-visual:
	npm run test:e2e -- e2e/visual.spec.js

test-update-snapshots:
	npm run test:e2e -- e2e/visual.spec.js --update-snapshots

clean:
	rm -rf dist test-results
