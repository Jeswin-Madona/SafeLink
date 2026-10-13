import re
from typing import List, Tuple
from app.models import IncidentAnalysisRequest, IncidentAnalysisResponse

def extract_time_indicators(text: str) -> str:
    patterns = [
        r'\b(?:night|evening|afternoon|morning|midnight|dawn|dusk)\b',
        r'\b\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)\b',
        r'\b\d{1,2}\s*(?:o\'clock)\b',
        r'\b(?:yesterday|today|last night|late night)\b'
    ]
    matches = []
    for pattern in patterns:
        found = re.findall(pattern, text, re.IGNORECASE)
        matches.extend(found)
    return ", ".join(list(set(matches))) if matches else "No explicit temporal anchor detected"

def classify_category_and_severity(text: str, fallback_cat: str = None) -> Tuple[str, str, List[str]]:
    text_lower = text.lower()
    risks = []

    # Category and Severity heuristics matching IncidentIQ
    if any(k in text_lower for k in ['stalk', 'followed', 'tailing', 'chasing', 'pursued']):
        category = "Stalking"
        severity = "HIGH"
        risks.append("Targeted pursuit behavior detected")
    elif any(k in text_lower for k in ['harass', 'lewd', 'grop', 'touch', 'molest', 'catcall', 'comment', 'eve-teas']):
        category = "Harassment"
        severity = "HIGH"
        risks.append("Direct gender-based verbal or physical harassment")
    elif any(k in text_lower for k in ['dark', 'unlit', 'broken light', 'streetlight', 'pitch black', 'underpass', 'no light']):
        category = "Poor Lighting"
        severity = "MEDIUM"
        risks.append("Severe nighttime visibility restriction")
    elif any(k in text_lower for k in ['weapon', 'knife', 'attack', 'assault', 'hit', 'snatch', 'grab']):
        category = "Physical Threat"
        severity = "CRITICAL"
        risks.append("Active violent or physical endangerment")
    elif any(k in text_lower for k in ['suspicious', 'group loitering', 'drunk', 'shady', 'unattended']):
        category = "Suspicious Activity"
        severity = "MEDIUM"
        risks.append("Loitering or unpredictable group behavior")
    else:
        category = fallback_cat if fallback_cat else "Infrastructure Hazard"
        severity = "LOW"
        risks.append("General public safety concern")

    if any(k in text_lower for k in ['night', 'late', 'isolated', 'deserted', 'alone']):
        risks.append("Low pedestrian traffic / isolated location")

    return category, severity, risks

def analyze_incident_report(request: IncidentAnalysisRequest) -> IncidentAnalysisResponse:
    combined_text = f"{request.title}. {request.description}"
    category, severity, risks = classify_category_and_severity(combined_text, request.reported_category)
    time_info = extract_time_indicators(combined_text)

    # Generated analytical summary
    summary = (
        f"AI Incident Summary: Report indicates {category.lower()} hazard with {severity.lower()} estimated severity. "
        f"Identified indicators include {', '.join(risks[:2]) if risks else 'general safety concern'}."
    )

    return IncidentAnalysisResponse(
        summary=summary,
        suggested_category=category,
        estimated_severity=severity,
        extracted_location=request.location or "Extracted from report context",
        extracted_time_indicators=time_info,
        key_risk_indicators=risks,
        disclaimer="AI-generated analysis. Not verified official finding."
    )
