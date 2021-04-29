export

.DEFAULT_GOAL := default

# Adding "-o xtrace" will print all shell commands (useful for debugging)
SHELL := /usr/bin/env bash -o errexit -o nounset -o pipefail
PROJECT_ROOT := $(shell git rev-parse --show-toplevel)
ARTEFACT_DIRECTORY := $(PROJECT_ROOT)/output
BUILD_DIRECTORY := $(ARTEFACT_DIRECTORY)/build
MAKE_TARGET_REGEX := ^[a-zA-Z%_-]+:
PACKAGE_DIRECTORY := $(ARTEFACT_DIRECTORY)/package

ENV ?= dev

include .env .env.$(ENV)
include $(PROJECT_ROOT)/make/*.mk

# Automatically mark all targets as .PHONY
# (since we're not using file-based targets)
.PHONY: $(shell grep -E -h "$(MAKE_TARGET_REGEX)" $(MAKEFILE_LIST) | sed s/:.*// | tr '\n' ' ')

default: lint test build bootstrap deploy stacks sleep-10 smoke ## Check, test, build, deploy and verify the code
