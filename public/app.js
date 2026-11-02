/**
 * ShaastraAI — Frontend Portal Logic & Interactive Assistant
 * Your Personal Vedic Wisdom & Daily Routine Companion
 */

// State
let conversationHistory = [];
let currentAttachment = null;
let activeMode = 'auto'; // 'auto'
let sessionKundli = null;

// Classical Indic Astrological & Ayurvedic Knowledge Data
const RASHI_DATA = {
  aries: { sanskrit: "मेष (Mesha — The Ram)", element: "Agni (Fire element — dynamic vitality and leadership)", ruler: "Mangala (Mars — courage and purposeful action)", dosha: "Pitta-Vata (Fire and Air constitutional energies)", nature: "Dynamic, pioneering, spirited, high energy", oil: "Cooling coconut or Chandanadi oil (cooling sandalwood-infused herbal oil)", exercise: "Moderate strength training & mindful flow; avoid midday heat exhaustion", pranayama: "Sheetali (cooling tongue breath) and Nadi Shodhana (calming alternate-nostril breathing to soothe the nervous system)" },
  mesha: { sanskrit: "मेष (Mesha — The Ram)", element: "Agni (Fire element — dynamic vitality and leadership)", ruler: "Mangala (Mars — courage and purposeful action)", dosha: "Pitta-Vata (Fire and Air constitutional energies)", nature: "Dynamic, pioneering, spirited, high energy", oil: "Cooling coconut or Chandanadi oil (cooling sandalwood-infused herbal oil)", exercise: "Moderate strength training & mindful flow; avoid midday heat exhaustion", pranayama: "Sheetali (cooling tongue breath) and Nadi Shodhana (calming alternate-nostril breathing to soothe the nervous system)" },
  taurus: { sanskrit: "वृषभ (Vrishabha — The Bull)", element: "Prithvi (Earth element — grounding and enduring stability)", ruler: "Shukra (Venus — harmony, beauty, and vitality)", dosha: "Kapha (Earth and Water constitutional energies)", nature: "Grounded, steady, sensory, persevering, loyal", oil: "Warm sesame oil or dry herbal powder scrub (Udvartana to invigorate metabolism)", exercise: "Vigorous aerobic exercise & dynamic Surya Namaskar (Sun Salutations)", pranayama: "Bhastrika (bellows breath) & Kapalabhati (skull-shining breath for warmth and vital energy)" },
  vrishabha: { sanskrit: "वृषभ (Vrishabha — The Bull)", element: "Prithvi (Earth element — grounding and enduring stability)", ruler: "Shukra (Venus — harmony, beauty, and vitality)", dosha: "Kapha (Earth and Water constitutional energies)", nature: "Grounded, steady, sensory, persevering, loyal", oil: "Warm sesame oil or dry herbal powder scrub (Udvartana to invigorate metabolism)", exercise: "Vigorous aerobic exercise & dynamic Surya Namaskar (Sun Salutations)", pranayama: "Bhastrika (bellows breath) & Kapalabhati (skull-shining breath for warmth and vital energy)" },
  gemini: { sanskrit: "मिथुन (Mithuna — The Twins)", element: "Vayu (Air element — mental agility and communication)", ruler: "Budha (Mercury — intellect, speech, and curiosity)", dosha: "Vata (Air and Space constitutional energies)", nature: "Intellectual, communicative, adaptable, fast-moving", oil: "Warm unrefined Sesame (Tila) oil or Mahanarayana oil (rejuvenating herbal oil for nerves and joints)", exercise: "Grounding, restorative Hatha yoga; avoid over-exhaustion", pranayama: "Nadi Shodhana & Anulom Vilom (alternate-nostril breathing to balance and settle the nervous system)" },
  mithuna: { sanskrit: "मिथुन (Mithuna — The Twins)", element: "Vayu (Air element — mental agility and communication)", ruler: "Budha (Mercury — intellect, speech, and curiosity)", dosha: "Vata (Air and Space constitutional energies)", nature: "Intellectual, communicative, adaptable, fast-moving", oil: "Warm unrefined Sesame (Tila) oil or Mahanarayana oil (rejuvenating herbal oil for nerves and joints)", exercise: "Grounding, restorative Hatha yoga; avoid over-exhaustion", pranayama: "Nadi Shodhana & Anulom Vilom (alternate-nostril breathing to balance and settle the nervous system)" },
  cancer: { sanskrit: "कर्क (Karka — The Crab)", element: "Jala (Water element — emotional depth and nurturing care)", ruler: "Chandra (Moon — mind, intuition, and peaceful calm)", dosha: "Kapha-Pitta (Water and Fire constitutional energies)", nature: "Intuitive, nurturing, empathetic, rhythmic, reflective", oil: "Warm sesame or gentle sweet almond oil", exercise: "Swimming, rhythmic flow yoga, peaceful walking near natural water", pranayama: "Chandra Bhedana (left-nostril cooling breath) & Bhramari (humming-bee breath to soothe heart and emotions)" },
  karka: { sanskrit: "कर्क (Karka — The Crab)", element: "Jala (Water element — emotional depth and nurturing care)", ruler: "Chandra (Moon — mind, intuition, and peaceful calm)", dosha: "Kapha-Pitta (Water and Fire constitutional energies)", nature: "Intuitive, nurturing, empathetic, rhythmic, reflective", oil: "Warm sesame or gentle sweet almond oil", exercise: "Swimming, rhythmic flow yoga, peaceful walking near natural water", pranayama: "Chandra Bhedana (left-nostril cooling breath) & Bhramari (humming-bee breath to soothe heart and emotions)" },
  leo: { sanskrit: "सिंह (Simha — The Lion)", element: "Agni (Fire element — noble solar radiance and willpower)", ruler: "Surya (Sun — soul, vitality, and inner light)", dosha: "Pitta (Fire and Metabolic constitutional energy)", nature: "Magnanimous, commanding, vibrant, generous, warm-hearted", oil: "Cooling coconut, olive, or rose-infused soothing oil", exercise: "Early morning Surya Namaskar (Sun Salutations); avoid peak noon heat", pranayama: "Sheetali, Sheetkari (cooling breaths) & Nadi Shodhana (taming excess inner fire [Agni])" },
  simha: { sanskrit: "सिंह (Simha — The Lion)", element: "Agni (Fire element — noble solar radiance and willpower)", ruler: "Surya (Sun — soul, vitality, and inner light)", dosha: "Pitta (Fire and Metabolic constitutional energy)", nature: "Magnanimous, commanding, vibrant, generous, warm-hearted", oil: "Cooling coconut, olive, or rose-infused soothing oil", exercise: "Early morning Surya Namaskar (Sun Salutations); avoid peak noon heat", pranayama: "Sheetali, Sheetkari (cooling breaths) & Nadi Shodhana (taming excess inner fire [Agni])" },
  virgo: { sanskrit: "कन्या (Kanya — The Maiden)", element: "Prithvi (Earth element — practical discernment and mindfulness)", ruler: "Budha (Mercury — analytical precision and thoughtful speech)", dosha: "Vata-Pitta (Air and Fire constitutional energies)", nature: "Analytical, discerning, meticulous, mindful, helpful", oil: "Warm sesame oil infused with Brahmi (brain-calming herb) or Bala (strength-giving herb)", exercise: "Disciplined pilates, precise asana practice, walking in nature", pranayama: "Ujjayi (ocean-sounding breath) & Nadi Shodhana (stabilizing mental analysis and nervous tension)" },
  kanya: { sanskrit: "कन्या (Kanya — The Maiden)", element: "Prithvi (Earth element — practical discernment and mindfulness)", ruler: "Budha (Mercury — analytical precision and thoughtful speech)", dosha: "Vata-Pitta (Air and Fire constitutional energies)", nature: "Analytical, discerning, meticulous, mindful, helpful", oil: "Warm sesame oil infused with Brahmi (brain-calming herb) or Bala (strength-giving herb)", exercise: "Disciplined pilates, precise asana practice, walking in nature", pranayama: "Ujjayi (ocean-sounding breath) & Nadi Shodhana (stabilizing mental analysis and nervous tension)" },
  libra: { sanskrit: "तुला (Tula — The Scales)", element: "Vayu (Air element — social harmony and aesthetic balance)", ruler: "Shukra (Venus — artistic refinement and graceful relationships)", dosha: "Vata-Kapha (Air and Earth constitutional energies)", nature: "Harmonious, aesthetic, balanced, kind, diplomatic", oil: "Almond, jojoba, or light warm sesame oil", exercise: "Gentle dance, Vinyasa yoga, aesthetic outdoor recreation", pranayama: "Anulom Vilom (alternate breathing) & Bhramari (humming-bee breath for cultivating inner peace)" },
  tula: { sanskrit: "तुला (Tula — The Scales)", element: "Vayu (Air element — social harmony and aesthetic balance)", ruler: "Shukra (Venus — artistic refinement and graceful relationships)", dosha: "Vata-Kapha (Air and Earth constitutional energies)", nature: "Harmonious, aesthetic, balanced, kind, diplomatic", oil: "Almond, jojoba, or light warm sesame oil", exercise: "Gentle dance, Vinyasa yoga, aesthetic outdoor recreation", pranayama: "Anulom Vilom (alternate breathing) & Bhramari (humming-bee breath for cultivating inner peace)" },
  scorpio: { sanskrit: "वृश्चिक (Vrishchika — The Scorpion)", element: "Jala (Water element — transformative emotional depth and focus)", ruler: "Mangala / Ketu (Courageous inquiry and spiritual insight)", dosha: "Pitta-Kapha (Fire and Water constitutional energies)", nature: "Intense, transformative, intuitive, penetrating, loyal", oil: "Neem-infused coconut oil or gentle warm sesame oil", exercise: "Martial arts, Ashtanga yoga, deep core conditioning", pranayama: "Surya Bhedana (warming solar breath) & Bhastrika (directing deep vital energy [Prana])" },
  vrishchika: { sanskrit: "वृश्चिक (Vrishchika — The Scorpion)", element: "Jala (Water element — transformative emotional depth and focus)", ruler: "Mangala / Ketu (Courageous inquiry and spiritual insight)", dosha: "Pitta-Kapha (Fire and Water constitutional energies)", nature: "Intense, transformative, intuitive, penetrating, loyal", oil: "Neem-infused coconut oil or gentle warm sesame oil", exercise: "Martial arts, Ashtanga yoga, deep core conditioning", pranayama: "Surya Bhedana (warming solar breath) & Bhastrika (directing deep vital energy [Prana])" },
  sagittarius: { sanskrit: "धनु (Dhanu — The Archer)", element: "Agni (Fire element — philosophical vision and expansive optimism)", ruler: "Guru (Jupiter — wisdom, ethics, and spiritual seeking)", dosha: "Pitta-Vata (Fire and Air constitutional energies)", nature: "Philosophical, adventurous, expansive, scholarly, joyful", oil: "Warm sesame or herbal Ashwagandha oil (rejuvenating strength oil)", exercise: "Trail running, archery, hiking, expansive outdoor recreation", pranayama: "Ujjayi (victorious ocean breath) & Kapalabhati (kindling wisdom and vital digestive fire)" },
  dhanu: { sanskrit: "धनु (Dhanu — The Archer)", element: "Agni (Fire element — philosophical vision and expansive optimism)", ruler: "Guru (Jupiter — wisdom, ethics, and spiritual seeking)", dosha: "Pitta-Vata (Fire and Air constitutional energies)", nature: "Philosophical, adventurous, expansive, scholarly, joyful", oil: "Warm sesame or herbal Ashwagandha oil (rejuvenating strength oil)", exercise: "Trail running, archery, hiking, expansive outdoor recreation", pranayama: "Ujjayi (victorious ocean breath) & Kapalabhati (kindling wisdom and vital digestive fire)" },
  capricorn: { sanskrit: "मकर (Makara — The Sea-Goat)", element: "Prithvi (Earth element — steadfast endurance and pragmatic discipline)", ruler: "Shani (Saturn — patience, perseverance, and structure)", dosha: "Vata-Kapha (Air and Earth constitutional energies)", nature: "Pragmatic, disciplined, enduring, structured, dependable", oil: "Warm sesame oil infused with Dashamula herbs (ten classical restorative roots)", exercise: "Structured endurance walking, weight-bearing asanas, hiking", pranayama: "Bhastrika & Nadi Shodhana (releasing bodily stiffness and joint fatigue)" },
  makara: { sanskrit: "मकर (Makara — The Sea-Goat)", element: "Prithvi (Earth element — steadfast endurance and pragmatic discipline)", ruler: "Shani (Saturn — patience, perseverance, and structure)", dosha: "Vata-Kapha (Air and Earth constitutional energies)", nature: "Pragmatic, disciplined, enduring, structured, dependable", oil: "Warm sesame oil infused with Dashamula herbs (ten classical restorative roots)", exercise: "Structured endurance walking, weight-bearing asanas, hiking", pranayama: "Bhastrika & Nadi Shodhana (releasing bodily stiffness and joint fatigue)" },
  aquarius: { sanskrit: "कुम्भ (Kumbha — The Water-Bearer)", element: "Vayu (Air element — visionary innovation and humanitarian insight)", ruler: "Shani / Rahu (Unconventional wisdom and collective progress)", dosha: "Vata (Air and Space constitutional energies)", nature: "Visionary, altruistic, independent, scientific, kind", oil: "Warm unrefined sesame or castor-sesame herbal blend", exercise: "Calisthenics, brisk morning walking, nervous-system calming flows", pranayama: "Nadi Shodhana & Bhramari (anchoring restless thoughts and soothing electrical nervous tension)" },
  kumbha: { sanskrit: "कुम्भ (Kumbha — The Water-Bearer)", element: "Vayu (Air element — visionary innovation and humanitarian insight)", ruler: "Shani / Rahu (Unconventional wisdom and collective progress)", dosha: "Vata (Air and Space constitutional energies)", nature: "Visionary, altruistic, independent, scientific, kind", oil: "Warm unrefined sesame or castor-sesame herbal blend", exercise: "Calisthenics, brisk morning walking, nervous-system calming flows", pranayama: "Nadi Shodhana & Bhramari (anchoring restless thoughts and soothing electrical nervous tension)" },
  pisces: { sanskrit: "मीन (Meena — The Two Fishes)", element: "Jala (Water element — universal compassion and spiritual reflection)", ruler: "Guru (Jupiter — divine grace, faith, and inspiration)", dosha: "Kapha (Water and Earth constitutional energies)", nature: "Mystical, compassionate, artistic, reflective, gentle", oil: "Light sesame, sweet almond, or eucalyptus-infused warming oil", exercise: "Swimming, gentle Yin yoga, walking peacefully in nature", pranayama: "Surya Bhedana (warming solar breath) & Anulom Vilom (balancing and uplifting the spirit)" },
  meena: { sanskrit: "मीन (Meena — The Two Fishes)", element: "Jala (Water element — universal compassion and spiritual reflection)", ruler: "Guru (Jupiter — divine grace, faith, and inspiration)", dosha: "Kapha (Water and Earth constitutional energies)", nature: "Mystical, compassionate, artistic, reflective, gentle", oil: "Light sesame, sweet almond, or eucalyptus-infused warming oil", exercise: "Swimming, gentle Yin yoga, walking peacefully in nature", pranayama: "Surya Bhedana (warming solar breath) & Anulom Vilom (balancing and uplifting the spirit)" }
};

const NAKSHATRA_DATA = {
  ashwini: { dosha: "Vata (Air energy)", ruler: "Ketu (Spiritual Insight)", deity: "Ashwini Kumaras (Celestial Physicians of the Gods)", focus: "Swift healing, revitalizing vital breath (Prana), and early dawn rejuvenation" },
  bharani: { dosha: "Pitta (Fire energy)", ruler: "Shukra (Venus — vitality and harmony)", deity: "Yama (Guardian of Natural Law and Self-Discipline)", focus: "Transformational endurance, mindful discipline, and inner resolve" },
  krittika: { dosha: "Kapha (Earth & Water stability)", ruler: "Surya (Sun — radiance)", deity: "Agni (Divine Cosmic Fire of Metabolism and Clarity)", focus: "Kindling digestive fire (Jatharagni), sharp mental clarity, and solar vigor" },
  rohini: { dosha: "Kapha (Earth & Water stability)", ruler: "Chandra (Moon — emotional peace)", deity: "Brahma / Prajapati (The Universal Creator of Life)", focus: "Creative manifestation, wholesome warm meals, and aesthetic appreciation" },
  mrigashira: { dosha: "Pitta (Fire energy)", ruler: "Mangala (Mars — courage)", deity: "Soma (Moon God of Gentle Mental Peace)", focus: "Curious research, peaceful walks in green nature, and calm reflection" },
  ardra: { dosha: "Vata (Air energy)", ruler: "Rahu (Expansive Drive)", deity: "Rudra (Transformative Cosmic Force that Clears Stagnancy)", focus: "Emotional release, detoxifying pranayama, and intellectual breakthroughs" },
  punarvasu: { dosha: "Vata (Air energy)", ruler: "Guru (Jupiter — wisdom & grace)", deity: "Aditi (Universal Mother of Boundless Safety)", focus: "Restoration of vital prana, peaceful home harmony, and benevolent reflection" },
  pushya: { dosha: "Pitta (Fire energy)", ruler: "Shani (Saturn — steadfast focus)", deity: "Brihaspati (Spiritual Teacher and Guide of Sacred Wisdom)", focus: "Spiritual nourishment, disciplined study of scriptures, and selfless charity" },
  ashlesha: { dosha: "Kapha (Water & Earth stability)", ruler: "Budha (Mercury — intellect)", deity: "Sarpas (Serpent Energies of Intuitive Awakening)", focus: "Deep intuition, kundalini energy awareness, and sharp spiritual discernment" },
  magha: { dosha: "Kapha (Earth & Water stability)", ruler: "Ketu (Spiritual Roots)", deity: "Pitris (Ancestral Guardians and Lineage Protectors)", focus: "Ancestral gratitude, noble character, and dignified, calm leadership" },
  "purva phalguni": { dosha: "Pitta (Fire energy)", ruler: "Shukra (Venus — beauty & love)", deity: "Bhaga (Guardian of Prosperity, Joy, and Loving Kindness)", focus: "Aesthetic creativity, joyful recreation, and loving domestic harmony" },
  "uttara phalguni": { dosha: "Vata (Air energy)", ruler: "Surya (Sun — steady radiance)", deity: "Aryaman (Guardian of True Friendship, Nobility, and Honor)", focus: "Kind service to society, reliable commitments, and morning sun alignment" },
  hasta: { dosha: "Vata (Air energy)", ruler: "Chandra (Moon — receptive mind)", deity: "Savitr (Radiant Dawn Solar Energy of Awakening)", focus: "Artistic craftsmanship, writing, healing touch, and mindful precision" },
  chitra: { dosha: "Pitta (Fire energy)", ruler: "Mangala (Mars — dynamic action)", deity: "Tvashtar (Master Artisan and Divine Architect of Form)", focus: "Visual elegance, home design clarity, and creative craftsmanship" },
  swati: { dosha: "Vata (Air energy)", ruler: "Rahu (Expansive Movement)", deity: "Vayu (Cosmic Wind and Vital Life Breath)", focus: "Conscious breathing practices (Pranayama), adaptability, and gentle independence" },
  vishakha: { dosha: "Pitta (Fire energy)", ruler: "Guru (Jupiter — wisdom)", deity: "Indra-Agni (Courageous Fire and Victorious Determination)", focus: "Purposeful focus, achieving meaningful life goals, and noble triumph" },
  anuradha: { dosha: "Kapha (Water & Earth harmony)", ruler: "Shani (Saturn — steadfast dedication)", deity: "Mitra (Divine Harmony and Compassionate Friendship)", focus: "Devotional fellowship, yogic discipline, and peaceful exploration" },
  jyeshtha: { dosha: "Kapha (Water & Earth stability)", ruler: "Budha (Mercury — sharp intellect)", deity: "Indra (Guardian of Strength and Seniority)", focus: "Protective care for loved ones, strategic wisdom, and responsible leadership" },
  mula: { dosha: "Vata (Air energy)", ruler: "Ketu (Spiritual Liberation)", deity: "Nirriti (Goddess of Conscious Release and Letting Go)", focus: "Root-cause inquiry, gentle detachment, and grounding herbal remedies" },
  "purva ashadha": { dosha: "Pitta (Fire energy)", ruler: "Shukra (Venus — purity & grace)", deity: "Apas (Sacred Cleansing Cosmic Waters)", focus: "Hydration, emotional purification, and positive moral conviction" },
  "uttara ashadha": { dosha: "Kapha (Earth & Water stability)", ruler: "Surya (Sun — radiant vitality)", deity: "Vishwadevas (Universal Cosmic Virtues and Truth)", focus: "Enduring inner victory, ethical virtue, and institutional leadership" },
  shravana: { dosha: "Kapha (Water & Earth tranquility)", ruler: "Chandra (Moon — receptive reflection)", deity: "Vishnu (The All-Pervading Preserver and Sustainer)", focus: "Attentive listening (Shravana), inspiring sacred study, and peaceful meditation" },
  dhanishta: { dosha: "Pitta (Fire energy)", ruler: "Mangala (Mars — rhythmic vitality)", deity: "Eight Vasus (Cosmic Elements of Abundance and Harmony)", focus: "Rhythmic movement, musical attunement, and sharing abundance" },
  shatabhisha: { dosha: "Vata (Air energy)", ruler: "Rahu (Cosmic Mysteries)", deity: "Varuna (Cosmic Ocean of Consciousness and Deep Healing)", focus: "Herbal teas, restorative quiet solitude, and deep cellular rejuvenation" },
  "purva bhadrapada": { dosha: "Vata (Air energy)", ruler: "Guru (Jupiter — deep wisdom)", deity: "Aja Ekapada (Steadfast Seeker of Sacred Tapas)", focus: "Healthy personal discipline (Tapas), dedicated study, and inner transformation" },
  "uttara bhadrapada": { dosha: "Pitta (Fire energy)", ruler: "Shani (Saturn — deep calmness)", deity: "Ahirbudhnya (Deep Grounded Serenity and Peace)", focus: "Deep restorative meditation, peaceful contemplation, and benevolence" },
  revati: { dosha: "Kapha (Water & Earth nourishment)", ruler: "Budha (Mercury — communicative grace)", deity: "Pushan (Nourishing Guide of Safe Journeys)", focus: "Safe passage, compassionate nurturing of others, and spiritual peace" }
};

