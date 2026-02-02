# Quickstart Script Tests

This directory contains BATS (Bash Automated Testing System) tests for the quickstart installation scripts.

## Prerequisites

### macOS
```bash
brew install bats-core shellcheck
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y bats shellcheck
```

### Fedora/RHEL
```bash
sudo dnf install -y bats ShellCheck
```

## Running Tests Locally

**Important:** Run all BATS commands from the repository root directory, not from the `tests/` directory.

### Run all tests
```bash
bats tests/quickstart.bats
```

### Run a specific test
```bash
bats tests/quickstart.bats --filter "check.sh passes shellcheck"
```

### Run with verbose output
```bash
bats tests/quickstart.bats --tap
```

### Run tests in parallel (requires bats-core 1.5+)
```bash
bats tests/quickstart.bats --jobs 4
```

## Test Coverage

The test suite covers:

1. **Static Analysis** (tested on Linux, macOS, Windows)
   - Shellcheck compliance
   - Bash syntax validation
   - Variable quoting
   - Function definitions

2. **Script Execution Testing**
   - **Linux** (via Docker containers): Full end-to-end testing
     - Ubuntu 22.04, 24.04
     - Debian Bookworm
     - Fedora 39
     - Alpine Linux
   - **macOS**: Direct script execution, OS detection, graceful handling of missing Docker
   - **Windows**: Direct script execution, OS detection, graceful handling of missing Docker

3. **Functionality**
   - OS detection
   - Dependency checking
   - Port availability validation
   - Error handling

4. **Code Quality**
   - Output formatting
   - Color code usage

## Docker Requirements

Many tests use Docker to simulate different Linux distributions. Ensure Docker is running before executing the full test suite:

```bash
docker ps
```

## Continuous Integration

These tests run automatically in GitHub Actions on every push and pull request. See [.github/workflows/docker-compose-test.yml](../.github/workflows/docker-compose-test.yml) for the CI configuration.

## Writing New Tests

Follow the BATS test format:

```bash
@test "description of what this tests" {
    run your_command
    [ "$status" -eq 0 ]
    [[ "$output" =~ "expected string" ]]
}
```

See the [BATS documentation](https://bats-core.readthedocs.io/) for more details.
