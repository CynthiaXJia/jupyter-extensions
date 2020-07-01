// returns true if we are inside an editable portion with `
function checkCompletionAvailable(text) {
  return (text.match(/`/g) || []).length % 2 === 1;
}

// todo: type return
function suggestData({ text }: { text: string }) {
  // todo: substr until next closing ` if it exists (instead of end of text)? thats not a capablility in the web ui tho
  const innerText = text.substring(text.lastIndexOf('`') + 1);
  const groups = innerText.split('.');
  if (groups.length === 1) {
    // suggest project names
    return {
      suggestions: [
        {
          label: 'cxjia-sandbox',
          kind: null,
          detail: '',
          documentation: '',
          insertText: 'cxjia-sandbox.',
          range: null,
        },
      ],
    };
  } else if (groups.length === 2) {
    // suggest dataset names based on groups[0]
  } else if (groups.length === 3) {
    // suggest table/model names based on groups[0] and [1]
  } else {
    return { suggestions: [] };
  }
}

// todo(cxjia) type monaco and return here
export function getSqlCompletionProvider(monaco) {
  return {
    provideCompletionItems: function(model, position) {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const completionAvailable = checkCompletionAvailable(textUntilPosition);
      if (!completionAvailable) {
        return { suggestions: [] };
      }

      return suggestData(textUntilPosition);
    },
  };
}
