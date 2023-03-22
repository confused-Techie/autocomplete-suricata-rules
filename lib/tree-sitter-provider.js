
function getSuggestions({editor, bufferPosition}) {
  let node = tokenBeforePosition(editor, bufferPosition);

  if (!node) {
    return [];
  }

  switch(node.type) {
    // Here then we can check for node types to provide completions on, while making
    // sure we are within the range
    // https://github.com/pulsar-edit/pulsar/blob/master/packages/autocomplete-html/lib/tree-sitter-provider.js
  }

  return [];
}

function tokenBeforePosition(editor, position) {
  const languageMode = editor.getBuffer().getLanguageMode();

  let node = languageMode.getSyntaxNodeAtPosition(
    position,
    (node, grammar) => grammar.scopeName === "text.suricataRules.basic" // Double check this
  );

  if (!node) {
    return null;
  }

  node = lastDescendant(node);

  while(
    position.isLessThan(node.endPosition) ||
    node.isMissing() ||
    node.type === "text"
  ) {
    node = tokenBefore(node);
    if (!node) {
      return null;
    }
  }

  return node;
}

const nodesToSeach = new Set([ // Double Check this
  "<",
  "tag_name",
  "attribute_name",
  "attribute_value",
  '"',
  "\'",
]);

function tokenBefore(node) {
  for (;;) {
    const { previousSibling } = node;
    if (previousSibling) {
      return lastDescendant(previousSibling);
    }

    const { parent } = node;
    if (parent) {
      node = parent;
      if (nodesToSearch.has(node.type)) {
        return node;
      }
      continue;
    }

    return null;
  }
}

function lastDescendant(node) {
  let { lastChild } = node;

  while(lastChild) {
    node = lastChild;
    lastChild = node.lastChild;
  }

  return node;
}

module.exports = getSuggestions;
