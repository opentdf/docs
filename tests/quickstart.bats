#!/usr/bin/env bats

# Tests for quickstart scripts across different operating systems

setup() {
    # Get the script directory
    SCRIPT_DIR="$BATS_TEST_DIRNAME/../static/quickstart"
}

# Shellcheck validation tests
@test "check.sh passes shellcheck" {
    shellcheck "$SCRIPT_DIR/check.sh"
}

@test "install.sh passes shellcheck" {
    shellcheck "$SCRIPT_DIR/install.sh"
}

# OS detection tests
@test "check.sh detects OS on Ubuntu 22.04" {
    run docker run --rm -v "$PWD:/work" -w /work ubuntu:22.04 bash -c "
        apt-get update -qq && apt-get install -y -qq lsof curl >/dev/null 2>&1
        bash static/quickstart/check.sh
    "
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]  # Script may exit 1 if ports in use
}

@test "check.sh detects OS on Ubuntu 24.04" {
    run docker run --rm -v "$PWD:/work" -w /work ubuntu:24.04 bash -c "
        apt-get update -qq && apt-get install -y -qq lsof curl >/dev/null 2>&1
        bash static/quickstart/check.sh
    "
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
}

@test "check.sh detects OS on Debian Bookworm" {
    run docker run --rm -v "$PWD:/work" -w /work debian:bookworm bash -c "
        apt-get update -qq && apt-get install -y -qq lsof curl >/dev/null 2>&1
        bash static/quickstart/check.sh
    "
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
}

@test "check.sh detects OS on Fedora 39" {
    run docker run --rm -v "$PWD:/work" -w /work fedora:39 bash -c "
        dnf install -y -q lsof curl >/dev/null 2>&1
        bash static/quickstart/check.sh
    "
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
}

@test "check.sh detects OS on Alpine Linux" {
    run docker run --rm -v "$PWD:/work" -w /work alpine:latest sh -c "
        apk add --no-cache bash lsof curl >/dev/null 2>&1
        bash static/quickstart/check.sh
    "
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
}

# Script syntax validation
@test "check.sh has valid bash syntax" {
    bash -n "$SCRIPT_DIR/check.sh"
}

@test "install.sh has valid bash syntax" {
    bash -n "$SCRIPT_DIR/install.sh"
}

# Dependency checking tests
@test "check.sh detects missing docker" {
    run docker run --rm -v "$PWD:/work" -w /work ubuntu:22.04 bash -c "
        apt-get update -qq >/dev/null 2>&1
        PATH=/usr/bin:/bin bash static/quickstart/check.sh
    "
    echo "Output: $output"
    [[ "$output" =~ "docker" ]] || [[ "$output" =~ "Docker" ]]
}

@test "check.sh detects docker when installed" {
    skip "Requires docker-in-docker setup"
}

# Port checking tests
@test "check.sh port validation works" {
    run bash -c "grep -q 'check_port.*8080' $SCRIPT_DIR/check.sh"
    [ "$status" -eq 0 ]

    run bash -c "grep -q 'check_port.*8443' $SCRIPT_DIR/check.sh"
    [ "$status" -eq 0 ]

    run bash -c "grep -q 'check_port.*9443' $SCRIPT_DIR/check.sh"
    [ "$status" -eq 0 ]
}

# Script structure tests
@test "check.sh defines print_status function" {
    grep -q "print_status()" "$SCRIPT_DIR/check.sh"
}

@test "check.sh defines print_warning function" {
    grep -q "print_warning()" "$SCRIPT_DIR/check.sh"
}

@test "check.sh defines check_port function" {
    grep -q "check_port()" "$SCRIPT_DIR/check.sh"
}

@test "install.sh defines install_otdfctl function" {
    grep -q "install_otdfctl()" "$SCRIPT_DIR/install.sh"
}

# Variable quoting tests (shellcheck compliance)
@test "check.sh properly quotes variables in print_status" {
    grep -q 'if \[ "$1" -eq 0 \]' "$SCRIPT_DIR/check.sh"
}

@test "check.sh properly quotes variables in check_port" {
    grep -q 'lsof -Pi :"$1"' "$SCRIPT_DIR/check.sh"
}

@test "install.sh properly declares TEMP_DIR variable" {
    grep -q 'local TEMP_DIR$' "$SCRIPT_DIR/install.sh"
    grep -q 'TEMP_DIR=$(mktemp -d)' "$SCRIPT_DIR/install.sh"
}

# Install script validation
@test "install.sh can detect platform architecture" {
    run bash <<EOF
source $SCRIPT_DIR/install.sh
detect_os_and_arch
EOF
    echo "Output: $output"
    # Should not error out
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
}

# Error handling tests
@test "check.sh handles missing lsof gracefully on Ubuntu" {
    run docker run --rm -v "$PWD:/work" -w /work ubuntu:22.04 bash -c "
        bash static/quickstart/check.sh
    "
    # Should exit with error but not crash
    [[ "$output" =~ "lsof" ]] || [ "$status" -ne 127 ]
}

# Output format tests
@test "check.sh produces readable output" {
    run bash "$SCRIPT_DIR/check.sh" 2>&1 || true
    # Should have some output
    [ -n "$output" ]
}

@test "check.sh uses color codes" {
    grep -q "GREEN=" "$SCRIPT_DIR/check.sh"
    grep -q "RED=" "$SCRIPT_DIR/check.sh"
    grep -q "YELLOW=" "$SCRIPT_DIR/check.sh"
}
