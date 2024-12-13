// const SpeechToText = async (
//   uri: string | null
// ): Promise<{
//   transcription: string;
//   isProcessing: boolean;
// }> => {
//   if (!uri) {
//     return { transcription: "", isProcessing: false };
//   }

//   const MAX_RETRIES = 3;
//   const RETRY_DELAY = 20000;

//   try {
//     const file = await fetch(uri);
//     const blob = await file.blob();

//     if (!blob.type.startsWith("audio/")) {
//       throw new Error("Invalid file type. Must be an audio file.");
//     }

//     for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//       try {
//         const response = await fetch(
//           // "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
//           // "https://api-inference.huggingface.co/models/facebook/wav2vec2-large-xlsr-53",
//           // "https://api-inference.huggingface.co/models/facebook/s2t-small-librispeech-asr",
//           // "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
//           // "https://api-inference.huggingface.co/models/microsoft/wavlm-large",
//           // "https://api-inference.huggingface.co/models/google/fastspeech2-en-ljspeech",
//           // "https://api-inference.huggingface.co/models/deepgram/jasper",
//           // "https://api-inference.huggingface.co/models/ai4bharat/indicwav2vec",
//           // "https://api-inference.huggingface.co/models/facebook/wav2vec2-large-xlsr-53-hindi",
//           // "https://api-inference.huggingface.co/models/microsoft/azure-speech-to-text-hindi",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer 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`,
//             },
//             body: blob,
//           }
//         );

//         // Parse the response
//         const data = await response.json();

//         // Check for model loading error
//         if (data.error && data.error.includes("currently loading")) {
//           if (attempt < MAX_RETRIES) {
//             console.log(
//               `Model loading (Attempt ${attempt}). Retrying in ${
//                 RETRY_DELAY / 1000
//               } seconds...`
//             );
//             await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
//             continue;
//           } else {
//             throw new Error(
//               `Model failed to load after ${MAX_RETRIES} attempts`
//             );
//           }
//         }

//         // Successful transcription
//         if (response.ok) {
//           return {
//             transcription: data.text || "No transcription available",
//             isProcessing: false,
//           };
//         } else {
//           console.error("Transcription API Error:", data);
//           return {
//             transcription: data.error || "Error transcribing audio",
//             isProcessing: true,
//           };
//         }
//       } catch (apiError: any) {
//         console.error(`Transcription API Attempt ${attempt} Error:`, apiError);

//         if (attempt === MAX_RETRIES) {
//           throw apiError;
//         }

//         // Wait before retrying
//         await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
//       }
//     }

//     throw new Error("Maximum retry attempts exceeded");
//   } catch (err: any) {

//     console.error("Transcription Error", err);
    
//     return {
//       transcription: err.message || "Error occurred during transcription",
//       isProcessing: false,
//     };
  
//   }
// };

// export default SpeechToText;

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
          "https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-english",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer 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`,
              "Content-Type": "audio/wav",
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
          // Post-process the transcription
          const rawTranscription = data.text || "No transcription available";
          const processedTranscription = postProcessTranscription(rawTranscription);
          
          return {
            transcription: processedTranscription,
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

// Function to post-process the transcription
const postProcessTranscription = (text: string): string => {
  // Convert to lowercase for consistent processing
  let processed = text.toLowerCase();

  // Common Indian English pronunciations and their corrections
  const corrections: [RegExp, string][] = [
    [/\bvery\b/g, "very"],
    [/\bvery good\b/g, "very good"],
    [/\bactually\b/g, "actually"],
    [/\bbasically\b/g, "basically"],
    [/\bonly\b/g, "only"],
    [/\byaar\b/g, "yaar"],
    [/\bda\b/g, "the"],
    [/\bna\b/g, "no"],
    [/\bji\b/g, "ji"],
    [/\bbhai\b/g, "bhai"],
    [/\bdidi\b/g, "didi"],
    [/\byeh\b/g, "yeah"],
    [/\bkya\b/g, "what"],
    [/\bacha\b/g, "okay"],
    [/\bthik hai\b/g, "okay"],
  ];

  // Apply corrections
  corrections.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement);
  });

  // Capitalize first letter of each sentence
  processed = processed.replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase());

  return processed;
};

export default SpeechToText;