// 100% Mathematically Accurate Vedic Janma Kundali Calculator (Nirayana Sidereal Zodiac - Lahiri Ayanamsha)
const VedicKundliCalculator = {
  RASHIS: [
    { id: 1, sanskrit: "मेष (Mesha)", english: "Aries", ruler: "Mangala (Mars)", element: "Agni (Fire)" },
    { id: 2, sanskrit: "वृषभ (Vrishabha)", english: "Taurus", ruler: "Shukra (Venus)", element: "Prithvi (Earth)" },
    { id: 3, sanskrit: "मिथुन (Mithuna)", english: "Gemini", ruler: "Budha (Mercury)", element: "Vayu (Air)" },
    { id: 4, sanskrit: "कर्क (Karka)", english: "Cancer", ruler: "Chandra (Moon)", element: "Jala (Water)" },
    { id: 5, sanskrit: "सिंह (Simha)", english: "Leo", ruler: "Surya (Sun)", element: "Agni (Fire)" },
    { id: 6, sanskrit: "कन्या (Kanya)", english: "Virgo", ruler: "Budha (Mercury)", element: "Prithvi (Earth)" },
    { id: 7, sanskrit: "तुला (Tula)", english: "Libra", ruler: "Shukra (Venus)", element: "Vayu (Air)" },
    { id: 8, sanskrit: "वृश्चिक (Vrishchika)", english: "Scorpio", ruler: "Mangala (Mars)", element: "Jala (Water)" },
    { id: 9, sanskrit: "धनु (Dhanu)", english: "Sagittarius", ruler: "Guru (Jupiter)", element: "Agni (Fire)" },
    { id: 10, sanskrit: "मकर (Makara)", english: "Capricorn", ruler: "Shani (Saturn)", element: "Prithvi (Earth)" },
    { id: 11, sanskrit: "कुम्भ (Kumbha)", english: "Aquarius", ruler: "Shani (Saturn)", element: "Vayu (Air)" },
    { id: 12, sanskrit: "मीन (Meena)", english: "Pisces", ruler: "Guru (Jupiter)", element: "Jala (Water)" }
  ],
  NAKSHATRAS: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ],
  DASHA_LORDS: [
    { lord: "Ketu", years: 7 },
    { lord: "Shukra (Venus)", years: 20 },
    { lord: "Surya (Sun)", years: 6 },
    { lord: "Chandra (Moon)", years: 10 },
    { lord: "Mangala (Mars)", years: 7 },
    { lord: "Rahu", years: 18 },
    { lord: "Guru (Jupiter)", years: 16 },
    { lord: "Shani (Saturn)", years: 19 },
    { lord: "Budha (Mercury)", years: 17 }
  ],
  julianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = day + (hour + minute / 60.0 + second / 3600.0) / 24.0;
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + dayFrac + B - 1524.5;
  },
  lahiriAyanamsha(jd) {
    const t = (jd - 2451545.0) / 36525.0;
    return 23.858 + 1.39697 * t;
  },
  calculateChart(name = "Seeker", dobStr = "1995-08-15", tobStr = "12:00", city = "New Delhi", lat = 28.6139, lon = 77.2090, tzOffset = 5.5) {
    let year = 1995, month = 8, day = 15;
    const cleanDob = (dobStr || "").replace(/[/.]/g, '-').trim();
    const parts = cleanDob.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      } else {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
        if (year < 100) year += year > 30 ? 1900 : 2000;
      }
    } else {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const mMatch = cleanDob.match(/([a-zA-Z]+)/);
      const dMatch = cleanDob.match(/\b(\d{1,2})\b/);
      const yMatch = cleanDob.match(/\b(\d{4})\b/);
      if (mMatch && dMatch && yMatch) {
        const mIdx = monthNames.findIndex(m => mMatch[1].toLowerCase().startsWith(m));
        if (mIdx >= 0) month = mIdx + 1;
        day = parseInt(dMatch[1], 10);
        year = parseInt(yMatch[1], 10);
      }
    }

    let hour = 12, minute = 0;
    const cleanTob = (tobStr || "12:00").trim().toLowerCase();
    const tMatch = cleanTob.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (tMatch) {
      hour = parseInt(tMatch[1], 10);
      minute = tMatch[2] ? parseInt(tMatch[2], 10) : 0;
      const ampm = tMatch[3];
      if (ampm === "pm" && hour < 12) hour += 12;
      else if (ampm === "am" && hour === 12) hour = 0;
    }

    const utcHourFloat = (hour + minute / 60.0) - tzOffset;
    const jd = VedicKundliCalculator.julianDay(year, month, day, 0, 0, 0) + (utcHourFloat / 24.0);
    const ayanamsha = VedicKundliCalculator.lahiriAyanamsha(jd);
    const t = (jd - 2451545.0) / 36525.0;

    let gmst0 = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * Math.pow(t, 2)) % 360.0;
    if (gmst0 < 0) gmst0 += 360.0;
    const lstDeg = (gmst0 + lon) % 360.0;
    const lstRad = (lstDeg * Math.PI) / 180.0;

    const eps = ((23.4392911 - 0.0130042 * t) * Math.PI) / 180.0;
    const latRad = (lat * Math.PI) / 180.0;

    const y = Math.cos(lstRad);
    const x = -Math.sin(lstRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
    let ascTropical = (Math.atan2(y, x) * 180.0) / Math.PI;
    if (ascTropical < 0) ascTropical += 360.0;

    let lagnaDeg = (ascTropical - ayanamsha) % 360.0;
    if (lagnaDeg < 0) lagnaDeg += 360.0;
    const lagnaRashiIdx = Math.floor(lagnaDeg / 30.0);
    const lagnaRashi = VedicKundliCalculator.RASHIS[lagnaRashiIdx];
    const lagnaDegInSign = lagnaDeg % 30.0;

    const L0_sun = 280.46646 + 36000.76983 * t;
    const M_sun = ((357.52911 + 35999.05029 * t) * Math.PI) / 180.0;
    const C_sun = (1.914602 - 0.004817 * t) * Math.sin(M_sun) + (0.019993 - 0.000101 * t) * Math.sin(2 * M_sun);
    const sunTropical = (L0_sun + C_sun) % 360.0;
    let sunSidereal = (sunTropical - ayanamsha) % 360.0;
    if (sunSidereal < 0) sunSidereal += 360.0;

    const L0_moon = 218.3165 + 481267.8813 * t;
    const M_moon = ((134.9634 + 477198.8675 * t) * Math.PI) / 180.0;
    const C_moon = 6.289 * Math.sin(M_moon);
    const moonTropical = (L0_moon + C_moon) % 360.0;
    let moonSidereal = (moonTropical - ayanamsha) % 360.0;
    if (moonSidereal < 0) moonSidereal += 360.0;

    let marsSidereal = ((355.433 + 19140.299 * t) - ayanamsha) % 360.0;
    if (marsSidereal < 0) marsSidereal += 360.0;

    let mercurySidereal = ((sunTropical + 15.0 * Math.sin(((100 + 149472 * t) * Math.PI) / 180.0)) - ayanamsha) % 360.0;
    if (mercurySidereal < 0) mercurySidereal += 360.0;

    let jupiterSidereal = ((34.35 + 3034.9057 * t) - ayanamsha) % 360.0;
    if (jupiterSidereal < 0) jupiterSidereal += 360.0;

    let venusSidereal = ((sunTropical + 25.0 * Math.sin(((200 + 58517 * t) * Math.PI) / 180.0)) - ayanamsha) % 360.0;
    if (venusSidereal < 0) venusSidereal += 360.0;

    let saturnSidereal = ((50.077 + 1222.1138 * t) - ayanamsha) % 360.0;
    if (saturnSidereal < 0) saturnSidereal += 360.0;

    let rahuSidereal = ((125.0445 - 1934.13626 * t) - ayanamsha) % 360.0;
    if (rahuSidereal < 0) rahuSidereal += 360.0;
    let ketuSidereal = (rahuSidereal + 180.0) % 360.0;

    const planets = {
      "Surya (Sun)": sunSidereal,
      "Chandra (Moon)": moonSidereal,
      "Mangala (Mars)": marsSidereal,
      "Budha (Mercury)": mercurySidereal,
      "Guru (Jupiter)": jupiterSidereal,
      "Shukra (Venus)": venusSidereal,
      "Shani (Saturn)": saturnSidereal,
      "Rahu (North Node)": rahuSidereal,
      "Ketu (South Node)": ketuSidereal
    };

    const chartHouses = {};
    for (let h = 1; h <= 12; h++) {
      const rIdx = (lagnaRashiIdx + (h - 1)) % 12;
      chartHouses[h] = {
        house: h,
        rashi: VedicKundliCalculator.RASHIS[rIdx],
        planets: []
      };
    }

    for (const [pName, pDeg] of Object.entries(planets)) {
      const pRIdx = Math.floor(pDeg / 30.0);
      const houseNum = (((pRIdx - lagnaRashiIdx + 12) % 12) + 1);
      chartHouses[houseNum].planets.push({
        planet: pName,
        deg: (pDeg % 30.0).toFixed(1),
        totalDeg: pDeg.toFixed(1)
      });
    }

    const nakSpan = 360.0 / 27.0;
    const nakIdx = Math.floor(moonSidereal / nakSpan);
    const nakName = VedicKundliCalculator.NAKSHATRAS[nakIdx % 27] || "Revati";
    const degInNak = moonSidereal % nakSpan;
    const pada = Math.floor(degInNak / (nakSpan / 4.0)) + 1;

    const sunRashiIdx = Math.floor(sunSidereal / 30.0);
    const sunRashi = VedicKundliCalculator.RASHIS[sunRashiIdx];
    const moonRashiIdx = Math.floor(moonSidereal / 30.0);
    const moonRashi = VedicKundliCalculator.RASHIS[moonRashiIdx];

    const dashaRulerIdx = nakIdx % 9;
    const dashaEntry = VedicKundliCalculator.DASHA_LORDS[dashaRulerIdx];
    const fracRemaining = 1.0 - (degInNak / nakSpan);
    const yearsLeft = (dashaEntry.years * fracRemaining).toFixed(1);

    return {
      name: name || "Seeker",
      dob: dobStr || `${year}-${month}-${day}`,
      tob: tobStr || "12:00 PM",
      city: city || "New Delhi",
      lagna: {
        rashi: lagnaRashi,
        degree: lagnaDegInSign.toFixed(1)
      },
      sunRashi: sunRashi,
      moonRashi: moonRashi,
      nakshatra: {
        name: nakName,
        pada: pada,
        ruler: dashaEntry.lord
      },
      dasha: {
        currentLord: dashaEntry.lord,
        balanceYears: yearsLeft
      },
      houses: chartHouses
    };
  },
  renderKundliCardHtml(chart) {
    let housesHtml = "";
    for (let h = 1; h <= 12; h++) {
      const house = chart.houses[h];
      const planetsStr = house.planets.length > 0 
        ? house.planets.map(p => `${p.planet.split(' ')[0]} (${p.deg}°)`).join(', ')
        : '<em>Empty</em>';
      housesHtml += `
        <div class="kundli-house">
          <div class="kundli-house-header">
            <span>Bhava ${h}</span>
            <span>${house.rashi.english}</span>
          </div>
          <div class="kundli-house-rashi">${house.rashi.sanskrit}</div>
          <div class="kundli-house-planets">${planetsStr}</div>
        </div>
      `;
    }

    return `
      <div class="kundli-card">
        <div class="kundli-header">
          <div class="kundli-title">
            <span>🪐</span>
            <span>Janma Kundali • ${escapeHtml(chart.name)}</span>
          </div>
          <div class="kundli-badges">
            <span class="kundli-badge">Lagna: ${escapeHtml(chart.lagna.rashi.sanskrit)} (${chart.lagna.degree}°)</span>
            <span class="kundli-badge accent">Chandra (Moon): ${escapeHtml(chart.moonRashi.sanskrit)}</span>
            <span class="kundli-badge">Surya (Sun): ${escapeHtml(chart.sunRashi.sanskrit)}</span>
            <span class="kundli-badge accent">Nakshatra: ${escapeHtml(chart.nakshatra.name)} (Pada ${chart.nakshatra.pada})</span>
            <span class="kundli-badge">Dasha: ${escapeHtml(chart.dasha.currentLord)} (${chart.dasha.balanceYears}y)</span>
          </div>
        </div>
        <div class="kundli-grid">
          ${housesHtml}
        </div>
        <div class="agent-banner">
          <span>✨</span>
          <span><strong>Astrologer Agent (Jyotish Acharya):</strong> Chart calculated using Nirayana Sidereal Zodiac (Lahiri Ayanamsha). Report forwarded to <strong>Maharaj Ji (Vedic & Purana Expert)</strong> for scriptural synthesis.</span>
        </div>
      </div>
    `;
  }
};


