ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.PHONY: help
## help: show list of available commands.
help : Makefile
	@echo "+--------------------+"
	@echo "| AVAILABLE COMMANDS |"
	@echo "+--------------------+"
	@cat Makefile | grep "##" | sed -n 's/^## /make /p' | column -t -s ':' && echo ""

.PHONY: run-services
## run-services: Run the backend test services (mongo, mailslurper).
run-services:
	./bin/run-mongo-if-not-running
	docker compose -f docker-compose.backend.yml up -d mailslurper

.PHONY: run-test-backend
## run-test-backend: Run the backend for manual test runs (ts or clojure).
run-test-backend: run-services
	./bin/run-backend-for-tests $${LIMA_TEST_BACKEND:-ts}

.PHONY: cucumber-js
## cucumber-js: Run the backend features on the TypeScript cucumber-js harness (TS backend).
cucumber-js: run-services
	LIMA_TEST_BACKEND=ts ./bin/cucumber-js

.PHONY: cucumber-js-clj
## cucumber-js-clj: Same harness against the legacy Clojure backend (double verification).
cucumber-js-clj: run-services
	LIMA_TEST_BACKEND=clojure ./bin/cucumber-js

.PHONY: typecheck
## typecheck: Typecheck the backend and the BDD harness.
typecheck:
	npx tsc -p tsconfig.backend.json
	npx tsc -p tests-ts/tsconfig.json
