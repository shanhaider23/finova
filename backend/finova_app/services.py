from openai import OpenAI
from django.conf import settings
import json

def generate_financial_advice(prompt, user_input=None):
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    GPT_MODEL = "gpt-3.5-turbo-1106"  # or "gpt-4-1106-preview"

    # Structure the messages properly
    messages = [
        {"role": "system", "content": "You are a financial advisor. Always respond in a structured JSON format."},
        {
            "role": "user",
            "content": (
                f"{prompt}\n\n"
                "Please provide your financial advice in the following JSON format:\n"
                "{\n"
                "  \"financial_advice\": [\n"
                "    {\n"
                "      \"month\": \"<Month>\",\n"
                "      \"suggestion\": [\n"
                "        {\n"
                "          \"title\": \"<Title of the suggestion>\",\n"
                "          \"description\": \"<Detailed description of the suggestion>\"\n"
                "        },\n"
                "        ...\n"
                "      ]\n"
                "    }\n"
                "  ]\n"
                "}"
            )
        }
    ]

    # Add user input to the messages if provided
    if user_input:
        messages.append({"role": "user", "content": user_input})

    try:
        # Call OpenAI GPT-4 API
        response = client.chat.completions.create(
            model=GPT_MODEL,
            messages=messages,
            temperature=0  # Lower temperature for more deterministic responses
        )
        
        # Debugging step: print the entire response to understand its structure
        print("Response from OpenAI:", response)

        # Access the message content
        response_message = response.choices[0].message.content
        print("Response message:", response_message)

        # Clean the response by removing code block markers
        if response_message.startswith("```json"):
            response_message = response_message[7:]  # Remove the opening ```json
        if response_message.endswith("```"):
            response_message = response_message[:-3]  # Remove the closing ```

        # Parse the cleaned response into JSON
        structured_response = json.loads(response_message)
        
        return structured_response
    except Exception as e:
        # Print error for debugging purposes
        print("Error generating AI advice:", e)
        return {
            "financial_advice": [
                {
                    "month": "N/A",
                    "suggestion": [
                        {
                            "title": "Error",
                            "description": "Unable to generate AI advice at the moment."
                        }
                    ]
                }
            ]
        }