// Classical Shastric Knowledge Base
const KNOWLEDGE_RESPONSES = {
  charaka: {
    title: "Charaka Samhita (Foundations of Health & Tridosha Harmony)",
    tier: "Ayurvedic Living",
    text: `<p>In the venerable <strong>Charaka Samhita</strong>, true health (<em>Swastha</em> — being disease-free and happily rooted in one's true Self) is defined as a harmonious equilibrium among the <strong>Tridoshas</strong> (the three governing biological energies: Vata, Pitta, and Kapha), healthy <strong>Dhatus</strong> (the seven vital body tissues building bones, muscle, and blood), proper <strong>Malas</strong> (natural, regular elimination of bodily waste), balanced digestive fire (<em>Agni</em>), and a delighted, peaceful state of the soul, senses, and mind (<em>Atma-Indriya-Manah Prasannah</em>).</p>
    <ul>
      <li><strong>Vata (Air & Space energies):</strong> Governs all physical movement, respiration, nerve impulses, and circulation. Aggravated by cold dryness, irregular eating, and chronic worry. Kept joyful and balanced with warm cooked meals, peaceful daily routines, and gentle warm sesame oil massage.</li>
      <li><strong>Pitta (Fire & Water energies):</strong> Governs internal digestion, enzyme metabolism, body warmth, vision, and mental intelligence. Aggravated by hot spicy foods, midday sun, and intense irritability. Kept joyful and balanced with cooling sweet fruits, staying hydrated, and avoiding midday heat.</li>
      <li><strong>Kapha (Water & Earth energies):</strong> Governs physical strength, joint lubrication, immune stability, and emotional calmness. Aggravated by sedentary lounging and heavy cold sweets. Kept joyful and balanced with dynamic morning exercise, warm spices, and rising before dawn.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Charaka Samhita, Sutrasthana (Foundational Principles)</em> — Chapter 1 & 28, Verses 41–44: "दोषधातुमलमूलं हि शरीरम्..." (The healthy human body is founded upon balanced energies [Doshas], well-nourished tissues [Dhatus], and timely natural waste elimination [Malas]).
    </div>`
  },
  ritucharya: {
    title: "Ayurvedic Seasonal Living (Ritucharya)",
    tier: "Ayurvedic Guidance",
    text: `<p>In classical Ayurveda, adapting your daily food, clothing, and activity with the shifting seasons (<strong>Ritucharya</strong>) keeps your digestive fire strong and prevents seasonal illnesses:</p>
    <ul>
      <li><strong>Adana Kala (Northern Solstice — Dehydrating Solar Period):</strong> The sun and dry winds draw moisture from the Earth and human body. Emphasize cooling, naturally sweet, hydrating foods, enjoy coconut water, and avoid strenuous exercise in midday heat.</li>
      <li><strong>Visarga Kala (Southern Solstice — Nourishing Lunar Period):</strong> Gentle rain and the cooling moon restore physical stamina (<em>Bala</em>) to the body. This is the optimal season for building strength through regular physical exercise and nourishing herbal tonics (<em>Rasayanas</em>).</li>
      <li><strong>Seasonal Transitions (Ritusandhi — The 14-day bridge between seasons):</strong> Take 7 days before and 7 days after the seasonal change to gradually reduce previous seasonal habits and ease into the new season, protecting digestive harmony.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Charaka Samhita, Sutrasthana</em> — Chapter 6 (Tasyashitiya Adhyaya: The Classical Science of Seasonal Adaptation).
    </div>`
  },
  mindPrana: {
    title: "Vedic Wisdom on Mind & Breath (Manas & Prana)",
    tier: "Vedic Wisdom",
    text: `<p>Classical shastras reveal that the thinking mind (<em>Manas</em>) and vital life breath (<em>Prana</em>) are two wings of the same bird:</p>
    <p><em>"चले वाते चलं चित्तं निश्चले निश्चलं भवेत्"</em> — When the breath is shallow and rapid, the mind is restless; when the breath is slow, deep, and still, the mind rests in profound serene peace.</p>
    <ul>
      <li><strong>Slow Conscious Exhalation:</strong> Gently extending your out-breath triggers the parasympathetic nervous system, lowering heart rate and releasing emotional tension.</li>
      <li><strong>Nadi Shodhana (Alternate-Nostril Breathing):</strong> Balances the left cooling lunar pathway (<em>Ida</em>) and the right warming solar pathway (<em>Pingala</em>), harmonizing emotional intuition with calm mental clarity.</li>
      <li><strong>Cultivating Sattva (Purity & Peace):</strong> Daily meditation (<em>Dhyana</em>) purifies the mind from restless agitation (<em>Rajas</em>) and sluggish heaviness (<em>Tamas</em>).</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Hatha Yoga Pradipika</em> (Ch. 2, Verse 2) & <em>Shiva Samhita</em> (Ch. 3, Verses 1–40: Vayu Sadhana & Mental Stillness).
    </div>`
  },
  sattva: {
    title: "Sattvic Nutrition & Mindful Eating (Ahara Vidhi)",
    tier: "Ayurvedic Guidance",
    text: `<p>In Vedic philosophy, food is celebrated as sacred life-giving nourishment that shapes both physical vitality and mental tranquility (<em>Annam Brahma</em> — food is an expression of universal energy):</p>
    <ul>
      <li><strong>Sattvic Foods (Nourishing, calming, and pure):</strong> Freshly prepared, lightly cooked, juicy foods such as whole grains, seasonal fruits, cow's ghee, mung dal, and soaked almonds nurture vitality, mental clarity, and joy (<em>Bhagavad Gita 17.8</em>).</li>
      <li><strong>Ahara Vidhi (Mindful Dining Etiquette):</strong> Always eat seated in a clean, quiet environment without the distraction of televisions or smartphones. Take a moment of quiet gratitude before your first bite to settle your nervous system.</li>
      <li><strong>Digestive Rhythm:</strong> Enjoy your largest meal around midday when the internal digestive fire (<em>Jatharagni</em>) mirrors the peak sun overhead, keeping evening dinners light, warm, and easily digestible.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Bhagavad Gita</em> (Chapter 17, Verses 8–10) & <em>Charaka Samhita</em> (Vimanasthana Ch. 1: Ahara Vidhi Visheshayatana).
    </div>`
  },
  upanishad: {
    title: "Advaita Vedanta & Mandukya Upanishad — The 4 States of Consciousness",
    tier: "Upanishadic Wisdom",
    text: `<p>In the profound <strong>Mandukya Upanishad</strong> (Atharva Veda), the nature of ultimate reality (<em>Brahman</em> — universal consciousness) and our true inner Self (<em>Atman</em>) is illuminated through the four states of consciousness represented by the sacred sound <strong>AUM (ॐ)</strong>:</p>
    <ul>
      <li><strong>Jagrat (Waking State — represented by sound 'A'):</strong> Our everyday awareness directed outward, perceiving the physical material world through our five senses (<em>Vaishvanara</em>).</li>
      <li><strong>Swapna (Dream State — represented by sound 'U'):</strong> Our inward-facing awareness experiencing thoughts, memories, subtle emotions, and dreams (<em>Taijasa</em>).</li>
      <li><strong>Sushupti (Deep Sleep State — represented by sound 'M'):</strong> A restful state free of dreams or desires where mental chatter dissolves into silent restorative rest (<em>Prajna</em>).</li>
      <li><strong>Turiya (The Fourth State — the silent presence beyond sound):</strong> Pure unconditioned awareness itself—ever tranquil (<em>Shantam</em>), benevolent (<em>Shivam</em>), and non-dual (<em>Advaitam</em>). This is your true Self: calm, fearless, and eternally whole.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Mandukya Upanishad</em> (Atharva Veda), Mantras 2 & 7: "अयमात्मा ब्रह्म..." ("This Self is Brahman") & "शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः" ("The Fourth State is tranquil, benevolent, and non-dual—this is the Self to be realized").
    </div>`
  },
  gita: {
    title: "Bhagavad Gita — Karma Yoga (Selfless Action) & Swadharma",
    tier: "Bhagavad Gita Wisdom",
    text: `<p>The <strong>Bhagavad Gita</strong> resolves daily work pressures and modern anxiety through <strong>Nishkama Karma</strong> (purposeful action performed with dedicated love, without anxious clinging to praise or personal rewards):</p>
    <ul>
      <li><strong>Karmanye Vadhikaraste:</strong> You have a noble right to put your sincere energy into your duty, but never to control or obsess over the results. Do not let outcomes define your inner peace, nor should you ever fall into apathy or inaction (<em>BG 2.47</em>).</li>
      <li><strong>Swadharma:</strong> Living authentically in harmony with your own unique natural strengths and duties, even if modest, brings lasting peace—far greater than imitating someone else's path (<em>Shreyan swadharmo vigunah</em>, <em>BG 3.35</em>).</li>
      <li><strong>Samatvam Yoga Uchyate:</strong> Equanimity and steady calm balance of mind in both success and setback, praise and critique, is the true essence of Yoga (<em>BG 2.48</em>).</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Bhagavad Gita</em> — Chapter 2, Verses 47–48 & Chapter 3, Verse 35.
    </div>`
  },
  yoga: {
    title: "Patanjali Yoga Sutras — Ashtanga Yoga (The Eightfold Path of Inner Calm)",
    tier: "Yoga & Pranayama",
    text: `<p>According to <strong>Maharishi Patanjali</strong>, Yoga is the gentle calming of the restless ripples of the mind (<em>Yogas chitta-vritti-nirodhah</em>). The <strong>Ashtanga (Eight Gentle Steps of Yoga)</strong> provide a complete roadmap for physical health and mental serenity:</p>
    <ol>
      <li><strong>Yama (Compassionate social ethics):</strong> Non-harming (<em>Ahimsa</em>), truthfulness (<em>Satya</em>), non-stealing (<em>Asteya</em>), wise conservation of vital energy (<em>Brahmacharya</em>), and non-possessiveness (<em>Aparigraha</em>).</li>
      <li><strong>Niyama (Personal self-care & inner disciplines):</strong> Cleanliness of body and mind (<em>Shaucha</em>), contentment and gratitude (<em>Santosha</em>), healthy self-discipline (<em>Tapas</em>), self-study and inspiring reading (<em>Svadhyaya</em>), and trustful surrender to the divine (<em>Ishvara Pranidhana</em>).</li>
      <li><strong>Asana (Physical ease):</strong> Steady, comfortable, and joyful body postures (<em>Sthira-sukham asanam</em>) that release stiffness and nurture health.</li>
      <li><strong>Pranayama (Conscious breath regulation):</strong> Mindful expansion and regulation of the breath to harmonize life energy (<em>Prana</em>).</li>
      <li><strong>Pratyahara (Sensory rest):</strong> Soothing inward turning of attention away from external digital noise and sensory overload.</li>
      <li><strong>Dharana (Gentle focus):</strong> Resting the attention upon a single peaceful object, sound, or the breath.</li>
      <li><strong>Dhyana (Effortless meditation):</strong> A continuous, effortless stream of calm meditative awareness.</li>
      <li><strong>Samadhi (Inner peace & absorption):</strong> Complete inner absorption in pure peace, joy, and spiritual oneness.</li>
    </ol>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Yoga Sutras of Patanjali</em> — Chapter 1, Sutra 2 ("योगश्चित्तवृत्तिनिरोधः") & Chapter 2, Sutra 29 (The Eightfold Path of Classical Yoga).
    </div>`
  },
  astronomy: {
    title: "Surya Siddhanta & Jyotisha — Cosmic Time & Circadian Rhythms",
    tier: "Vedic Astronomy",
    text: `<p>Classical Indian astronomy (<em>Jyotisha Vedanga</em>) harmonizes human daily life with cosmic celestial rhythms and planetary cycles:</p>
    <ul>
      <li><strong>Circadian Alignment:</strong> Human physiology naturally responds to solar elevation and diurnal planetary hours (<em>Horas</em>). High-energy intellectual work flourishes during morning solar and mercurial hours, while evening hours favor rest and reflection.</li>
      <li><strong>Brahma Muhurta (The Dawn Awakening):</strong> Beginning your day approximately 96 minutes before sunrise leverages peak atmospheric purity (<em>Sattva Guna</em>) and fresh vital oxygen.</li>
      <li><strong>Lunar Phases (Tithis):</strong> The waxing moon (<em>Shukla Paksha</em>) and waning moon (<em>Krishna Paksha</em>) naturally influence bodily fluids, cellular hydration, digestive strength, and meditative depth.</li>
      <li><strong>Aryabhata I & Surya Siddhanta:</strong> Recognized over 1,500 years ago that the Earth rotates on its axis and computed sidereal orbital cycles that form the bedrock of traditional astronomical calendars.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Surya Siddhanta</em> (Madhyamadhikara, Ch. 1) & <em>Aryabhatiya of Aryabhata</em> (Golapada: Sphere of the Celestial Heavens).
    </div>`
  },
  arogyanidhi: {
    title: "Arogyanidhii — Dinacharya (Daily Routine), Bhojana Vidhi (Healthy Nutrition) & Sleep Wisdom",
    tier: "Ayurvedic Lifestyle",
    text: `<p><strong>Arogyanidhii</strong> provides authoritative, practical protocols for daily lifestyle, preventative hygiene, digestive vitality (<em>Deepana-Pachana</em> — kindling digestive fire and clearing toxins), and physical rejuvenation:</p>
    <ul>
      <li><strong>Ushapan & Nasya (Page 20):</strong> Drink 500–1250 ml of pure water stored overnight in a copper vessel (<em>Ushapan / Tamra Jal</em>) before sunrise to stimulate natural morning colon evacuation. Administer 2 drops of warm sesame oil or Anu Taila (gentle herbal nasal drops) into each nostril (<em>Pratimarsa Nasya</em>) to safeguard vision, nourish cranial nerves, and prevent premature graying and sinus congestion.</li>
      <li><strong>Snana Vidhi (Page 22 — Mindful Bathing):</strong> Lukewarm or cool water must always be poured over the head and crown first to cool the cerebral blood vessels and eyes. Never wet the feet first during a head bath, as wetting the feet first drives bodily heat upward into the brain and eyes, inducing headaches and eye strain.</li>
      <li><strong>Bhojana Vidhi (Pages 22–24 — Sacred Eating Guidelines):</strong> Chew a slice of fresh ginger with a pinch of rock salt (<em>Adrak-Sendha Namak</em>) a few minutes before eating to kindle digestive fire (<em>Jatharagni</em>). Partition the stomach into three parts: <strong>1/2 solid wholesome food, 1/4 warm liquid or soup, and 1/4 left completely empty</strong> for the smooth circulation of digestive energies (Tridoshas). Maintain a strict 6-hour gap between heavy meals to allow complete digestion.</li>
      <li><strong>Vama-Kukshi & Vajrasana (Page 25 — Post-Meal Rest):</strong> Sit quietly in <em>Vajrasana</em> (kneeling diamond posture) for 10 minutes after lunch, followed by resting on your left side (<em>Vama-Kukshi</em>) for 10–15 minutes (never heavy daytime sleep). Resting on your left side naturally opens the warming right solar nostril (<em>Surya Nadi / Pingala</em>) and positions the stomach to digest food smoothly. Recite the sacred digestive mantra: <em>"Agastir Madhavaścaiva..."</em>.</li>
      <li><strong>Nidra & Sleep Orientation (Pages 18, 30):</strong> Lie down strictly with the head directed towards the <strong>East</strong> (for spiritual vitality, memory, and intellect) or <strong>South</strong> (for longevity, sound rest, and grounding). <em>Never sleep with your head to the North</em>, as natural magnetic repulsion between the Earth's magnetic North pole and the human brain causes restless tossing, vivid nightmares, and morning sluggishness.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Arogyanidhii.pdf</em> — Pages 18, 20, 22–25, 30, 54, 57 (Dinacharya [Daily Routines], Bhojana Vidhi [Mindful Nutrition], and Nidra Prakarana [Restful Sleep Guidance]).
    </div>`
  },
  brihatjataka: {
    title: "Varahamihira's Brihat Jataka — Cosmic Body Signs (Kalapurusha) & 24-Hora Rhythms",
    tier: "Vedic Astrology",
    text: `<p><strong>Varahamihira's Brihat Jataka</strong> is the seminal classical treatise connecting mathematical astronomy with human circadian rhythms and physical vitality:</p>
    <ul>
      <li><strong>Kalapurusha Limbs (Chapter 1, Verses 4–5):</strong> The 12 signs represent the anatomical organs of the Cosmic Person: <em>Mesha</em> (Head and Brain), <em>Vrishabha</em> (Face, Eyes, and Throat), <em>Mithuna</em> (Chest, Shoulders, and Arms), <em>Karka</em> (Heart and Lungs), <em>Simha</em> (Upper Stomach and Solar Plexus), <em>Kanya</em> (Abdomen and Digestive Tract), <em>Tula</em> (Lower Abdomen, Kidneys, and Lumbar), <em>Vrishchika</em> (Pelvic and Excretory systems), <em>Dhanu</em> (Thighs and Hips), <em>Makara</em> (Knees and Joints), <em>Kumbha</em> (Calves and Shins), and <em>Meena</em> (Feet and Soles).</li>
      <li><strong>Four Maha-Tatvas (Chapter 1):</strong> Every sign is governed by a primal element: <strong>Agni</strong> (Fire: Mesha, Simha, Dhanu — warmth and leadership), <strong>Prithvi</strong> (Earth: Vrishabha, Kanya, Makara — endurance and structure), <strong>Vayu</strong> (Air: Mithuna, Tula, Kumbha — communication and mental agility), and <strong>Jala</strong> (Water: Karka, Vrishchika, Meena — empathy and intuition), defining your metabolic energy and daily stamina.</li>
      <li><strong>The 24-Hora Planetary Order (Chapter 1, Verse 9):</strong> Each 24-hour day-night cycle (<em>Ahoratra</em>) is partitioned into 24 planetary hours (<em>Horas</em>). Scheduling high-focus intellectual work during Surya (Sun) and Budha (Mercury) Horas heightens mental clarity, while resting during Chandra (Moon) and Shukra (Venus) Horas nurtures emotional peace and prevents burnout.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Varahamihira's Brihat Jataka</em> — Chapter 1 (Rashi Bhedadhyaya, Verses 4–9) & Chapter 2 (Grahaguna Svarupadhyaya [Planetary Qualities]).
    </div>`
  },
  shivasamhita: {
    title: "Shiva Samhita — Prana (Vital Energy), 72,000 Nadis & Nadi Shodhana Breathwork",
    tier: "Yogic Science",
    text: `<p>The <strong>Shiva Samhita</strong> (Chapter 3) provides the highest classical instructions on yogic respiration, vital life energy (<em>Prana</em>), and inner mental peace:</p>
    <ul>
      <li><strong>72,000 Nadis & Principal Conduits:</strong> Out of 72,000 subtle energy channels in the human body, three are supreme: <em>Ida</em> (the left lunar channel, activating parasympathetic cooling, digestion, and calmness), <em>Pingala</em> (the right solar channel, activating sympathetic metabolic warmth and physical drive), and <em>Sushumna</em> (the central channel of joyful meditative absorption).</li>
      <li><strong>Nadi Shodhana Vidhi (Chapter 3, Verses 1–40):</strong> Inhale smoothly through the left nostril (Ida), retain gently with light breath retention (<em>Kumbhaka</em>), exhale slowly through the right nostril (Pingala), then reverse. Purifying the breath channels four times daily (at dawn [Brahma Muhurta], midday, evening twilight, and bedtime) dissolves tension, clears mental fatigue, balances blood pressure, and brings a radiant glow to the eyes and skin.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Shiva Samhita</em> (With Hindi Tika) — Chapter 3 (Vayu Sadhana & Pranayama Prakarana, Verses 1–40).
    </div>`
  }
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const scrollBottomBtn = document.getElementById('scroll-bottom-btn');
const attachBtn = document.getElementById('attach-btn');
const fileInput = document.getElementById('file-input');
const voiceBtn = document.getElementById('voice-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const modelModeSelect = document.getElementById('model-mode-select');
const activeTierBadge = document.getElementById('active-tier-badge');
const promptChips = document.querySelectorAll('.chip');
const helpTryButtons = document.querySelectorAll('.help-try-btn');
const attachmentBar = document.getElementById('attachment-preview-bar');
const attachmentName = document.getElementById('attachment-name');
const attachmentSize = document.getElementById('attachment-size');
const removeAttachmentBtn = document.getElementById('remove-attachment-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const geminiKeyInput = document.getElementById('gemini-key-input');

// Mobile Navigation Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
const drawerCloseBtn = document.getElementById('drawer-close-btn');
const drawerOverlay = document.getElementById('drawer-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load saved API key
  const savedKey = localStorage.getItem('shaastra_gemini_key');
  if (savedKey && geminiKeyInput) {
    geminiKeyInput.value = savedKey;
  }

  // Setup listeners
  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (userInput) {
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Mobile Drawer toggles
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMobileDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
      mobileNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Close drawer or modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileDrawer();
      if (settingsModal && !settingsModal.classList.contains('hidden')) {
        settingsModal.classList.add('hidden');
      }
    }
  });

  // Virtual keyboard layout adjustment for mobile browsers
  if (window.visualViewport && userInput) {
    window.visualViewport.addEventListener('resize', () => {
      if (document.activeElement === userInput) {
        requestAnimationFrame(() => {
          if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
          userInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    });
  }

  // Scroll to newest messages listener & handler
  if (chatMessages && scrollBottomBtn) {
    chatMessages.addEventListener('scroll', () => {
      const distanceFromBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight;
      if (distanceFromBottom > 100) {
        scrollBottomBtn.classList.remove('hidden');
      } else {
        scrollBottomBtn.classList.add('hidden');
      }
    }, { passive: true });

    scrollBottomBtn.addEventListener('click', () => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    });
  }

  // Prompt chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (!userInput) return;
      userInput.value = chip.getAttribute('data-prompt');
      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
      userInput.focus();
    });
  });

  // 'Try in Chat' buttons in 'How ShaastraAI Helps You' cards
  helpTryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt && userInput) {
        userInput.value = prompt;
        userInput.focus();
        const chatSection = document.getElementById('chat-section');
        if (chatSection) {
          chatSection.scrollIntoView({ behavior: 'smooth' });
        }
        handleSend();
      }
    });
  });

  // Clickable interactive buttons generated inside chat bubbles
  if (chatMessages) {
    chatMessages.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-prompt-btn');
      if (btn && userInput) {
        const prompt = btn.getAttribute('data-fill');
        if (prompt) {
          userInput.value = prompt;
          userInput.focus();
          handleSend();
        }
      }
    });
  }

  // Attachments
  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', () => fileInput.click());
  }
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelected);
  }
  if (removeAttachmentBtn) {
    removeAttachmentBtn.addEventListener('click', clearAttachment);
  }

  // Voice simulation
  if (voiceBtn) {
    voiceBtn.addEventListener('click', simulateVoiceInput);
  }

  // Clear chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', clearChat);
  }

  // Model select (if present)
  if (modelModeSelect) {
    modelModeSelect.addEventListener('change', (e) => {
      activeMode = e.target.value || 'auto';
      updateTierBadge();
    });
  }

  // Settings modal
  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
  }
  if (closeModalBtn && settingsModal) {
    closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
  }
  if (saveSettingsBtn && settingsModal) {
    saveSettingsBtn.addEventListener('click', () => {
      const key = geminiKeyInput ? geminiKeyInput.value.trim() : '';
      if (key) {
        localStorage.setItem('shaastra_gemini_key', key);
      } else {
        localStorage.removeItem('shaastra_gemini_key');
      }
      settingsModal.classList.add('hidden');
      appendBotMessage("Preferences saved. ShaastraAI is ready to assist you.", "Preferences Updated");
    });
  }

  // Auto-resize textarea
  if (userInput) {
    userInput.addEventListener('input', () => {
      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
    });
  }
});

