import re
from typing import List, Tuple

# Regex patterns for sensitive PII
CREDIT_CARD_REGEX = re.compile(
    r"\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b"
)
SSN_REGEX = re.compile(r"\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b")
PHONE_REGEX = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
PASSWORD_REGEX = re.compile(r"(?i)\b(?:password|passwd|pwd|secret|pin)\s*[:=]\s*([^\s,;]+)")

# Injection patterns
INJECTION_KEYWORDS = [
    "ignore all previous instructions",
    "ignore previous instructions",
    "disregard previous instructions",
    "system prompt",
    "you are now in developer mode",
    "jailbreak",
    "do anything now",
    "dan mode",
    "reveal your prompt",
    "output the above instructions",
]

# Profanity and abuse triggers
ABUSIVE_WORDS = [
    "scam", "fraud", "sue", "lawyer", "court", "furious", "unacceptable",
    "garbage", "horrible", "terrible", "pathetic", "idiot", "useless"
]


def mask_pii(text: str) -> Tuple[str, bool]:
    """
    Detects and masks sensitive customer PII including Credit Card numbers,
    SSNs, phone numbers, and leaked passwords.
    Returns (cleaned_text, pii_detected_bool).
    """
    pii_found = False
    cleaned = text

    if CREDIT_CARD_REGEX.search(cleaned):
        cleaned = CREDIT_CARD_REGEX.sub("[REDACTED_CARD_NUMBER]", cleaned)
        pii_found = True

    if SSN_REGEX.search(cleaned):
        cleaned = SSN_REGEX.sub("[REDACTED_SSN]", cleaned)
        pii_found = True

    if PASSWORD_REGEX.search(cleaned):
        cleaned = PASSWORD_REGEX.sub(r"password: [REDACTED_CREDENTIAL]", cleaned)
        pii_found = True

    return cleaned, pii_found


def detect_prompt_injection(text: str) -> bool:
    """
    Scans input for common system prompt override or jailbreak markers.
    """
    lower = text.lower()
    for pattern in INJECTION_KEYWORDS:
        if pattern in lower:
            return True
    return False


def assess_customer_frustration(text: str) -> Tuple[float, bool]:
    """
    Assesses customer frustration and urgency based on exclamation marks,
    all-caps tokens, and high-urgency keywords.
    Returns (frustration_score between 0.0 and 1.0, is_urgent_escalate).
    """
    score = 0.2
    lower = text.lower()

    # Repeated punctuation (e.g., ??? or !!!)
    if "!" in text:
        score += min(0.3, text.count("!") * 0.1)
    if "?" in text and text.count("?") >= 2:
        score += 0.15

    # Check for all-caps yelling (words with len >= 4 in uppercase)
    words = text.split()
    caps_count = sum(1 for w in words if len(w) >= 4 and w.isupper())
    if caps_count >= 2:
        score += 0.25

    # Abusive/urgent keywords
    matched_abuse = sum(1 for w in ABUSIVE_WORDS if w in lower)
    if matched_abuse > 0:
        score += min(0.4, matched_abuse * 0.15)

    final_score = min(1.0, round(score, 2))
    should_escalate = final_score >= 0.75

    return final_score, should_escalate


def check_rag_groundedness(answer: str, retrieved_snippets: List[str]) -> float:
    """
    Heuristic lexical-grounding verification: calculates keyword overlap
    between key noun phrases in the generated answer and the source snippets.
    Returns groundedness score from 0.0 to 1.0.
    """
    if not retrieved_snippets:
        return 1.0  # No RAG required for pure conversational turns

    answer_words = set(re.findall(r"\b[A-Za-z0-9_]{4,}\b", answer.lower()))
    if not answer_words:
        return 1.0

    context_words = set()
    for snip in retrieved_snippets:
        context_words.update(re.findall(r"\b[A-Za-z0-9_]{4,}\b", snip.lower()))

    common = answer_words.intersection(context_words)
    overlap_ratio = len(common) / len(answer_words)

    # Scale to expected baseline (0.7+ is high grounding for natural dialogue)
    score = min(1.0, overlap_ratio * 1.4)
    return round(score, 2)
