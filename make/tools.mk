check-%: # Check that a variable is defined, e.g. make check-ENV
	@: $(if $(value $*),,$(error $* is undefined))

sleep-%: # Sleep for n seconds, e.g. make sleep-5
	sleep $*

dump: ## Dump all make variables
	@$(foreach V, $(sort $(.VARIABLES)), \
		$(if $(filter-out environment% default automatic, $(origin $V)), \
			$(info $V=$($V) ($(value $V))) \
		) \
	)
	@echo > /dev/null

encrypt:
	aws kms encrypt \
		--key-id "$(AWS_KMS_KEY_ID)" \
		--plaintext fileb://<(echo '$(PLAINTEXT)') \
		--query CiphertextBlob \
		--output text \
		--profile ${ENV}

decrypt:
	aws kms decrypt \
		--ciphertext-blob fileb://<(echo '$(CIPHERTEXT)' | base64 -d) \
		--query Plaintext \
		--output text \
		--profile ${ENV} \
		| base64 -d
