/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import * as recast from 'recast';
const n = recast.types.namedTypes;
import fs from 'fs';
import path from 'path';
import { functions } from '../src/sections/generated/scalar_functions';

(function () {
  const pathToElasticsearch = process.argv[2];
  const { scalarFunctions, aggregationFunctions } = loadFunctionDocs(pathToElasticsearch);
  writeFunctionDocs(
    scalarFunctions,
    path.join(__dirname, '../src/sections/generated/scalar_functions.tsx')
  );
  writeFunctionDocs(
    aggregationFunctions,
    path.join(__dirname, '../src/sections/generated/aggregation_functions.tsx')
  );
})();

function loadFunctionDocs(pathToElasticsearch: string) {
  // Define the directory path
  const definitionsPath = path.join(
    pathToElasticsearch,
    '/docs/reference/esql/functions/kibana/definition'
  );
  const docsPath = path.join(pathToElasticsearch, '/docs/reference/esql/functions/kibana/docs');

  // Read the directory
  const docsFiles = fs.readdirSync(docsPath);

  const ESFunctionDefinitions = fs
    .readdirSync(definitionsPath)
    .map((file) => JSON.parse(fs.readFileSync(`${definitionsPath}/${file}`, 'utf-8')));

  const scalarFunctions = new Map<string, string>();
  const aggregationFunctions = new Map<string, string>();

  // Iterate over each file in the directory
  for (const file of docsFiles) {
    // Ensure we only process .md files
    if (path.extname(file) === '.md') {
      const functionDefinition = ESFunctionDefinitions.find(
        (def) => def.name === path.basename(file, '.md')
      );

      if (!functionDefinition) {
        continue;
      }

      // Read the file content
      const content = fs.readFileSync(path.join(docsPath, file), 'utf-8');

      // Get the function name from the file name by removing the .md extension
      const functionName = path.basename(file, '.md');

      // Add the function name and content to the map
      if (functionDefinition.type === 'eval') {
        scalarFunctions.set(functionName, content);
      }
      if (functionDefinition.type === 'agg') {
        aggregationFunctions.set(functionName, content);
      }
    }
  }

  return { scalarFunctions, aggregationFunctions };
}

function writeFunctionDocs(functionDocs: Map<string, string>, pathToDocsFile: string) {
  const codeStrings = Array.from(functionDocs.entries()).map(([name, doc]) => {
    const docWithoutLinks = removeAsciiDocInternalCrossReferences(
      doc,
      Array.from(functionDocs.keys())
    );
    return `
  const foo = 
  // Do not edit manually... automatically generated by scripts/generate_esql_docs.ts
  {
    label: i18n.translate(
      'languageDocumentation.documentationESQL.${name}',
      {
        defaultMessage: '${name.toUpperCase()}',
      }
    ),
    description: (
      <Markdown
        openLinksInNewTab
        readOnly
        enableSoftLineBreaks
        markdownContent={i18n.translate(
          'languageDocumentation.documentationESQL.${name}.markdown',
          {
            defaultMessage: \`${docWithoutLinks.replaceAll('`', '\\`')}\`,
            description:
              'Text is in markdown. Do not translate function names, special characters, or field names like sum(bytes)',
            ignoreTag: true,
          }
        )}
      />
    ),
  };`;
  });

  const ast = recast.parse(fs.readFileSync(pathToDocsFile, 'utf-8'), {
    parser: require('recast/parsers/babel'),
  });

  const functionsList = findFunctionsList(ast);

  functionsList.elements = codeStrings.map(
    (codeString) => recast.parse(codeString).program.body[0].declarations[0].init
  );

  const newFileContents = recast.print(ast);

  fs.writeFileSync(pathToDocsFile, newFileContents.code);
}

/**
 * Deals with asciidoc internal cross-references in the function descriptions
 *
 * Examples:
 * <<esql-mv_max>> -> `MV_MAX`
 * <<esql-st_intersects,ST_INTERSECTS>> -> `ST_INTERSECTS`
 * <<esql-multivalued-fields, multivalued fields>> -> multivalued fields
 */
function removeAsciiDocInternalCrossReferences(asciidocString: string, functionNames: string[]) {
  const internalCrossReferenceRegex = /<<(.+?)(,.+?)?>>/g;

  const extractPossibleFunctionName = (id: string) => id.replace('esql-', '');

  return asciidocString.replace(internalCrossReferenceRegex, (_match, anchorId, linkText) => {
    const ret = linkText ? linkText.slice(1) : anchorId;

    const matchingFunction = functionNames.find(
      (name) =>
        extractPossibleFunctionName(ret) === name.toLowerCase() ||
        extractPossibleFunctionName(ret) === name.toUpperCase()
    );
    return matchingFunction ? `\`${matchingFunction.toUpperCase()}\`` : ret;
  });
}

/**
 * This function searches the AST for the functions list
 */
function findFunctionsList(ast: any): recast.types.namedTypes.ArrayExpression {
  let foundArray: recast.types.namedTypes.ArrayExpression | null = null;

  const functionsArrayIdentifier = Object.keys({ functions })[0];

  recast.visit(ast, {
    visitVariableDeclarator(astPath) {
      if (
        n.Identifier.check(astPath.node.id) &&
        astPath.node.id.name === functionsArrayIdentifier
      ) {
        this.traverse(astPath);
      }
      return false;
    },
    visitObjectProperty(astPath) {
      if (
        n.Identifier.check(astPath.node.key) &&
        astPath.node.key.name === 'items' &&
        n.ArrayExpression.check(astPath.node.value)
      ) {
        foundArray = astPath.node.value;
        this.abort();
      }
      return false;
    },
  });

  if (!foundArray) {
    throw new Error('Could not find the functions array in the AST');
  }

  return foundArray;
}
