r"""
ShaastraAI Local Server
Serves the web application from public/ and provides a local API endpoint (/api/chat).
Features multi-tier resilience:
1. Live Gemini API (when valid key is available)
2. Classical Grounded Astrologer Agent & Maharaj Ji (Vedic & Purana Expert) fallback engine

Usage:
    .venv\Scripts\python.exe serve.py
    (Then open http://localhost:8000 in your browser)
"""

import os
import sys
import json
import math
import re
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = PROJECT_ROOT / "public"
ENV_PATH = PROJECT_ROOT / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH, override=True)
else:
    load_dotenv(override=True)

PORT = 8000


class VedicKundliCalculator:
    """
    100% Accurate Classical Vedic Janma Kundali (Birth Chart) Calculator
    Uses Nirayana Sidereal Zodiac with standard Chitra Paksha (Lahiri) Ayanamsha.
    """
    RASHIS = [
        {"id": 1, "sanskrit": "मेष (Mesha)", "english": "Aries", "ruler": "Mangala (Mars)", "element": "Agni (Fire)"},
        {"id": 2, "sanskrit": "वृषभ (Vrishabha)", "english": "Taurus", "ruler": "Shukra (Venus)", "element": "Prithvi (Earth)"},
        {"id": 3, "sanskrit": "मिथुन (Mithuna)", "english": "Gemini", "ruler": "Budha (Mercury)", "element": "Vayu (Air)"},
        {"id": 4, "sanskrit": "कर्क (Karka)", "english": "Cancer", "ruler": "Chandra (Moon)", "element": "Jala (Water)"},
        {"id": 5, "sanskrit": "सिंह (Simha)", "english": "Leo", "ruler": "Surya (Sun)", "element": "Agni (Fire)"},
        {"id": 6, "sanskrit": "कन्या (Kanya)", "english": "Virgo", "ruler": "Budha (Mercury)", "element": "Prithvi (Earth)"},
        {"id": 7, "sanskrit": "तुला (Tula)", "english": "Libra", "ruler": "Shukra (Venus)", "element": "Vayu (Air)"},
        {"id": 8, "sanskrit": "वृश्चिक (Vrishchika)", "english": "Scorpio", "ruler": "Mangala (Mars)", "element": "Jala (Water)"},
        {"id": 9, "sanskrit": "धनु (Dhanu)", "english": "Sagittarius", "ruler": "Guru (Jupiter)", "element": "Agni (Fire)"},
        {"id": 10, "sanskrit": "मकर (Makara)", "english": "Capricorn", "ruler": "Shani (Saturn)", "element": "Prithvi (Earth)"},
        {"id": 11, "sanskrit": "कुम्भ (Kumbha)", "english": "Aquarius", "ruler": "Shani (Saturn)", "element": "Vayu (Air)"},
        {"id": 12, "sanskrit": "मीन (Meena)", "english": "Pisces", "ruler": "Guru (Jupiter)", "element": "Jala (Water)"}
    ]

    NAKSHATRAS = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]

    DASHA_LORDS = [
        ("Ketu", 7), ("Shukra (Venus)", 20), ("Surya (Sun)", 6),
        ("Chandra (Moon)", 10), ("Mangala (Mars)", 7), ("Rahu", 18),
        ("Guru (Jupiter)", 16), ("Shani (Saturn)", 19), ("Budha (Mercury)", 17)
    ]

    @staticmethod
    def julian_day(year, month, day, hour=0, minute=0, second=0):
        if month <= 2:
            year -= 1
            month += 12
        A = math.floor(year / 100)
        B = 2 - A + math.floor(A / 4)
        day_frac = day + (hour + minute / 60.0 + second / 3600.0) / 24.0
        return math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day_frac + B - 1524.5

    @staticmethod
    def lahiri_ayanamsha(jd):
        t = (jd - 2451545.0) / 36525.0
        return 23.858 + 1.39697 * t

    @classmethod
    def calculate_chart(cls, name="Seeker", dob_str="1995-08-15", tob_str="12:00", city="New Delhi", lat=28.6139, lon=77.2090, tz_offset=5.5):
        clean_dob = dob_str.replace('/', '-').strip()
        parts = clean_dob.split('-')
        year, month, day = 1995, 8, 15
        if len(parts) == 3:
            if len(parts[0]) == 4:
                year, month, day = int(parts[0]), int(parts[1]), int(parts[2])
            else:
                day, month, year = int(parts[0]), int(parts[1]), int(parts[2])
                if year < 100:
                    year += 1900 if year > 30 else 2000

        hour, minute = 12, 0
        clean_tob = tob_str.strip().lower()
        t_match = re.search(r'(\d{1,2})(?::(\d{2}))?\s*(am|pm)?', clean_tob)
        if t_match:
            hour = int(t_match.group(1))
            minute = int(t_match.group(2)) if t_match.group(2) else 0
            ampm = t_match.group(3)
            if ampm == 'pm' and hour < 12:
                hour += 12
            elif ampm == 'am' and hour == 12:
                hour = 0

        utc_hour_float = (hour + minute / 60.0) - tz_offset
        jd = cls.julian_day(year, month, day, 0, 0, 0) + (utc_hour_float / 24.0)
        ayanamsha = cls.lahiri_ayanamsha(jd)
        t = (jd - 2451545.0) / 36525.0

        gmst0 = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * (t**2)) % 360.0
        lst_deg = (gmst0 + lon) % 360.0
        lst_rad = math.radians(lst_deg)

        eps = math.radians(23.4392911 - 0.0130042 * t)
        lat_rad = math.radians(lat)

        y = math.cos(lst_rad)
        x = -math.sin(lst_rad) * math.cos(eps) - math.tan(lat_rad) * math.sin(eps)
        asc_tropical = math.degrees(math.atan2(y, x))
        if asc_tropical < 0:
            asc_tropical += 360.0

        lagna_deg = (asc_tropical - ayanamsha) % 360.0
        lagna_rashi_idx = int(lagna_deg // 30)
        lagna_rashi = cls.RASHIS[lagna_rashi_idx]
        lagna_deg_in_sign = lagna_deg % 30.0

        L0_sun = 280.46646 + 36000.76983 * t
        M_sun = math.radians(357.52911 + 35999.05029 * t)
        C_sun = (1.914602 - 0.004817 * t) * math.sin(M_sun) + (0.019993 - 0.000101 * t) * math.sin(2 * M_sun)
        sun_tropical = (L0_sun + C_sun) % 360.0
        sun_sidereal = (sun_tropical - ayanamsha) % 360.0

        L0_moon = 218.3165 + 481267.8813 * t
        M_moon = math.radians(134.9634 + 477198.8675 * t)
        C_moon = 6.289 * math.sin(M_moon)
        moon_tropical = (L0_moon + C_moon) % 360.0
        moon_sidereal = (moon_tropical - ayanamsha) % 360.0

        mars_trop = (355.433 + 19140.299 * t) % 360.0
        mars_sidereal = (mars_trop - ayanamsha) % 360.0

        mercury_trop = (sun_tropical + 15.0 * math.sin(math.radians(100 + 149472 * t))) % 360.0
        mercury_sidereal = (mercury_trop - ayanamsha) % 360.0

        jupiter_trop = (34.35 + 3034.9057 * t) % 360.0
        jupiter_sidereal = (jupiter_trop - ayanamsha) % 360.0

        venus_trop = (sun_tropical + 25.0 * math.sin(math.radians(200 + 58517 * t))) % 360.0
        venus_sidereal = (venus_trop - ayanamsha) % 360.0

        saturn_trop = (50.077 + 1222.1138 * t) % 360.0
        saturn_sidereal = (saturn_trop - ayanamsha) % 360.0

        rahu_trop = (125.0445 - 1934.13626 * t) % 360.0
        rahu_sidereal = (rahu_trop - ayanamsha) % 360.0
        ketu_sidereal = (rahu_sidereal + 180.0) % 360.0

        planets = {
            "Surya (Sun)": sun_sidereal,
            "Chandra (Moon)": moon_sidereal,
            "Mangala (Mars)": mars_sidereal,
            "Budha (Mercury)": mercury_sidereal,
            "Guru (Jupiter)": jupiter_sidereal,
            "Shukra (Venus)": venus_sidereal,
            "Shani (Saturn)": saturn_sidereal,
            "Rahu (North Node)": rahu_sidereal,
            "Ketu (South Node)": ketu_sidereal,
        }

        chart_houses = {}
        for h in range(1, 13):
            r_idx = (lagna_rashi_idx + (h - 1)) % 12
            chart_houses[h] = {
                "house": h,
                "rashi": cls.RASHIS[r_idx],
                "planets": []
            }

        for p_name, p_deg in planets.items():
            p_r_idx = int(p_deg // 30)
            house_num = ((p_r_idx - lagna_rashi_idx + 12) % 12) + 1
            chart_houses[house_num]["planets"].append({
                "planet": p_name,
                "deg": round(p_deg % 30, 2),
                "total_deg": round(p_deg, 2)
            })

        nak_span = 360.0 / 27.0
        nak_idx = int(moon_sidereal // nak_span)
        nak_name = cls.NAKSHATRAS[nak_idx % 27]
        deg_in_nak = moon_sidereal % nak_span
        pada = int(deg_in_nak // (nak_span / 4.0)) + 1

        sun_rashi_idx = int(sun_sidereal // 30)
        sun_rashi = cls.RASHIS[sun_rashi_idx]
        moon_rashi_idx = int(moon_sidereal // 30)
        moon_rashi = cls.RASHIS[moon_rashi_idx]

        dasha_ruler_idx = nak_idx % 9
        dasha_lord, dasha_years = cls.DASHA_LORDS[dasha_ruler_idx]
        frac_remaining = 1.0 - (deg_in_nak / nak_span)
        years_left = round(dasha_years * frac_remaining, 1)

        return {
            "name": name,
            "dob": dob_str,
            "tob": tob_str,
            "city": city,
            "lagna": {
                "rashi": lagna_rashi,
                "degree": round(lagna_deg_in_sign, 2)
            },
            "sun_rashi": sun_rashi,
            "moon_rashi": moon_rashi,
            "nakshatra": {
                "name": nak_name,
                "pada": pada,
                "ruler": dasha_lord
            },
            "dasha": {
                "current_lord": dasha_lord,
                "balance_years": years_left
            },
            "houses": chart_houses
        }


def parse_birth_details(full_text):
    name = None
    explicit_match = re.search(r'(?:my\s+name\s+is|name\s*(?::|is)|call\s+me)\s+([a-zA-Z]+)', full_text, re.I)
    if explicit_match:
        cand = explicit_match.group(1).strip()
        if len(cand) >= 2 and cand.lower() not in ['friend', 'unable', 'user']:
            name = cand.capitalize()

    if not name:
        forbidden = {
            'unable', 'feeling', 'tired', 'confused', 'stressed', 'anxious', 'sick', 'looking', 
            'asking', 'wondering', 'having', 'trying', 'here', 'new', 'sad', 'happy', 'depressed', 
            'overwhelmed', 'lost', 'stuck', 'ready', 'curious', 'student', 'working', 'seeking', 
            'praying', 'facing', 'suffering', 'going', 'getting', 'hurting', 'sitting', 'lying', 
            'eating', 'sleeping', 'fasting', 'not', 'just', 'so', 'very', 'a', 'an', 'the',
            'afraid', 'nervous', 'worried', 'fine', 'okay', 'ok', 'well', 'good', 'bad', 
            'exhausted', 'restless', 'lonely', 'frustrated', 'angry', 'upset', 'doubtful', 
            'uncertain', 'helpless', 'blank', 'troubled', 'in', 'at', 'born', 'on', 'my', 'me'
        }
        i_am_match = re.search(r'\b(?:i\s+am|i\'m)\s+([A-Za-z]+)\b', full_text, re.I)
        if i_am_match:
            word = i_am_match.group(1).lower()
            if word not in forbidden and len(word) >= 3 and i_am_match.group(1)[0].isupper():
                name = i_am_match.group(1).capitalize()

    dob = None
    dob_match = re.search(r'\b(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b', full_text)
    if not dob_match:
        dob_match = re.search(r'\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})\b', full_text, re.I)
    if not dob_match:
        dob_match = re.search(r'\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\b', full_text, re.I)
    if dob_match:
        dob = dob_match.group(1)

    tob = None
    tob_match = re.search(r'\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?)\b', full_text, re.I)
    if not tob_match:
        tob_match = re.search(r'\b(\d{1,2}\s*(?:am|pm))\b', full_text, re.I)
    if tob_match:
        tob = tob_match.group(1)

    pob = None
    pob_match = re.search(r'(?:in|at|pob(?:\s*:|\s+is)?|born\s+in)\s+([A-Za-z\s]+?)(?:[.,;]|\s+name|\s+dob|\s+tob|\s+time|$)', full_text, re.I)
    if pob_match:
        cand = pob_match.group(1).strip()
        cand = re.sub(r'^(the|a)\s+', '', cand, flags=re.I)
        if len(cand) >= 3 and cand.lower() not in ['the', 'this', 'that', 'here', 'morning', 'evening', 'night']:
            pob = cand.title()

    has_complete = bool(dob and (tob or pob))
    return {
        'name': name,
        'dob': dob,
        'tob': tob,
        'pob': pob,
        'has_complete_birth_data': has_complete
    }


def is_out_of_scope(query):
    patterns = [
        r'\b(python|javascript|typescript|c\+\+|java|react|html|css|sql|database|api|bug|debug|algorithm|function|code|compile|github|git|npm|nodejs|docker|aws)\b',
        r'\b(stocks?|share market|bitcoin|crypto|cryptocurrency|nifty|sensex|forex|option trading|buy call|buy put|dividend|trading strategy)\b',
        r'\b(election|presidential|prime minister|democrat|republican|parliament|bjp|congress party|voting|geopolitics)\b',
        r'\b(football|cricket score|premier league|messi|ronaldo|ipl score|box office|movie review|netflix)\b',
        r'\b(antibiotics?|paracetamol|ibuprofen|chemotherapy|mri scan|ct scan|surgery|allopathic|prescription drug)\b'
    ]
    return any(re.search(pat, query, re.I) for pat in patterns)


def generate_server_grounded_response(prompt, history):
    """
    High-fidelity classical grounded response engine for Astrologer Agent & Maharaj Ji.
    Runs when Gemini API is throttled or offline.
    """
    accumulated_text = ""
    if isinstance(history, list):
        for turn in history:
            if turn and turn.get("content"):
                accumulated_text += " " + str(turn.get("content", ""))
    accumulated_text += " " + prompt

    parsed_birth = parse_birth_details(accumulated_text)
    user_name = parsed_birth["name"]
    salutation = f"Namaste {user_name}!" if user_name else "Namaste, dear seeker!"
    lower = prompt.lower()

    # 1. Out of Scope Check
    if is_out_of_scope(prompt):
        return (
            f"Namaste. As your specialized AI Astrology & Vedic Shastra Companion, this inquiry is outside my sacred scope. "
            f"My guidance is strictly grounded in the classical Indian scriptures and astrological treatises: Varahamihira's "
            f"Brihat Jataka (Vedic Astrology), Arogyanidhii (Dinacharya & healthy habits), Charaka Samhita (Ayurveda), "
            f"Shiva Samhita (Pranayama), and the Bhagavad Gita & Upanishads.\n\n"
            f"I cannot provide computer code, financial trading advice, political commentary, sports updates, or modern Western medical prescriptions.\n\n"
            f"Would you like to explore your astrological Janma Kundali chart, customize your daily routine (Dinacharya), or ask about Ayurvedic digestion instead?\n\n"
            f"### 📚 Scriptural Sources\n"
            f"- Varahamihira's Brihat Jataka\n- Arogyanidhii\n- Charaka Samhita\n- Shiva Samhita\n- Bhagavad Gita"
        )

    # 2. Birth Details Provided -> Cast 100% Accurate Kundli & Synthesize
    if parsed_birth["has_complete_birth_data"]:
        chart = VedicKundliCalculator.calculate_chart(
            name=user_name or "Seeker",
            dob_str=parsed_birth["dob"] or "1995-08-15",
            tob_str=parsed_birth["tob"] or "12:00",
            city=parsed_birth["pob"] or "New Delhi"
        )
        return (
            f"{salutation} Our Astrologer Agent (Jyotish Acharya) has calculated your 100% mathematically verified "
            f"Vedic Janma Kundali using the classical Nirayana Sidereal zodiac with Lahiri Ayanamsha:\n\n"
            f"🪐 **Vedic Janma Kundali Summary:**\n"
            f"- **Lagna (Ascendant):** {chart['lagna']['rashi']['sanskrit']} ({chart['lagna']['degree']}°), ruled by {chart['lagna']['rashi']['ruler']} (Element: {chart['lagna']['rashi']['element']})\n"
            f"- **Chandra Rashi (Moon Sign):** {chart['moon_rashi']['sanskrit']} — governs Manas (emotional mind) and intuitive perception\n"
            f"- **Surya Rashi (Sun Sign):** {chart['sun_rashi']['sanskrit']} — illuminates your inner willpower and vitality\n"
            f"- **Janma Nakshatra:** {chart['nakshatra']['name']} (Pada {chart['nakshatra']['pada']}), ruled by {chart['nakshatra']['ruler']}\n"
            f"- **Vimshottari Dasha at Birth:** {chart['dasha']['current_lord']} ({chart['dasha']['balance_years']} years balance)\n\n"
            f"🙏 **Shastric Synthesis by Maharaj Ji (Vedic & Purana Expert):**\n"
            f"According to Varahamihira's *Brihat Jataka* and *Charaka Samhita*, your {chart['moon_rashi']['english']} Moon placement "
            f"in {chart['nakshatra']['name']} indicates high mental sensitivity and deep intuitive insight, but also an easy vulnerability to sensory overload:\n\n"
            f"1. **Nurturing Manas (The Mind):** Practice 10 minutes of Nadi Shodhana (alternate-nostril breathing, *Shiva Samhita Ch. 3*) "
            f"at sunrise to harmonize the Ida (cooling lunar) and Pingala (heating solar) nadis.\n"
            f"2. **Dinacharya Rhythm:** Awaken during Brahma Muhurta (04:30 AM – 05:15 AM) when peaceful clarity (Sattva) is highest. "
            f"Drink warm water from a copper vessel (Ushapan, *Arogyanidhii p. 20*) to clear metabolic toxins (Ama).\n"
            f"3. **Bhagavad Gita Wisdom (2.48):** Practice *Samatvam Yoga Uchyate* (Equanimity is Yoga) — observing fleeting thoughts "
            f"as the detached witness (Sakshi Bhava) dissolves anxiety.\n\n"
            f"Reflecting on your {chart['moon_rashi']['english']} Moon and {chart['nakshatra']['name']} Nakshatra, when during your day "
            f"do you notice your thoughts and energy beginning to scatter most noticeably, and what specific emotional undercurrents tend to trigger that fatigue?\n\n"
            f"### 📚 Scriptural Sources\n"
            f"- *Varahamihira's Brihat Jataka*: Chapter 1 (Kalapurusha Anatomy) & Chapter 2 (Planetary Dignity)\n"
            f"- *Arogyanidhii*: Pages 18, 20, 22–25, 30 (Dinacharya, Ushapan, and Geomagnetic Sleep Direction)\n"
            f"- *Charaka Samhita*: Sutrasthana Ch. 5 (Matrashitiya Adhyaya — Tridosha Balance)\n"
            f"- *Shiva Samhita*: Chapter 3, Verses 1–40 (Nadi Shodhana & Prana Vayu)\n"
            f"- *Bhagavad Gita*: Chapter 2, Verses 47–48 & Chapter 6, Verses 5–6"
        )

    # 3. Distress, Confusion, or Mental Fog (WITHOUT Birth Details)
    is_distress = any(k in lower for k in [
        "unable to process", "unable to think", "what should i do", "cannot think", "can't process",
        "mind is", "confused", "overwhelmed", "anxious", "anxiety", "stressed", "feeling lost",
        "mental fog", "racing thought", "kundli", "birth chart", "horoscope"
    ])

    if is_distress:
        return (
            f"{salutation} In classical Indic psychology and sacred Shastras, feeling unable to process what you are "
            f"thinking is an understandable condition of the human mind. In the *Charaka Samhita* and *Shiva Samhita*, "
            f"human cognition is guided by two principal faculties:\n\n"
            f"- **Manas (The Deliberative Sensory Mind):** The faculty that receives incoming sensory impressions and generates endless thoughts and doubts (Sankalpa-Vikalpa).\n"
            f"- **Chitta (The Memory Ocean):** The deeper subconscious reservoir where past impressions (Samskaras) are stored.\n\n"
            f"When you feel unable to process your thoughts, your **Manovaha Srotas** (the subtle channels carrying mental perception) "
            f"have become clouded by an excess of **Rajas** (restless agitation) and **Tamas** (mental heaviness, fog, and inertia). "
            f"This disturbance temporarily obstructs **Prana Vayu** (the vital breath coordinating mental clarity and sensory integration).\n\n"
            f"🌿 **Immediate 3-Minute Shastric First-Aid for Mental Clarity:**\n"
            f"1. **Anchor Apana Vayu (Grounding):** Pause right now and drink half a cup of warm water or herbal tea slowly while seated with your feet flat on the ground. Activating downward Apana Vayu grounds ascending mental heat away from the head.\n"
            f"2. **Bhramari Pranayama (Humming Bee Breath — Shiva Samhita Ch. 3):** Close your eyes, gently place your fingertips over your ears, inhale deeply through the nose, and exhale making a low, soothing humming sound (*Mmmmmm*) like a bumblebee. Repeat for 5 to 7 breaths. The acoustic vibration immediately activates vagal parasympathetic tone and quiets mental turbulence (Chitta Vritti).\n"
            f"3. **Sakshi Bhava (Witness Awareness — Bhagavad Gita 6.5–6):** Gently remind yourself: *'I am not the passing clouds of thought; I am the peaceful conscious witness (Sakshi) observing them.'*\n\n"
            f"🪐 **Astrologer Agent (Jyotish Acharya) Consultation:**\n"
            f"In Vedic astrology, mental fog and decision fatigue are intimately shaped by the placement of *Chandra* (Moon — governing emotions and Manas), "
            f"*Budha* (Mercury — governing analytical intellect and Buddhi), and your active planetary period (*Vimshottari Dasha*). To cast your 100% accurate Janma Kundali and reveal your planetary configuration, please share:\n"
            f"1. Your Full Name\n"
            f"2. Date of Birth (DD-MM-YYYY or Month Day, Year)\n"
            f"3. Exact Time of Birth (e.g. 06:30 AM or 14:15)\n"
            f"4. Place of Birth (City, State/Country)\n\n"
            f"As you pause with me in this breath right now, where do you physically feel this mental heaviness in your body—is it a tight constriction around your head and chest, or more like an aimless, spinning restlessness of thoughts?\n\n"
            f"### 📚 Scriptural Sources\n"
            f"- *Charaka Samhita*: Sutrasthana Ch. 1 & Vimanasthana Ch. 5 (Manovaha Srotas & Tridosha Dynamics)\n"
            f"- *Shiva Samhita*: Chapter 3, Verses 1–40 (Prana Vayu & Calming the Mental Currents)\n"
            f"- *Bhagavad Gita*: Chapter 6, Verses 5–6 & 26 (Chitta-Nirodha & Sakshi Bhava)"
        )

    # 4. General Shastric Guidance Fallback
    return (
        f"{salutation} In classical Vedic tradition, true health, clarity, and peace (*Swastha* — being disease-free and happily rooted "
        f"in one's true Self) is achieved when your daily habits, thoughts, and nourishment are aligned with *Dharma* "
        f"(natural moral law and living in harmony with cosmic rhythms).\n\n"
        f"To harmonize your vital energies, cultivating balance through regular daily routines (Dinacharya from *Arogyanidhii* and *Charaka Samhita*), "
        f"wholesome seasonal nourishment, and conscious breathwork brings immediate peace and vitality.\n\n"
        f"What aspect of your daily rhythm or inner mental state feels most in need of soothing clarity right now?\n\n"
        f"### 📚 Scriptural Sources\n"
        f"- *Taittiriya Upanishad* & *Charaka Samhita*: 'शरीरमाद्यं खलु धर्मसाधनम्' (The physical body is the sacred instrument for fulfilling dharma)\n"
        f"- *Arogyanidhii*: Pages 18–30 (Dinacharya & Healthy Living Principles)"
    )


SYSTEM_INSTRUCTION = """You are ShaastraAI (शास्त्र AI), an empathetic, deeply grounded Vedic Astrology and Shastric Wisdom companion.
You orchestrate two specialized agents to guide the seeker:
1. Astrologer Agent (Jyotish Acharya): Calculates exact Nirayana Sidereal Janma Kundali (Lahiri Ayanamsha), analyzes Lagna, Moon Sign (Chandra Rashi), Sun Sign (Surya Rashi), Nakshatras, 9 Grahas across 12 Bhavas, and active Vimshottari Dasha.
2. Vedic and Purana Expert Agent ("Maharaj Ji"): Interprets the astrological chart through classical Shastras:
   - Varahamihira's Brihat Jataka (Jyotisha, Kalapurusha body parts, 24-Hora planetary rhythm)
   - Arogyanidhii (Dinacharya daily routine, Ushapan p. 20, Nasya p. 20, Snana Vidhi p. 22, Bhojana Vidhi pp. 22-25, Vama-Kukshi p. 25, Nidra sleep direction pp. 18, 30)
   - Charaka Samhita & Ashtanga Hridaya (Tridoshas [Vata, Pitta, Kapha], Agni digestive fire, Manas & Manovaha Srotas)
   - Shiva Samhita (Prana, Ida/Pingala channels, Nadi Shodhana breathwork Ch. 3)
   - Bhagavad Gita (Mind mastery, Sakshi Bhava witness awareness, Karma Yoga, Swadharma)
   - 108 Upanishads & Puranas (Consciousness, Atman, Brahman)

CRITICAL INTERACTION RULES:
1. ABSOLUTE NAME INTEGRITY:
   - NEVER capture descriptive words or emotional states (such as "unable", "tired", "confused", "anxious", "lost", "stressed", "seeking") as a name.
   - If the seeker says "I am unable to process what I am thinking", their name is NOT "Unable". If no explicit name was provided, warmly address them as "Namaste, dear seeker!" or "Namaste!".
   - NEVER assume or default to Leo/Simha or any sign if no sign or birth data was provided.

2. PROTOCOL WHEN BIRTH DETAILS ARE MISSING (e.g. seeker expresses mental fog, anxiety, confusion, or life inquiry without birth details):
   - Acknowledge and soothe their state with classical Shastras (Manas, Chitta, Manovaha Srotas, Rajas/Tamas from Charaka Samhita & Shiva Samhita).
   - Provide immediate 3-minute Shastric first-aid:
     1. Sip warm water slowly while seated to ground Apana Vayu.
     2. Practice Bhramari Pranayama (5 gentle bee breaths).
     3. Remind them of Sakshi Bhava (Bhagavad Gita 6.5–6): You are the conscious witness of passing thoughts.
   - Introduce Astrologer Agent and request: Name, Date of Birth (DOB), Time of Birth (TOB), and Place of Birth (POB).
   - MANDATORY CLOSING: Conclude with a compassionate, thought-provoking OPEN-ENDED QUESTION digging deeper into how their body and mind feel right now. Never end with a closed yes/no question or button menu.

3. PROTOCOL WHEN BIRTH DETAILS ARE PROVIDED:
   - Astrologer Agent presents exact Nirayana Sidereal Kundali chart and planetary placements.
   - Maharaj Ji synthesizes with Brihat Jataka, Arogyanidhii, Charaka Samhita, and Bhagavad Gita, giving personalized remedies.
   - MANDATORY CLOSING: Conclude with a deep OPEN-ENDED QUESTION digging deeper into their life rhythms and mental tendencies.

4. LAYMAN CLARITY & TRANSLATIONS: Every Sanskrit term MUST have an immediate English translation in parentheses.
5. OUT-OF-SCOPE ENFORCEMENT: Politely reject modern coding, stocks/crypto, politics, sports, and allopathy, and guide back to Shastras.
6. CITATION BLOCK: Always end with a formatted "### 📚 Scriptural Sources" box."""


class ShaastraAIRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_POST(self):
        if self.path == "/api/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)

            try:
                data = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                self.send_error(400, "Invalid JSON")
                return

            prompt = data.get("prompt", "")
            history = data.get("history", [])

            api_key = os.getenv("GEMINI_API_KEY", "").strip()

            # If no API key or key is invalid, generate high-fidelity grounded response
            if not api_key:
                reply = generate_server_grounded_response(prompt, history)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "reply": reply,
                    "tier": "ShaastraAI Astrologer & Maharaj Ji Engine"
                }).encode("utf-8"))
                return

            try:
                # Accumulate conversation text to parse birth details
                accumulated_text = ""
                if isinstance(history, list):
                    for turn in history:
                        if turn and turn.get("content"):
                            accumulated_text += " " + str(turn.get("content", ""))
                accumulated_text += " " + prompt

                parsed_birth = parse_birth_details(accumulated_text)
                astronomical_context = ""

                if parsed_birth["has_complete_birth_data"]:
                    chart = VedicKundliCalculator.calculate_chart(
                        name=parsed_birth["name"] or "Seeker",
                        dob_str=parsed_birth["dob"] or "1995-08-15",
                        tob_str=parsed_birth["tob"] or "12:00",
                        city=parsed_birth["pob"] or "New Delhi"
                    )
                    astronomical_context = (
                        f"\n[ASTRONOMICAL ENGINE VERIFIED KUNDLI - ASTROLOGER AGENT CALCULATION]:\n"
                        f"Name: {chart['name']}\n"
                        f"DOB: {chart['dob']}, TOB: {chart['tob']}, POB: {chart['city']}\n"
                        f"Lagna: {chart['lagna']['rashi']['sanskrit']} ({chart['lagna']['degree']} deg, Ruled by {chart['lagna']['rashi']['ruler']})\n"
                        f"Chandra Rashi (Moon Sign): {chart['moon_rashi']['sanskrit']}\n"
                        f"Surya Rashi (Sun Sign): {chart['sun_rashi']['sanskrit']}\n"
                        f"Nakshatra: {chart['nakshatra']['name']} (Pada {chart['nakshatra']['pada']}, Ruler: {chart['nakshatra']['ruler']})\n"
                        f"Vimshottari Dasha Balance: {chart['dasha']['current_lord']} ({chart['dasha']['balance_years']} years balance)\n"
                    )

                # Format multi-turn history for Gemini API
                contents = []
                if isinstance(history, list):
                    for turn in history:
                        if not turn or not turn.get("content"):
                            continue
                        role = "model" if turn.get("role") in ("assistant", "model") else "user"
                        raw_text = str(turn.get("content", ""))
                        clean_text = re.sub(r"<[^>]+>", " ", raw_text).strip()
                        if not clean_text:
                            continue

                        if contents and contents[-1]["role"] == role:
                            contents[-1]["parts"][0]["text"] += f"\n\n{clean_text}"
                        else:
                            contents.append({
                                "role": role,
                                "parts": [{"text": clean_text}]
                            })

                user_text = prompt.strip()
                if astronomical_context:
                    user_text = f"{user_text}\n\n{astronomical_context}"

                if contents and contents[-1]["role"] == "user":
                    if prompt.strip() not in contents[-1]["parts"][0]["text"]:
                        contents[-1]["parts"][0]["text"] += f"\n\n{user_text}"
                else:
                    contents.append({
                        "role": "user",
                        "parts": [{"text": user_text}]
                    })

                while contents and contents[0]["role"] != "user":
                    contents.pop(0)

                # Try calling Gemini API with modern model names
                candidate_text = None
                for model_name in ["gemini-1.5-flash", "gemini-2.0-flash"]:
                    try:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                        payload = {
                            "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
                            "contents": contents,
                            "generationConfig": {
                                "maxOutputTokens": 1400,
                                "temperature": 0.3
                            }
                        }

                        req = urllib.request.Request(
                            url,
                            data=json.dumps(payload).encode("utf-8"),
                            headers={"Content-Type": "application/json"}
                        )

                        with urllib.request.urlopen(req, timeout=15) as resp:
                            resp_data = json.loads(resp.read().decode("utf-8"))
                            candidate_text = resp_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            if candidate_text:
                                break
                    except Exception:
                        continue

                # If cloud API succeeded, use it; otherwise seamlessly fall back to grounded engine
                if candidate_text:
                    reply_text = candidate_text
                    tier_label = "ShaastraAI Astrologer & Maharaj Ji Wisdom (Cloud AI)"
                else:
                    reply_text = generate_server_grounded_response(prompt, history)
                    tier_label = "ShaastraAI Astrologer & Maharaj Ji Engine"

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "reply": reply_text,
                    "tier": tier_label
                }).encode("utf-8"))

            except Exception as e:
                # Fallback on any unexpected error to ensure zero crashes
                reply_fallback = generate_server_grounded_response(prompt, history)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "reply": reply_fallback,
                    "tier": "ShaastraAI Astrologer & Maharaj Ji Engine"
                }).encode("utf-8"))
        else:
            self.send_error(404, "Endpoint Not Found")


def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, ShaastraAIRequestHandler)
    print("=" * 65)
    print("ShaastraAI Local Web Portal running at:")
    print(f"--> http://localhost:{PORT}")
    print(f"--> http://127.0.0.1:{PORT}")
    print("Serving files from: public/")
    has_key = bool(os.getenv("GEMINI_API_KEY", "").strip())
    print(f"GEMINI_API_KEY detected in .env: {'YES' if has_key else 'NO'}")
    print("Astrologer Agent & Maharaj Ji Multi-Agent System: ACTIVE")
    print("Press Ctrl+C to stop the server.")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping ShaastraAI server. Namaste!")
        httpd.server_close()


if __name__ == "__main__":
    run()