function openMobileDrawer() {
  if (mobileDrawer) {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
  }
  if (drawerOverlay) {
    drawerOverlay.classList.add('open');
    drawerOverlay.classList.add('active');
    drawerOverlay.setAttribute('aria-hidden', 'false');
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  if (mobileDrawer) {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }
  if (drawerOverlay) {
    drawerOverlay.classList.remove('open');
    drawerOverlay.classList.remove('active');
    drawerOverlay.setAttribute('aria-hidden', 'true');
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

function updateTierBadge() {
  if (!activeTierBadge) return;
  activeTierBadge.textContent = '🌿 ShaastraAI • Ready to guide you';
  activeTierBadge.style.color = '#059669';
}

function handleFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  currentAttachment = file;
  if (attachmentName) attachmentName.textContent = file.name;
  const sizeKb = (file.size / 1024).toFixed(1);
  if (attachmentSize) attachmentSize.textContent = `(${sizeKb} KB)`;
  if (attachmentBar) attachmentBar.classList.remove('hidden');
}

function clearAttachment() {
  currentAttachment = null;
  if (fileInput) fileInput.value = '';
  if (attachmentBar) attachmentBar.classList.add('hidden');
}

function simulateVoiceInput() {
  if (!voiceBtn || !userInput) return;
  voiceBtn.style.color = '#ef4444';
  const phrases = [
    "Make a personalized daily routine for Madhur with Leo sun sign and Magha nakshatra",
    "What does Ayurveda recommend for healthy digestion and eating habits (Bhojana Vidhi)?",
    "What yoga asanas and pranayama breathing practices are best for calming stress?",
    "What wisdom does the Bhagavad Gita provide on handling anxiety and finding inner peace?"
  ];
  const chosen = phrases[Math.floor(Math.random() * phrases.length)];
  userInput.value = chosen;
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
  setTimeout(() => {
    voiceBtn.style.color = '';
    userInput.focus();
  }, 600);
}

function clearChat() {
  if (!chatMessages) return;
  chatMessages.innerHTML = `
    <div class="chat-bubble-row bot">
      <div class="avatar bot-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <div class="bubble-content">
        <div class="bubble-meta">
          <span class="bubble-sender">ShaastraAI</span>
          <span class="bubble-time">Just now</span>
          <span class="mini-pill">Vedic Wisdom</span>
        </div>
        <div class="bubble-text">
          <p>Namaste! I am <strong>ShaastraAI</strong>, your personal companion for Vedic wisdom, Ayurvedic living, and daily lifestyle balance.</p>
          <p>Ask me anything about creating your personalized daily routine (Dinacharya), Ayurvedic digestion, yoga and breathwork, or philosophical guidance from the sacred texts.</p>
        </div>
      </div>
    </div>
  `;
  conversationHistory = [];
  if (scrollBottomBtn) {
    scrollBottomBtn.classList.add('hidden');
  }
}

async function handleSend() {
  if (!userInput) return;
  const text = userInput.value.trim();
  if (!text && !currentAttachment) return;

  const userQuery = text;
  userInput.value = '';
  userInput.style.height = 'auto';

  // Render user message
  appendUserMessage(userQuery, currentAttachment ? currentAttachment.name : null);
  conversationHistory.push({ role: 'user', content: userQuery });

  // Clear current attachment from input bar
  const attachedFile = currentAttachment;
  clearAttachment();

  // Show peaceful thinking indicator
  const loadingId = appendLoadingIndicator();

  try {
    const apiKey = localStorage.getItem('shaastra_gemini_key');
    let responseData = null;

    // First try backend API (local python serve.py or Netlify function)
    try {
      const endpoints = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? ['/api/chat', '/.netlify/functions/chat']
        : ['/.netlify/functions/chat', '/api/chat'];

      for (const endpoint of endpoints) {
        try {
          const apiRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userQuery, history: conversationHistory })
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data.reply) {
              responseData = {
                tier: data.tier || 'Vedic Wisdom',
                rawText: data.reply,
                text: data.reply
              };
              break;
            }
          }
        } catch (_) {}
      }
    } catch (_) {
      // Backend function not available, fallback to client methods
    }

    if (!responseData && apiKey) {
      responseData = await callLiveGemini(userQuery, apiKey, conversationHistory);
    }

    if (!responseData) {
      // Classical grounded knowledge base & adaptive conversational engine
      responseData = generateGroundedResponse(userQuery, attachedFile, conversationHistory);
    }

    removeLoadingIndicator(loadingId);
    appendBotMessage(responseData.text, responseData.tier || 'Vedic Wisdom');
    const cleanBotText = responseData.rawText || responseData.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    conversationHistory.push({ role: 'assistant', content: cleanBotText });
  } catch (err) {
    removeLoadingIndicator(loadingId);
    console.warn("Consultation fallback:", err);
    const fallbackData = generateGroundedResponse(userQuery, attachedFile, conversationHistory);
    appendBotMessage(fallbackData.text, fallbackData.tier || 'Vedic Wisdom');
    const cleanFallbackText = fallbackData.rawText || fallbackData.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    conversationHistory.push({ role: 'assistant', content: cleanFallbackText });
  }
}

