const getSuggestions = require("./tree-sitter-provider.js");

const provider = {
  selector: ".source.suricataRules",
  disableForSelector: ".source.suricataRules .comment",
  priority: 1,
  filterSuggestions: true,

  getSuggestions(request) {
    if (request.editor.getBuffer().getLanguageMode().tree) {
      return getSuggestions(request);
    } else {
      // This is receiving TextMate suggestions, which we don't support.
    }
  },

  onDidInsertSuggestion({editor, suggestion}) {
    if (suggestion.type === "attribute") {
      // Not sure the purpose here, shown withn autocomplete-html
      setTimeout(this.triggerAutocomplete.bind(this, editor), 1);
    }
  },

  triggerAutocomplete(editor) {
    atom.commands.dispatch(
      editor.getElement(),
      "autocomplete-plus:activate",
      { activatedManually: false}
    )
  }

};

module.exports = {
  activate() {},

  getProvider() { return provider },
};
