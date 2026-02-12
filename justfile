set shell := ["bash", "-cu"]
set windows-shell := ["powershell"]

node_bin := "node_modules/.bin/"
tsc := node_bin + "tsc"
biome := node_bin + "biome"
tsdown := node_bin + "tsdown"
vitest := node_bin + "vitest"
typedoc := node_bin + "typedoc"

compiler := "packages/compiler"
runtime := "packages/runtime"
web := "packages/web"

webpack := "plugins/webpack"
rsbuild := "plugins/rsbuild"
rollup := "plugins/rollup"
vite := "plugins/vite"
postcss := "plugins/postcss"

test_compiler := "tests/compiler"
test_web := "tests/web"

bench_keyframes := "benchmarks/keyframes"
bench_style := "benchmarks/style"
bench_variables := "benchmarks/variables"

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

    cd ./{{webpack}} && ../../{{tsc}} --noEmit
    cd ./{{rsbuild}} && ../../{{tsc}} --noEmit
    cd ./{{rollup}} && ../../{{tsc}} --noEmit
    cd ./{{vite}} && ../../{{tsc}} --noEmit
    cd ./{{postcss}} && ../../{{tsc}} --noEmit

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

    cd ./{{webpack}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{rsbuild}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{rollup}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{vite}} && ../../{{tsdown}} -c tsdown.config.ts
    cd ./{{postcss}} && ../../{{tsdown}} -c tsdown.config.ts

# Run tests
test:
    cd ./{{test_compiler}} && ./{{vitest}} run
    cd ./{{test_web}} && ./{{vitest}} run

# Run tests on different environments
test-all:
    cd ./{{test_compiler}} && pnpm run test
    cd ./{{test_web}} && pnpm run test

    cd ./{{test_compiler}} && deno run test
    cd ./{{test_web}} && deno run test

    cd ./{{test_compiler}} && bun run test
    cd ./{{test_web}} && bun run test

# Run benchmarks
bench:
    cd ./{{bench_keyframes}} && ./{{vitest}} bench --run
    cd ./{{bench_style}} && ./{{vitest}} bench --run
    cd ./{{bench_variables}} && ./{{vitest}} bench --run

# Clean builds
clean:
    cd ./{{postcss}} && rm -rf ./dist
    cd ./{{vite}} && rm -rf ./dist
    cd ./{{rollup}} && rm -rf ./dist
    cd ./{{rsbuild}} && rm -rf ./dist
    cd ./{{webpack}} && rm -rf ./dist

    cd ./{{web}} && rm -rf ./dist
    cd ./{{runtime}} && rm -rf ./dist
    cd ./{{compiler}} && rm -rf ./dist

# Clean everything
clean-all:
    just clean

    cd ./{{bench_variables}} && rm -rf ./node_modules
    cd ./{{bench_style}} && rm -rf ./node_modules
    cd ./{{bench_keyframes}} && rm -rf ./node_modules

    cd ./{{test_web}} && rm -rf ./node_modules
    cd ./{{test_compiler}} && rm -rf ./node_modules

    cd ./{{postcss}} && rm -rf ./node_modules
    cd ./{{vite}} && rm -rf ./node_modules
    cd ./{{rollup}} && rm -rf ./node_modules
    cd ./{{rsbuild}} && rm -rf ./node_modules
    cd ./{{webpack}} && rm -rf ./node_modules

    cd ./{{web}} && rm -rf ./node_modules
    cd ./{{runtime}} && rm -rf ./node_modules
    cd ./{{compiler}} && rm -rf ./node_modules

    rm -rf ./node_modules
