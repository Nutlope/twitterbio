"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import * as z from "zod";
import { formSchema } from "@/app/(base)/new/YourDetails";

// Define the type of the context state
interface FormContextState {
  formData: z.infer<typeof formSchema>;
  setFormData: (data: z.infer<typeof formSchema>) => void;
}

// Create a context with an empty object and a dummy function
const FormContext = createContext<FormContextState>({
  formData: { notes: "", visibility: "public", lists: [] },
  setFormData: () => {},
});

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormContextState["formData"]>({
    notes: "",
    visibility: "public",
    lists: [],
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
