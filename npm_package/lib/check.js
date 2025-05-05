// checkOptionalChaining.js

const { existsSync, readFileSync, mkdirSync, appendFileSync } = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;


const logDir = path.resolve(process.cwd(), 'logs');
const logFilePath = path.join(logDir, 'peekchain.log');

// Ensure logs directory exists
if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

// Always clear the log file before each run
require('fs').writeFileSync(logFilePath, '', 'utf8');

// Log helper function
function log(message) {
    appendFileSync(logFilePath, message + '\n', 'utf8');
}

// Needed for __dirname in ESM
// import { fileURLToPath } from 'url';
// import { argv } from 'process';


function runOptionalChainingCheck() {

    try {
        console.log(`See detailed log at: ${logFilePath}`);

        log(`Script started...`);

        const STATIC_SAFE_CALLS = new Set();



        const relativePath = process.argv[2];
        if (!relativePath) {
            log(`No file argument provided.`);
            process.exit(0);
        }
        const file = path.resolve(process.cwd(), relativePath);
        log(`fileName`, file);

        const fileExists = existsSync(file);
        if (!file || !fileExists) {
            log(`No file provided or file doesn't exist.`);
            process.exit(0);
        }



        log(`Analyzing file: ${file}`);

        const code = readFileSync(file, 'utf8');
        let errorFound = false;



        // const astCommentCleaner = parser.parse(code, {
        //     sourceType: 'module',
        //     plugins: ['jsx', 'optionalChaining', ['optionalChainingAssign', { version: '2023-07' }]],
        //     comments: false,
        // });

        // const codeWithoutComments = babelGenerator.default(astCommentCleaner, { comments: false }).code;

        // Ensure 'log' folder exists
        // if (!fs.existsSync('log')) {
        //    fs.mkdirSync('log');
        // }
        // fs.writeFileSync('log/astCommentCleaner.json', JSON.stringify(astCommentCleaner, null, 2), 'utf8');
        // fs.writeFileSync('log/code.txt', JSON.stringify(code, null, 2), 'utf8');

        // ❌ Regex pre-checks for invalid optional chaining use
        const invalidChainingPatterns = [
            /\+\+\s*[a-zA-Z_$][\w$]*\?\.\w+/,         // ++user?.count
            /[a-zA-Z_$][\w$]*\?\.\w+\s*\+\+/,         // user?.count++
            /[a-zA-Z_$][\w$]*\?\.\w+\s*=(?!=|>)/      // user?.name = "x" but NOT ===, ==, =>
        ];



        // const lines = codeWithoutComments.split('\n');
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (/^\s*(import|export)\s/.test(line)) continue;
            for (const pattern of invalidChainingPatterns) {
                if (pattern.test(line)) {
                    log(`❌ [Invalid Pattern] ${file}:${i + 1}`);
                    log(`   ↪ ${line.trim()}`);
                    log(`   🚫 Optional chaining cannot be used on the left-hand side of assignment, delete, or increment/decrement.`);
                    process.exit(1);
                }
            }
        }

        log(`Regex pre-checks completed`);

        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: [['optionalChainingAssign', { version: '2023-07' }], 'optionalChaining', 'jsx'],
            comments: true
        });

        // fs.writeFileSync('log/ast.json', JSON.stringify(ast, null, 2), 'utf8');
        // fs.writeFileSync('log/codeWithoutComments.txt', JSON.stringify(codeWithoutComments, null, 2), 'utf8');

        const localIdentifiers = new Set();


        // 🧠 Get root identifier from any nested chain
        function getBaseIdentifierName(node) {
            while (node && (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression')) {
                node = node.object;
            }
            return node?.type === 'Identifier' ? node.name : null;
        }
        function checkOptionalChainSafety(path) {
            const chainLinks = [];
            let node = path.node;
            // Walk down the callee/member chain and collect links
            while (
                node.type === 'CallExpression' || node.type === 'OptionalCallExpression' ||
                node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression'
            ) {
                chainLinks.push(node);
                // Move to the next link: callee of calls, object of member access
                if (node.type === 'CallExpression' || node.type === 'OptionalCallExpression') {
                    node = node.callee;
                } else {
                    node = node.object;
                }
            }

            // Now analyze the chain from base to top
            let chainActive = false;
            let unsafe = false;
            // Traverse from base object up to the final call
            for (let i = chainLinks.length - 1; i >= 0; i--) {
                const link = chainLinks[i];
                const isOptionalType = link.type === 'OptionalMemberExpression' || link.type === 'OptionalCallExpression';
                const hasOptionalOperator = isOptionalType && link.optional === true;
                if (chainActive && (!isOptionalType || link.optional === false)) {
                    // Chain already started, but this link has no optional operator
                    unsafe = true;
                    const line = path.node.loc?.start?.line || '?';
                    log(`❌ [Unsafe Optional Call] ${file}:${line}`);
                    log(`   ↪ ${path.toString()}`);
                    log(`   🚫 Once optional chaining starts, all links and the final call must use '?.'`);
                    errorFound = true;
                    process.exit(1); // immediate stop
                    // break;
                }
                if (hasOptionalOperator) {
                    // This link has a ?. operator, so the optional chain is (or remains) active
                    chainActive = true;
                }
            }

            // if (unsafe) { // never executed due to this earlier block
            //     // Report or collect the error (here we just log for illustration)
            //     log(`Unsafe optional call at line ${path.node.loc.start.line}: ${path.toString()}`);
            // }
        }


        // function isFullyOptionalChain(path) {
        //     let node = path.node;

        //     // Check downward
        //     while (node && (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression')) {
        //         if (!node.optional) {
        //             return false; // 🛑 Found non-optional access
        //         }
        //         node = node.object;
        //     }

        //     // Check upward
        //     let parentPath = path.parentPath;
        //     while (parentPath && (parentPath.isMemberExpression() || parentPath.isOptionalMemberExpression())) {
        //         if (!parentPath.node.optional) {
        //             return false; // 🛑 Parent access is non-optional
        //         }
        //         parentPath = parentPath.parentPath;
        //     }

        //     return true; // ✅ All access are optional
        // }

        // Helper function to check if a member chain is fully optional
        function isFullyOptionalChain(path) {
            // Traverse down the chain from the current member expression
            let current = path;
            while (current && (current.isMemberExpression() || current.isOptionalMemberExpression())) {
                if (!current.isOptionalMemberExpression()) {
                    // This node is a normal MemberExpression (no optional chaining at this link)
                    return false;
                }
                if (current.isOptionalMemberExpression() && !current.node.optional) {
                    // This node is an OptionalMemberExpression, but `.optional` is false,
                    // meaning this particular access used a plain dot.
                    return false;
                }
                // Move to the next object in the chain (e.g., traverse from `obj?.foo.bar` to `obj?.foo`)
                current = current.get("object");
            }
            // If we exited the loop without finding a non-optional link, the chain is fully optional
            return true;
        }
        traverse(ast, {
            ImportDeclaration(path) {
                const importSource = path.node.source.value;
                const isLocalImport = importSource.startsWith('./') || importSource.startsWith('../');

                path.node.specifiers.forEach(spec => {
                    if (spec.local) {
                        const importedName = spec.local.name;
                        if (!isLocalImport) {
                            STATIC_SAFE_CALLS.add(importedName);
                        } else {
                            localIdentifiers.add(importedName);
                        }
                    }
                });
            }
        });

        const addToLocalIdentifiers = (name) => {
            if (!STATIC_SAFE_CALLS.has(name)) {
                localIdentifiers.add(name);
            }
        }


        // log(`STATIC_SAFE_CALLS populated`, [...STATIC_SAFE_CALLS]);


        traverse(ast, {
            VariableDeclarator(path) {
                if (path.node.id.type === 'Identifier') {
                    // if (!STATIC_SAFE_CALLS.has(path.node.id.name)) {
                    //     localIdentifiers.add(path.node.id.name);
                    // }
                    addToLocalIdentifiers(path.node.id.name);
                } else if (path.node.id.type === 'ObjectPattern') {
                    // ✅ Handle destructuring: { user } = this.props // Class based components
                    for (const property of path.node.id.properties) {
                        if (property.type === 'ObjectProperty' && property.key.type === 'Identifier') {
                            addToLocalIdentifiers(property.key.name);
                        }
                    }
                }
            },
            FunctionDeclaration(path) {
                if (path.node.id) {
                    // if (!STATIC_SAFE_CALLS.has(path.node.id.name)) {
                    //     localIdentifiers.add(path.node.id.name);
                    // }
                    addToLocalIdentifiers(path.node.id.name);
                }
            },
            ClassDeclaration(path) {
                if (path.node.id) {
                    // if (!STATIC_SAFE_CALLS.has(path.node.id.name)) {
                    //     localIdentifiers.add(path.node.id.name);
                    // }
                    getBaseIdentifierName(path.node.id.name);
                }
            },
            ImportDeclaration(path) {
                path.node.specifiers.forEach(spec => {
                    if (spec.local) {
                        // if (!STATIC_SAFE_CALLS.has(spec.local.name)) {
                        //     localIdentifiers.add(spec.local.name);
                        // }
                        getBaseIdentifierName(spec.local.name);
                    }
                });
            }
        });

        // log('localIdentifiers populated ', localIdentifiers);

        // log(JSON.stringify(ast, null, 2)); // 🌟 Full readable AST

        // ✅ Deep inspection for member, optional, and call expressions
        traverse(ast, {
            // MemberExpression(path) {
            //     const baseName = getBaseIdentifierName(path.node);
            //     const propertyName = path.node.property?.name;

            //     // ✅ Skip if it's assigning .propTypes to a local component
            //     if (
            //         propertyName === 'propTypes' &&
            //         localIdentifiers.has(baseName) &&
            //         path.parent?.type === 'AssignmentExpression' &&
            //         path.parent.left === path.node
            //     ) {
            //         return; // ✅ This is safe: MyComponent.propTypes = { ... }
            //     }

            //     if (localIdentifiers.has(baseName) && !isFullyOptionalChain(path)) {
            //         const line = path.node.loc?.start?.line || '?';
            //         log(`❌ [Unsafe Access] ${file}:${line}`);
            //         log(`   ↪ ${path.toString()}`);
            //         log(`   ⚠️ '${baseName}' is local, but some part of the chain is accessed unsafely after optional chaining.`);
            //         errorFound = true;
            //     }
            // },

            // OptionalMemberExpression(path) {
            //     const propertyName = path.node.property?.name;
            //     const baseName = getBaseIdentifierName(path.node);

            //     // ✅ Skip known safe pattern: MyComponent.propTypes = ...
            //     if (
            //         propertyName === 'propTypes' &&
            //         localIdentifiers.has(baseName) &&
            //         path.parent?.type === 'AssignmentExpression' &&
            //         path.parent.left === path.node
            //     ) {
            //         return;
            //     }
            //     if (localIdentifiers.has(baseName)) {
            //         const parent = path.parentPath;
            //         const line = path.node.loc?.start?.line || '?';
            //         if (
            //             parent.isAssignmentExpression() ||
            //             parent.isUpdateExpression()
            //         ) {
            //             log(`❌ [Chaining Misuse] ${file}:${line}`);
            //             log(`   ↪ ${path.toString()}`);
            //             log(`   🚫 Optional chaining misused with assignment/delete/increment.`);
            //             errorFound = true;
            //         }
            //     }
            // },
            // Handle both OptionalMemberExpression and MemberExpression nodes
            "MemberExpression|OptionalMemberExpression"(path) {
                // Only check the outermost member of a chain to avoid duplicate checks
                if (path.parentPath.isMemberExpression() || path.parentPath.isOptionalMemberExpression()) {
                    return;  // Skip if parent is also a property access (not the chain's end)
                }
                // Now `path` is the top of a member access chain
                if (!isFullyOptionalChain(path)) {
                    const { line } = path.node.loc.start;
                    const baseName = getBaseIdentifierName(path.node);

                    // You could collect this location or otherwise record the violation as needed
                    if (localIdentifiers.has(baseName)) {
                        log(`❌ [Unsafe Access] ${file}:${line}`);
                        log(`   ↪ ${path.toString()}`);
                        log(`   ⚠️ '${baseName}' is local, but some part of the chain is accessed unsafely after optional chaining.`);
                        errorFound = true;
                    }
                }
            },
            CallExpression(path) {
                //  if (path.node.type === 'CallExpression') {
                checkOptionalChainSafety(path);
                //  }
                const callee = path.node.callee;
                if (callee.type === 'MemberExpression' || callee.type === 'OptionalMemberExpression') {
                    const baseName = getBaseIdentifierName(callee);
                    if (localIdentifiers.has(baseName) && !isFullyOptionalChain(path.get('callee'))) {
                        const line = path.node.loc?.start?.line || '?';
                        log(`❌ [Unsafe Call Access] ${file}:${line}`);
                        log(`   ↪ ${path.toString()}`);
                        log(`   ⚠️ '${baseName}' is local, but function/property call chain is not safely guarded.`);
                        errorFound = true;
                    }
                }
            },
            VariableDeclarator(path) { // first 
                const line = path.node.loc?.start?.line || '?';
                if (path.node.id.type === 'ObjectPattern') {
                    const init = path.node.init;
                    const unsafe =
                        !init ||
                        init.type === 'Identifier' ||
                        init.type === 'NullLiteral' ||
                        (init.type === 'Literal' && init.value === null);

                    if (unsafe) {
                        log(`❌ [Unguarded Destructuring] ${file}:${line}`);
                        log(`   ↪ const { ... } = ${init?.name || 'null/undefined'}`);
                        log(`   💡 Add fallback: const { name } = ${init?.name || 'obj'} ?? {}`);
                        errorFound = true;
                    }
                }
            },
            UnaryExpression(path) {
                if (path.node.operator !== 'delete') return;

                const arg = path.node.argument;

                // ✅ If already optional (safe delete), ignore
                if (arg.type === 'OptionalMemberExpression') {
                    return;
                }

                // ❌ If non-optional, check if dangerous
                if (
                    arg.type === 'MemberExpression' &&
                    !arg.optional && // redundant, but safe
                    arg.object.type === 'Identifier'
                ) {
                    const base = arg.object.name;
                    if (localIdentifiers.has(base)) {
                        const line = path.node.loc?.start?.line || '?';
                        log(`❌ [Unsafe Delete Access] ${file}:${line}`);
                        log(`   ↪ ${path.toString()}`);
                        log(`   ⚠️ '${base}' may be null/undefined. Use optional chaining: delete ${base}?.prop`);
                        errorFound = true;
                    }
                }
            },
            OptionalCallExpression(path) {
                // Handle optional calls separately
                checkOptionalChainSafety(path);
            }



        });

        if (errorFound) {
            log('FAIL');
            console.log('FAIL');
            process.exit(1);
        } else {
            log('All checks passed.');
            console.log('PASS');
        }

    } catch (e) {

        if (e instanceof Error && e.message.startsWith('ProcessExit_')) {
            throw e; // Let Jest test catch this
        }

        log('🔥 Unexpected error during optional chaining analysis:', e);
        console.log('FAIL');
        process.exit(1); // fallback exit


    }

}
module.exports = { runOptionalChainingCheck }; // for mjs
// export { runOptionalChainingCheck };for esm

// ✅ Call runOptionalChainingCheck if run via `node checkOptionalChaining.js file.js`
if (require?.main === module) { // for mjs
    runOptionalChainingCheck();
}

// const currentFile = fileURLToPath(import.meta.url); // for esm
// if (argv[1] === currentFile) {
//     runOptionalChainingCheck();
// }