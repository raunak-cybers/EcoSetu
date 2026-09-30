const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image_base64, mime_type } = await req.json()

    if (!image_base64 || !mime_type) {
      return new Response(JSON.stringify({ error: "Missing image_base64 or mime_type" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server misconfiguration: missing API key" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    apiKey = apiKey.replace(/['"]/g, '').trim()

    // Call Gemini API (gemini-2.5-flash)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Classify this e-waste item into exactly one category. If it does not clearly match, answer Unknown. Do not guess."
              },
              {
                inlineData: {
                  mimeType: mime_type,
                  data: image_base64
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: [
                  "PCB",
                  "Li-ion Battery",
                  "Lead-acid Battery",
                  "Other Battery",
                  "Cable/Wire",
                  "LCD Panel",
                  "Motor",
                  "Magnet-Bearing Assembly",
                  "Mixed Plastics",
                  "CRT Glass",
                  "Unknown"
                ]
              },
              confidence: {
                type: "string",
                enum: ["high", "medium", "low"]
              }
            },
            required: ["category", "confidence"]
          }
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API Error: ${response.status} ${response.statusText}`, errorText)
      return new Response(JSON.stringify({ error: "Upstream AI service error", details: errorText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    
    // Extract the text response
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
    
    // Defensively parse the JSON (strip markdown fences if present)
    rawText = rawText.trim()
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\n/, "").replace(/\n```$/, "")
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\n/, "").replace(/\n```$/, "")
    }

    let result
    try {
      result = JSON.parse(rawText)
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", rawText)
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error("Function exception:", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
