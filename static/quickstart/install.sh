#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Semantic version pattern: 1.2.3 or v1.2.3, with optional pre-release suffix
SEMVER_REGEX='^v?[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$'

validate_semver() {
    local version="$1"
    local context="$2"
    if [[ ! "$version" =~ $SEMVER_REGEX ]]; then
        echo -e "${RED}✗ Invalid version format: $version${NC}"
        [[ -n "$context" ]] && echo "  $context"
        exit 1
    fi
}

# Configuration
OPENTDF_VERSION="${OPENTDF_VERSION:-latest}"
INSTALL_DIR="${HOME}/.opentdf"
OPENTDF_DIR="${INSTALL_DIR}/platform"
OTDFCTL_BIN="${INSTALL_DIR}/bin"

# Validate OPENTDF_VERSION from environment
if [[ "$OPENTDF_VERSION" != "latest" ]]; then
    validate_semver "$OPENTDF_VERSION" "Expected format: 'latest', '1.2.3', or 'v1.2.3'"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   OpenTDF Quick Start Installer"
echo "   For evaluation and development only"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Detect OS and architecture
ARCH=$(uname -m)
case "$ARCH" in
    x86_64|amd64|arm64|aarch64)
        ;;
    *)
        echo -e "${RED}✗ Unsupported architecture: $ARCH${NC}"
        echo "  Supported: x86_64, amd64, arm64, aarch64"
        exit 1
        ;;
esac

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="darwin"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    echo -e "${RED}✗ Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

echo -e "${BLUE}→${NC} Detected OS: $OS ($ARCH)"
echo ""

# Detect docker compose command early (needed for "already installed" message)
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker compose"  # Default fallback
fi

