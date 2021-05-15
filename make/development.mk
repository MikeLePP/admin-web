build: ## Compile and package the code
	npm run build

clean: ## Clean up the project artefacts
	npm run clean

lint: ## Lint the code
	npx eslint .

serve: local-env
	npm run serve

start: local-env
	npm run start

fix:
	npm run fix

test: ## Run unit tests
	npx jest --passWithNoTests

smoke: check-API_URL ## Execute smoke tests against the deployed environment
	curl $(API_URL)/messages -H "Content-Type: application/json" -d '{"text":"hello"}'
	curl $(API_URL)/messages

local-env: # Configure environment variables for connecting to local development resources
	$(eval ENV := local)
	$(eval include .env .env.local)
