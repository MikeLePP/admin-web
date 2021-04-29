TAGS_INPUT_FILE := $(PROJECT_ROOT)/tags/tags.env
TAGS_OUTPUT_FILE := $(ARTEFACT_DIRECTORY)/tags.env

bootstrap: tags ## Setup your environment for use with the toolkit.
	npx cdk bootstrap --profile $(ENV)

cdk-deploy:
	npx cdk deploy --require-approval never "*" --progress events --profile $(ENV)

deploy: tags cdk-deploy ## Deploy all resources to AWS

describe-stack: check-STACK_NAME # List outputs for a specific stack, e.g. make describe-stack STACK_NAME=...
	@aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" \
		--output table \
	| sed s/DescribeStacks/$(STACK_NAME)/

destroy: ## Clean up the resources in AWS
	npx cdk destroy --force "*"

destroy-%: check-STACK_PREFIX # Clean up a specific stack in AWS, e.g. make destroy-core
	npx cdk destroy --force "$(STACK_PREFIX)-$*"

diff: # Show differences between CDK app and deployed resources
	npx cdk diff

logs-%: check-STACK_NAME ## Show the logs for a Lambda function, e.g. make logs-api
	$(eval LAMBDA_FUNCTION_NAME := $(STACK_NAME)-$*)
	awslogs get -s 1m -S -G -w /aws/lambda/$(LAMBDA_FUNCTION_NAME) \
		| npx pino-pretty --translateTime SYS:standard

stacks: ## List all stacks and their outputs
	@npx cdk list 2>/dev/null \
	| xargs -L 1 -I '{}' \
		$(MAKE) --no-print-directory describe-stack STACK_NAME={}

synth-%: check-STACK_PREFIX # Generate the CloudFormation template for a stack, e.g. make synth-core
	npx cdk synth "$(STACK_PREFIX)-$*"

tags: # Resolve and generate tags for AWS resources
	@mkdir -p $(ARTEFACT_DIRECTORY)
	$(eval RESOLVED_TAGS := $(shell cat $(TAGS_INPUT_FILE) | tr '\n' '|'))
	@printf '$(RESOLVED_TAGS)' | tr '|' '\n' > $(TAGS_OUTPUT_FILE)