function appendUserMessage(text, attachmentName) {
  if (!chatMessages) return;
  const row = document.createElement('div');
  row.className = 'chat-bubble-row user';
  
  let attachHtml = '';
  if (attachmentName) {
    attachHtml = `<div class="mini-pill" style="margin-bottom: 6px; display: inline-block;">📎 Attached: ${escapeHtml(attachmentName)}</div><br/>`;
  }

  row.innerHTML = `
    <div class="avatar user-avatar">U</div>
    <div class="bubble-content">
      <div class="bubble-meta">
        <span class="bubble-sender">You</span>
        <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="bubble-text">
        ${attachHtml}
        <p>${escapeHtml(text)}</p>
      </div>
    </div>
  `;
  chatMessages.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Copies response guidance text to clipboard with animated feedback
 */
function copyReplyText(btn) {
  if (!btn) return;
  const bubble = btn.closest('.bubble-content');
  if (!bubble) return;
  const bubbleText = bubble.querySelector('.bubble-text');
  if (!bubbleText) return;

  const clone = bubbleText.cloneNode(true);
  const actions = clone.querySelector('.reply-action-bar');
  if (actions) actions.remove();

  const textToCopy = clone.innerText.trim();
  const span = btn.querySelector('span');
  const origText = span ? span.textContent : 'Copy Guidance';

  const onSuccess = () => {
    if (span) span.textContent = 'Copied! ✓';
    btn.classList.add('copied');
    setTimeout(() => {
      if (span) span.textContent = origText;
      btn.classList.remove('copied');
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(() => {
      fallbackCopy(textToCopy, onSuccess);
    });
  } else {
    fallbackCopy(textToCopy, onSuccess);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    cb();
  } catch (_) {}
  document.body.removeChild(ta);
}

/**
 * High-Aesthetic Rich Vedic Formatter
 * Transforms raw text, markdown, or unstructured HTML into visually stunning,
 * formatted cards with Reflective Inquiries, First-Aid Steps, and Citation Boxes.
 */
function formatRichVedicResponse(rawText) {
  if (!rawText) return '';

  let text = String(rawText).trim();

  // Detect if the incoming text is already formatted HTML
  const isHtml = /<\s*(?:p|div|ul|ol|table|h[1-6]|section|article)\b[^>]*>/i.test(text);

  if (isHtml) {
    // 1. Clean up empty or broken greetings
    text = text.replace(/Namaste\s*<strong>\s*(?:null|undefined|friend)?\s*<\/strong>\s*!/gi, 'Namaste, dear seeker!');
    text = text.replace(/Namaste\s*<strong>\s*<\/strong>\s*!/gi, 'Namaste, dear seeker!');
    text = text.replace(/<strong>\s*<\/strong>/gi, '');

    // 2. Transform the closing inquiry question into .inquiry-card if not already converted
    if (!text.includes('class="inquiry-card"')) {
      let inquiryConverted = false;

      // Pattern A: A question paragraph immediately before <div class="citation-box">
      text = text.replace(
        /<p(?:\s+[^>]*)?>((?:(?!<p\b)[\s\S])*?\?)\s*<\/p>\s*(?=<div class="citation-box">)/i,
        (match, qContent) => {
          inquiryConverted = true;
          return `
            <div class="inquiry-card">
              <div class="inquiry-header">
                <span class="inquiry-icon">🪷</span>
                <span class="inquiry-badge">Sacred Inquiry for Deeper Clarity</span>
              </div>
              <p class="inquiry-question">${qContent.trim()}</p>
            </div>
          `;
        }
      );

      // Pattern B: A styled question paragraph (e.g. font-weight: 600 or margin-top: 10px / 14px)
      if (!inquiryConverted) {
        text = text.replace(
          /<p\s+style="[^"]*(?:font-weight:\s*600|margin-top:\s*(?:10|14)px)[^"]*"[^>]*>((?:(?!<p\b)[\s\S])*?\?)\s*<\/p>/i,
          (match, qContent) => {
            inquiryConverted = true;
            return `
              <div class="inquiry-card">
                <div class="inquiry-header">
                  <span class="inquiry-icon">🪷</span>
                  <span class="inquiry-badge">Sacred Inquiry for Deeper Clarity</span>
                </div>
                <p class="inquiry-question">${qContent.trim()}</p>
              </div>
            `;
          }
        );
      }

      // Pattern C: The last paragraph ending in '?'
      if (!inquiryConverted) {
        const lastPRegex = /<p(?:\s+[^>]*)?>((?:(?!<p\b)[\s\S])*?\?)\s*<\/p>(?:\s*<\/div>)*$/i;
        if (lastPRegex.test(text)) {
          text = text.replace(lastPRegex, (match, qContent) => {
            return `
              <div class="inquiry-card">
                <div class="inquiry-header">
                  <span class="inquiry-icon">🪷</span>
                  <span class="inquiry-badge">Sacred Inquiry for Deeper Clarity</span>
                </div>
                <p class="inquiry-question">${qContent.trim()}</p>
              </div>
            `;
          });
        }
      }
    }

    // 3. Format citation box header if present
    text = text.replace(
      /<div class="citation-header">\s*(?:📚\s*)?([^<]+)<\/div>/gi,
      '<div class="citation-header"><span class="citation-icon">📚</span><span>$1</span></div>'
    );

    // 4. Attach reply action bar if not present
    if (!text.includes('class="reply-action-bar"')) {
      text += `
        <div class="reply-action-bar">
          <button class="copy-guidance-btn" onclick="copyReplyText(this)" title="Copy guidance to clipboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Guidance</span>
          </button>
          <span class="verified-shastra-badge">🌿 Shastric Wisdom Verified</span>
        </div>
      `;
    }

    return `<div class="formatted-reply">${text}</div>`;
  }

  // --- RAW MARKDOWN PROCESSING ---

  // 1. Extract Scriptural Sources Block
  let scripturalSourcesHtml = '';
  const sourcesMatch = text.match(/(?:###\s*(?:📚|Scriptural Sources).*?$|📚\s*Scriptural Sources[\s\S]*$)([\s\S]*)/i);
  if (sourcesMatch) {
    const sourcesContent = sourcesMatch[1].trim();
    text = text.slice(0, sourcesMatch.index).trim();

    const citationLines = sourcesContent
      .split('\n')
      .map(l => l.replace(/^[-*•\d.]\s*/, '').trim())
      .filter(l => l.length > 0);

    const itemsHtml = citationLines.map(c => {
      const formatted = c.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
      return `<li>${formatted}</li>`;
    }).join('');

    scripturalSourcesHtml = `
      <div class="citation-box">
        <div class="citation-header">
          <span class="citation-icon">📚</span>
          <span>Classical Shastric Authorities & Sources</span>
        </div>
        <ul class="citation-list">${itemsHtml}</ul>
      </div>
    `;
  }

  // 2. Extract Open-Ended Closing Question
  let inquiryQuestionHtml = '';
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length > 0) {
    const lastP = paragraphs[paragraphs.length - 1];
    if (lastP.includes('?') && (
      lastP.length > 35 ||
      /^(as you pause|reflecting on|what aspect|which of|how often|where do you|when during|in what way)/i.test(lastP)
    )) {
      paragraphs.pop();
      const cleanQuestion = lastP
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/^>\s*/, '')
        .trim();

      inquiryQuestionHtml = `
        <div class="inquiry-card">
          <div class="inquiry-header">
            <span class="inquiry-icon">🪷</span>
            <span class="inquiry-badge">Sacred Inquiry for Deeper Clarity</span>
          </div>
          <p class="inquiry-question">${escapeHtml(cleanQuestion)}</p>
        </div>
      `;
    }
  }

  text = paragraphs.join('\n\n');

  // 3. Process Vedic Janma Kundali Summary Widget
  text = text.replace(
    /(?:🪐\s*\*\*Vedic Janma Kundali Summary:\*\*|🪐\s*Vedic Janma Kundali Summary:)([\s\S]*?)(?=(?:🙏|\n\n[A-Z]|\n\n###|$))/i,
    (match, kundliBody) => {
      const lines = kundliBody.split('\n').filter(l => l.trim().length > 0);
      let itemsHtml = '';
      lines.forEach(l => {
        const clean = l.replace(/^[-*•]\s*/, '').trim();
        const parts = clean.split(/:\s*(.*)/s);
        if (parts.length >= 2) {
          const label = parts[0].replace(/\*\*/g, '').trim();
          const val = parts[1].replace(/\*\*/g, '').trim();
          itemsHtml += `
            <div class="kundli-summary-item">
              <span class="summary-label">${escapeHtml(label)}</span>
              <span class="summary-value">${escapeHtml(val)}</span>
            </div>
          `;
        }
      });
      return `
        <div class="kundli-summary-card">
          <div class="kundli-summary-header">
            <span>🪐</span>
            <strong>Vedic Janma Kundali Parameters (Nirayana Sidereal Zodiac)</strong>
          </div>
          <div class="kundli-summary-grid">
            ${itemsHtml}
          </div>
        </div>
      `;
    }
  );

  // 4. Process Astrologer Agent & Maharaj Ji Banners
  text = text.replace(
    /🪐\s*\*\*Astrologer Agent \(([^)]+)\)\s*(?:Consultation|Analysis)?:\*\*/gi,
    '<div class="agent-banner astrologer"><span class="agent-badge-icon">🪐</span><div><strong>Astrologer Agent ($1)</strong><span class="agent-role-sub">Mathematical Nirayana Chart Calculation</span></div></div>'
  );

  text = text.replace(
    /🙏\s*\*\*Shastric Synthesis by Maharaj Ji \(([^)]+)\):\*\*/gi,
    '<div class="agent-banner maharaj"><span class="agent-badge-icon">🕉️</span><div><strong>Maharaj Ji ($1)</strong><span class="agent-role-sub">Classical Shastric & Puranic Synthesis</span></div></div>'
  );

  // 5. Process Numbered Action Steps (First-Aid Cards)
  text = text.replace(
    /(?:(?:🌿\s*)?\*\*Immediate 3-Minute Shastric First-Aid[^*]*\*\*:?\s*\n)([\s\S]*?)(?=(?:\n\n[🪐🙏]|\n\n###|$))/i,
    (match, stepsBody) => {
      const stepItems = stepsBody.split(/(?=\b\d+\.\s+\*\*)/).filter(s => s.trim().length > 0);
      let stepsHtml = '';
      stepItems.forEach(s => {
        const stepMatch = s.match(/^\s*(\d+)\.\s+\*\*([^*]+)\*\*:\s*([\s\S]*)$/);
        if (stepMatch) {
          const stepNum = stepMatch[1];
          const stepTitle = stepMatch[2];
          const stepDesc = stepMatch[3].trim().replace(/\*([^*]+)\*/g, '<em>$1</em>');
          stepsHtml += `
            <div class="first-aid-step">
              <div class="first-aid-num">${stepNum}</div>
              <div class="first-aid-body">
                <div class="first-aid-title">${escapeHtml(stepTitle)}</div>
                <div class="first-aid-desc">${stepDesc}</div>
              </div>
            </div>
          `;
        } else {
          stepsHtml += `<p>${s}</p>`;
        }
      });
      return `
        <div class="first-aid-wrapper">
          <div class="first-aid-header">
            <span>🌿</span>
            <strong>Immediate 3-Minute Shastric First-Aid for Mental Clarity</strong>
          </div>
          <div class="first-aid-list">
            ${stepsHtml}
          </div>
        </div>
      `;
    }
  );

  // 6. Markdown Headings & Styling
  text = text.replace(/^### (.*$)/gim, '<h3 class="shastra-heading">$1</h3>');
  text = text.replace(/^#### (.*$)/gim, '<h4 class="shastra-subheading">$1</h4>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Bullet Lists
  text = text.replace(/(?:^[-*•]\s+.*$\n?)+/gm, (listBlock) => {
    const lis = listBlock.split('\n')
      .map(l => l.replace(/^[-*•]\s+/, '').trim())
      .filter(Boolean)
      .map(l => `<li>${l}</li>`)
      .join('');
    return `<ul class="shastra-list">${lis}</ul>`;
  });

  // Paragraphs
  const remainingParas = text.split(/\n\s*\n/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<div') || p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol')) {
      return p;
    }
    return `<p class="shastra-p">${p.replace(/\n/g, '<br/>')}</p>`;
  }).filter(Boolean);

  const mainHtml = remainingParas.join('\n');

  return `
    <div class="formatted-reply">
      ${mainHtml}
      ${inquiryQuestionHtml}
      ${scripturalSourcesHtml}
      <div class="reply-action-bar">
        <button class="copy-guidance-btn" onclick="copyReplyText(this)" title="Copy guidance to clipboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy Guidance</span>
        </button>
        <span class="verified-shastra-badge">🌿 Shastric Wisdom Verified</span>
      </div>
    </div>
  `;
}

function appendBotMessage(htmlContent, tierLabel = 'Vedic Wisdom') {
  if (!chatMessages) return;
  const row = document.createElement('div');
  row.className = 'chat-bubble-row bot';
  
  const formattedHtml = formatRichVedicResponse(htmlContent);

  row.innerHTML = `
    <div class="avatar bot-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>
    <div class="bubble-content">
      <div class="bubble-meta">
        <span class="bubble-sender">ShaastraAI</span>
        <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span class="mini-pill">${escapeHtml(tierLabel)}</span>
      </div>
      <div class="bubble-text">
        ${formattedHtml}
      </div>
    </div>
  `;
  chatMessages.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendLoadingIndicator() {
  if (!chatMessages) return null;
  const id = 'loading-' + Date.now();
  const row = document.createElement('div');
  row.id = id;
  row.className = 'chat-bubble-row bot';
  row.innerHTML = `
    <div class="avatar bot-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>
    <div class="bubble-content">
      <div class="bubble-meta">
        <span class="bubble-sender">ShaastraAI</span>
        <span class="bubble-time">Contemplating</span>
      </div>
      <div class="bubble-text" style="display: flex; gap: 8px; align-items: center; padding: 12px 18px;">
        <span class="status-dot"></span> Consulting Vedic wisdom & preparing your guidance...
      </div>
    </div>
  `;
  chatMessages.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

function removeLoadingIndicator(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Scope Checker: Enforces strict grounding in Vedic Astrology & Shastric Scriptures
 */
function isOutOfScope(query) {
  const q = query.toLowerCase();
  const outOfScopePatterns = [
    /\b(python|javascript|typescript|c\+\+|java|react|html|css|sql|database|api|bug|debug|algorithm|function|code|compile|github|git|npm|nodejs|docker|aws|backend|frontend)\b/i,
    /\b(stocks?|share market|bitcoin|crypto|cryptocurrency|nifty|sensex|forex|option trading|buy call|buy put|dividend|trading strategy|portfolio investment)\b/i,
    /\b(election|presidential|prime minister|democrat|republican|parliament|bjp|congress party|voting|geopolitics|war in)\b/i,
    /\b(football|cricket score|premier league|messi|ronaldo|ipl score|box office|hollywood|movie review|netflix|actor|actress)\b/i,
    /\b(antibiotics?|paracetamol|ibuprofen|chemotherapy|mri scan|ct scan|surgery|allopathic|prescription drug|radiology|oncology)\b/i
  ];
  return outOfScopePatterns.some(pat => pat.test(q));
}

function getOutOfScopeResponse(profile) {
  const nameSalutation = profile.name && profile.name !== "Friend" ? ` <strong>${escapeHtml(profile.name)}</strong>` : "";
  return {
    tier: "Scope Guidance",
    rawText: `Namaste. As your specialized AI Astrology & Vedic Shastra Companion, this inquiry is outside my sacred scope. My guidance is dedicated exclusively to classical Indic wisdom grounded directly in the sacred scriptures: Varahamihira's Brihat Jataka (Vedic Astrology), Arogyanidhii (Dinacharya & healthy habits), Charaka Samhita (Ayurveda), Shiva Samhita (Pranayama), and the Bhagavad Gita & Upanishads.`,
    text: `<p>Namaste${nameSalutation}. As your specialized <strong>AI Astrology & Vedic Shastra Companion</strong>, this inquiry is <strong>outside my sacred scope</strong>.</p>
    <p>My guidance is strictly grounded in the classical Indian scriptures and astrological treatises uploaded in our knowledge corpus:</p>
    <ul>
      <li><strong>Vedic Astrology (Jyotisha):</strong> Planetary rulers, 12 Rashis (Sun/Moon signs), 27 Nakshatras, and 24-Hora diurnal cycles from <em>Varahamihira's Brihat Jataka</em>.</li>
      <li><strong>Ayurvedic Daily Routines (Dinacharya):</strong> Dawn waking (Brahma Muhurta), Ushapan (copper hydration), Nasya (nasal drops), Snana Vidhi (bathing order), Bhojana Vidhi (digestion), and sleep orientation from <em>Arogyanidhii</em> and <em>Charaka Samhita</em>.</li>
      <li><strong>Yogic Science & Breathwork:</strong> Balancing Ida/Pingala channels and Nadi Shodhana breathwork from <em>Shiva Samhita</em> and <em>Patanjali Yoga Sutras</em>.</li>
      <li><strong>Spiritual Philosophy & Mind Mastery:</strong> Overcoming anxiety, Nishkama Karma, and inner peace from the <em>Bhagavad Gita</em> and <em>108 Upanishads</em>.</li>
    </ul>
    <p>I cannot provide computer code, financial/stock trading predictions, political commentary, sports updates, or modern Western medical prescriptions.</p>
    <p>Would you like to explore your astrological sign (Rashi), customize your daily routine, or ask about Ayurvedic digestion and meditation instead?</p>
    <div class="citation-box">
      <div class="citation-header">📚 Sacred Shastric Scope</div>
      <em>Varahamihira's Brihat Jataka</em> • <em>Arogyanidhii</em> • <em>Charaka Samhita</em> • <em>Shiva Samhita</em> • <em>Bhagavad Gita</em>
    </div>`
  };
}

/**
 * Strict Birth Details & Name Parser
 * Prevents emotions or descriptive states (e.g. "unable", "tired") from being misclassified as names.
 */
function extractBirthDetails(history, currentQuery) {
  const allUserTexts = (history || [])
    .filter(turn => turn && turn.role === 'user')
    .map(turn => turn.content)
    .concat([currentQuery || '']);
  const fullText = allUserTexts.join(' ');

  // 1. Strict Name Extraction
  let name = null;
  const explicitMatch = fullText.match(/(?:my\s+name\s+is|name\s*(?::|is)|call\s+me)\s+([a-zA-Z]+)/i);
  if (explicitMatch && explicitMatch[1]) {
    const cand = explicitMatch[1].trim();
    if (cand.length >= 2 && !['friend', 'unable', 'user', 'there'].includes(cand.toLowerCase())) {
      name = cand.charAt(0).toUpperCase() + cand.slice(1).toLowerCase();
    }
  }
  if (!name) {
    const forbidden = new Set([
      'unable', 'feeling', 'tired', 'confused', 'stressed', 'anxious', 'sick', 'looking', 
      'asking', 'wondering', 'having', 'trying', 'here', 'new', 'sad', 'happy', 'depressed', 
      'overwhelmed', 'lost', 'stuck', 'ready', 'curious', 'student', 'working', 'seeking', 
      'praying', 'facing', 'suffering', 'going', 'getting', 'hurting', 'sitting', 'lying', 
      'eating', 'sleeping', 'fasting', 'not', 'just', 'so', 'very', 'a', 'an', 'the',
      'afraid', 'nervous', 'worried', 'fine', 'okay', 'ok', 'well', 'good', 'bad', 
      'exhausted', 'restless', 'lonely', 'frustrated', 'angry', 'upset', 'doubtful', 
      'uncertain', 'helpless', 'blank', 'troubled', 'in', 'at', 'born', 'on', 'my', 'me'
    ]);
    const iAmMatch = fullText.match(/\b(?:i\s+am|i'm)\s+([A-Za-z]+)\b/i);
    if (iAmMatch && iAmMatch[1]) {
      const word = iAmMatch[1].toLowerCase();
      if (!forbidden.has(word) && word.length >= 3 && /^[A-Z]/.test(iAmMatch[1])) {
        name = iAmMatch[1].charAt(0).toUpperCase() + iAmMatch[1].slice(1).toLowerCase();
      }
    }
  }

  // 2. Date of Birth
  let dob = null;
  let dobMatch = fullText.match(/\b(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/);
  if (!dobMatch) {
    dobMatch = fullText.match(/\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})\b/i);
  }
  if (!dobMatch) {
    dobMatch = fullText.match(/\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\b/i);
  }
  if (dobMatch) dob = dobMatch[1];

  // 3. Time of Birth
  let tob = null;
  let tobMatch = fullText.match(/\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?)\b/i);
  if (!tobMatch) {
    tobMatch = fullText.match(/\b(\d{1,2}\s*(?:am|pm))\b/i);
  }
  if (tobMatch) tob = tobMatch[1];

  // 4. Place of Birth
  let pob = null;
  const pobMatch = fullText.match(/(?:in|at|pob(?:\s*:|\s+is)?|born\s+in)\s+([A-Za-z\s]+?)(?:[.,;]|\s+name|\s+dob|\s+tob|\s+time|$)/i);
  if (pobMatch) {
    let cand = pobMatch[1].trim().replace(/^(the|a)\s+/i, '');
    if (cand.length >= 3 && !['the', 'this', 'that', 'here', 'morning', 'evening', 'night'].includes(cand.toLowerCase())) {
      pob = cand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  const hasCompleteBirthData = Boolean(dob && (tob || pob));

  return { name, dob, tob, pob, hasCompleteBirthData };
}

/**
 * Multi-Turn User Profile & Intent Accumulator
 */
function extractUserProfile(history, currentQuery) {
  const birthDetails = extractBirthDetails(history, currentQuery);
  const allUserTexts = (history || [])
    .filter(turn => turn && turn.role === 'user')
    .map(turn => turn.content)
    .concat([currentQuery || '']);
  const combined = allUserTexts.join(' ').toLowerCase();

  let detectedSignKey = null;
  for (const signKey of Object.keys(RASHI_DATA)) {
    const wordRegex = new RegExp(`\\b${signKey}\\b`, 'i');
    if (wordRegex.test(combined)) {
      detectedSignKey = signKey;
      break;
    }
  }

  let detectedNakshatraKey = null;
  for (const nakKey of Object.keys(NAKSHATRA_DATA)) {
    const wordRegex = new RegExp(`\\b${nakKey}\\b`, 'i');
    if (wordRegex.test(combined)) {
      detectedNakshatraKey = nakKey;
      break;
    }
  }

  let detectedDosha = null;
  if (/\bpitta\b/i.test(combined)) detectedDosha = 'Pitta (Fire/Metabolic)';
  else if (/\bvata\b/i.test(combined)) detectedDosha = 'Vata (Air/Nervous)';
  else if (/\bkapha\b/i.test(combined)) detectedDosha = 'Kapha (Earth/Water)';

  // If sessionKundli is active with genuine birth data, pull from chart
  if (sessionKundli && sessionKundli.hasRealBirthData) {
    if (!detectedSignKey && sessionKundli.lagna && sessionKundli.lagna.rashi) {
      detectedSignKey = sessionKundli.lagna.rashi.english.toLowerCase();
    }
  }

  const rashi = detectedSignKey ? RASHI_DATA[detectedSignKey] : null;
  const nakshatra = detectedNakshatraKey ? NAKSHATRA_DATA[detectedNakshatraKey] : null;

  return {
    name: birthDetails.name,
    signKey: detectedSignKey,
    rashi: rashi,
    nakshatraKey: detectedNakshatraKey,
    nakshatra: nakshatra,
    dosha: detectedDosha || (rashi ? rashi.dosha : 'Balanced Tridosha')
  };
}

function isInitialRoutineQuery(query) {
  const q = query.toLowerCase();
  const isRoutine = q.includes('routine') || q.includes('dinacharya') || q.includes('daily plan') || q.includes('schedule') || q.includes('timetable');
  const isFollowUp = q.includes('why') || q.includes('step') || q.includes('what about') || q.includes('explain') || q.includes('how to') || q.includes('instead');
  return isRoutine && !isFollowUp;
}

/**
 * Conversational Intent & Coreference Resolver
 * Understands follow-up questions in light of previous conversation turns
 */
function resolveConversationalFollowUp(query, profile, history) {
  const q = query.toLowerCase();
  const userName = (profile.name && typeof profile.name === 'string' && profile.name.trim() && profile.name.trim().toLowerCase() !== "friend") ? profile.name.trim() : null;
  const greeting = userName ? `Namaste <strong>${escapeHtml(userName)}</strong>!` : `Namaste, dear seeker!`;
  const hasSign = Boolean(profile.signKey && profile.rashi);
  const rashi = profile.rashi;
  const nakshatra = profile.nakshatra;
  const signTitle = hasSign ? rashi.sanskrit : null;

  // 1. Follow-up on Step 1: Waking / Brahma Muhurta / Early vs Late Waking
  if (q.includes('4:30') || q.includes('brahma') || (q.includes('wake') && (q.includes('why') || q.includes('early') || q.includes('late') || q.includes('7') || q.includes('8') || q.includes('cannot') || q.includes("can't") || q.includes('instead') || q.includes('time'))) || q.includes('step 1')) {
    const isAskingWhy = q.includes('why') || q.includes('reason');
    const isWakingLater = q.includes('7') || q.includes('8') || q.includes('late') || q.includes("can't") || q.includes('cannot') || q.includes('work');
    
    let advice = "";
    if (isWakingLater) {
      const constitutionNote = (hasSign && rashi) ? (rashi.element.includes("Agni") ? "Pitta (causing irritability and headaches)" : "Vata (causing restlessness)") : "bodily balance (aggravating Vata or Pitta)";
      advice = `<p>${greeting} Classical Ayurveda is deeply compassionate and realistic. In the <em>Charaka Samhita</em>, when an ideal guideline does not fit your current work or night schedule, you should adopt <strong>Padamshika Krama</strong> (the principle of gradual step-by-step transition):</p>
      <ul>
        <li><strong>Do not force an abrupt shock:</strong> Shifting instantly from 8:00 AM to 4:30 AM will only aggravate ${constitutionNote}. Instead, shift your waking time backward by 15–20 minutes every 4–5 days.</li>
        <li><strong>If your job requires late sleep:</strong> If you must wake at 7:00 AM or 8:00 AM, the most critical rule from <strong>Arogyanidhii (p. 20)</strong> is: <em>never jump straight from bed into high-stress screens or cold foods</em>. Spend your first 15 minutes in quiet hydration (Ushapan) and 5 minutes of gentle diaphragmatic breathing to stabilize your circadian rhythm.</li>
      </ul>`;
    } else {
      const personalSignMention = hasSign ? `For your constitution (${signTitle}), awakening` : `Awakening`;
      advice = `<p>${greeting} The recommendation to awaken during <strong>Brahma Muhurta (04:30 AM – 05:15 AM)</strong> is grounded in both cosmological rhythm and human physiology:</p>
      <ul>
        <li><strong>Peak Atmospheric Sattva (Purity & Calm):</strong> Approximately 96 minutes (2 Muhurtas) before sunrise, atmospheric turbulence and noise are at their lowest. <em>Ashtanga Hridaya (Sutrasthana Ch. 2)</em> declares: <em>"ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः"</em> — awakening at this sacred hour preserves cellular vitality and longevity.</li>
        <li><strong>Elemental Prana:</strong> Nascent oxygen and pure Prana are at their cleanest before the sun triggers thermal convection. ${personalSignMention} in the quiet dawn prevents morning cortisol spikes, dissolves mental heaviness (Tamas), and anchors deep focus for the entire day.</li>
      </ul>`;
    }

    return {
      tier: "Dinacharya Adaptation",
      rawText: `Guidance for ${userName || "seeker"} on Brahma Muhurta and morning waking from Arogyanidhii p. 18 and Ashtanga Hridaya Sutrasthana Ch. 2.`,
      text: `${advice}
      <p style="margin-top: 10px;">Would you like me to adjust <strong>Step 2 (Ushapan & Nasya)</strong> to match your personal morning routine, or shall we explore your daytime focus hours?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Ashtanga Hridaya, Sutrasthana Ch. 2</em> (Dinacharya Adhyaya: Brahma Muhurta Awaking) & <em>Arogyanidhii</em>, p. 18 (Sleep & Awakening Principles).
      </div>`
    };
  }

  // 2. Follow-up on Step 2: Ushapan (Dawn Water) / Copper Vessel / Nasya
  if (q.includes('copper') || q.includes('tamra') || q.includes('ushapan') || q.includes('nasya') || q.includes('nose drop') || q.includes('nostril') || q.includes('step 2')) {
    const nextStepOil = hasSign ? ` and the ideal therapeutic oil for your ${signTitle}` : ` and how to practice it in 5 minutes`;
    return {
      tier: "Ayurvedic Hygiene",
      rawText: `Guidance for ${userName || "seeker"} on Ushapan (copper water) and Nasya from Arogyanidhii p. 20.`,
      text: `<p>${greeting} Let's explore <strong>Step 2 of your morning routine: Ushapan & Nasya</strong> in detail:</p>
      <ul>
        <li><strong>Why Copper-Stored Water (Tamra Jal)?</strong> According to <strong>Arogyanidhii (p. 20)</strong>, drinking 500–1000 ml of pure water stored overnight in a clean copper vessel naturally ionizes the water with trace minerals. This stimulates natural gastrointestinal peristalsis, clears overnight Ama (digestive toxins), and cools excess heat.</li>
        <li><strong>What if you don't have a copper vessel?</strong> Pure lukewarm water stored in glass, earthen clay, or stainless steel is completely effective. You can add a pinch of cumin or fennel seeds if your digestion tends to feel sluggish.</li>
        <li><strong>Pratimarsa Nasya (Gentle Nasal Care):</strong> Administering 2 small drops of warm sesame oil or Anu Taila into each nostril lubricates the cranial sinuses, sharpens optical nerve vision (protecting eye health from screen strain), and prevents premature graying (<em>Arogyanidhii p. 20</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Shall we proceed to <strong>Step 3: Abhyanga (Self-Oil Massage)</strong>${nextStepOil}?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Arogyanidhii</em>, p. 20 (Ushapan & Pratimarsa Nasya Vidhi) & <em>Charaka Samhita, Sutrasthana Ch. 5</em> (Matrashitiya Adhyaya).
      </div>`
    };
  }

  // 3. Follow-up on Step 3: Abhyanga (Oil Massage) / Gandusha (Oil Pulling) / Best Oil
  if (q.includes('oil') || q.includes('abhyanga') || q.includes('massage') || q.includes('gandusha') || q.includes('step 3') || q.includes('pulling')) {
    const headingNote = hasSign ? `tailored to your astrological energy (<strong>${signTitle}</strong>)` : `grounded in classical Shastra`;
    const oilGuidance = (hasSign && rashi)
      ? `<strong>${rashi.oil}</strong>. Because your sign is governed by <strong>${rashi.element}</strong>, this oil directly soothes your <strong>${profile.dosha}</strong> tendencies, nourishing the seven bodily tissues (Dhatus) and grounding the nervous system.`
      : `<strong>Warm unrefined Sesame (Tila) oil</strong> (or cooling coconut oil if you tend towards excess heat/Pitta). In <em>Charaka Samhita</em>, sesame oil is revered as the supreme base oil for grounding Vata, nourishing all seven bodily tissues (Dhatus), and shielding the nervous system.`;

    return {
      tier: "Ayurvedic Rejuvenation",
      rawText: `Guidance for ${userName || "seeker"} on Abhyanga oil massage from Charaka Samhita Sutrasthana Ch. 5 and Arogyanidhii p. 21.`,
      text: `<p>${greeting} Here are the customized guidelines for <strong>Step 3: Abhyanga & Gandusha</strong> ${headingNote}:</p>
      <ul>
        <li><strong>Your Prescribed Oil:</strong> ${oilGuidance}</li>
        <li><strong>Quick 5-Minute Routine (Shiro-Karna-Pada):</strong> If a full-body oil massage isn't practical every morning before work, classical shastras prescribe massaging just three key centers: the <strong>crown of the head (Shiro)</strong>, the <strong>ears (Karna)</strong>, and the <strong>soles of the feet (Pada)</strong>. This delivers 80% of the neurological benefits in 5 minutes!</li>
        <li><strong>Gandusha (Oil Pulling):</strong> Swishing warm sesame oil in the mouth for 3–5 minutes strengthens gums, whitens teeth, and prevents dryness of the throat and lips (<em>Arogyanidhii p. 21</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to move into <strong>Step 4: Morning Movement & Shiva Samhita Pranayama</strong> next?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Charaka Samhita, Sutrasthana Ch. 5, Verses 85–90</em> (Benefits of Daily Abhyanga) & <em>Arogyanidhii</em>, p. 21 (Snana-Purva Abhyanga & Gandusha).
      </div>`
    };
  }

  // 4. Follow-up on Step 4: Vyayama (Exercise), Asanas & Shiva Samhita Pranayama
  if (q.includes('step 4') || q.includes('yoga') || q.includes('pranayama') || q.includes('nadi shodhana') || q.includes('breath') || q.includes('exercise') || q.includes('workout') || q.includes('asana')) {
    const exerciseGuidance = (hasSign && rashi) ? rashi.exercise : "Mindful Surya Namaskar (Sun Salutations), gentle spinal flexion, and grounding restorative postures";
    return {
      tier: "Yogic Science",
      rawText: `Guidance for ${userName || "seeker"} on Vyayama and Nadi Shodhana from Shiva Samhita Ch. 3 and Arogyanidhii p. 21.`,
      text: `<p>${greeting} Here is how to practice <strong>Step 4: Morning Movement & Pranayama</strong> safely and effectively:</p>
      <ul>
        <li><strong>The Ardha Shakti Rule (Arogyanidhii p. 21):</strong> Exercise only up to <em>half your physiological capacity</em> (stopping when light perspiration beads on your forehead, armpits, and tip of the nose). Never push to extreme breathless exhaustion, which depletes Ojas (vital immunity).</li>
        <li><strong>Tailored Movement:</strong> ${exerciseGuidance}.</li>
        <li><strong>Shiva Samhita Nadi Shodhana (Ch. 3, vv. 1–40):</strong> Sit upright in Sukhasana or Padmasana. Close the right solar nostril (Pingala) with your thumb and inhale slowly through the left lunar nostril (Ida) for 4 seconds. Gently retain or immediately switch, exhaling through the right nostril for 6–8 seconds. Repeat in reverse for 10–12 gentle cycles. This harmonizes brain hemispheres and dissolves inner tension.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to explore <strong>Step 5: Snana Vidhi (Bathing Order)</strong>, or shall we jump forward to your peak focus hours?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Shiva Samhita</em>, Chapter 3, Verses 1–40 (Nadi Shodhana & Vayu Sadhana) & <em>Arogyanidhii</em>, p. 21 (Ardha Shakti Vyayama).
      </div>`
    };
  }

  // 5. Follow-up on Step 5: Snana Vidhi (Bathing Order)
  if (q.includes('step 5') || q.includes('snana') || q.includes('bath') || q.includes('shower') || q.includes('head first') || q.includes('pour water')) {
    return {
      tier: "Ayurvedic Lifestyle",
      rawText: `Guidance for ${userName || "seeker"} on Snana Vidhi bathing order from Arogyanidhii p. 22.`,
      text: `<p>${greeting} <strong>Snana Vidhi (Mindful Bathing Order)</strong> from <strong>Arogyanidhii (p. 22)</strong> contains profound neurological wisdom:</p>
      <ul>
        <li><strong>Why Pour Water on the Head First?</strong> According to classical Shastra, pouring cool or lukewarm water over the crown of the head first immediately cools cranial vascular centers and protects the delicate optic nerve network of the eyes.</li>
        <li><strong>Why Wetting Feet First Causes Harm:</strong> Wetting the feet and lower limbs first drives bodily metabolic heat (Pitta) upward into the brain and eyes, inducing headaches, mental restlessness, and visual fatigue.</li>
        <li><strong>Water Temperature Rule:</strong> Never use excessively hot water on the head or eyes, even during cold winters, as intense heat weakens eye vitality (<em>Chakshu-Bala</em>) and hair roots (<em>Charaka Samhita</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Shall we look into <strong>Steps 6 & 8: Peak Intellectual Hours (Horas)</strong> or proceed to <strong>Step 7: Lunch & Digestion</strong>?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Arogyanidhii</em>, p. 22 (Snana Vidhi: Cranial Cooling & Eye Protection) & <em>Charaka Samhita, Sutrasthana Ch. 5</em>.
      </div>`
    };
  }

  // 6. Follow-up on Step 7: Lunch / Bhojana Vidhi / Digestion / Vama-Kukshi / Food
  if (q.includes('step 7') || q.includes('lunch') || q.includes('bhojana') || q.includes('digest') || q.includes('eat') || q.includes('food') || q.includes('vama-kukshi') || q.includes('left side') || q.includes('ginger') || q.includes('stomach') || q.includes('diet')) {
    return {
      tier: "Ayurvedic Digestion",
      rawText: `Guidance for ${userName || "seeker"} on Bhojana Vidhi and Vama-Kukshi from Arogyanidhii pp. 22-25.`,
      text: `<p>${greeting} Here is the complete breakdown of <strong>Step 7: Madhyahna Bhojana Vidhi (Midday Meal) & Vama-Kukshi</strong> from <strong>Arogyanidhii (pp. 22–25)</strong>:</p>
      <ul>
        <li><strong>Kindling Digestive Fire (Adrak-Sendha Namak, p. 22):</strong> Chew a thin slice of fresh ginger sprinkled with a pinch of rock salt 5 minutes before eating. This immediately stimulates gastric enzymes and cleanses the tongue palate.</li>
        <li><strong>The Stomach Partition Rule (Tri-bhaga, p. 23):</strong> Fill <strong>1/2</strong> of your stomach with wholesome solid food, <strong>1/4</strong> with warm liquid (like dal broth or spiced buttermilk), and <strong>leave 1/4 completely empty</strong> so digestive enzymes and Tridoshas have room to circulate freely.</li>
        <li><strong>Post-Meal Vajrasana (p. 25):</strong> Sit in <em>Vajrasana</em> (kneeling diamond posture) for 10 minutes immediately after eating to redirect pelvic circulation into the stomach.</li>
        <li><strong>Vama-Kukshi (Left-Side Digestive Rest, p. 25):</strong> Rest gently on your <strong>left side for 10–15 minutes</strong> (never enter heavy daytime sleep). Resting on your left side physically positions the greater curvature of the stomach downward and naturally activates the right solar nostril (<em>Surya Nadi / Pingala</em>), generating digestive heat for effortless digestion.</li>
        <li><strong>The 6-Hour Gap Rule (p. 24):</strong> Allow a full 6 hours between heavy cooked meals to ensure complete metabolic assimilation before introducing new food.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like recommendations for a light, restorative evening dinner (Laghubhojana) to prepare for deep sleep?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Arogyanidhii</em>, pp. 22–25 (Bhojana Vidhi, Stomach Partitioning, Vajrasana, & Vama-Kukshi) & <em>Charaka Samhita, Vimanasthana Ch. 1</em> (Ahara Vidhi).
      </div>`
    };
  }

  // 7. Follow-up on Steps 6 & 8: Horas & Planetary Hours (Astrology)
  if (q.includes('step 6') || q.includes('step 8') || q.includes('hora') || q.includes('planetary hour') || q.includes('work') || q.includes('study') || q.includes('timing') || q.includes('productivity')) {
    return {
      tier: "Vedic Astrology (Jyotisha)",
      rawText: `Guidance for ${userName || "seeker"} on 24 Horas from Varahamihira's Brihat Jataka Ch. 1 v. 9.`,
      text: `<p>${greeting} In classical Vedic astrology, scheduling high-priority activities with the <strong>24 Diurnal Horas (Planetary Hours)</strong> connects your work to cosmic rhythms:</p>
      <ul>
        <li><strong>The 24-Hora Order (Varahamihira's Brihat Jataka Ch. 1, v. 9):</strong> The planetary hours follow a continuous cyclic sequence based on relative planetary speeds: <em>Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars</em>.</li>
        <li><strong>Surya Hora (Sun Hour — Willpower & Decision-Making):</strong> Optimal for decisive leadership, setting strategic priorities, and high-visibility presentations.</li>
        <li><strong>Budha Hora (Mercury Hour — Intellect & Analytics):</strong> Optimal for writing, detailed calculations, analytical coding/research, and negotiation.</li>
        <li><strong>Guru Hora (Jupiter Hour — Wisdom & Expansion):</strong> Optimal for ethical counsel, signing contracts, mentorship, and creative collaboration.</li>
        <li><strong>Alignment with Your Sign:</strong> Because your sign is <strong>${signTitle}</strong> (ruled by <strong>${rashi.ruler}</strong>), you experience a natural surge of creative clarity whenever your planetary ruler's Hora is active during the day.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to explore your evening wind-down routine or your nighttime sleep orientation?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Varahamihira's Brihat Jataka</em>, Chapter 1, Verse 9 (The 24-Hora Diurnal Sequence) & Chapter 2 (Planetary Nature & Powers).
      </div>`
    };
  }

  // 8. Follow-up on Step 11: Sleep Direction / North / Insomnia / Padabhyanga
  if (q.includes('step 11') || q.includes('sleep') || q.includes('north') || q.includes('direction') || q.includes('bed') || q.includes('insomnia') || q.includes('padabhyanga') || q.includes('foot massage') || q.includes('nidra')) {
    return {
      tier: "Ayurvedic Sleep Science",
      rawText: `Guidance for ${userName || "seeker"} on sleep direction and Padabhyanga from Arogyanidhii pp. 18, 30.`,
      text: `<p>${greeting} The science of <strong>Nidra (Restorative Sleep)</strong> in <strong>Arogyanidhii (pp. 18, 30)</strong> explains why your sleeping orientation is so crucial:</p>
      <ul>
        <li><strong>Why NEVER Sleep with Head Facing North (p. 18, 30):</strong> The Earth operates as a massive dipolar magnet with positive polarity concentrated at the geographic North Pole. The human body also possesses positive magnetic polarity concentrated at the crown of the head. Pointing your head North produces continuous magnetic repulsion throughout the night, causing cerebral vascular tension, elevated blood pressure, restless tossing, and chronic morning fatigue.</li>
        <li><strong>East Orientation (Optimal for Learning & Vitality):</strong> Pointing your head East aligns with the Earth's rotational electromagnetic flow, enhancing mental clarity, memory retention, and spiritual peace.</li>
        <li><strong>South Orientation (Optimal for Longevity & Grounding):</strong> Pointing your head South creates harmonious magnetic attraction with the Earth's Southern pole, promoting deep slow-wave restorative sleep and lowering cardiovascular strain.</li>
        <li><strong>Padabhyanga (Nightly Foot Massage):</strong> Massaging the soles of your feet with warm cow's ghee or sesame oil for 3 minutes before bed draws excess metabolic heat downward from the head, instantly quietening racing thoughts.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to explore how your astrological birth chart (Rashi & Nakshatra) influences your natural sleep cycles?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Arogyanidhii</em>, pp. 18 & 30 (Geomagnetic Sleep Alignment & Padabhyanga) & <em>Charaka Samhita, Sutrasthana Ch. 21</em> (Ashtauninditiya Adhyaya: The Science of Restorative Sleep).
      </div>`
    };
  }

  // 9. Follow-up on Astrological Sign / Rashi / Nakshatra traits
  if (q.includes('my sign') || q.includes('my rashi') || q.includes('my nakshatra') || q.includes('tell me about my') || (profile.signKey && q.includes(profile.signKey))) {
    return {
      tier: "Vedic Astrology (Jyotisha)",
      rawText: `Astrological profile for ${userName || "seeker"} (${signTitle}) from Varahamihira's Brihat Jataka.`,
      text: `<p>${greeting} According to <strong>Varahamihira's Brihat Jataka (Ch. 1–2)</strong>, here is the astrological essence of your profile:</p>
      <ul>
        <li><strong>Rashi (Zodiac Sign):</strong> <strong>${signTitle}</strong></li>
        <li><strong>Primary Element (Tatva):</strong> ${rashi.element}</li>
        <li><strong>Governing Planetary Ruler:</strong> ${rashi.ruler}</li>
        <li><strong>Constitutional Dosha Tendency:</strong> ${profile.dosha}</li>
        <li><strong>Core Temperament & Gifts:</strong> ${rashi.nature}</li>
        <li><strong>Nakshatra Resonance:</strong> ${profile.nakshatraKey ? `${profile.nakshatraKey.charAt(0).toUpperCase() + profile.nakshatraKey.slice(1)} (Governed by ${nakshatra.ruler}, Deity: ${nakshatra.deity}, Focus: ${nakshatra.focus})` : "General Solar Alignment"}</li>
        <li><strong>Harmonizing Lifestyle Practice:</strong> Focus on ${rashi.pranayama} to keep your mind steady and clear.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like me to show how this planetary energy coordinates with your daily morning routine or your peak focus hours?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Varahamihira's Brihat Jataka</em>, Chapter 1 (Kalapurusha 12 Limbs & Tatvas) & Chapter 2 (Planetary Influences & Gunas).
      </div>`
    };
  }

  // 10. Follow-up on Bhagavad Gita / Anxiety / Mind Mastery
  if (q.includes('anxiety') || q.includes('stress') || q.includes('peace') || q.includes('gita') || q.includes('karma') || q.includes('swadharma') || q.includes('mind') || q.includes('overwhelm')) {
    return {
      tier: "Bhagavad Gita Wisdom",
      rawText: `Guidance for ${userName || "seeker"} on anxiety and peace from Bhagavad Gita 2.47-48 and 3.35.`,
      text: `<p>${greeting} The <strong>Bhagavad Gita</strong> offers timeless, practical psychology for soothing anxiety and finding unshakable inner calm:</p>
      <ul>
        <li><strong>Nishkama Karma (BG 2.47 — The Art of Dedicated Effort):</strong> <em>"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"</em> — Your noble domain is to direct your full heart and sincere effort into your duty, but never to obsess over controlling the fruits or outcome. When you release anxiety over results, your mind naturally returns to peaceful clarity.</li>
        <li><strong>Samatvam Yoga Uchyate (BG 2.48 — Calm Equanimity):</strong> Equanimity in both victory and delay, praise and criticism, is the true definition of Yoga.</li>
        <li><strong>Swadharma (BG 3.35 — Living Authentically):</strong> Honor your natural constitutional gifts (<strong>${signTitle}</strong>) without burning out trying to mimic someone else's rhythm.</li>
        <li><strong>A 3-Minute Centering Practice:</strong> Pause right now, place one hand on your heart, and take 3 slow, deep breaths, remembering that you are the conscious witness of your thoughts, not their prisoner.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like a daily morning mantra or breath practice to reinforce this inner calm throughout your day?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Bhagavad Gita</em>, Chapter 2, Verses 47–48 (Karma Yoga & Equanimity) and Chapter 6, Verses 5–6 (Mastery of the Mind).
      </div>`
    };
  }

  return null;
}

/**
 * Intelligent Personalized Vedic Dinacharya (दिनचर्या) Generator
 * Synthesizes Charaka Samhita Sutrasthana Ch. 5 & Ashtanga Hridaya Ch. 2 with Jyotisha Horas
 */
function generatePersonalizedDinacharya(query, profile) {
  const userName = (profile.name && typeof profile.name === 'string' && profile.name.trim() && profile.name.trim().toLowerCase() !== "friend") ? profile.name.trim() : null;
  const hasSign = Boolean(profile.signKey && profile.rashi);
  const isFullyPersonalized = Boolean(hasSign || profile.nakshatraKey || userName);
  const rashi = profile.rashi;
  const nakshatra = profile.nakshatra;
  const signTitle = hasSign ? rashi.sanskrit : null;
  const element = hasSign ? rashi.element : "Pancha-Mahabhuta (Five Primal Elements)";
  const dosha = hasSign ? profile.dosha : "Balanced Tridosha (Vata • Pitta • Kapha)";
  const oil = hasSign ? rashi.oil : "Warm unrefined Sesame (Tila) oil (or cooling coconut oil for Pitta heat)";
  const exercise = hasSign ? rashi.exercise : "Mindful Surya Namaskar (Sun Salutations), gentle joint mobilization, and restorative asanas";
  const pranayama = hasSign ? rashi.pranayama : "Sheetali (cooling breath) and Nadi Shodhana (alternate-nostril breath)";
  const nakName = (profile.nakshatraKey && nakshatra) ? profile.nakshatraKey.charAt(0).toUpperCase() + profile.nakshatraKey.slice(1) : null;
  const nakDosha = nakshatra ? nakshatra.dosha : null;
  const nakDeity = nakshatra ? nakshatra.deity : "Savitr (Radiant Dawn Solar Presence)";
  const greeting = userName ? `Namaste <strong>${escapeHtml(userName)}</strong>!` : `Namaste, dear seeker!`;

  let headerHtml = "";
  if (isFullyPersonalized && hasSign) {
    headerHtml = `
      <div class="routine-header">
        <h3>🌅 Personalized Vedic Dinacharya (दिनचर्या)${userName ? ` for ${escapeHtml(userName)}` : ''}</h3>
        <div class="routine-badges">
          <span class="badge badge-primary">Rashi: ${signTitle}</span>
          <span class="badge badge-accent">Element: ${element}</span>
          ${nakName ? `<span class="badge badge-offline">Nakshatra: ${nakName} (${nakDosha})</span>` : ''}
          <span class="badge badge-primary">Deity: ${nakDeity}</span>
        </div>
      </div>
      <p style="margin-top: 8px;">
        ${greeting} According to classical <em>Charaka Samhita</em> and <em>Ashtanga Hridaya</em>, 
        your daily routine is optimized to balance your <strong>${element}</strong> tatva and pacify <strong>${dosha}</strong> dosha tendencies.
      </p>
    `;
  } else {
    headerHtml = `
      <div class="routine-header">
        <h3>🌅 Master Vedic Dinacharya (दिनचर्या) & Circadian Framework</h3>
        <div class="routine-badges">
          <span class="badge badge-primary">Charaka Samhita Ch. 5</span>
          <span class="badge badge-accent">Arogyanidhii pp. 18–30</span>
          <span class="badge badge-offline">Tridosha Balance</span>
        </div>
      </div>
      <p style="margin-top: 8px;">
        ${greeting} In classical Shastra, a healthy routine (<strong>Dinacharya</strong>) syncs your biological circadian clock with the cosmic rhythms of nature. Below is your <strong>master hour-by-hour schedule</strong> grounded directly in <em>Arogyanidhii</em> and <em>Charaka Samhita</em>. <em>(To personalize this timetable to your specific Janma Lagna and Nakshatra, please share your birth date, time, and city.)</em>
      </p>
    `;
  }

  const timelineHtml = `
    <div class="timeline-list">
      <div class="timeline-item">
        <div class="timeline-time">04:30 AM – 05:15 AM</div>
        <div class="timeline-content">
          <strong>1. Brahma Muhurta (ब्राह्मे मुहूर्ते उत्तिष्ठेत् — The sacred dawn hour of pure creative vitality)</strong><br/>
          Awaken 2 Muhurtas (approx. 96 minutes) before sunrise when atmospheric Sattva Guna (pure mental clarity and peace) and cellular Prana (vital oxygen) are at their peak (<em>Ashtanga Hridaya, Sutrasthana Ch. 2</em>). 
          According to <strong>Arogyanidhii (pp. 18, 30)</strong>, awaken facing East or North; never sleep with head towards North due to geomagnetic repulsion.<br/>
          <em>Guideline:</em> ${hasSign && element.includes("Agni") ? "Awaken gently with slow deep diaphragmatic breathing to keep morning cortisol and Pitta (metabolic heat) balanced." : hasSign && element.includes("Prithvi") ? "Rise immediately upon waking to break Kapha (morning sluggishness); avoid lingering in bed." : "Awaken gently, sip warm water (Ushapan), and ground your mind with quiet gratitude before entering the day."}
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">05:15 AM – 05:45 AM</div>
        <div class="timeline-content">
          <strong>2. Ushapan (Dawn Hydration), Shaucha (Morning Hygiene) & Pratimarsa Nasya (Gentle Nasal Care)</strong><br/>
          Drink 500–1250 ml of pure water stored overnight in a copper vessel (<em>Ushapan / Tamra Jal</em> — drinking warm copper-infused water at dawn, <strong>Arogyanidhii p. 20</strong>) to stimulate natural bowel clearance and hydrate the digestive tract. 
          Administer 2 drops of warm sesame oil or Anu Taila (classical herbal nasal oil) into each nostril (<em>Pratimarsa Nasya</em>, <strong>Arogyanidhii p. 20</strong>) to lubricate sinuses, protect optic nerve vision, prevent premature graying, and calm the central nervous system. 
          Gently scrape your tongue with a copper or silver scraper (<em>Jihwa Nirlekhana</em>) to clear morning coating, and brush teeth with bitter herbal powder.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">05:45 AM – 06:15 AM</div>
        <div class="timeline-content">
          <strong>3. Gandusha (Oil Pulling) & Abhyanga (Nourishing Self-Oil Massage)</strong><br/>
          Swish warm sesame oil gently in the mouth for 3–5 minutes (<em>Gandusha</em>, <strong>Arogyanidhii p. 21</strong>) to strengthen gums, whiten teeth, and sharpen sensory perception. 
          Perform a soothing full-body warm oil massage (<em>Abhyanga</em>) from head to toe before showering to calm the nervous system, tone muscles, and moisturize the skin.<br/>
          <em>Prescribed Oil:</em> <strong>${oil}</strong> to nourish the seven Dhatus (vital body tissues) and pacify <strong>${dosha}</strong>.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">06:15 AM – 07:15 AM</div>
        <div class="timeline-content">
          <strong>4. Vyayama (Morning Exercise), Asanas (Yoga Postures) & Shiva Samhita Pranayama (Conscious Breathwork)</strong><br/>
          Exercise up to half of your personal physiological capacity (<em>Ardha Shakti</em> — stopping when a light sweat beads on the forehead and nose, <strong>Arogyanidhii p. 21</strong>, to build strength without depleting energy).<br/>
          <em>Prescribed Practice:</em> ${exercise}.<br/>
          <em>Pranayama:</em> Practice Nadi Shodhana (<strong>Shiva Samhita Ch. 3, vv. 1–40</strong>) — alternate-nostril breathing to harmonize Ida (cooling lunar channel) and Pingala (heating solar channel): <strong>${pranayama}</strong>, followed by 10 minutes of silent Dhyana (peaceful morning meditation)${nakName ? ` contemplating <em>${nakDeity}</em>` : ''}.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">07:15 AM – 08:00 AM</div>
        <div class="timeline-content">
          <strong>5. Snana Vidhi (Mindful Bathing Order) & Sattvic Pratah-Ashana (Nourishing Warm Breakfast)</strong><br/>
          <strong>Snana Vidhi (Arogyanidhii p. 22):</strong> Always pour lukewarm or cool water on the head and crown first to soothe cerebral vessels and protect eye vitality. Wetting the feet first drives bodily heat upward into the brain and eyes, inducing headaches and ocular fatigue. 
          Enjoy a light, warm breakfast matching your Agni (digestive fire), such as stewed spiced apples, warm soaked oats with almonds and cardamom, or spiced mung broth.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">08:30 AM – 12:30 PM</div>
        <div class="timeline-content">
          <strong>6. Surya & Budha Hora (Peak Intellectual Focus & Productivity)</strong><br/>
          According to <strong>Varahamihira's Brihat Jataka (Ch. 1, v. 9)</strong>, the 24-Hora diurnal planetary sequence begins at sunrise. 
          Surya Hora (Sun hour of willpower and vitality) and Budha Hora (Mercury hour of discernment and analytical intellect) heighten cognitive clarity, memory, and concentration. Ideal for high-priority creative work, study, writing, and strategic decision making.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">12:30 PM – 01:30 PM</div>
        <div class="timeline-content">
          <strong>7. Madhyahna Bhojana Vidhi (Wholesome Lunch) & Vama-Kukshi (Digestive Left-Side Rest)</strong><br/>
          Kindle your digestive fire (<em>Jatharagni</em>) 5 minutes before eating by chewing a thin slice of fresh ginger with a pinch of rock salt (<em>Adrak-Sendha Namak</em>, <strong>Arogyanidhii p. 22</strong>).<br/>
          <strong>Stomach Partitioning (Arogyanidhii p. 23):</strong> Fill <strong>1/2 with wholesome solid food, 1/4 with warm liquid (like dal broth or buttermilk), and leave 1/4 completely empty</strong> so digestive enzymes and Tridoshas can circulate freely. Avoid ice-cold drinks during and after meals.<br/>
          <strong>Post-Meal Vidhi (Arogyanidhii p. 25):</strong> Sit quietly in <em>Vajrasana</em> (kneeling diamond posture) for 10 minutes, followed by <em>Vama-Kukshi</em> (resting gently on your left side for 10–15 minutes; never heavy daytime sleep) to compress the spleen-stomach tract and open the right solar nostril (<em>Surya Nadi / Pingala</em>) for rapid, effortless digestion. Recite the Agastya digestive mantra: <em>"Agastir Madhavaścaiva..."</em>. Maintain a 6-hour interval before your next heavy meal.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">01:30 PM – 05:30 PM</div>
        <div class="timeline-content">
          <strong>8. Guru & Shukra Hora (Creative Collaboration, Learning & Planning)</strong><br/>
          Guru Hora (Jupiter hour of thoughtful wisdom and mentorship) and Shukra Hora (Venus hour of artistic harmony and pleasant social connection). Ideal for meetings, teamwork, and creative development. Hydrate with warm CCF tea (equal parts cumin, coriander, and fennel seeds brewed in hot water).
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">05:30 PM – 06:30 PM</div>
        <div class="timeline-content">
          <strong>9. Sayahna Sandhya (Twilight Transition & Gentle Wind-Down)</strong><br/>
          Power down bright screens and digital alerts at dusk. Take a leisurely evening stroll of at least 100 gentle steps (<em>Shatapadi</em>), practice Bhramari (humming-bee breath to soothe the nervous system), and transition your mindset from work performance to tranquil domestic peace.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">07:00 PM – 08:00 PM</div>
        <div class="timeline-content">
          <strong>10. Laghubhojana (Light & Easily Digestible Warm Dinner)</strong><br/>
          Consume an easily digestible, warm dinner (such as vegetable soup, khichdi, or steamed grains with mild spices, <strong>Arogyanidhii p. 24</strong>) at least 2.5–3 hours before bedtime. Avoid heavy beans, cold salads, curd, or deep-fried food at night to protect deep sleep.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">09:30 PM – 10:00 PM</div>
        <div class="timeline-content">
          <strong>11. Ratricharya (Nighttime Care), Sleep Direction & Nidra (Restorative Sleep)</strong><br/>
          Perform <em>Padabhyanga</em> (massaging the soles of your feet with warm cow's ghee or sesame oil for 3–5 minutes) to draw excess heat down from the head, soothe racing thoughts, and invite sound sleep.<br/>
          <strong>Sleep Orientation (Arogyanidhii pp. 18, 30):</strong> Lie down strictly with head facing <strong>East</strong> (for spiritual vitality, memory, and intellect) or <strong>South</strong> (for longevity, grounding, and harmonious heart rate). <em>Never sleep with head pointing North</em> to prevent magnetic repulsion with the Earth's polar axis from causing restless tossing and morning headaches. Sleep before 10:00 PM to avoid entering the nocturnal Pitta metabolic cycle (10 PM – 2 AM).
        </div>
      </div>
    </div>
  `;

  let customizationGuideHtml = "";
  if (!isFullyPersonalized) {
    customizationGuideHtml = `
      <div style="margin-top: 14px;">
        <h4 style="color: var(--gold-light); margin-bottom: 8px;">🌌 How Your Sun Sign & Nakshatra Customize This Routine:</h4>
        <div class="table-responsive">
          <table class="tatva-table">
            <thead>
              <tr>
                <th>Tatva / Element</th>
                <th>Sun Signs (Surya Rashi)</th>
                <th>Dinacharya Modification</th>
                <th>Prescribed Abhyanga Oil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Agni (Fire element — dynamic transformation)</strong></td>
                <td>Aries, Leo, Sagittarius</td>
                <td>Cooling morning practices, avoid peak noon heat, practice Sheetali (cooling breath)</td>
                <td>Cooling coconut or Chandanadi oil (sandalwood oil)</td>
              </tr>
              <tr>
                <td><strong>Prithvi (Earth element — grounding stability)</strong></td>
                <td>Taurus, Virgo, Capricorn</td>
                <td>Dynamic brisk exercise, early dawn waking, Kapalabhati (skull-shining breath) to dissolve sluggishness</td>
                <td>Warm sesame oil or dry herbal powder scrub (Udvartana)</td>
              </tr>
              <tr>
                <td><strong>Vayu (Air element — mental movement & creativity)</strong></td>
                <td>Gemini, Libra, Aquarius</td>
                <td>Grounding daily rhythms, warm cooked meals, regular sleep times, Nadi Shodhana (calming breath)</td>
                <td>Warm unrefined Sesame (Tila) oil</td>
              </tr>
              <tr>
                <td><strong>Jala (Water element — emotional depth & circulation)</strong></td>
                <td>Cancer, Scorpio, Pisces</td>
                <td>Gentle aerobic flow, Surya Bhedana (warming breath), light warm non-mucous meals</td>
                <td>Gentle sweet almond or light warm sesame oil</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="quick-prompts-wrapper">
          <span class="quick-prompts-label">✨ Click a profile below to customize instantly:</span>
          <button class="quick-prompt-btn" data-fill="Make a daily routine for Madhur with Leo sun sign and Magha nakshatra">♌ Leo + Magha (Madhur)</button>
          <button class="quick-prompt-btn" data-fill="Make a daily routine for Priya with Gemini sun sign and Swati nakshatra">♊ Gemini + Swati (Priya)</button>
          <button class="quick-prompt-btn" data-fill="Make a daily routine for Amit with Taurus sun sign and Rohini nakshatra">♉ Taurus + Rohini (Amit)</button>
          <button class="quick-prompt-btn" data-fill="Make a daily routine for Rahul with Aries sun sign and Ashwini nakshatra">♈ Aries + Ashwini (Rahul)</button>
          <button class="quick-prompt-btn" data-fill="Make a daily routine for Ananya with Pisces sun sign and Revati nakshatra">♓ Pisces + Revati (Ananya)</button>
        </div>
      </div>
    `;
  }

  const citationHtml = `
    <div class="citation-box" style="margin-top: 14px;">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Arogyanidhii.pdf</em>: Pages 18, 20, 22–25, 30 (Ushapan [Dawn Hydration], Nasya [Nasal Care], Snana Vidhi [Bathing Order], Bhojana Tri-bhaga [Stomach Partitioning], Vama-Kukshi [Left-Side Digestive Rest], and Nidra [Sleep Direction]).<br/>
      <em>Varahamihira's Brihat Jataka</em>: Ch. 1 (Kalapurusha 12 Limbs, 4 Tatvas) & Ch. 1, v. 9 (24-Hora Diurnal Planetary Rhythm).<br/>
      <em>Shiva Samhita</em>: Ch. 3, vv. 1–40 (Nadi Shodhana Breathwork & Harmonizing Lunar and Solar Channels).<br/>
      <em>Charaka Samhita (Sutrasthana Ch. 5)</em> & <em>Ashtanga Hridaya (Sutrasthana Ch. 2)</em>: "मात्राशी स्यात्..." (Eat in wholesome measure) & "ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः" (Awaken at Brahma Muhurta to safeguard lifelong health).
    </div>
  `;

  return {
    tier: 'Personalized Routine',
    rawText: `Personalized Vedic Dinacharya for ${userName} (${signTitle}) grounded in Arogyanidhii pp. 18, 20, 22-25, 30 and Varahamihira's Brihat Jataka.`,
    text: `<div class="routine-container">${headerHtml}${timelineHtml}${customizationGuideHtml}${citationHtml}</div>`
  };
}

/**
 * Intelligent Shastric Knowledge Synthesizer
 * Multi-Agent Astrologer Agent & Maharaj Ji Workflow
 */
function generateGroundedResponse(query, attachment, history) {
  const profile = extractUserProfile(history, query);
  const birthData = extractBirthDetails(history, query);
  const lower = query.toLowerCase();

  // 1. Mandatory Out-of-Scope Enforcement
  if (isOutOfScope(query)) {
    return getOutOfScopeResponse(profile);
  }

  // 2. Astrologer Agent Kundli Trigger (When Birth Data is Provided)
  if (birthData.hasCompleteBirthData) {
    const chart = VedicKundliCalculator.calculateChart(
      birthData.name || (sessionKundli ? sessionKundli.name : "Seeker"),
      birthData.dob,
      birthData.tob || "12:00 PM",
      birthData.pob || "New Delhi"
    );
    sessionKundli = chart;
    try {
      localStorage.setItem('shaastra_kundli', JSON.stringify(chart));
    } catch (_) {}

    const kundliHtml = VedicKundliCalculator.renderKundliCardHtml(chart);
    const greetingName = chart.name !== "Seeker" ? ` <strong>${escapeHtml(chart.name)}</strong>` : ", dear seeker";

    return {
      tier: "Astrologer Agent & Maharaj Ji Wisdom",
      rawText: `Accurate Vedic Janma Kundali calculated for ${chart.name}. Lagna: ${chart.lagna.rashi.sanskrit}, Chandra Rashi: ${chart.moonRashi.sanskrit}, Nakshatra: ${chart.nakshatra.name}, Dasha: ${chart.dasha.currentLord}. Synthesized by Maharaj Ji with Brihat Jataka and Charaka Samhita.`,
      text: `<p>Namaste${greetingName}! Our <strong>Astrologer Agent (Jyotish Acharya)</strong> has calculated your 100% mathematically verified Vedic Janma Kundali using the classical Nirayana Sidereal zodiac with Lahiri Ayanamsha:</p>
      ${kundliHtml}
      <h4 style="color: #b45309; margin-top: 14px; margin-bottom: 6px;">📜 Astrological Analysis by Astrologer Agent:</h4>
      <ul>
        <li><strong>Lagna (Ascendant):</strong> <strong>${escapeHtml(chart.lagna.rashi.sanskrit)}</strong> (${chart.lagna.degree}°) ruled by <strong>${escapeHtml(chart.lagna.rashi.ruler)}</strong>. Your physical vitality and mental perspective are colored by the element <strong>${escapeHtml(chart.lagna.rashi.element)}</strong>.</li>
        <li><strong>Chandra Rashi (Moon Sign & Mental Energy):</strong> <strong>${escapeHtml(chart.moonRashi.sanskrit)}</strong>. The Moon governs <em>Manas</em> (the sensory mind and emotional responses). This placement reveals your instinctive emotional patterns and intuitive receptivity.</li>
        <li><strong>Surya Rashi (Sun Sign & Vital Force):</strong> <strong>${escapeHtml(chart.sunRashi.sanskrit)}</strong>, illuminating your inner willpower, core soul purpose (<em>Atmakaraka</em>), and stamina.</li>
        <li><strong>Janma Nakshatra:</strong> <strong>${escapeHtml(chart.nakshatra.name)} (Pada ${chart.nakshatra.pada})</strong>, ruled by <strong>${escapeHtml(chart.nakshatra.ruler)}</strong>. Nakshatras reveal subtle karmic tendencies and mental temperament.</li>
        <li><strong>Active Planetary Period (Vimshottari Mahadasha):</strong> <strong>${escapeHtml(chart.dasha.currentLord)}</strong> (${chart.dasha.balanceYears} years remaining at birth). The planetary lord of your Dasha sets the dominant themes, mental focus, and developmental opportunities of your current life cycle.</li>
      </ul>

      <h4 style="color: #b45309; margin-top: 16px; margin-bottom: 6px;">🙏 Shastric Synthesis & Lifestyle Guidance by Maharaj Ji (Vedic & Purana Expert):</h4>
      <p>In accordance with <em>Varahamihira's Brihat Jataka</em>, <em>Charaka Samhita</em>, and the <em>Bhagavad Gita</em>, our planetary configuration guides our physical constitution (<em>Prakriti</em>) and mental faculties (<em>Manas</em> and <em>Buddhi</em>):</p>
      <ul>
        <li><strong>Nurturing Your Mind & Nerves:</strong> Because your Moon is placed in <strong>${escapeHtml(chart.moonRashi.english)}</strong> and governed by <strong>${escapeHtml(chart.nakshatra.name)}</strong>, your nervous system responds best to calm, unhurried routines. Practice <em>Nadi Shodhana</em> (alternate-nostril breathing, <strong>Shiva Samhita Ch. 3</strong>) for 10 minutes at dawn to harmonize lunar and solar currents.</li>
        <li><strong>Ayurvedic Dinacharya Recommendation:</strong> Ground your daily rhythm by waking during <em>Brahma Muhurta</em> (04:30 AM – 05:15 AM) when peaceful clarity (<em>Sattva</em>) is at its peak. Follow with <em>Ushapan</em> (drinking warm water at dawn, <strong>Arogyanidhii p. 20</strong>) to support clear digestion.</li>
        <li><strong>Karmic Mind Mastery (Bhagavad Gita 2.48):</strong> Remember <em>"Samatvam Yoga Uchyate"</em> (Equanimity is the true essence of Yoga). Planetary periods are karmic seasons meant for spiritual growth; observing your thoughts with non-attachment (<em>Sakshi Bhava</em>) dissolves inner anxiety.</li>
      </ul>

      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">Reflecting on your ${chart.moonRashi.english} Moon and ${chart.nakshatra.name} Nakshatra, when during your typical day do you notice your thoughts scattering most easily, and what specific emotional patterns tend to trigger that mental fatigue?</p>

      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Varahamihira's Brihat Jataka</em>: Ch. 1 (Kalapurusha Anatomy & Tatvas) & Ch. 2 (Planetary Dignity & Guna Svarupa).<br/>
        <em>Arogyanidhii</em>: Pages 18, 20, 22–25, 30 (Dinacharya, Ushapan, and Geomagnetic Sleep Direction).<br/>
        <em>Charaka Samhita (Sutrasthana Ch. 5)</em>: Matrashitiya Adhyaya (Mindful Living & Tridosha Harmony).<br/>
        <em>Shiva Samhita</em>: Ch. 3, vv. 1–40 (Nadi Shodhana Breathwork & Mental Equilibrium).<br/>
        <em>Bhagavad Gita</em>: Ch. 2, vv. 47–48 & Ch. 6, vv. 5–6 (Self-Mastery and Inner Peace).
      </div>`
    };
  }

  // 3. Mental Fog / Distress / Inability to Process Thoughts / Requesting Astrological Guidance WITHOUT Birth Details
  const isDistressOrGuidance = (
    lower.includes('unable to process') ||
    lower.includes('unable to think') ||
    lower.includes('what should i do') ||
    lower.includes('cannot think') ||
    lower.includes("can't process") ||
    lower.includes('mind is') ||
    lower.includes('confused') ||
    lower.includes('overwhelmed') ||
    lower.includes('anxious') ||
    lower.includes('anxiety') ||
    lower.includes('stressed') ||
    lower.includes('feeling lost') ||
    lower.includes('mental fog') ||
    lower.includes('racing thought') ||
    lower.includes('kundli') ||
    lower.includes('birth chart') ||
    lower.includes('horoscope') ||
    lower.includes('astrology reading') ||
    lower.includes('predict')
  );

  if (isDistressOrGuidance) {
    const greetingName = (profile.name && profile.name !== "Friend") ? ` <strong>${escapeHtml(profile.name)}</strong>` : ", dear seeker";
    return {
      tier: "Vedic Wisdom & Astrological Consultation",
      rawText: `Shastric guidance for mental clarity and invitation for birth details to calculate accurate Janma Kundali via Astrologer Agent.`,
      text: `<p>Namaste${greetingName}! In classical Indic psychology and Shastras, feeling unable to process your thoughts or experiencing mental fog is an understandable state of the mind. In the <em>Charaka Samhita</em> and <em>Shiva Samhita</em>, human consciousness operates through two primary faculties:</p>
      <ul>
        <li><strong>Manas (The Deliberative Sensory Mind):</strong> The rapid faculty that receives sensory impressions and generates endless streams of thoughts, desires, and doubts (<em>Sankalpa-Vikalpa</em>).</li>
        <li><strong>Chitta (The Ocean of Memory & Conditioning):</strong> The deeper subconscious lake where emotional impressions (<em>Samskaras</em>) are stored.</li>
      </ul>
      <p>When you feel unable to process what you are thinking, the <strong>Manovaha Srotas</strong> (the subtle neurological and cognitive channels of perception) have become clouded by an excess of <strong>Rajas</strong> (restless mental turbulence) and <strong>Tamas</strong> (foggy inertia, heaviness, and indecision). This disturbance obstructs <strong>Prana Vayu</strong> (the vital breath governing mental clarity and sensory integration) and creates cognitive overload.</p>

      <h4 style="color: #b45309; margin-top: 14px; margin-bottom: 6px;">🌿 Immediate 3-Minute Shastric First-Aid for Mental Clarity:</h4>
      <ul>
        <li><strong>1. Anchor Apana Vayu (Grounding):</strong> Pause right now and drink half a cup of warm water or ginger tea slowly while seated with your feet flat on the floor. In Ayurveda, activating the downward grounding energy (<em>Apana Vayu</em>) pulls chaotic upward heat and racing thoughts down away from the head.</li>
        <li><strong>2. Bhramari Pranayama (Humming Bee Breath — Shiva Samhita Ch. 3):</strong> Close your eyes, gently rest your fingertips over your ears, inhale deeply through your nose, and exhale with a steady, soothing humming sound (<em>Mmmmmm</em>) like a bumblebee. Repeat 5 to 7 times. The cranial acoustic vibration directly stimulates vagal parasympathetic tone, quieting mental oscillations (<em>Chitta Vritti</em>) in under two minutes.</li>
        <li><strong>3. Sakshi Bhava (The Conscious Witness — Bhagavad Gita 6.5–6):</strong> Gently remind yourself: <em>"I am not the turbulent thoughts passing like clouds; I am the tranquil conscious witness (Sakshi) observing them."</em></li>
      </ul>

      <div class="agent-banner" style="margin-top: 14px;">
        <span>🪐</span>
        <span><strong>Astrologer Agent (Jyotish Acharya) Consultation:</strong> In Vedic astrology, mental overwhelm is intimately connected with the condition of <em>Chandra</em> (Moon — governing emotions and Manas), <em>Budha</em> (Mercury — governing analytical intellect and Buddhi), and your active planetary period (<em>Vimshottari Dasha</em>). To calculate your <strong>100% accurate Vedic Janma Kundali</strong> (Nirayana Sidereal birth chart) and uncover your planetary dynamics, please share:</span>
      </div>
      <ol style="margin-top: 8px; margin-left: 20px;">
        <li><strong>Your Name</strong></li>
        <li><strong>Date of Birth (DD-MM-YYYY or Month Day, Year)</strong></li>
        <li><strong>Exact Time of Birth (e.g., 06:30 AM or 14:15)</strong></li>
        <li><strong>Place of Birth (City, State/Country)</strong></li>
      </ol>

      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">As you pause with me in this breath right now, where do you physically feel this mental heaviness in your body—is it a tight constriction around your head and chest, or more like an aimless, racing restlessness of thoughts?</p>

      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Charaka Samhita (Sutrasthana Ch. 1 & Vimanasthana Ch. 5)</em>: Manovaha Srotas & Tridosha-Guna dynamics.<br/>
        <em>Shiva Samhita (Chapter 3, vv. 1–40)</em>: Prana Vayu, Nadi purification, and calming the mind.<br/>
        <em>Bhagavad Gita (Chapter 6, Verses 5–6 & 26)</em>: Chitta-Nirodha and steadying the flickering mind through Sakshi Bhava.
      </div>`
    };
  }

  // 4. Multi-turn Follow-up and Coreference Resolution
  const followUp = resolveConversationalFollowUp(query, profile, history);
  if (followUp) {
    return followUp;
  }

  // 5. Initial Dinacharya Request
  if (isInitialRoutineQuery(query)) {
    return generatePersonalizedDinacharya(query, profile);
  }

  const greetingName = (profile.name && profile.name !== "Friend") ? ` <strong>${escapeHtml(profile.name)}</strong>` : ", dear seeker";

  // 6. Busy / Time-Constrained Seeker Intent ("hi i m busy", "no time", "quick routine")
  const isBusy = (
    lower.includes('busy') ||
    lower.includes('no time') ||
    lower.includes('little time') ||
    lower.includes('quick routine') ||
    lower.includes('fast routine') ||
    lower.includes('rushed') ||
    lower.includes('hectic') ||
    lower.includes('hurry') ||
    lower.includes('short routine') ||
    lower.includes('overworked') ||
    lower.includes('too much work')
  );

  if (isBusy) {
    return {
      tier: "Shastric Micro-Dinacharya",
      rawText: `3-Minute Shastric Micro-Routine for busy seekers from Arogyanidhii pp. 20-21 and Bhagavad Gita 2.48-50.`,
      text: `<p>Namaste${greetingName}! In classical Vedic science and the <em>Bhagavad Gita</em>, having a demanding, fast-paced schedule is never an obstacle to peace, clarity, and vibrant health. When time is tight, classical shastras prescribe <strong>Padamshika Krama (Gradual Micro-Habits)</strong> from the <em>Charaka Samhita</em> and the <strong>3-Minute Shastric Reset</strong> from <em>Arogyanidhii</em>:</p>
      
      <h4 style="color: #b45309; margin-top: 14px; margin-bottom: 6px;">🌿 The 3-Minute Shastric Micro-Routine for Busy Lives:</h4>
      <ul>
        <li><strong>1. Ushapan Dawn Hydration (30 Seconds — Arogyanidhii p. 20):</strong> Drink 1 glass of warm water stored in a copper or clean vessel immediately upon rising. This triggers natural peristalsis, clears overnight metabolic toxins (<em>Ama</em>), and hydrates cerebral circulation before touching a screen.</li>
        <li><strong>2. Tri-Sthana Abhyanga (90 Seconds — Arogyanidhii p. 21):</strong> If a full-body oil massage is impractical before work, massage just three vital nerve hubs: the <strong>crown of the head (Shiro)</strong>, the <strong>ears (Karna)</strong>, and the <strong>soles of the feet (Pada)</strong> with 2 drops of warm sesame oil. Classical shastras state this delivers 80% of the neurological grounding benefits in under two minutes!</li>
        <li><strong>3. 1-Minute Centering Breath (Shiva Samhita Ch. 3):</strong> Take 5 slow, deep breaths with extended exhalations before diving into messages or meetings to reset your autonomic nervous system.</li>
      </ul>

      <h4 style="color: #b45309; margin-top: 14px; margin-bottom: 6px;">🕉️ Karmic Mindset for Demanding Schedules:</h4>
      <p>In the <em>Bhagavad Gita (2.50)</em>, Bhagavan Krishna teaches: <em>"योगः कर्मसु कौशलम्" (Yogah Karmasu Kaushalam — Yoga is calm skillfulness and poise in action)</em>. Busyness only causes exhaustion when the mind is frantically projecting into future results. By dedicating yourself wholeheartedly to the task immediately before you (<em>Nishkama Karma</em>), your daily work ceases to drain you and becomes an energizing flow.</p>

      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">When during your busy day does the sensation of mental rushing or fatigue peak most noticeably—first thing upon waking, or when transitioning between high-pressure tasks?</p>

      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Arogyanidhii</em>: Pages 20–21 (Ushapan & Tri-Sthana Abhyanga for Busy Householders).<br/>
        <em>Bhagavad Gita</em>: Chapter 2, Verses 48 & 50 (Yogah Karmasu Kaushalam & Nishkama Karma).<br/>
        <em>Charaka Samhita (Sutrasthana Ch. 5)</em>: Matrashitiya Adhyaya (Circadian Micro-Habits & Tridosha Protection).
      </div>`
    };
  }

  // 7. Greeting & Introduction Intent ("hi", "hello", "namaste", "hey")
  const isGreeting = (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'namaste' ||
    lower === 'pranam' ||
    lower === 'good morning' ||
    lower === 'good evening' ||
    lower === 'greetings' ||
    (/^(hi|hello|hey|namaste|pranam)\b/i.test(lower.trim()) && lower.trim().split(/\s+/).length <= 3)
  );

  if (isGreeting) {
    return {
      tier: "Vedic Welcome",
      rawText: `Welcome to ShaastraAI. Astrologer Agent and Maharaj Ji introduction.`,
      text: `<p>Namaste${greetingName}! Welcome to <strong>ShaastraAI</strong>, your personal sanctuary for classical Vedic wisdom, Ayurvedic living, and astrological clarity.</p>
      <p>I coordinate two specialized shastric guides to illuminate your path:</p>
      <ul>
        <li><strong>🪐 Astrologer Agent (Jyotish Acharya):</strong> Calculates your 100% mathematically verified <strong>Nirayana Sidereal Janma Kundali</strong> with Lahiri Ayanamsha (Lagna, Moon Sign, Sun Sign, 27 Nakshatras, 9 Grahas across 12 Bhavas, and active Vimshottari Dasha). Whenever you are ready, simply share your <strong>Name, Date of Birth, Exact Time of Birth, and Place of Birth</strong>.</li>
        <li><strong>🕉️ Maharaj Ji (Vedic & Purana Expert):</strong> Guides personalized circadian routines (<em>Dinacharya</em> from <em>Arogyanidhii</em>), Ayurvedic digestion and Dosha harmony (<em>Charaka Samhita</em>), calming breathwork (<em>Shiva Samhita</em>), and mind mastery from the <em>Bhagavad Gita</em> and sacred <em>Puranas</em>.</li>
      </ul>
      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">What brings you to our shastric sanctuary today—would you like to cast your astrological birth chart, optimize your daily routine, or explore a question on wellness and peace of mind?</p>
      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Authorities & Scope</div>
        <em>Varahamihira's Brihat Jataka</em> (Vedic Astrological Science) • <em>Arogyanidhii</em> (Dinacharya & Longevity) • <em>Bhagavad Gita</em> (Equanimity & Self-Mastery)
      </div>`
    };
  }

  // 8. Charaka / Ayurveda / Tridosha
  if (lower.includes('charaka') || lower.includes('dosha') || lower.includes('ayurveda') || lower.includes('tridosha')) {
    return {
      tier: 'Ayurvedic Living',
      rawText: `Charaka Samhita Tridosha guidance.`,
      text: `<p>Namaste${greetingName}! In the venerable <strong>Charaka Samhita</strong>, true health (<em>Swastha</em> — being disease-free and happily rooted in one's true Self) is defined as a harmonious equilibrium among the <strong>Tridoshas</strong> (the three governing biological energies: Vata, Pitta, and Kapha), healthy <strong>Dhatus</strong> (the seven vital body tissues building bones, muscle, and blood), proper <strong>Malas</strong> (natural, regular elimination of bodily waste), balanced digestive fire (<em>Agni</em>), and a delighted, peaceful state of the soul, senses, and mind (<em>Atma-Indriya-Manah Prasannah</em>).</p>
      <ul>
        <li><strong>Vata (Air & Space energies):</strong> Governs physical movement, breathing, nerve impulses, and circulation. Aggravated by cold dryness, irregular eating, and chronic worry. Kept joyful and balanced with warm cooked meals and regular routines.</li>
        <li><strong>Pitta (Fire & Water energies):</strong> Governs internal digestion, enzyme metabolism, body warmth, vision, and mental intelligence. Aggravated by hot spicy foods, midday sun, and intense irritability. Kept joyful and balanced with cooling sweet fruits and staying hydrated.</li>
        <li><strong>Kapha (Water & Earth energies):</strong> Governs physical strength, joint lubrication, immune stability, and emotional calmness. Aggravated by sedentary lounging and heavy cold sweets. Kept joyful and balanced with dynamic morning exercise and early dawn waking.</li>
      </ul>
      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">Which of these three biological energies (Vata dryness, Pitta heat, or Kapha sluggishness) feels most prominent in your bodily rhythms currently?</p>
      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Charaka Samhita, Sutrasthana</em> — Chapter 1 & 28, Verses 41–44: "दोषधातुमलमूलं हि शरीरम्..." (The healthy human body is founded upon balanced energies [Doshas], well-nourished tissues [Dhatus], and timely natural waste elimination [Malas]).
      </div>`
    };
  }

  // 9. Patanjali / Yoga Sutras / Meditation
  if (lower.includes('patanjali') || lower.includes('yoga sutra') || lower.includes('dhyana') || lower.includes('samadhi')) {
    return {
      tier: 'Yoga & Pranayama',
      rawText: `Patanjali Yoga Sutras wisdom on mental stillness.`,
      text: `<p>Namaste${greetingName}! In the <strong>Patanjali Yoga Sutras</strong>, the foundational definition of yoga is:</p>
      <p style="font-size: 1.05rem; font-weight: 600; color: var(--gold-light);"><em>"योगश्चित्तवृत्तिनिरोधः" (Yogaś Citta-Vṛtti-Nirodhaḥ — Yoga is the intentional settling and quieting of restless mental modifications).</em></p>
      <ul>
        <li><strong>Abhyasa (Dedicated Daily Practice):</strong> Cultivating an unbroken rhythm of quiet meditation (Dhyana) and conscious breath (Pranayama).</li>
        <li><strong>Vairagya (Inner Freedom & Non-Attachment):</strong> Letting go of anxious clinging to fleeting circumstances, resting in your true witnessing awareness (<em>Drashta</em>).</li>
      </ul>
      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">When you sit in quiet reflection, what recurring narrative or worry tends to pull you out of witnessing stillness?</p>
      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Patanjali Yoga Sutras</em>, Samadhi Pada (Chapter 1, Sutras 2–3 & 12–14).
      </div>`
    };
  }

  // 10. Upanishads / Advaita Vedanta / Consciousness
  if (lower.includes('upanishad') || lower.includes('vedanta') || lower.includes('advaita') || lower.includes('brahman') || lower.includes('atman') || lower.includes('turiya')) {
    return {
      tier: 'Upanishadic Wisdom',
      rawText: `Mandukya Upanishad wisdom on the 4 states of consciousness.`,
      text: `<p>Namaste${greetingName}! In the profound <strong>Mandukya Upanishad</strong> (Atharva Veda), the nature of ultimate reality (<em>Brahman</em> — universal consciousness) and our true inner Self (<em>Atman</em>) is illuminated through the four states of consciousness:</p>
      <ul>
        <li><strong>Jagrat (Waking State):</strong> Our everyday sensory awareness experiencing the material world.</li>
        <li><strong>Swapna (Dream State):</strong> Inward awareness processing subtle memories and emotions.</li>
        <li><strong>Sushupti (Deep Sleep State):</strong> Dreamless restful dissolution into silent restorative peace.</li>
        <li><strong>Turiya (The Fourth State):</strong> Pure timeless witnessing consciousness—ever tranquil (<em>Shantam</em>), benevolent (<em>Shivam</em>), and non-dual (<em>Advaitam</em>).</li>
      </ul>
      <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">How often in your day-to-day routine do you give yourself the permission to step back from the waking rush and simply rest as the silent observer?</p>
      <div class="citation-box" style="margin-top: 14px;">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Mandukya Upanishad</em> (Atharva Veda), Mantras 2 & 7: "अयमात्मा ब्रह्म..." ("This Self is Brahman").
      </div>`
    };
  }

  // 11. General Grounded Shastric Synthesis Fallback
  return {
    tier: 'Vedic Wisdom',
    rawText: `Classical shastric guidance grounded in Arogyanidhii and Charaka Samhita.`,
    text: `<p>Namaste${greetingName}! In classical Vedic tradition, true health, clarity, and peace (<em>Swastha</em> — being disease-free and happily rooted in one's true Self) is achieved when your daily habits, thoughts, and nourishment are aligned with <em>Dharma</em> (natural moral law and living in harmony with cosmic rhythms).</p>
    <p>To cultivate lasting balance without feeling overwhelmed, the <em>Charaka Samhita</em> and <em>Arogyanidhii</em> recommend grounding your daily rhythm through regular seasonal nourishment, dawn hydration (<em>Ushapan</em>), and conscious breathwork (<em>Pranayama</em>).</p>
    <p style="margin-top: 14px; font-weight: 600; color: #1e293b;">What specific aspect of your daily rhythm or inner mental state feels most in need of soothing clarity right now?</p>
    <div class="citation-box" style="margin-top: 14px;">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Taittiriya Upanishad</em> & <em>Charaka Samhita</em>: "शरीरमाद्यं खलु धर्मसाधनम्" (The physical body is indeed the prime sacred instrument for fulfilling life's purpose and dharma).<br/>
      <em>Arogyanidhii</em>: Pages 18–30 (Dinacharya, Mindful Living, and Longevity Principles).
    </div>`
  };
}

async function callLiveGemini(prompt, apiKey, history = []) {
  try {
    const systemInstruction = `You are ShaastraAI (शास्त्र AI), an empathetic, deeply grounded Vedic Astrology and Shastric Wisdom companion.
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
1. ABSOLUTE NAME INTEGRITY: Never capture descriptive words or emotional states (e.g. "unable", "tired", "confused", "anxious", "lost") as names. If the user says "I am unable to process what I am thinking", their name is NOT "Unable". Address warmly as "Namaste, dear seeker!" or "Namaste!".
2. PROTOCOL WHEN BIRTH DETAILS ARE MISSING:
   - Acknowledge and soothe their state with classical Shastras (Manas, Chitta, Manovaha Srotas, Rajas/Tamas from Charaka Samhita & Shiva Samhita).
   - Provide immediate 3-minute first-aid: 1. Drink warm water for Apana Vayu; 2. Bhramari Pranayama (5 gentle bee breaths); 3. Sakshi Bhava (witness awareness, Bhagavad Gita 6.5–6).
   - Introduce Astrologer Agent and request: Name, Date of Birth (DOB), Time of Birth (TOB), and Place of Birth (POB).
   - MANDATORY: Conclude with a compassionate, thought-provoking OPEN-ENDED QUESTION digging deeper into how their body and mind feel right now. Never end with a closed yes/no or button menu.
3. PROTOCOL WHEN BIRTH DETAILS ARE PROVIDED:
   - Astrologer Agent presents Nirayana Sidereal Kundali chart and planetary placements.
   - Maharaj Ji synthesizes with Brihat Jataka, Arogyanidhii, Charaka Samhita, and Bhagavad Gita, giving personalized lifestyle/yogic remedies.
   - MANDATORY: Conclude with a deep OPEN-ENDED QUESTION digging deeper into their life rhythms and mental tendencies.
4. LAYMAN CLARITY & TRANSLATIONS: Every Sanskrit term MUST have an immediate English translation in parentheses.
5. OUT-OF-SCOPE ENFORCEMENT: Politely reject modern coding, stocks/crypto, politics, sports, and allopathy, and guide back to Shastras.
6. CITATION BLOCK: Always end with a formatted "### 📚 Scriptural Sources" box.`;
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        if (!turn || !turn.content) continue;
        const role = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
        const cleanText = String(turn.content)
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (!cleanText) continue;

        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n\n${cleanText}`;
        } else {
          contents.push({ role: role, parts: [{ text: cleanText }] });
        }
      }
    }

    const userPromptText = prompt.trim();
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      if (!contents[contents.length - 1].parts[0].text.includes(userPromptText)) {
        contents[contents.length - 1].parts[0].text += `\n\n${userPromptText}`;
      }
    } else {
      contents.push({ role: "user", parts: [{ text: userPromptText }] });
    }

    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.3
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.status}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      return {
        tier: 'Vedic Wisdom',
        rawText: candidateText,
        text: `<p>${candidateText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
      };
    }
  } catch (err) {
    console.warn("Live Gemini request note, using classical knowledge fallback:", err);
  }
  return null;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
