export function replaceVariables(prompt: any, variables: Object[]) {
  let newPrompt = prompt;
  for (const key in variables) {
    if (variables.hasOwnProperty(key)) {
      const value = variables[key];
      newPrompt = newPrompt.replace(`{{${key}}}`, value);
    }
  }
  return newPrompt;
  }
  
export function validatePrompt(prompt: string) {
  const regex = /{{([^}]+)}}/g;
  const match = prompt.match(regex);
  return !match;
}