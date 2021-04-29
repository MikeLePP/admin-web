awslocal ssm put-parameter \
    --name $CORE_API_SSM_PARAM_NAME \
    --value "{\"clientId\":\"$CORE_API_CLIENT_ID\",\"clientSecret\":\"$CORE_API_CLIENT_SECRET\"}" \
    --type SecureString \
    --overwrite
