export type StreamingAPIArgs = {
  url: string;
  onDataChunk: (chunk: string) => void;
  onDataEnd: () => void;
  onError: (error: Error) => void;
  options?: RequestInit;
};

export async function streamingAPI(args: StreamingAPIArgs) {
  const { url, onDataChunk, onDataEnd, onError, options } = args;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      throw new Error("No response body");
    }

    const processChunk = async (
      result: ReadableStreamReadResult<Uint8Array>
    ) => {
      const { done, value } = result;

      if (done) {
        onDataEnd();
        return;
      }

      if (value) {
        const decodedValue = decoder.decode(value, { stream: true });
        onDataChunk(decodedValue);
      }
      reader.read().then(processChunk);
    };

    reader.read().then(processChunk);
  } catch (error: any) {
    onError(error);
  }
}
