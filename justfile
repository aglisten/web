set shell := ["bash", "-cu"]

node_bin := "node_modules/.bin/"
tsc := node_bin + "tsc"
biome := node_bin + "biome"
tsdown := node_bin + "tsdown"
vitest := node_bin + "vitest"
typedoc := node_bin + "typedoc"

compiler := "packages/compiler"
runtime := "packages/runtime"
web := "packages/web"

test_compiler := "tests/compiler"
test_web := "tests/web"

# Default action
_:
    just build
    just lint
    just fmt
    just build
    just test

# Install
i:
    pnpm install

# Lint with TypeScript Compiler
tsc:
    cd ./{{compiler}} && ../../{{tsc}} --noEmit
    cd ./{{runtime}} && ../../{{tsc}} --noEmit
    cd ./{{web}} && ../../{{tsc}} --noEmit

# Lint code
lint:
    ls-lint
    typos
    just tsc

# Format code
fmt:
    ./{{biome}} check --write .

# Build packages
build:
    cd ./{{compiler}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{runtime}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{web}} && ../../{{tsdown}} -c tsdown.config.ts

# Run tests
test:
    cd ./{{test_compiler}} && ./{{vitest}} run
    cd ./{{test_web}} && ./{{vitest}} run

# Clean builds
clean:
    cd ./{{web}} && rm -rf ./dist
    cd ./{{runtime}} && rm -rf ./dist
    cd ./{{compiler}} && rm -rf ./dist

# Clean everything
clean-all:
    just clean

    cd ./{{test_compiler}} && rm -rf ./node_modules

    cd ./{{web}} && rm -rf ./node_modules
    cd ./{{runtime}} && rm -rf ./node_modules
    cd ./{{compiler}} && rm -rf ./node_modules

    rm -rf ./node_modules
