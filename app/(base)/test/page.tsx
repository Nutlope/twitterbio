"use client";

import React, { useState } from "react";
import { generatedIcsArrayToEvents } from "@/lib/utils";
import { AddToCalendarButtonProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([] as AddToCalendarButtonProps[]);
  const [error, setError] = useState(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    // Clear output/error when input changes
    setOutput([]);
    setError(null);
  };

  const parseInput = () => {
    try {
      // Replace 'yourParsingFunction' with your actual parsing logic
      const result = generatedIcsArrayToEvents(input);
      setOutput(result);
      setError(null);
    } catch (err: any) {
      setOutput([]);
      setError(err?.message || "unknown error");
    }
  };

  return (
    <div className="grid w-full max-w-2xl place-items-center gap-2">
      <Textarea rows={12} value={input} onChange={handleInputChange} />
      <Button onClick={parseInput}>Parse</Button>
      {output && <div>{JSON.stringify(output)}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
