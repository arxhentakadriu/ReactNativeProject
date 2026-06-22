type AdviceResponse = {
  slip?: {
    advice?: string;
  };
};

export async function fetchAdvice() {
  const response = await fetch('https://api.adviceslip.com/advice');

  if (!response.ok) {
    throw new Error('Could not load a task tip.');
  }

  const data = (await response.json()) as AdviceResponse;
  return data.slip?.advice ?? 'Keep your task list small and clear.';
}
