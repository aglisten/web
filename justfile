set shell := ["bash", "-cu"]
set windows-shell := ["powershell"]

node_bin := "node_modules/.bin/"
tsc := node_bin + "tsgo"
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

ex_var := "examples/set-variables"
ex_fallback := "examples/fallback"
ex_merge := "examples/merge"

tmpl_webpack := "templates/webpack"
tmpl_rsbuild := "templates/rsbuild"
tmpl_next := "templates/next"
tmpl_rollup := "templates/rollup"
tmpl_rolldown := "templates/rolldown"
tmpl_vite := "templates/vite"

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

# Install with frozen-lockfile
if:
    pnpm install --frozen-lockfile

lsl_cfg := "-config ../../../.ls-lint.yml"

# Lint with ls-lint
lslint:
    cd ./{{compiler}}/src && ls-lint {{lsl_cfg}}
    cd ./{{runtime}}/src && ls-lint {{lsl_cfg}}
    cd ./{{web}}/src && ls-lint {{lsl_cfg}}

    cd ./{{webpack}}/src && ls-lint {{lsl_cfg}}
    cd ./{{rsbuild}}/src && ls-lint {{lsl_cfg}}
    cd ./{{rollup}}/src && ls-lint {{lsl_cfg}}
    cd ./{{vite}}/src && ls-lint {{lsl_cfg}}
    cd ./{{postcss}}/src && ls-lint {{lsl_cfg}}

    cd ./{{test_compiler}}/src && ls-lint {{lsl_cfg}}
    cd ./{{test_web}}/src && ls-lint {{lsl_cfg}}

    cd ./{{bench_keyframes}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_style}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_variables}}/src && ls-lint {{lsl_cfg}}

    cd ./{{ex_var}}/src && ls-lint {{lsl_cfg}}
    cd ./{{ex_fallback}}/src && ls-lint {{lsl_cfg}}
    cd ./{{ex_merge}}/src && ls-lint {{lsl_cfg}}

    cd ./{{tmpl_webpack}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_rsbuild}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_next}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_rollup}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_rolldown}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_vite}}/src && ls-lint {{lsl_cfg}}

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
    just lslint
    typos
    just tsc

# Lint code with Biome
lint-biome:
    ./{{biome}} lint .

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

# Run variables benchmarks
bench-var:
    cd ./{{bench_variables}} && ./{{vitest}} bench --run

# Run keyframes benchmarks
bench-kf:
    cd ./{{bench_keyframes}} && ./{{vitest}} bench --run

# Run style benchmarks
bench-style:
    cd ./{{bench_style}} && ./{{vitest}} bench --run

# Run all benchmarks
bench:
    just bench-var
    just bench-kf
    just bench-style

# Clean builds
clean:
    cd ./{{tmpl_vite}} && rm -rf ./dist
    cd ./{{tmpl_rolldown}} && rm -rf ./dist
    cd ./{{tmpl_rollup}} && rm -rf ./dist
    cd ./{{tmpl_next}} && rm -rf ./dist
    cd ./{{tmpl_rsbuild}} && rm -rf ./dist
    cd ./{{tmpl_webpack}} && rm -rf ./dist

    cd ./{{ex_merge}} && rm -rf ./dist
    cd ./{{ex_fallback}} && rm -rf ./dist
    cd ./{{ex_var}} && rm -rf ./dist

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

    cd ./{{tmpl_vite}} && rm -rf ./node_modules
    cd ./{{tmpl_rolldown}} && rm -rf ./node_modules
    cd ./{{tmpl_rollup}} && rm -rf ./node_modules
    cd ./{{tmpl_next}} && rm -rf ./node_modules
    cd ./{{tmpl_rsbuild}} && rm -rf ./node_modules
    cd ./{{tmpl_webpack}} && rm -rf ./node_modules

    cd ./{{ex_merge}} && rm -rf ./node_modules
    cd ./{{ex_fallback}} && rm -rf ./node_modules
    cd ./{{ex_var}} && rm -rf ./node_modules

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
