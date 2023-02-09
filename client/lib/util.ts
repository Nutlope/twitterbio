export function replaceVariables(prompt: string, variables: any) {
  let newPrompt = prompt;
  for (const key in variables) {
    if (variables.hasOwnProperty(key)) {
      const value = variables[key];
      if (typeof value === 'string') {
        newPrompt = newPrompt.replace(`{{${key}}}`, value);
      }
    }
  }
  return newPrompt;
}

export function validatePrompt(prompt: string) {
  const regex = /{{([^}]+)}}/g;
  const match = prompt.match(regex);
  return !match;
}