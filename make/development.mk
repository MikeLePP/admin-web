build: clean  ## Compile and package the code
	npm run build

clean: ## Clean up the project artefacts
	npm run clean

lint: ## Lint the code
	npx eslint .

serve:
	npm run serve

start:
	npm run start

test: ## Run unit tests
	npx jest --passWithNoTests

smoke: check-API_URL ## Execute smoke tests against the deployed environment
	curl $(API_URL)/messages -H "Content-Type: application/json" -d '{"text":"hello"}'
	curl $(API_URL)/messages
