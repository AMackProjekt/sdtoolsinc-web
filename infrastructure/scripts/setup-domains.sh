#!/bin/bash

# Azure Static Web Apps Custom Domain Setup Script
# Run this script to configure custom domains for all portals

set -e

RESOURCE_GROUP="toolsinc-rg"
LOCATION="eastus"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up custom domains for T.O.O.L.S Inc portals...${NC}"

# Function to add custom domain to SWA
add_custom_domain() {
  local app_name=$1
  local domain=$2
  
  echo -e "${YELLOW}Adding domain ${domain} to ${app_name}...${NC}"
  
  az staticwebapp hostname set \
    --name "$app_name" \
    --resource-group "$RESOURCE_GROUP" \
    --hostname "$domain"
  
  echo -e "${GREEN}✓ Domain ${domain} added to ${app_name}${NC}"
}

# Main website domains
echo -e "\n${GREEN}=== Main Website ===${NC}"
add_custom_domain "toolsinc-web" "www.sdtoolsinc.org"
add_custom_domain "toolsinc-web" "sdtoolsinc.org"

# Client portal
echo -e "\n${GREEN}=== Client Portal ===${NC}"
add_custom_domain "toolsinc-client-portal" "client.sdtoolsinc.org"

# Case manager portal
echo -e "\n${GREEN}=== Case Manager Portal ===${NC}"
add_custom_domain "toolsinc-casemgr-portal" "staff.sdtoolsinc.org"

# Admin portal
echo -e "\n${GREEN}=== Admin Portal ===${NC}"
add_custom_domain "toolsinc-admin-portal" "admin.sdtoolsinc.org"

# Portal hub
echo -e "\n${GREEN}=== Portal Hub ===${NC}"
add_custom_domain "toolsinc-portal-hub" "portal.sdtoolsinc.org"

echo -e "\n${GREEN}Custom domain setup complete!${NC}"
echo -e "${YELLOW}Important: Update your DNS records with the following CNAME entries:${NC}"
echo ""
echo "www.sdtoolsinc.org        → [SWA hostname from Azure]"
echo "client.sdtoolsinc.org     → [SWA hostname from Azure]"
echo "staff.sdtoolsinc.org      → [SWA hostname from Azure]"
echo "admin.sdtoolsinc.org      → [SWA hostname from Azure]"
echo "portal.sdtoolsinc.org     → [SWA hostname from Azure]"
echo ""
echo -e "${YELLOW}Run the following to get hostnames:${NC}"
echo "az staticwebapp show --name toolsinc-web --resource-group $RESOURCE_GROUP --query defaultHostname -o tsv"
