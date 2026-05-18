"use client";
import { analyzeResume } from "@/services/resumeService";
import React, {useState } from "react";

export const useAtsAnalyser = () => {
  const [selectedFile,setSelectedFile]=useState<File|null>(null);
  const [role,setRole]=useState("");
  const [email,setEmail]=useState("");
  const [jobDescription,setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const openFilePicker = () => {
    const input =
      document.createElement("input");

    input.type = "file";

    input.accept = ".pdf";

    input.onchange = (e: any) => {
      const file =
        e.target.files?.[0];

      if (file) {
        setSelectedFile(file);
      }
    };

    input.click();
  };

  const handleDrop=(e:any)=>{
      e.preventDefault();

      const file=e.dataTransfer.files[0];

      setSelectedFile(file);
  };

  const handleDragOver=(e:any)=>{
      e.preventDefault();
  };

const analyse =
    async () => {
      if (!selectedFile) return;

      try {
        setLoading(true);

        const response:any =
          await analyzeResume({
            file: selectedFile,
            target_role:role,
            email,
            jobDescription,
          });

        console.log(
          "ATS response",
          response,
        );

        return response;
      } catch (error) {
        console.error(
          "Resume analyze failed",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

  return{
      selectedFile,
      role,
      email,
      jobDescription,
      setRole,
      setEmail,
      openFilePicker,
      handleDrop,
      handleDragOver,
      analyse,
      setJobDescription,
  };
};