set shell := ["bash", "-cu"]

node_bin := "node_modules/.bin/"
tsc := node_bin + "tsc"
biome := node_bin + "biome"
tsdown := node_bin + "tsdown"
vitest := node_bin + "vitest"
typedoc := node_bin + "typedoc"

transpiler := "packages/transpiler"
web_runtime := "packages/web-runtime"
web := "packages/web"

test_transpiler := "tests/transpiler"

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
    cd ./{{transpiler}} && ../../{{tsc}} --noEmit
    cd ./{{web_runtime}} && ../../{{tsc}} --noEmit
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
    cd ./{{transpiler}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{web_runtime}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{web}} && ../../{{tsdown}} -c tsdown.config.ts

# Run tests
test:
    cd ./{{test_transpiler}} && ./{{vitest}} run

# Clean builds
clean:
    cd ./{{web}} && rm -rf ./dist
    cd ./{{web_runtime}} && rm -rf ./dist
    cd ./{{transpiler}} && rm -rf ./dist

# Clean everything
clean-all:
    just clean

    cd ./{{test_transpiler}} && rm -rf ./node_modules

    cd ./{{web}} && rm -rf ./node_modules
    cd ./{{web_runtime}} && rm -rf ./node_modules
    cd ./{{transpiler}} && rm -rf ./node_modules

    rm -rf ./node_modules
