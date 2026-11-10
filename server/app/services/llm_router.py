import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Groq client conditionally
groq_client = None
if settings.GROQ_API_KEY:
    try:
        from groq import AsyncGroq
        groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    except Exception as e:
        logger.warning(f"Could not initialize AsyncGroq client: {e}")

# Initialize Google GenAI client conditionally
gemini_client = None
if settings.GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.warning(f"Could not initialize Google GenAI client: {e}")


class LLMRouter:
    """
    Production-grade multi-model LLM router:
    - Primary Chat: Groq (Llama-3.3-70b-versatile) for ultra-low latency streaming.
    - Fallback Chat: Google Gemini 2.5 Flash if Groq is unavailable or rate-limited.
    - RAG Embeddings: Google text-embedding-004 (768 dimensions).
    - Executive Briefings: Google Gemini 2.5 Flash for deep root cause synthesis.
    - Graceful Mock Fallback: Generates deterministic responses when keys are not set.
    """

    @classmethod
    async def classify_intent_and_sentiment(cls, user_text: str) -> Dict[str, Any]:
        """
        Classifies user query intent and sentiment in under 200ms using Groq Fast Model.
        """
        # Testing environment bypass: return deterministic mock immediately
        if settings.ENVIRONMENT == "testing":
            lower = user_text.lower()
            intent = "General Inquiry"
            if any(w in lower for w in ["delivery", "tracking", "lost", "transit", "shipping", "fedex", "ups"]):
                intent = "Lost In Transit"
            elif any(w in lower for w in ["broken", "screen", "flicker", "device", "charge", "battery", "hardware"]):
                intent = "Hardware Failure"
            elif any(w in lower for w in ["refund", "charge", "bill", "invoice", "payment", "card", "cost"]):
                intent = "Billing & Invoicing"
            elif any(w in lower for w in ["password", "hacked", "account", "login", "auth", "2fa"]):
                intent = "Account Security"
            elif any(w in lower for w in ["cancel", "subscription", "stop"]):
                intent = "Cancellation"

            is_frustrated = any(w in lower for w in ["angry", "ridiculous", "terrible", "bad", "worst", "!"])
            sentiment = "frustrated" if is_frustrated else "neutral"

            return {
                "intent": intent,
                "intent_confidence": 0.92,
                "sentiment": sentiment,
                "sentiment_score": 0.85 if is_frustrated else 0.4,
                "urgency_score": 0.80 if is_frustrated else 0.35,
                "entities": {},
            }

        prompt = f"""You are a customer support intent classifier.
Analyze this user query:
\"\"\"{user_text}\"\"\"

Return strictly valid JSON with this exact schema:
{{
  "intent": "Hardware Failure" | "Lost In Transit" | "Billing & Invoicing" | "Account Security" | "Cancellation" | "General Inquiry",
  "intent_confidence": 0.0 to 1.0,
  "sentiment": "satisfied" | "neutral" | "urgent" | "frustrated",
  "sentiment_score": 0.0 to 1.0,
  "urgency_score": 0.0 to 1.0,
  "entities": {{}}
}}
JSON:"""

        # 1. Try Groq
        if groq_client:
            try:
                response = await groq_client.chat.completions.create(
                    model=settings.GROQ_FAST_MODEL or "llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": "You are a precise JSON-only classifier."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.1,
                    response_format={"type": "json_object"},
                    timeout=2.0,
                )
                raw_json = response.choices[0].message.content
                return json.loads(raw_json)
            except Exception as e:
                logger.warning(f"Groq intent classification failed: {e}. Falling back...")

        # 2. Try Gemini
        if gemini_client:
            try:
                res = gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                cleaned = res.text.strip().replace("```json", "").replace("```", "").strip()
                return json.loads(cleaned)
            except Exception as e:
                logger.warning(f"Gemini intent classification fallback failed: {e}")

        # 3. Deterministic Heuristic Fallback
        lower = user_text.lower()
        intent = "General Inquiry"
        if any(w in lower for w in ["delivery", "tracking", "lost", "transit", "shipping", "fedex", "ups"]):
            intent = "Lost In Transit"
        elif any(w in lower for w in ["broken", "screen", "flicker", "device", "charge", "battery", "hardware"]):
            intent = "Hardware Failure"
        elif any(w in lower for w in ["refund", "charge", "bill", "invoice", "payment", "card", "cost"]):
            intent = "Billing & Invoicing"
        elif any(w in lower for w in ["password", "hacked", "account", "login", "auth", "2fa"]):
            intent = "Account Security"
        elif any(w in lower for w in ["cancel", "subscription", "stop"]):
            intent = "Cancellation"

        is_frustrated = any(w in lower for w in ["angry", "ridiculous", "terrible", "bad", "worst", "!"])
        sentiment = "frustrated" if is_frustrated else "neutral"

        return {
            "intent": intent,
            "intent_confidence": 0.88,
            "sentiment": sentiment,
            "sentiment_score": 0.8 if is_frustrated else 0.4,
            "urgency_score": 0.75 if is_frustrated else 0.35,
            "entities": {},
        }

    @classmethod
    async def stream_chat_turn(
        cls,
        conversation_history: List[Dict[str, str]],
        system_instruction: str,
        temperature: float = 0.5,
    ) -> AsyncGenerator[str, None]:
        """
        Streams natural chat response tokens.
        Primary: Groq Llama-3.3-70b
        Fallback: Google Gemini 2.5 Flash
        """
        if settings.ENVIRONMENT == "testing":
            yield "I have reviewed your inquiry and our company policy. Let me run our automated diagnostic check."
            return

        # 1. Attempt Groq Streaming
        if groq_client:
            try:
                messages = [{"role": "system", "content": system_instruction}]
                for msg in conversation_history:
                    role = "user" if msg["sender"] in ["customer", "user"] else "assistant"
                    messages.append({"role": role, "content": msg["text"]})

                stream = await groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL or "llama-3.3-70b-versatile",
                    messages=messages,
                    temperature=temperature,
                    stream=True,
                    timeout=5.0,
                )
                async for chunk in stream:
                    delta = chunk.choices[0].delta.content or ""
                    if delta:
                        yield delta
                return
            except Exception as e:
                logger.warning(f"Groq chat stream failed: {e}. Falling back to Google Gemini...")

        # 2. Attempt Google Gemini Fallback
        if gemini_client:
            try:
                contents = f"System Instruction: {system_instruction}\n\nConversation:\n"
                for msg in conversation_history:
                    contents += f"{msg['sender'].capitalize()}: {msg['text']}\n"
                contents += "AI:"

                res = gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=contents,
                )
                yield res.text
                return
            except Exception as e:
                logger.warning(f"Gemini chat fallback failed: {e}")

        # 3. Fallback simulated response
        yield "I understand your concern. Let me inspect your order records and run our automated diagnostic checks right away."

    @classmethod
    async def get_embedding(cls, text: str) -> List[float]:
        """
        Generates 768-dimensional vector embedding using Google text-embedding-004.
        """
        if settings.ENVIRONMENT == "testing" or not gemini_client:
            import hashlib
            h = hashlib.sha256(text.encode("utf-8")).digest()
            base_vals = [((b / 255.0) - 0.5) for b in h]  # 32 values
            repeated = (base_vals * 24)[:768]  # 768 dimensions
            return repeated

        if gemini_client:
            try:
                response = gemini_client.models.embed_content(
                    model=settings.EMBEDDING_MODEL,
                    contents=text,
                )
                return response.embedding.values
            except Exception as e:
                logger.warning(f"Gemini embed_content failed: {e}. Using deterministic mock embedding...")

        # Deterministic 768-dim mock vector for offline/testing mode
        import hashlib
        h = hashlib.sha256(text.encode("utf-8")).digest()
        base_vals = [((b / 255.0) - 0.5) for b in h]  # 32 values
        repeated = (base_vals * 24)[:768]  # 768 dimensions
        return repeated

    @classmethod
    async def generate_ai_briefing(
        cls,
        ticket_number: str,
        customer_name: str,
        conversation_text: str,
        attempted_steps: List[str],
    ) -> Dict[str, Any]:
        """
        Synthesizes an AI Copilot Briefing for human operators using Google Gemini 2.5 Flash.
        """
        if settings.ENVIRONMENT == "testing":
            return {
                "core_issue": "Customer reported an unresolved issue after standard diagnostic checks failed.",
                "root_cause": "Carrier depot tracking anomaly or unverified hardware fault.",
                "attempted_steps": attempted_steps or ["Tracking ID verified", "Carrier status checked"],
                "recommended_action": "Execute 1-click manual replacement dispatch or issue warranty refund.",
                "recommended_action_label": "Dispatch Replacement",
                "confidence": 0.94,
                "urgency_score": 0.88,
                "sentiment_summary": "Frustrated - 48h SLA breached",
            }

        prompt = f"""You are the ResolveAI Support Copilot.
A customer conversation has escalated. Create an executive briefing for the human support agent so the customer NEVER repeats themselves.

Ticket: {ticket_number}
Customer: {customer_name}
Attempted Steps: {json.dumps(attempted_steps)}
Conversation:
{conversation_text}

Return strictly JSON with this schema:
{{
  "core_issue": "Concise 1-sentence description of the core problem",
  "root_cause": "Identified failure reason or root cause",
  "attempted_steps": ["step 1", "step 2"],
  "recommended_action": "Recommended resolution procedure",
  "recommended_action_label": "Short button label, e.g. Dispatch Replacement",
  "confidence": 0.0 to 1.0,
  "urgency_score": 0.0 to 1.0,
  "sentiment_summary": "Frustrated - Expressed high urgency"
}}
JSON:"""

        if gemini_client:
            try:
                res = gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                cleaned = res.text.strip().replace("```json", "").replace("```", "").strip()
                return json.loads(cleaned)
            except Exception as e:
                logger.warning(f"Gemini briefing generation failed: {e}")

        # Deterministic fallback briefing
        return {
            "core_issue": "Customer reported an unresolved issue after standard diagnostic checks failed.",
            "root_cause": "Carrier depot tracking anomaly or unverified hardware fault.",
            "attempted_steps": attempted_steps or ["Tracking ID verified", "Carrier status checked"],
            "recommended_action": "Execute 1-click manual replacement dispatch or issue warranty refund.",
            "recommended_action_label": "Dispatch Replacement",
            "confidence": 0.91,
            "urgency_score": 0.85,
            "sentiment_summary": "Frustrated - 48h SLA breached",
        }
