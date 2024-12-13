import { template } from "@babel/core";

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
                text: `Hey Gemini, Youre acting as a backend API here. I want you to analyze the sentence and answer only in resticted format. If you answer me in any different format then the app will crash. So, be careful and return me answer in same fromat on every call.
                the formet should be in JSON format with no extra spaces between.
                Return me the List of tasks eg. [{}, {}, {}]

                The format of each task contain:
                  id: number;
                  title: string, try your max to understand query and assign;
                  description: string, Add discription by yourself by analysing the title;
                  date: assign a latest data in the format "DD-MM-YYYY";
                  time: IN THE FORMAT "HH:MM";
                  completed: boolean;

                If you cannot understand the query then return {null} for that task.  Sentence: "${query}"
                `,
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
