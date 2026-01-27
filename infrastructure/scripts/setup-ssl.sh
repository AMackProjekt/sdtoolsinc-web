#!/bin/bash

# SSL Certificate Configuration Script for Azure Static Web Apps
# This script helps configure SSL certificates for custom domains

set -e

RESOURCE_GROUP="toolsinc-rg"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}SSL Certificate Configuration for T.O.O.L.S Inc${NC}"
echo ""

echo -e "${YELLOW}Note: Azure Static Web Apps automatically provisions free SSL certificates${NC}"
echo -e "${YELLOW}for custom domains via managed certificates.${NC}"
echo ""

# Function to check SSL status
check_ssl_status() {
  local app_name=$1
  local domain=$2
  
  echo -e "${YELLOW}Checking SSL status for ${domain} on ${app_name}...${NC}"
  
  az staticwebapp hostname show \
    --name "$app_name" \
    --resource-group "$RESOURCE_GROUP" \
    --hostname "$domain" \
    --query "sslState" -o tsv
  
  echo -e "${GREEN}✓ SSL status checked${NC}"
}

echo -e "${GREEN}=== SSL Certificate Status ===${NC}\n"

# Check all domains
echo "Main website (www.sdtoolsinc.org):"
check_ssl_status "toolsinc-web" "www.sdtoolsinc.org" || echo "Not configured yet"

echo ""
echo "Client portal (client.sdtoolsinc.org):"
check_ssl_status "toolsinc-client-portal" "client.sdtoolsinc.org" || echo "Not configured yet"

echo ""
echo "Case manager portal (staff.sdtoolsinc.org):"
check_ssl_status "toolsinc-casemgr-portal" "staff.sdtoolsinc.org" || echo "Not configured yet"

echo ""
echo "Admin portal (admin.sdtoolsinc.org):"
check_ssl_status "toolsinc-admin-portal" "admin.sdtoolsinc.org" || echo "Not configured yet"

echo ""
echo "Portal hub (portal.sdtoolsinc.org):"
check_ssl_status "toolsinc-portal-hub" "portal.sdtoolsinc.org" || echo "Not configured yet"

echo ""
echo -e "${GREEN}SSL certificate check complete!${NC}"
echo ""
echo -e "${YELLOW}Important Notes:${NC}"
echo "1. SSL certificates are automatically managed by Azure"
echo "2. Certificate provisioning may take 5-10 minutes after domain validation"
echo "3. Ensure DNS records are properly configured before SSL provisioning"
echo "4. Certificates are automatically renewed before expiration"
