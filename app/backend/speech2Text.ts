const SpeechToText = async (
  uri: string | null
): Promise<{
  transcription: string;
  isProcessing: boolean;
}> => {
  if (!uri) {
    return { transcription: "", isProcessing: false };
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 20000;

  try {
    const file = await fetch(uri);
    const blob = await file.blob();

    if (!blob.type.startsWith("audio/")) {
      throw new Error("Invalid file type. Must be an audio file.");
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer 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`,
            },
            body: blob,
          }
        );

        // Parse the response
        const data = await response.json();

        console.log("Transcription API Response:", data);

        // Check for model loading error
        if (data.error && data.error.includes("currently loading")) {
          if (attempt < MAX_RETRIES) {
            console.log(
              `Model loading (Attempt ${attempt}). Retrying in ${
                RETRY_DELAY / 1000
              } seconds...`
            );
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            continue;
          } else {
            throw new Error(
              `Model failed to load after ${MAX_RETRIES} attempts`
            );
          }
        }

        // Successful transcription
        if (response.ok) {
          return {
            transcription: data.text || "No transcription available",
            isProcessing: false,
          };
        } else {
          console.error("Transcription API Error:", data);
          return {
            transcription: data.error || "Error transcribing audio",
            isProcessing: true,
          };
        }
      } catch (apiError: any) {
        console.error(`Transcription API Attempt ${attempt} Error:`, apiError);

        if (attempt === MAX_RETRIES) {
          throw apiError;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }

    throw new Error("Maximum retry attempts exceeded");
  } catch (err: any) {

    console.error("Transcription Error", err);
    
    return {
      transcription: err.message || "Error occurred during transcription",
      isProcessing: false,
    };
  
  }
};

export default SpeechToText;
