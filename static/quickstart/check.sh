#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 OpenTDF Pre-flight Check"
echo ""

ERRORS=0
WARNINGS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ERRORS=$((ERRORS + 1))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# Check OS
echo "Checking operating system..."
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    print_status 0 "Linux detected"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    print_status 0 "macOS detected"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    print_status 0 "Windows detected (Git Bash/Cygwin)"
else
    print_status 1 "Unsupported OS: $OSTYPE"
fi
echo ""

# Check for Docker or Podman
echo "Checking container runtime..."
HAS_DOCKER=0
HAS_PODMAN=0

if command -v docker &> /dev/null; then
    if docker ps &> /dev/null; then
        HAS_DOCKER=1
        print_status 0 "Docker found and running"
    else
        print_warning "Docker found but not running. Try: 'docker ps'"
    fi
else
    print_status 1 "Docker not found"
fi

if command -v podman &> /dev/null; then
    HAS_PODMAN=1
    print_status 0 "Podman found"
fi

if [ $HAS_DOCKER -eq 0 ] && [ $HAS_PODMAN -eq 0 ]; then
    echo -e "${RED}   Install Docker: https://docs.docker.com/get-docker/${NC}"
fi
echo ""

# Check for docker-compose
echo "Checking docker-compose..."
if command -v docker-compose &> /dev/null; then
    print_status 0 "docker-compose found ($(docker-compose --version))"
elif docker compose version &> /dev/null; then
    print_status 0 "docker compose plugin found ($(docker compose version))"
else
    print_status 1 "docker-compose not found"
    echo -e "${RED}   Install: https://docs.docker.com/compose/install/${NC}"
fi
echo ""

# Check for curl
echo "Checking required tools..."
if command -v curl &> /dev/null; then
    print_status 0 "curl found"
else
    print_status 1 "curl not found (required for installation)"
fi
echo ""

# Check available memory
echo "Checking system resources..."
if [[ "$OS" == "macos" ]]; then
    TOTAL_MEM=$(sysctl -n hw.memsize)
    TOTAL_MEM_GB=$((TOTAL_MEM / 1024 / 1024 / 1024))
    if [ $TOTAL_MEM_GB -ge 4 ]; then
        print_status 0 "Memory: ${TOTAL_MEM_GB}GB available"
    else
        print_warning "Memory: ${TOTAL_MEM_GB}GB (4GB+ recommended)"
    fi
elif [[ "$OS" == "linux" ]]; then
    TOTAL_MEM=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    TOTAL_MEM_GB=$((TOTAL_MEM / 1024 / 1024))
    if [ $TOTAL_MEM_GB -ge 4 ]; then
        print_status 0 "Memory: ${TOTAL_MEM_GB}GB available"
    else
        print_warning "Memory: ${TOTAL_MEM_GB}GB (4GB+ recommended)"
    fi
fi
echo ""

# Check available disk space
echo "Checking disk space..."
if [[ "$OS" == "macos" ]]; then
    # macOS uses -g for gigabytes (lowercase)
    AVAILABLE_SPACE=$(df -g . | tail -1 | awk '{print $4}')
    if [ "$AVAILABLE_SPACE" -ge 10 ]; then
        print_status 0 "Disk space: ${AVAILABLE_SPACE}GB available"
    else
        print_warning "Disk space: ${AVAILABLE_SPACE}GB (10GB+ recommended)"
    fi
elif [[ "$OS" == "linux" ]]; then
    # Linux uses -BG for gigabytes
    AVAILABLE_SPACE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$AVAILABLE_SPACE" -ge 10 ]; then
        print_status 0 "Disk space: ${AVAILABLE_SPACE}GB available"
    else
        print_warning "Disk space: ${AVAILABLE_SPACE}GB (10GB+ recommended)"
    fi
fi
echo ""

# Check if ports are available
echo "Checking port availability..."
check_port() {
    if [[ "$OS" == "macos" ]] || [[ "$OS" == "linux" ]]; then
        if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            print_warning "Port $1 is already in use"
            return 1
        else
            print_status 0 "Port $1 is available"
            return 0
        fi
    else
        print_status 0 "Port $1 (check skipped on Windows)"
        return 0
    fi
}

check_port 8080
check_port 5432
check_port 65432
echo ""

# Check for sudo access (needed for /etc/hosts)
echo "Checking permissions..."
if [[ "$OS" != "windows" ]]; then
    if sudo -n true 2>/dev/null; then
        print_status 0 "sudo access available (no password required)"
    else
        print_status 0 "sudo access available (will prompt for password)"
    fi
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Ready to install OpenTDF:"
    echo "  curl -fsSL https://opentdf.io/install.sh | bash"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Passed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "You can proceed, but some features may not work optimally:"
    echo "  curl -fsSL https://opentdf.io/install.sh | bash"
else
    echo -e "${RED}✗ Failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before installing."
    exit 1
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
