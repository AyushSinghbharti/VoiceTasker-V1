interface GeminiQueryResponse {
  response: string;
  isLoading: boolean;
}

const handleGeminiQuery = async (
  query: string
): Promise<GeminiQueryResponse> => {
  if (!query.trim()) {
    throw new Error("Please enter a query!");
  }

  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDakEdco4GYPqGcZcGkyuu_CHvmrFCI8eU";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze the sentence and answer only in format. matching the Task interface:
                {
                  [
                  id: number;
                  title: string, try your max to understand query and assign;
                  description: string, Add discription by yourself by analysing the title;
                  date: assign a latest data in the format "YYYY-MM-DD";
                  time: IN THE FORMAT "HH:MM";
                  isDone: boolean;
                  ]
                }. If recieved miltiple task, return a object contain multiple task. If the sentence cannot be understood, return {null} for that task. Output the JSON format. Sentence: "${query}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const generatedText =
        data.candidates?.[0]?.content.parts[0].text || "No response received.";
      return { response: generatedText, isLoading: false };
    } else {
      const errorMessage = data.error?.message || "Error with the API call.";
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Error:", error);
    throw new Error("Failed to fetch response. Please try again.");
  }
};

export default handleGeminiQuery;
