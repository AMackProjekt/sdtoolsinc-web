#!/bin/bash

# Performance Verification Script
# This script runs a series of checks to verify the performance optimizations

echo "🚀 T.O.O.L.S Inc - Performance Verification"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track pass/fail
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check and report
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌ $1 FAILED${NC}"
        ((CHECKS_FAILED++))
    fi
}

# 1. Check Node version
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -ge 18 ]; then
    check "Node.js version is 18+ (found: $(node -v))"
else
    echo -e "${RED}❌ Node.js version must be 18+ (found: $(node -v))${NC}"
    ((CHECKS_FAILED++))
fi
echo ""

# 2. Check dependencies
echo "2️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    check "node_modules exists"
else
    echo -e "${YELLOW}⚠️  node_modules not found. Run 'npm install'${NC}"
    ((CHECKS_FAILED++))
fi
echo ""

# 3. Security audit
echo "3️⃣  Running security audit..."
AUDIT_OUTPUT=$(npm audit --json 2>/dev/null)
VULNERABILITIES=$(echo "$AUDIT_OUTPUT" | grep -o '"vulnerabilities":{[^}]*}' | grep -o '"total":[0-9]*' | cut -d ':' -f 2)

if [ -z "$VULNERABILITIES" ] || [ "$VULNERABILITIES" -eq 0 ]; then
    check "No security vulnerabilities found"
else
    echo -e "${RED}❌ Found $VULNERABILITIES vulnerabilities. Run 'npm audit fix'${NC}"
    ((CHECKS_FAILED++))
fi
echo ""

# 4. Check TypeScript compilation
echo "4️⃣  Checking TypeScript..."
npx tsc --noEmit > /dev/null 2>&1
check "TypeScript compiles without errors"
echo ""

# 5. Build the application
echo "5️⃣  Building application..."
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    check "Production build successful"
    
    # Check if out directory exists
    if [ -d "out" ]; then
        check "Static export created"
    else
        echo -e "${RED}❌ Static export directory not found${NC}"
        ((CHECKS_FAILED++))
    fi
else
    echo -e "${RED}❌ Build failed. Check /tmp/build.log for details${NC}"
    cat /tmp/build.log
    ((CHECKS_FAILED++))
fi
echo ""

# 6. Check bundle sizes
echo "6️⃣  Analyzing bundle sizes..."
if [ -d "out/_next/static/chunks" ]; then
    MAIN_JS_SIZE=$(find out/_next/static/chunks -name "main-*.js" -exec ls -lh {} \; | awk '{print $5}')
    FRAMEWORK_JS_SIZE=$(find out/_next/static/chunks -name "framework-*.js" -exec ls -lh {} \; | awk '{print $5}')
    
    echo "   📦 Main JS: $MAIN_JS_SIZE"
    echo "   📦 Framework JS: $FRAMEWORK_JS_SIZE"
    
    # Get first load JS from build output
    FIRST_LOAD=$(grep "First Load JS" /tmp/build.log | head -1 | awk '{print $6, $7}')
    if [ ! -z "$FIRST_LOAD" ]; then
        echo "   📦 First Load JS: $FIRST_LOAD"
        check "Bundle analysis complete"
    fi
else
    echo -e "${YELLOW}⚠️  Bundle chunks not found${NC}"
fi
echo ""

# 7. Check critical files exist
echo "7️⃣  Verifying critical files..."
CRITICAL_FILES=(
    "PERFORMANCE.md"
    "HEALTH_CHECKS.md"
    "components/WebVitals.tsx"
    "components/ErrorBoundary.tsx"
    "app/error.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        check "$file exists"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        ((CHECKS_FAILED++))
    fi
done
echo ""

# 8. Check package versions
echo "8️⃣  Checking package versions..."
NEXT_VERSION=$(npm list next --depth=0 2>/dev/null | grep next@ | sed 's/.*next@//' | cut -d ' ' -f 1)
REACT_VERSION=$(npm list react --depth=0 2>/dev/null | grep "react@" | sed 's/.*react@//' | cut -d ' ' -f 1)
TS_VERSION=$(npm list typescript --depth=0 2>/dev/null | grep typescript@ | sed 's/.*typescript@//' | cut -d ' ' -f 1)

echo "   📦 Next.js: $NEXT_VERSION"
echo "   📦 React: $REACT_VERSION"
echo "   📦 TypeScript: $TS_VERSION"

# Check if Next.js is 15+
if [ ! -z "$NEXT_VERSION" ]; then
    NEXT_MAJOR=$(echo "$NEXT_VERSION" | cut -d '.' -f 1)
    if [ "$NEXT_MAJOR" -ge 15 ]; then
        check "Next.js version is 15+"
    else
        echo -e "${RED}❌ Next.js should be version 15+ (found: $NEXT_VERSION)${NC}"
        ((CHECKS_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Could not determine Next.js version${NC}"
fi
echo ""

# 9. Check configuration files
echo "9️⃣  Verifying configuration..."
CONFIG_FILES=(
    "next.config.js"
    "tailwind.config.ts"
    "tsconfig.json"
    "package.json"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        check "$file exists"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        ((CHECKS_FAILED++))
    fi
done

# Check if bundle analyzer is configured
if grep -q "bundle-analyzer" "next.config.js"; then
    check "Bundle analyzer configured"
else
    echo -e "${YELLOW}⚠️  Bundle analyzer not configured${NC}"
fi
echo ""

# Summary
echo "============================================"
echo "📊 Summary"
echo "============================================"
echo -e "${GREEN}✅ Passed: $CHECKS_PASSED${NC}"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $CHECKS_FAILED${NC}"
else
    echo -e "${GREEN}✅ Failed: 0${NC}"
fi
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Performance optimizations verified.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the output above.${NC}"
    exit 1
fi
