import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req:NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-12b-it:free", // or any OpenRouter-supported model
        messages,
        stream: true, // enable streaming
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // optional
          "X-Title": "My Next.js App", // optional
        },
        responseType: "stream", // important for streaming
      }
    );

    const stream = response.data;

    // Return as a web stream so frontend can consume
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        stream.on("data", (chunk:any) => {
          const payloads = chunk.toString().split("\n\n");

          for (const payload of payloads) {
            if (payload.includes("[DONE]")) {
              controller.close();
              return;
            }

            if (payload.startsWith("data:")) {
              try {
                const data = JSON.parse(payload.replace("data: ", ""));
                const text = data.choices[0]?.delta?.content;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (err) {
                console.error("Error parsing stream", err);
              }
            }
          }
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (err:any) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}




//it is the code when all model fails
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// const MODELS = [
//   "google/gemma-3-4b-it:free",
//   "google/gemma-3-12b-it:free",
// ];

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     let lastError: any = null;

//     for (const model of MODELS) {
//       try {
//         const response = await axios.post(
//           "https://openrouter.ai/api/v1/chat/completions",
//           { model, messages, stream: true },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//             responseType: "stream",
//           }
//         );

//         const stream = response.data;
//         const encoder = new TextEncoder();

//         const readable = new ReadableStream({
//           async start(controller) {
//             stream.on("data", (chunk: any) => {
//               const payloads = chunk.toString().split("\n\n");

//               for (const payload of payloads) {
//                 if (payload.includes("[DONE]")) {
//                   controller.close();
//                   return;
//                 }

//                 if (payload.startsWith("data:")) {
//                   try {
//                     const data = JSON.parse(payload.replace("data: ", ""));
//                     const text = data.choices[0]?.delta?.content;
//                     if (text) {
//                       controller.enqueue(encoder.encode(text));
//                     }
//                   } catch (err) {
//                     console.error("Stream parsing error", err);
//                   }
//                 }
//               }
//             });

//             stream.on("end", () => controller.close());
//             stream.on("error", (err: any) => controller.error(err));
//           },
//         });

//         return new NextResponse(readable, {
//           headers: {
//             "Content-Type": "text/plain; charset=utf-8",
//             "Transfer-Encoding": "chunked",
//           },
//         });
//       } catch (err: any) {
//         lastError = err;
//         const status = err.response?.status;

//         // If model failed due to quota / bad request, try next
//         if (status === 400 || status === 429) {
//           console.warn(`${model} failed with status ${status}, trying next model...`);
//           continue;
//         } else {
//           // Other errors: stop immediately
//           throw err;
//         }
//       }
//     }

//     // If all models fail
//     console.error("All models failed:", lastError);
//     return NextResponse.json(
//       { error: "All models failed or exceeded quota." },
//       { status: 500 }
//     );
//   } catch (error) {
//     console.error("API error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