# Check if already installed
if [ -d "$OPENTDF_DIR" ]; then
    echo -e "${YELLOW}⚠ OpenTDF appears to be already installed at $OPENTDF_DIR${NC}"
    echo ""
    read -p "Do you want to reinstall? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo -e "${GREEN}OpenTDF is already installed!${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🚀 To start the platform:"
        echo ""
        echo "  1. Start Docker/Colima (if not running):"
        echo "     # For Colima users (macOS)"
        echo "     colima start"
        echo ""
        echo "     # For Docker Desktop users"
        echo "     # Start Docker Desktop from Applications"
        echo ""
        echo "  2. Start OpenTDF services:"
        echo "     cd $OPENTDF_DIR"
        echo "     $COMPOSE_CMD up -d"
        echo ""
        echo "🛠️  Management commands:"
        echo "   Stop:    cd $OPENTDF_DIR && $COMPOSE_CMD down"
        echo "   Start:   cd $OPENTDF_DIR && $COMPOSE_CMD up -d"
        echo "   Restart: cd $OPENTDF_DIR && $COMPOSE_CMD restart"
        echo "   Logs:    cd $OPENTDF_DIR && $COMPOSE_CMD logs -f"
        echo "   Status:  cd $OPENTDF_DIR && $COMPOSE_CMD ps"
        echo ""
        echo "✅ Verify it's running:"
        echo "   https://platform.opentdf.local:8443/healthz"
        echo "   (Should show: {\"status\":\"SERVING\"})"
        echo ""
        echo "📚 Full documentation:"
        echo "   https://opentdf.io/quickstart"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        exit 0
    fi
    echo -e "${BLUE}→${NC} Stopping existing services..."
    (cd "$OPENTDF_DIR" && $COMPOSE_CMD down 2>/dev/null) || true
fi

# Create installation directory
mkdir -p "$INSTALL_DIR"
mkdir -p "$OTDFCTL_BIN"

# Function to install otdfctl
install_otdfctl() {
    echo -e "${BLUE}→${NC} Installing otdfctl CLI..."

    # Get the latest release version
    RELEASE_URL="https://api.github.com/repos/opentdf/otdfctl/releases/latest"
    if [[ "$OPENTDF_VERSION" == "latest" ]]; then
        VERSION=$(curl -s "$RELEASE_URL" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
        if [ -z "$VERSION" ]; then
            echo -e "${RED}✗ Could not determine latest otdfctl version${NC}"
            exit 1
        fi
        validate_semver "$VERSION" "This may indicate a compromised API response."
    else
        VERSION="$OPENTDF_VERSION"
    fi

    echo -e "${BLUE}  Downloading otdfctl $VERSION...${NC}"

    # Determine the correct archive name
    local PLATFORM=""
    local EXTENSION=""
    if [[ "$OS" == "darwin" ]]; then
        if [[ "$ARCH" == "arm64" ]]; then
            PLATFORM="darwin-arm64"
        else
            PLATFORM="darwin-amd64"
        fi
        EXTENSION="tar.gz"
    elif [[ "$OS" == "linux" ]]; then
        if [[ "$ARCH" == "aarch64" ]] || [[ "$ARCH" == "arm64" ]]; then
            PLATFORM="linux-arm64"
        else
            PLATFORM="linux-amd64"
        fi
        EXTENSION="tar.gz"
    elif [[ "$OS" == "windows" ]]; then
        PLATFORM="windows-amd64"
        EXTENSION="zip"
    fi

    # Remove 'v' prefix if present
    VERSION_NUM="${VERSION#v}"
    ARCHIVE_NAME="otdfctl-${VERSION_NUM}-${PLATFORM}.${EXTENSION}"
    DOWNLOAD_URL="https://github.com/opentdf/otdfctl/releases/download/${VERSION}/${ARCHIVE_NAME}"

    # Download and extract
    local TEMP_DIR
    TEMP_DIR=$(mktemp -d)
    if curl -fsSL "$DOWNLOAD_URL" -o "$TEMP_DIR/$ARCHIVE_NAME"; then
        cd "$TEMP_DIR"
        if [[ "$EXTENSION" == "tar.gz" ]]; then
            tar -xzf "$ARCHIVE_NAME"
        elif [[ "$EXTENSION" == "zip" ]]; then
            unzip -q "$ARCHIVE_NAME"
        fi

        # Find and move the binary (it's in target/ subdirectory with version in name)
        BINARY_WITH_VERSION="target/otdfctl-${VERSION_NUM}-${PLATFORM}"
        if [ -f "$BINARY_WITH_VERSION" ]; then
            mv "$BINARY_WITH_VERSION" "$OTDFCTL_BIN/otdfctl"
            chmod +x "$OTDFCTL_BIN/otdfctl"
        elif [ -f "target/otdfctl-${VERSION_NUM}-${PLATFORM}.exe" ]; then
            mv "target/otdfctl-${VERSION_NUM}-${PLATFORM}.exe" "$OTDFCTL_BIN/otdfctl.exe"
            chmod +x "$OTDFCTL_BIN/otdfctl.exe"
        elif [ -f "otdfctl" ]; then
            mv otdfctl "$OTDFCTL_BIN/otdfctl"
            chmod +x "$OTDFCTL_BIN/otdfctl"
        else
            echo -e "${RED}✗ Could not find otdfctl binary in archive${NC}"
            echo "Expected: $BINARY_WITH_VERSION"
            ls -la
            rm -rf "$TEMP_DIR"
            exit 1
        fi

        rm -rf "$TEMP_DIR"
        echo -e "${GREEN}✓${NC} otdfctl $VERSION installed to $OTDFCTL_BIN/otdfctl"
    else
        echo -e "${RED}✗ Could not download otdfctl from $DOWNLOAD_URL${NC}"
        echo "Please check your internet connection and try again."
        rm -rf "$TEMP_DIR"
        exit 1
    fi
}

# Function to check Docker
check_docker() {
    echo -e "${BLUE}→${NC} Checking Docker..."

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker is not installed${NC}"
        echo ""
        echo "Please install Docker:"
        echo "  macOS/Windows: https://docs.docker.com/desktop/"
        echo "  Linux: https://docs.docker.com/engine/install/"
        exit 1
    fi

    if ! docker ps &> /dev/null; then
        echo -e "${RED}✗ Docker is not running${NC}"
        echo ""
        echo "Please start Docker and try again."
        exit 1
    fi

    # Check for docker-compose or docker compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        echo -e "${RED}✗ docker-compose not found${NC}"
        echo "Please install docker-compose: https://docs.docker.com/compose/install/"
        exit 1
    fi

    echo -e "${GREEN}✓${NC} Docker is running"
    echo -e "${GREEN}✓${NC} Using: $COMPOSE_CMD"
}

# Function to add hosts entries
add_hosts_entries() {
    echo ""
    echo -e "${BLUE}→${NC} Configuring /etc/hosts..."

    HOSTS_ENTRIES=(
        "127.0.0.1 platform.opentdf.local"
        "127.0.0.1 keycloak.opentdf.local"
    )

    NEEDS_UPDATE=false
    for entry in "${HOSTS_ENTRIES[@]}"; do
        if ! grep -q "$entry" /etc/hosts 2>/dev/null; then
            NEEDS_UPDATE=true
            break
        fi
    done

    if [ "$NEEDS_UPDATE" = true ]; then
        echo "The following entries need to be added to /etc/hosts:"
        for entry in "${HOSTS_ENTRIES[@]}"; do
            echo "  $entry"
        done
        echo ""
        echo -e "${YELLOW}This requires sudo access.${NC}"

        for entry in "${HOSTS_ENTRIES[@]}"; do
            if ! grep -q "$entry" /etc/hosts 2>/dev/null; then
                echo "$entry" | sudo tee -a /etc/hosts > /dev/null
            fi
        done

        echo -e "${GREEN}✓${NC} Hosts entries added"
    else
        echo -e "${GREEN}✓${NC} Hosts entries already configured"
    fi
}

# Function to download and setup docker-compose
setup_docker_compose() {
    echo ""
    echo -e "${BLUE}→${NC} Setting up OpenTDF platform..."

    # Clone or download the platform configuration
    if [ -d "$OPENTDF_DIR" ]; then
        rm -rf "$OPENTDF_DIR"
    fi

    mkdir -p "$OPENTDF_DIR"
    cd "$OPENTDF_DIR"

    # Download the docker-compose file from the getting started docs
    echo -e "${BLUE}→${NC} Downloading docker-compose configuration..."
    curl -fsSL https://raw.githubusercontent.com/opentdf/docs/main/docs/getting-started/docker-compose.yaml -o docker-compose.yaml

    if [ ! -f docker-compose.yaml ] || [ ! -s docker-compose.yaml ]; then
        echo -e "${RED}✗ Failed to download docker-compose.yaml${NC}"
        exit 1
    fi

    # Create .env file with JAVA_OPTS_APPEND to suppress warning
    if [[ "$OS" == "darwin" ]] && [[ "$ARCH" == "arm64" ]]; then
        echo 'JAVA_OPTS_APPEND="-XX:UseSVE=0"' > .env
    else
        echo 'JAVA_OPTS_APPEND=""' > .env
    fi

    echo -e "${GREEN}✓${NC} Platform configuration ready"
}

# Function to start services
start_services() {
    echo ""
    echo -e "${BLUE}→${NC} Starting OpenTDF services..."
    echo -e "${YELLOW}   This may take 2-3 minutes on first run...${NC}"
    echo ""

    cd "$OPENTDF_DIR"

    # Handle M4 chip environment variable if needed
    if [[ "$OS" == "darwin" ]] && [[ "$ARCH" == "arm64" ]]; then
        export JAVA_OPTS_APPEND="-XX:UseSVE=0"
    fi

    # Start services
    $COMPOSE_CMD up -d

    echo ""
    echo -e "${BLUE}→${NC} Waiting for services to become healthy..."

    # Wait for services to be ready (with timeout)
    local MAX_WAIT=180
    local WAIT_TIME=0
    local SLEEP_INTERVAL=5

    while [ $WAIT_TIME -lt $MAX_WAIT ]; do
        # Check if key services are healthy
        if $COMPOSE_CMD ps | grep -q "healthy" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Services are starting up"
            break
        fi

        echo -n "."
        sleep $SLEEP_INTERVAL
        WAIT_TIME=$((WAIT_TIME + SLEEP_INTERVAL))
    done

    echo ""

    # Additional wait for services to be fully ready
    echo -e "${BLUE}→${NC} Waiting for platform to be fully ready..."
    sleep 15

    echo -e "${GREEN}✓${NC} Services started"
}

# Function to import certificates
import_certificates() {
    echo ""
    echo -e "${BLUE}→${NC} Configuring SSL certificates..."

    # Wait for Caddy to generate certificates
    echo -e "${BLUE}  Waiting for Caddy to generate certificates...${NC}"
    local MAX_WAIT=30
    local WAIT_TIME=0
    while [ $WAIT_TIME -lt $MAX_WAIT ]; do
        if $COMPOSE_CMD exec -T caddy ls /data/caddy/certificates/local/platform.opentdf.local/platform.opentdf.local.crt &>/dev/null; then
            break
        fi
        sleep 2
        WAIT_TIME=$((WAIT_TIME + 2))
    done

    # Extract root CA certificate from Docker volume
    # We only need to trust the root CA, which automatically trusts all site certificates
    local TEMP_CERT_DIR
    TEMP_CERT_DIR=$(mktemp -d)
    if $COMPOSE_CMD exec -T caddy cat /data/caddy/pki/authorities/local/root.crt > "$TEMP_CERT_DIR/caddy-root.crt" 2>/dev/null; then

        if [[ "$OS" == "darwin" ]]; then
            # macOS - use security command
            echo -e "${BLUE}  Importing Caddy root CA to macOS keychain...${NC}"
            if sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$TEMP_CERT_DIR/caddy-root.crt" 2>/dev/null; then
                echo -e "${GREEN}✓${NC} Caddy root CA imported to System keychain"
                echo -e "${YELLOW}  Note: You may need to restart your browser${NC}"
            else
                echo -e "${YELLOW}⚠${NC} Certificate import requires sudo access (was denied or failed)"
                echo "  To manually import the root CA:"
                echo "    1. Extract: docker exec platform-caddy-1 cat /data/caddy/pki/authorities/local/root.crt > caddy-root.crt"
                echo "    2. Double-click caddy-root.crt and add to System keychain"
                echo "  Or use: curl -k (to skip certificate verification)"
            fi

        elif [[ "$OS" == "linux" ]]; then
            # Linux - detect distribution and use appropriate method
            if [ -f /etc/debian_version ]; then
                # Debian/Ubuntu
                echo -e "${BLUE}  Importing Caddy root CA (Debian/Ubuntu)...${NC}"
                if sudo cp "$TEMP_CERT_DIR/caddy-root.crt" /usr/local/share/ca-certificates/caddy-local-authority.crt 2>/dev/null && \
                   sudo update-ca-certificates 2>/dev/null; then
                    echo -e "${GREEN}✓${NC} Root CA imported"
                else
                    echo -e "${YELLOW}⚠${NC} Certificate import failed"
                fi
            elif [ -f /etc/redhat-release ] || [ -f /etc/fedora-release ]; then
                # RHEL/CentOS/Fedora
                echo -e "${BLUE}  Importing Caddy root CA (RHEL/CentOS/Fedora)...${NC}"
                if sudo cp "$TEMP_CERT_DIR/caddy-root.crt" /etc/pki/ca-trust/source/anchors/caddy-local-authority.crt 2>/dev/null && \
                   sudo update-ca-trust 2>/dev/null; then
                    echo -e "${GREEN}✓${NC} Root CA imported"
                else
                    echo -e "${YELLOW}⚠${NC} Certificate import failed"
                fi
            elif [ -f /etc/arch-release ]; then
                # Arch Linux
                echo -e "${BLUE}  Importing Caddy root CA (Arch Linux)...${NC}"
                if sudo cp "$TEMP_CERT_DIR/caddy-root.crt" /etc/ca-certificates/trust-source/anchors/caddy-local-authority.crt 2>/dev/null && \
                   sudo trust extract-compat 2>/dev/null; then
                    echo -e "${GREEN}✓${NC} Root CA imported"
                else
                    echo -e "${YELLOW}⚠${NC} Certificate import failed"
                fi
            else
                echo -e "${YELLOW}⚠${NC} Unknown Linux distribution, cannot auto-import certificates"
                echo "  See: https://opentdf.io/getting-started#trust-self-signed-certificates"
            fi

        else
            # Windows
            echo -e "${YELLOW}⚠${NC} Automatic certificate import not supported on Windows"
            echo "  Manual steps:"
            echo "    1. Extract root CA: docker exec platform-caddy-1 cat /data/caddy/pki/authorities/local/root.crt > caddy-root.crt"
            echo "    2. Open Certificate Manager (certmgr.msc)"
            echo "    3. Import caddy-root.crt to Trusted Root Certification Authorities"
            echo "  Or use: curl -k or otdfctl --tls-no-verify"
        fi

        # Clean up temp directory
        rm -rf "$TEMP_CERT_DIR"
    else
        echo -e "${YELLOW}⚠${NC} Could not extract root CA from Caddy"
        echo "  Certificates will be self-signed. You can:"
        echo "    - Accept browser security warnings (safe for local dev)"
        echo "    - Manually extract and trust the root CA"
        echo "    - Use: curl -k or otdfctl --tls-no-verify"
        echo "  See: https://opentdf.io/getting-started#trust-self-signed-certificates"
    fi
}

# Function to run smoke test
run_smoke_test() {
    echo ""
    echo -e "${BLUE}→${NC} Running connectivity test..."

    # Add otdfctl to PATH temporarily
    export PATH="$OTDFCTL_BIN:$PATH"

    # Test if the platform is responding
    if curl -k -s https://platform.opentdf.local > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Platform is responding"
    else
        echo -e "${YELLOW}⚠${NC} Platform connectivity test failed (this may be normal during initial startup)"
    fi
}

# Function to show completion message
show_completion() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✓ OpenTDF installation complete!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📍 Installation directory: $INSTALL_DIR"
    echo ""
    echo "🚀 Getting started:"
    echo ""
    echo "  1. Add otdfctl to your PATH:"
    echo "     export PATH=\"$OTDFCTL_BIN:\$PATH\""
    echo ""
    echo "  2. Or create a symlink:"
    echo "     sudo ln -sf $OTDFCTL_BIN/otdfctl /usr/local/bin/otdfctl"
    echo ""
    echo "  3. Test the installation:"
    echo "     $OTDFCTL_BIN/otdfctl --version"
    echo ""
    echo "  4. Create an otdfctl profile:"
    echo "     $OTDFCTL_BIN/otdfctl profile create platform-otdf-local https://platform.opentdf.local:8443"
    echo ""
    echo "🌐 Access points:"
    echo "   Platform: https://platform.opentdf.local:8443"
    echo "   Keycloak: https://keycloak.opentdf.local:9443"
    echo ""
    echo "📚 Next steps:"
    echo "   Quickstart Guide: https://opentdf.io/quickstart"
    echo "   Documentation: https://opentdf.io/introduction"
    echo ""
    echo "🛠️  Management commands:"
    echo "   Stop:    cd $OPENTDF_DIR && $COMPOSE_CMD down"
    echo "   Start:   cd $OPENTDF_DIR && $COMPOSE_CMD up -d"
    echo "   Logs:    cd $OPENTDF_DIR && $COMPOSE_CMD logs -f"
    echo "   Status:  cd $OPENTDF_DIR && $COMPOSE_CMD ps"
    echo ""
    echo "⚠️  Note: This setup is for evaluation only."
    echo "   For production deployment guidance, visit: https://opentdf.io"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main installation flow
main() {
    install_otdfctl
    check_docker
    add_hosts_entries
    setup_docker_compose
    start_services
    import_certificates
    run_smoke_test
    show_completion
}

# Run main installation
main
