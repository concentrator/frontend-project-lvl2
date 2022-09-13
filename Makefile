install:
	npm ci

publish-test:
	npm publish --dry-run

lint:
	npx eslint .
