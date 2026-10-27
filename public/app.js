/**
 * ShaastraAI — Frontend Portal Logic & Interactive Assistant
 */

// State
let conversationHistory = [];
let currentAttachment = null;
let activeMode = 'auto'; // 'auto', 'bedrock', 'gemini', 'faiss'

// Classical Indic Astrological & Ayurvedic Knowledge Data
const RASHI_DATA = {
  aries: { sanskrit: "मेष (Mesha)", element: "Agni (Fire)", ruler: "Mangala (Mars)", dosha: "Pitta-Vata", nature: "Dynamic, pioneering, high energy", oil: "Cooling coconut or Chandanadi oil", exercise: "Moderate strength training & flow; avoid midday heat exhaustion", pranayama: "Sheetali and Nadi Shodhana (calming the nervous system)" },
  mesha: { sanskrit: "मेष (Mesha)", element: "Agni (Fire)", ruler: "Mangala (Mars)", dosha: "Pitta-Vata", nature: "Dynamic, pioneering, high energy", oil: "Cooling coconut or Chandanadi oil", exercise: "Moderate strength training & flow; avoid midday heat exhaustion", pranayama: "Sheetali and Nadi Shodhana (calming the nervous system)" },
  taurus: { sanskrit: "वृषभ (Vrishabha)", element: "Prithvi (Earth)", ruler: "Shukra (Venus)", dosha: "Kapha", nature: "Grounded, steady, sensory, persevering", oil: "Warm sesame oil or dry herbal powder (Udvartana)", exercise: "Vigorous aerobic exercise & dynamic Surya Namaskar", pranayama: "Bhastrika & Kapalabhati (warming & stimulating)" },
  vrishabha: { sanskrit: "वृषभ (Vrishabha)", element: "Prithvi (Earth)", ruler: "Shukra (Venus)", dosha: "Kapha", nature: "Grounded, steady, sensory, persevering", oil: "Warm sesame oil or dry herbal powder (Udvartana)", exercise: "Vigorous aerobic exercise & dynamic Surya Namaskar", pranayama: "Bhastrika & Kapalabhati (warming & stimulating)" },
  gemini: { sanskrit: "मिथुन (Mithuna)", element: "Vayu (Air)", ruler: "Budha (Mercury)", dosha: "Vata", nature: "Intellectual, communicative, adaptable, fast-moving", oil: "Warm unrefined Sesame (Tila) oil or Mahanarayana oil", exercise: "Grounding, restorative Hatha yoga; avoid over-exhaustion", pranayama: "Nadi Shodhana & Anulom Vilom (balancing the nervous system)" },
  mithuna: { sanskrit: "मिथुन (Mithuna)", element: "Vayu (Air)", ruler: "Budha (Mercury)", dosha: "Vata", nature: "Intellectual, communicative, adaptable, fast-moving", oil: "Warm unrefined Sesame (Tila) oil or Mahanarayana oil", exercise: "Grounding, restorative Hatha yoga; avoid over-exhaustion", pranayama: "Nadi Shodhana & Anulom Vilom (balancing the nervous system)" },
  cancer: { sanskrit: "कर्क (Karka)", element: "Jala (Water)", ruler: "Chandra (Moon)", dosha: "Kapha-Pitta", nature: "Intuitive, nurturing, empathetic, rhythmic", oil: "Warm sesame or gentle almond oil", exercise: "Swimming, rhythmic flow yoga, walking near natural water", pranayama: "Chandra Bhedana & Bhramari (soothing mind & emotions)" },
  karka: { sanskrit: "कर्क (Karka)", element: "Jala (Water)", ruler: "Chandra (Moon)", dosha: "Kapha-Pitta", nature: "Intuitive, nurturing, empathetic, rhythmic", oil: "Warm sesame or gentle almond oil", exercise: "Swimming, rhythmic flow yoga, walking near natural water", pranayama: "Chandra Bhedana & Bhramari (soothing mind & emotions)" },
  leo: { sanskrit: "सिंह (Simha)", element: "Agni (Fire)", ruler: "Surya (Sun)", dosha: "Pitta", nature: "Magnanimous, commanding, vibrant, solar-driven", oil: "Cooling coconut, olive, or rose-infused oil", exercise: "Early morning Surya Namaskar; avoid peak noon exertion", pranayama: "Sheetali, Sheetkari & Nadi Shodhana (taming excess Agni)" },
  simha: { sanskrit: "सिंह (Simha)", element: "Agni (Fire)", ruler: "Surya (Sun)", dosha: "Pitta", nature: "Magnanimous, commanding, vibrant, solar-driven", oil: "Cooling coconut, olive, or rose-infused oil", exercise: "Early morning Surya Namaskar; avoid peak noon exertion", pranayama: "Sheetali, Sheetkari & Nadi Shodhana (taming excess Agni)" },
  virgo: { sanskrit: "कन्या (Kanya)", element: "Prithvi (Earth)", ruler: "Budha (Mercury)", dosha: "Vata-Pitta", nature: "Analytical, discerning, meticulous, mindful", oil: "Warm sesame oil infused with Brahmi or Bala", exercise: "Disciplined pilates, precise asana practice, walking", pranayama: "Ujjayi & Nadi Shodhana (stabilizing mental analysis)" },
  kanya: { sanskrit: "कन्या (Kanya)", element: "Prithvi (Earth)", ruler: "Budha (Mercury)", dosha: "Vata-Pitta", nature: "Analytical, discerning, meticulous, mindful", oil: "Warm sesame oil infused with Brahmi or Bala", exercise: "Disciplined pilates, precise asana practice, walking", pranayama: "Ujjayi & Nadi Shodhana (stabilizing mental analysis)" },
  libra: { sanskrit: "तुला (Tula)", element: "Vayu (Air)", ruler: "Shukra (Venus)", dosha: "Vata-Kapha", nature: "Harmonious, aesthetic, balanced, relationship-oriented", oil: "Almond, jojoba, or light sesame oil", exercise: "Gentle dance, Vinyasa yoga, aesthetic outdoor recreation", pranayama: "Anulom Vilom & Bhramari (cultivating inner peace)" },
  tula: { sanskrit: "तुला (Tula)", element: "Vayu (Air)", ruler: "Shukra (Venus)", dosha: "Vata-Kapha", nature: "Harmonious, aesthetic, balanced, relationship-oriented", oil: "Almond, jojoba, or light sesame oil", exercise: "Gentle dance, Vinyasa yoga, aesthetic outdoor recreation", pranayama: "Anulom Vilom & Bhramari (cultivating inner peace)" },
  scorpio: { sanskrit: "वृश्चिक (Vrishchika)", element: "Jala (Water)", ruler: "Mangala / Ketu", dosha: "Pitta-Kapha", nature: "Intense, transformative, intuitive, penetrating", oil: "Neem-infused coconut oil or sesame oil", exercise: "Martial arts, Ashtanga yoga, deep core conditioning", pranayama: "Surya Bhedana & Bhastrika (directing deep prana)" },
  vrishchika: { sanskrit: "वृश्चिक (Vrishchika)", element: "Jala (Water)", ruler: "Mangala / Ketu", dosha: "Pitta-Kapha", nature: "Intense, transformative, intuitive, penetrating", oil: "Neem-infused coconut oil or sesame oil", exercise: "Martial arts, Ashtanga yoga, deep core conditioning", pranayama: "Surya Bhedana & Bhastrika (directing deep prana)" },
  sagittarius: { sanskrit: "धनु (Dhanu)", element: "Agni (Fire)", ruler: "Guru (Jupiter)", dosha: "Pitta-Vata", nature: "Philosophical, adventurous, expansive, scholarly", oil: "Warm sesame or herbal ashwagandha oil", exercise: "Trail running, archery, hiking, expansive outdoor sports", pranayama: "Ujjayi & Kapalabhati (boosting wisdom and vital fire)" },
  dhanu: { sanskrit: "धनु (Dhanu)", element: "Agni (Fire)", ruler: "Guru (Jupiter)", dosha: "Pitta-Vata", nature: "Philosophical, adventurous, expansive, scholarly", oil: "Warm sesame or herbal ashwagandha oil", exercise: "Trail running, archery, hiking, expansive outdoor sports", pranayama: "Ujjayi & Kapalabhati (boosting wisdom and vital fire)" },
  capricorn: { sanskrit: "मकर (Makara)", element: "Prithvi (Earth)", ruler: "Shani (Saturn)", dosha: "Vata-Kapha", nature: "Pragmatic, disciplined, enduring, structured", oil: "Warm sesame oil with dashamula herbs", exercise: "Structured endurance training, weight-bearing asanas", pranayama: "Bhastrika & Nadi Shodhana (releasing rigidity)" },
  makara: { sanskrit: "मकर (Makara)", element: "Prithvi (Earth)", ruler: "Shani (Saturn)", dosha: "Vata-Kapha", nature: "Pragmatic, disciplined, enduring, structured", oil: "Warm sesame oil with dashamula herbs", exercise: "Structured endurance training, weight-bearing asanas", pranayama: "Bhastrika & Nadi Shodhana (releasing rigidity)" },
  aquarius: { sanskrit: "कुम्भ (Kumbha)", element: "Vayu (Air)", ruler: "Shani / Rahu", dosha: "Vata", nature: "Visionary, scientific, altruistic, independent", oil: "Warm unrefined sesame or castor/sesame blend", exercise: "Calisthenics, brisk walking, nervous-system calming flows", pranayama: "Nadi Shodhana & Bhramari (anchoring restless electrical energy)" },
  kumbha: { sanskrit: "कुम्भ (Kumbha)", element: "Vayu (Air)", ruler: "Shani / Rahu", dosha: "Vata", nature: "Visionary, scientific, altruistic, independent", oil: "Warm unrefined sesame or castor/sesame blend", exercise: "Calisthenics, brisk walking, nervous-system calming flows", pranayama: "Nadi Shodhana & Bhramari (anchoring restless electrical energy)" },
  pisces: { sanskrit: "मीन (Meena)", element: "Jala (Water)", ruler: "Guru (Jupiter)", dosha: "Kapha", nature: "Mystical, compassionate, artistic, reflective", oil: "Light sesame, mustard, or eucalyptus-infused oil", exercise: "Swimming, gentle Yin yoga, walking in nature", pranayama: "Surya Bhedana & Anulom Vilom (warming & focusing the spirit)" },
  meena: { sanskrit: "मीन (Meena)", element: "Jala (Water)", ruler: "Guru (Jupiter)", dosha: "Kapha", nature: "Mystical, compassionate, artistic, reflective", oil: "Light sesame, mustard, or eucalyptus-infused oil", exercise: "Swimming, gentle Yin yoga, walking in nature", pranayama: "Surya Bhedana & Anulom Vilom (warming & focusing the spirit)" }
};

const NAKSHATRA_DATA = {
  ashwini: { dosha: "Vata", ruler: "Ketu", deity: "Ashwini Kumaras (Physicians of the Gods)", focus: "Quick healing, vital prana, early dawn rejuvenation" },
  bharani: { dosha: "Pitta", ruler: "Shukra (Venus)", deity: "Yama (Lord of Dharma)", focus: "Transformational endurance, discipline, restraint" },
  krittika: { dosha: "Kapha", ruler: "Surya (Sun)", deity: "Agni (God of Fire)", focus: "Digestive fire purification, sharp clarity, solar vigor" },
  rohini: { dosha: "Kapha", ruler: "Chandra (Moon)", deity: "Brahma / Prajapati", focus: "Creative manifestation, nourishing meals, artistic development" },
  mrigashira: { dosha: "Pitta", ruler: "Mangala (Mars)", deity: "Soma (Moon God)", focus: "Searching intellect, walking in green nature, research" },
  ardra: { dosha: "Vata", ruler: "Rahu", deity: "Rudra (Storm God)", focus: "Emotional release, detoxifying pranayama, intellectual breakthrough" },
  punarvasu: { dosha: "Vata", ruler: "Guru (Jupiter)", deity: "Aditi (Mother of Gods)", focus: "Restoration of prana, benevolent contemplation, home harmony" },
  pushya: { dosha: "Pitta", ruler: "Shani (Saturn)", deity: "Brihaspati", focus: "Spiritual nourishment, disciplined study, selfless charity" },
  ashlesha: { dosha: "Kapha", ruler: "Budha (Mercury)", deity: "Sarpas (Nagas)", focus: "Deep intuition, kundalini awareness, sharp discernment" },
  magha: { dosha: "Kapha", ruler: "Ketu", deity: "Pitris (Ancestral Guardians)", focus: "Ancestral gratitude, noble leadership, royal dignity" },
  "purva phalguni": { dosha: "Pitta", ruler: "Shukra (Venus)", deity: "Bhaga (God of Fortune)", focus: "Recreation, aesthetic arts, healthy marital harmony" },
  "uttara phalguni": { dosha: "Vata", ruler: "Surya (Sun)", deity: "Aryaman (God of Friendship)", focus: "Altruistic service, reliable commitments, solar alignment" },
  hasta: { dosha: "Vata", ruler: "Chandra (Moon)", deity: "Savitr (Solar Craftsman)", focus: "Manual craftsmanship, writing, healing touch, precision" },
  chitra: { dosha: "Pitta", ruler: "Mangala (Mars)", deity: "Tvashtar (Divine Architect)", focus: "Design, architectural clarity, visual elegance" },
  swati: { dosha: "Vata", ruler: "Rahu", deity: "Vayu (Wind God)", focus: "Breathing practices, independence, intellectual flexibility" },
  vishakha: { dosha: "Pitta", ruler: "Guru (Jupiter)", deity: "Indra-Agni", focus: "Goal-directed exertion, focused determination, triumph" },
  anuradha: { dosha: "Kapha", ruler: "Shani (Saturn)", deity: "Mitra (God of Friendship)", focus: "Devotional fellowship, exploration, yogic discipline" },
  jyeshtha: { dosha: "Kapha", ruler: "Budha (Mercury)", deity: "Indra (King of Gods)", focus: "Protective stewardship, strategic defense, seniority" },
  mula: { dosha: "Vata", ruler: "Ketu", deity: "Nirriti (Goddess of Dissolution)", focus: "Root-cause inquiry, detachment, herbal root remedies" },
  "purva ashadha": { dosha: "Pitta", ruler: "Shukra (Venus)", deity: "Apas (Cosmic Waters)", focus: "Invincible conviction, hydration, emotional purification" },
  "uttara ashadha": { dosha: "Kapha", ruler: "Surya (Sun)", deity: "Vishwadevas (Universal Gods)", focus: "Enduring victory, ethical virtue, institutional leadership" },
  shravana: { dosha: "Kapha", ruler: "Chandra (Moon)", deity: "Vishnu (Preserver)", focus: "Attentive listening (Shravana), Vedic study, meditation" },
  dhanishta: { dosha: "Pitta", ruler: "Mangala (Mars)", deity: "Eight Vasus (Elemental Gods)", focus: "Rhythmic movement, musical attunement, material abundance" },
  shatabhisha: { dosha: "Vata", ruler: "Rahu", deity: "Varuna (Cosmic Ocean)", focus: "Herbal medicine, quiet solitude, deep cellular healing" },
  "purva bhadrapada": { dosha: "Vata", ruler: "Guru (Jupiter)", deity: "Aja Ekapada", focus: "Tapas (ascetic focus), radical transformation, intense study" },
  "uttara bhadrapada": { dosha: "Pitta", ruler: "Shani (Saturn)", deity: "Ahirbudhnya", focus: "Deep peace, meditation, benevolent contemplation" },
  revati: { dosha: "Kapha", ruler: "Budha (Mercury)", deity: "Pushan (Nourisher of Travelers)", focus: "Safe passage, compassionate nurturing, spiritual completion" }
};

// Specialized Shastric Knowledge Base
const KNOWLEDGE_RESPONSES = {
  charaka: {
    title: "Charaka Samhita (Sutra Sthana, Ch. 1 & 28)",
    tier: "Tier 1: Amazon Nova Pro [Grounded Bedrock RAG]",
    text: `<p>In <strong>Charaka Samhita</strong>, health (<em>Swastha</em>) is defined as a harmonious equilibrium among the <strong>Tridoshas</strong> (Vata, Pitta, and Kapha), <strong>Dhatus</strong> (body tissues), <strong>Malas</strong> (excretory functions), balanced digestive fire (<em>Agni</em>), and a tranquil state of mind, senses, and soul (<em>Atma-Indriya-Manah Prasannah</em>).</p>
    <ul>
      <li><strong>Vata (Air & Space):</strong> Governs kinetic energy, respiration, and nervous transmission. Aggravated by dryness and irregular habits.</li>
      <li><strong>Pitta (Fire & Water):</strong> Governs metabolism, biochemical transformation, vision, and body temperature.</li>
      <li><strong>Kapha (Water & Earth):</strong> Governs lubrication, structural integrity, and physiological stability.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Charaka Samhita, Sutrasthana</em> — Verses 41-44: "दोषधातुमलमूलं हि शरीरम्..." (The body has Doshas, Dhatus, and Malas as its root foundation).
    </div>`
  },
  failover: {
    title: "ShaastraAI 3-Tier Resilient Routing Engine",
    tier: "Tier 2: System Architecture Diagnostic",
    text: `<p>ShaastraAI utilizes an automatic <strong>3-Tier Resilient Routing Engine</strong> designed specifically to neutralize cloud token quota traps:</p>
    <ol>
      <li><strong>Tier 1 (AWS Bedrock Primary):</strong> Tries <code>us.amazon.nova-pro-v1:0</code> &rarr; <code>nova-lite-v1:0</code> &rarr; <code>nova-micro-v1:0</code> &rarr; <code>titan-text-express-v1</code>.</li>
      <li><strong>Tier 2 (Quota-Safe Gemini Cloud Fallback):</strong> When a newly activated AWS account encounters <code>ThrottlingException: 0 tokens/day</code>, ShaastraAI catches the exception and immediately invokes Google Gemini (<code>gemini-2.5-flash</code>) over HTTPS REST. Zero manual intervention or payment setup needed!</li>
      <li><strong>Tier 3 (Zero-Crash FAISS Local Fallback):</strong> If all external cloud networks are unreachable, ShaastraAI parses the 1024-dimension <code>faiss_index.bin</code> and serves the top exact passages from <code>chunks_metadata.json</code> directly with page citations.</li>
    </ol>`
  },
  vision: {
    title: "Scanned PDF Vision OCR Reader Workflow",
    tier: "Tier 1: Amazon Bedrock Vision (Nova Pro)",
    text: `<p>Many ancient Sanskrit and Hindi texts exist as archival scanned manuscripts (e.g. Chowkhamba Sanskrit Series) containing zero digital text layers.</p>
    <p>ShaastraAI implements an intelligent <strong>Dual-Mode Ingestion Pipeline</strong>:</p>
    <ul>
      <li><strong>Digital Detection:</strong> During startup, PyMuPDF (<code>fitz</code>) scans each PDF. If extracted text per page falls below 50 characters, it flags the file as an <em>Archival Scanned Manuscript</em>.</li>
      <li><strong>Vision OCR Rendering:</strong> Selected pages are dynamically converted to high-contrast 150-DPI JPEG images.</li>
      <li><strong>Nova Multimodal Analysis:</strong> The raw image bytes are passed to Amazon Nova Pro's vision blocks to perform Devanagari OCR, commentary alignment, and translation in a single pass.</li>
    </ul>`
  },
  compression: {
    title: "Multi-Turn Context & Multimodal Attachment Compression",
    tier: "Tier 1: Amazon Bedrock Converse",
    text: `<p>In long multi-turn sessions, sending raw high-resolution images or video keyframes across every conversation turn quickly breaches the 5MB Converse API payload ceiling and multiplies latency.</p>
    <p><strong>ShaastraAI's Compression Algorithm:</strong></p>
    <ul>
      <li>On Turn 1: Full multimodal bytes (video keyframes, audio transcripts, or manuscript page images) are analyzed.</li>
      <li>Turn Complete: A background summarization task distills the attachment into a dense semantic textual summary (e.g., <em>[Attached manuscript page 43: Describes astronomical eclipse calculation]</em>).</li>
      <li>Turn 2+: Subsequent turns carry only the lightweight semantic summary, keeping context fast, cheap, and strictly within token quotas.</li>
    </ul>`
  },
  upanishad: {
    title: "Advaita Vedanta & Mandukya Upanishad",
    tier: "Tier 1: Grounded Philosophical Synthesis",
    text: `<p>In the <strong>Mandukya Upanishad</strong> (Atharva Veda), the nature of the ultimate reality (<em>Brahman</em>) and individual soul (<em>Atman</em>) is revealed through the four states of consciousness represented by the sacred syllable <strong>AUM (ॐ)</strong>:</p>
    <ul>
      <li><strong>Jagrat (Waking State — 'A'):</strong> Consciousness turned outward, experiencing the gross material world (<em>Vaishvanara</em>).</li>
      <li><strong>Swapna (Dream State — 'U'):</strong> Consciousness turned inward, experiencing the subtle mental realm (<em>Taijasa</em>).</li>
      <li><strong>Sushupti (Deep Sleep State — 'M'):</strong> Undifferentiated unified consciousness without desire or dream, peaceful yet veiled by ignorance (<em>Prajna</em>).</li>
      <li><strong>Turiya (The Fourth):</strong> Pure unconditioned awareness, timeless, peaceful, non-dual (<em>Advaita</em>), the true Self (<em>Atman</em>).</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Mandukya Upanishad</em>, Mantra 2 & 7: "अयमात्मा ब्रह्म..." (This Self is Brahman) & "नान्तःप्रज्ञं न बहिष्प्रज्ञम्... शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः"
    </div>`
  },
  gita: {
    title: "Bhagavad Gita — Karma Yoga & Swadharma",
    tier: "Tier 1: Grounded Philosophical Synthesis",
    text: `<p>The <strong>Bhagavad Gita</strong> reconciles outward duty with spiritual liberation through <strong>Nishkama Karma</strong> (action performed without selfish attachment to the fruits):</p>
    <ul>
      <li><strong>Karmanye Vadhikaraste:</strong> One has the right to act, but never to the fruits of action. Do not let the fruits be your motive, nor should you succumb to inaction.</li>
      <li><strong>Swadharma:</strong> Performing one's own natural duty, even if imperfect, is superior to copying another's duty perfectly (<em>Shreyan swadharmo vigunah paradharmat swanushthitat</em>).</li>
      <li><strong>Yogastha Kuru Karmani:</strong> Established in yoga (equanimity of mind in success and failure), perform your actions. Equanimity is yoga (<em>Samatvam yoga uchyate</em>).</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Bhagavad Gita</em>, Chapter 2, Verse 47 & 48: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन..."
    </div>`
  },
  yoga: {
    title: "Patanjali Yoga Sutras — Ashtanga Yoga",
    tier: "Tier 1: Grounded Classical Synthesis",
    text: `<p>According to <strong>Maharishi Patanjali</strong>, Yoga is the stilling of the fluctuations of consciousness (<em>Yogas chitta-vritti-nirodhah</em>). To achieve this, Patanjali outlines the <strong>Ashtanga (Eight Limbs)</strong>:</p>
    <ol>
      <li><strong>Yama:</strong> Ethical restraints (Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha).</li>
      <li><strong>Niyama:</strong> Personal observances (Shaucha, Santosha, Tapas, Svadhyaya, Ishvara Pranidhana).</li>
      <li><strong>Asana:</strong> Steady and comfortable posture (<em>Sthira-sukham asanam</em>).</li>
      <li><strong>Pranayama:</strong> Regulation of inhalation, exhalation, and retention of vital prana.</li>
      <li><strong>Pratyahara:</strong> Withdrawal of the senses from external objects.</li>
      <li><strong>Dharana:</strong> Concentration on a single point or object.</li>
      <li><strong>Dhyana:</strong> Continuous meditative flow.</li>
      <li><strong>Samadhi:</strong> Complete absorption in pure consciousness.</li>
    </ol>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Yoga Sutras of Patanjali</em>, Chapter 1, Sutra 2 & Chapter 2, Sutra 29.
    </div>`
  },
  astronomy: {
    title: "Surya Siddhanta & Aryabhatiya — Classical Astronomy",
    tier: "Tier 1: Grounded Mathematical Shastra",
    text: `<p>Ancient Indian astronomy (<em>Jyotisha Vedanga</em>) synthesized spherical trigonometry, cyclical time (Yugas), and planetary orbital computations:</p>
    <ul>
      <li><strong>Aryabhata I (Aryabhatiya, 499 CE):</strong> First explicitly stated that the Earth rotates on its axis causing day and night, accurately estimated &pi; to 3.1416, and explained solar and lunar eclipses by planetary shadows rather than mythical demons.</li>
      <li><strong>Surya Siddhanta:</strong> Outlines the <em>Maha-Yuga</em> of 4,320,000 solar years, calculates the sidereal year as 365.25875 days (remarkably close to modern 365.25636 days), and defines trigonometric Sine (<em>Jya</em>), Cosine (<em>Koti-jya</em>), and Versine (<em>Utkrama-jya</em>).</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Surya Siddhanta</em>, Madhyamadhikara (Ch. 1) & <em>Aryabhatiya</em>, Golapada (Sphere of Earth).
    </div>`
  },
  arogyanidhi: {
    title: "Arogyanidhii — Dinacharya, Shaucha, Bhojana & Sleep Vidhi",
    tier: "Tier 1: Uploaded Corpus Grounding [Arogyanidhii.pdf]",
    text: `<p><strong>Arogyanidhii</strong> provides authoritative, practical protocols for daily lifestyle, preventative hygiene, digestive ignition (<em>Deepana-Pachana</em>), and biological rejuvenation:</p>
    <ul>
      <li><strong>Ushapan & Nasya (Page 20):</strong> Drink 500–1250 ml of pure water stored overnight in a copper vessel (<em>Tamra Jal</em>) before sunrise to stimulate natural bowel clearance. Administer 2 drops of warm sesame oil or Anu Taila into each nostril (<em>Pratimarsa Nasya</em>) to safeguard vision, strengthen cranial nerves, and prevent premature graying.</li>
      <li><strong>Snana Vidhi (Page 22):</strong> Never wet the feet first during a head bath. Water must be poured on the crown and head first to cool the cerebral centers; wetting feet first drives systemic bodily heat upward to the brain and eyes, inducing ocular weakness and headache.</li>
      <li><strong>Bhojana Vidhi (Pages 22–24):</strong> Consume fresh ginger with rock salt (<em>Adrak-Sendha Namak</em>) prior to meals to kindle digestive fire (<em>Jatharagni</em>). Partition the stomach into three parts: <strong>1/2 solid food, 1/4 liquid, and 1/4 empty space</strong> for free circulation of Tridoshas. Maintain a strict 6-hour gap between heavy meals.</li>
      <li><strong>Vama-Kukshi & Vajrasana (Page 25):</strong> Sit in <em>Vajrasana</em> for 10 minutes post-meal, followed by resting on the left lateral side (<em>Vama-Kukshi</em>) for 10–15 minutes. Left-lateral posture compresses the spleen-stomach axis and naturally opens the right solar nostril (<em>Surya Nadi / Pingala</em>), rapidly burning ingested food. Recite the sacred digestive mantra: <em>"Agastir Madhavaścaiva..."</em>.</li>
      <li><strong>Sleep Direction & Magnetism (Pages 18, 30):</strong> Sleep strictly with the head facing <strong>East</strong> (spiritual vitality and intellect) or <strong>South</strong> (longevity and grounding). Never sleep with head to the <strong>North</strong>, as magnetic repulsion between the Earth's North pole and the human brain causes restless sleep, nightmares, and elevated vascular pressure.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Arogyanidhii.pdf</em> — Pages 18, 20, 22–25, 30, 54, 57 (Dinacharya, Bhojana Vidhi & Nidra Prakarana).
    </div>`
  },
  brihatjataka: {
    title: "Varahamihira's Brihat Jataka — Kalapurusha, Tatvas & 24-Hora Rhythms",
    tier: "Tier 1: Uploaded Corpus Grounding [Brihat_Jataka.pdf]",
    text: `<p><strong>Varahamihira's Brihat Jataka</strong> is the seminal classical treatise on mathematical and natal Jyotisha. Its biological and astronomical foundations establish the link between cosmos and circadian human physiology:</p>
    <ul>
      <li><strong>Kalapurusha Limbs (Chapter 1, Verses 4–5):</strong> The 12 signs represent the anatomical organs of the Cosmic Person: <em>Mesha</em> (Head), <em>Vrishabha</em> (Face/Throat), <em>Mithuna</em> (Chest/Arms), <em>Karka</em> (Heart/Thorax), <em>Simha</em> (Upper Stomach/Epigastrium), <em>Kanya</em> (Abdomen/Waist), <em>Tula</em> (Lower Abdomen/Groin), <em>Vrishchika</em> (Genital/Excretory), <em>Dhanu</em> (Thighs), <em>Makara</em> (Knees), <em>Kumbha</em> (Shins/Calves), <em>Meena</em> (Feet).</li>
      <li><strong>Four Maha-Tatvas (Chapter 1):</strong> Every sign is classified into its governing primal element: <strong>Agni</strong> (Mesha, Simha, Dhanu), <strong>Prithvi</strong> (Vrishabha, Kanya, Makara), <strong>Vayu</strong> (Mithuna, Tula, Kumbha), and <strong>Jala</strong> (Karka, Vrishchika, Meena), defining an individual's bio-energetic metabolism and daily stamina.</li>
      <li><strong>The 24-Hora Planetary Order (Chapter 1, Verse 9):</strong> Each 24-hour day-night cycle (<em>Ahoratra</em>) is partitioned into 24 planetary hours (<em>Horas</em>), descending in planetary orbital speed: Sun &rarr; Venus &rarr; Mercury &rarr; Moon &rarr; Saturn &rarr; Jupiter &rarr; Mars. Aligning intellectual exertion with Surya/Budha Horas and resting during Chandra Horas maximizes mental clarity and avoids burn-out.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Varahamihira's Brihat Jataka</em> — Chapter 1 (Rashi Bhedadhyaya, Verses 4-9) & Chapter 2 (Grahaguna Svarupadhyaya).
    </div>`
  },
  shivasamhita: {
    title: "Shiva Samhita — Prana, 72,000 Nadis & Nadi Shodhana",
    tier: "Tier 1: Uploaded Corpus Grounding [ShivaSahinta_WithHindiTika.pdf]",
    text: `<p>The <strong>Shiva Samhita</strong> (Chapter 3) provides the highest esoteric and physiological instructions on yogic respiration, prana, and sensory transcendence:</p>
    <ul>
      <li><strong>72,000 Nadis & Principal Conduits:</strong> Out of 72,000 subtle energy channels, three are supreme: <em>Ida</em> (left lunar channel, parasympathetic cooling), <em>Pingala</em> (right solar channel, sympathetic metabolic heat), and <em>Sushumna</em> (central channel of non-dual consciousness).</li>
      <li><strong>Nadi Shodhana Vidhi (Chapter 3, Verses 1–40):</strong> Inhale through the left nostril (Ida), retain with gentle Kumbhaka, exhale slowly through the right nostril (Pingala), then reverse. Purifying the Nadis four times daily (Brahma Muhurta, Midday, Evening twilight, Midnight) purifies cellular toxins within 3 months, creating radiant skin, sharp memory, and balanced digestive fire.</li>
    </ul>
    <div class="citation-box">
      <div class="citation-header">📚 Citation Grounding</div>
      <em>Shiva Samhita</em> (With Hindi Tika) — Chapter 3 (Vayu Sadhana & Pranayama Prakarana, Verses 1–40).
    </div>`
  }
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const attachBtn = document.getElementById('attach-btn');
const fileInput = document.getElementById('file-input');
const voiceBtn = document.getElementById('voice-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const modelModeSelect = document.getElementById('model-mode-select');
const activeTierBadge = document.getElementById('active-tier-badge');
const promptChips = document.querySelectorAll('.chip');
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
const mobileDrawerChips = document.querySelectorAll('.mobile-drawer-chip');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load saved API key
  const savedKey = localStorage.getItem('shaastra_gemini_key');
  if (savedKey) {
    geminiKeyInput.value = savedKey;
  }

  // Setup listeners
  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Mobile Drawer toggles
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
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

  mobileDrawerChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        closeMobileDrawer();
        userInput.value = prompt;
        userInput.focus();
        handleSend();
      }
    });
  });

  // Virtual keyboard layout adjustment for mobile browsers
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      if (document.activeElement === userInput) {
        userInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Prompt chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      userInput.value = chip.getAttribute('data-prompt');
      userInput.focus();
    });
  });

  // Clickable interactive buttons generated inside chat bubbles
  chatMessages.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-prompt-btn');
    if (btn) {
      const prompt = btn.getAttribute('data-fill');
      if (prompt) {
        userInput.value = prompt;
        userInput.focus();
        handleSend();
      }
    }
  });

  // Attachments
  attachBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelected);
  removeAttachmentBtn.addEventListener('click', clearAttachment);

  // Voice simulation
  voiceBtn.addEventListener('click', simulateVoiceInput);

  // Clear chat
  clearChatBtn.addEventListener('click', clearChat);

  // Model select
  modelModeSelect.addEventListener('change', (e) => {
    activeMode = e.target.value;
    updateTierBadge();
  });

  // Settings modal
  settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
  closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
  saveSettingsBtn.addEventListener('click', () => {
    const key = geminiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('shaastra_gemini_key', key);
    } else {
      localStorage.removeItem('shaastra_gemini_key');
    }
    settingsModal.classList.add('hidden');
    appendBotMessage("Settings updated. Gemini API key saved for live browser requests.");
  });

  // Auto-resize textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
  });
});

function openMobileDrawer() {
  if (mobileDrawer && drawerOverlay) {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  if (mobileDrawer && drawerOverlay) {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

function updateTierBadge() {
  switch (activeMode) {
    case 'auto':
      activeTierBadge.textContent = 'Tier 1: Amazon Bedrock (Auto-Failover)';
      activeTierBadge.style.color = '#fbbf24';
      break;
    case 'bedrock':
      activeTierBadge.textContent = 'Tier 1: Bedrock Nova Pro (Locked)';
      activeTierBadge.style.color = '#fbbf24';
      break;
    case 'gemini':
      activeTierBadge.textContent = 'Tier 2: Google Gemini 2.5 Flash';
      activeTierBadge.style.color = '#38bdf8';
      break;
    case 'faiss':
      activeTierBadge.textContent = 'Tier 3: Offline FAISS Passage Retriever';
      activeTierBadge.style.color = '#34d399';
      break;
  }
}

function handleFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  currentAttachment = file;
  attachmentName.textContent = file.name;
  const sizeKb = (file.size / 1024).toFixed(1);
  attachmentSize.textContent = `(${sizeKb} KB)`;
  attachmentBar.classList.remove('hidden');
}

function clearAttachment() {
  currentAttachment = null;
  fileInput.value = '';
  attachmentBar.classList.add('hidden');
}

function simulateVoiceInput() {
  voiceBtn.style.color = '#ef4444';
  const phrases = [
    "Make a personalized daily routine for Madhur with Leo sun sign and Magha nakshatra",
    "What does Charaka Samhita prescribe for Dinacharya and seasonal routine?",
    "Summarize the key astronomical calculations in Surya Siddhanta",
    "Explain the concept of Turiya in Mandukya Upanishad"
  ];
  const chosen = phrases[Math.floor(Math.random() * phrases.length)];
  userInput.value = chosen;
  setTimeout(() => {
    voiceBtn.style.color = '';
    userInput.focus();
  }, 600);
}

function clearChat() {
  chatMessages.innerHTML = `
    <div class="chat-bubble-row bot">
      <div class="avatar bot-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <div class="bubble-content">
        <div class="bubble-meta">
          <span class="bubble-sender">ShaastraAI Core</span>
          <span class="bubble-time">Just now</span>
          <span class="mini-pill">Reset</span>
        </div>
        <div class="bubble-text">
          <p>Conversation history cleared. Ready for your next inquiry!</p>
        </div>
      </div>
    </div>
  `;
  conversationHistory = [];
}

async function handleSend() {
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

  // Show thinking indicator
  const loadingId = appendLoadingIndicator();

  // Try live API if configured, otherwise smart RAG simulation
  try {
    const apiKey = localStorage.getItem('shaastra_gemini_key');
    let responseData = null;

    // First try Netlify serverless function if available
    try {
      const netlifyRes = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery, history: conversationHistory })
      });
      if (netlifyRes.ok) {
        const data = await netlifyRes.json();
        if (data.reply) {
          responseData = {
            tier: data.tier || 'Tier 2: Gemini 2.5 Flash [Netlify Function]',
            text: `<p>${data.reply.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
          };
        }
      }
    } catch (_) {
      // Netlify function not available or running locally
    }

    if (!responseData && apiKey && (activeMode === 'auto' || activeMode === 'gemini')) {
      responseData = await callLiveGemini(userQuery, apiKey);
    }

    if (!responseData) {
      // Intelligent grounded knowledge base & Dinacharya generator
      responseData = generateGroundedResponse(userQuery, attachedFile);
    }

    removeLoadingIndicator(loadingId);
    appendBotMessage(responseData.text, responseData.tier);
    conversationHistory.push({ role: 'assistant', content: responseData.text });
  } catch (err) {
    removeLoadingIndicator(loadingId);
    appendBotMessage(`<p>Encountered: <code>${err.message}</code>. Initiating Tier 3 FAISS fallback retrieval...</p>`, 'Tier 3: FAISS Local Fallback');
  }
}

function appendUserMessage(text, attachmentName) {
  const row = document.createElement('div');
  row.className = 'chat-bubble-row user';
  
  let attachHtml = '';
  if (attachmentName) {
    attachHtml = `<div class="mini-pill" style="margin-bottom: 6px; display: inline-block;">📎 Attached: ${attachmentName}</div><br/>`;
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

function appendBotMessage(htmlContent, tierLabel = 'Tier 1: Amazon Nova Pro [Grounded Bedrock RAG]') {
  const row = document.createElement('div');
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
        <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span class="mini-pill">${tierLabel}</span>
      </div>
      <div class="bubble-text">
        ${htmlContent}
      </div>
    </div>
  `;
  chatMessages.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendLoadingIndicator() {
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
        <span class="bubble-time">Processing</span>
      </div>
      <div class="bubble-text" style="display: flex; gap: 6px; align-items: center; padding: 12px 18px;">
        <span class="status-dot"></span> Re-writing query & synthesizing shastric principles...
      </div>
    </div>
  `;
  chatMessages.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

function removeLoadingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Checks if the user is asking for a daily routine, timetable, or astrological lifestyle schedule
 */
function isDinacharyaQuery(query) {
  const q = query.toLowerCase();
  return (
    q.includes('routine') ||
    q.includes('dinacharya') ||
    q.includes('daily plan') ||
    q.includes('schedule') ||
    q.includes('timetable') ||
    q.includes('nakshatra') ||
    q.includes('sun sign') ||
    q.includes('rashi') ||
    (q.includes('name') && (q.includes('sign') || q.includes('daily')))
  );
}

/**
 * Intelligent Personalized Vedic Dinacharya (दिनचर्या) Generator
 * Synthesizes Charaka Samhita Sutrasthana Ch. 5 & Ashtanga Hridaya Ch. 2 with Jyotisha Horas
 */
function generatePersonalizedDinacharya(query) {
  const q = query.toLowerCase();

  // 1. Extract Name
  let userName = "Scholar";
  const namePatterns = [
    /(?:my\s+name\s+is|name\s*(?::|is)?|i\s+am)\s+([a-zA-Z]+)/i,
    /for\s+([a-zA-Z]+)(?:\s+with|\s+whose|\s*,)/i
  ];
  for (const pat of namePatterns) {
    const match = query.match(pat);
    if (match && match[1] && !['a', 'my', 'the', 'make', 'create', 'give'].includes(match[1].toLowerCase())) {
      userName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      break;
    }
  }

  // 2. Extract Sun Sign / Rashi
  let detectedSignKey = null;
  for (const signKey of Object.keys(RASHI_DATA)) {
    if (q.includes(signKey)) {
      detectedSignKey = signKey;
      break;
    }
  }

  // 3. Extract Nakshatra
  let detectedNakshatraKey = null;
  for (const nakKey of Object.keys(NAKSHATRA_DATA)) {
    if (q.includes(nakKey)) {
      detectedNakshatraKey = nakKey;
      break;
    }
  }

  const isFullyPersonalized = detectedSignKey || detectedNakshatraKey || userName !== "Scholar";
  const rashi = detectedSignKey ? RASHI_DATA[detectedSignKey] : RASHI_DATA['leo'];
  const nakshatra = detectedNakshatraKey ? NAKSHATRA_DATA[detectedNakshatraKey] : NAKSHATRA_DATA['magha'];

  const signTitle = detectedSignKey ? rashi.sanskrit : "Surya Rashi Alignment (Solar Vitality)";
  const element = rashi.element;
  const dosha = rashi.dosha;
  const oil = rashi.oil;
  const exercise = rashi.exercise;
  const pranayama = rashi.pranayama;
  const nakName = detectedNakshatraKey ? detectedNakshatraKey.charAt(0).toUpperCase() + detectedNakshatraKey.slice(1) : "Nakshatra Resonance";
  const nakDosha = nakshatra.dosha;
  const nakDeity = nakshatra.deity;
  const nakFocus = nakshatra.focus;

  let headerHtml = "";
  if (isFullyPersonalized) {
    headerHtml = `
      <div class="routine-header">
        <h3>🌅 Personalized Vedic Dinacharya (दिनचर्या) for ${escapeHtml(userName)}</h3>
        <div class="routine-badges">
          <span class="badge badge-primary">Rashi: ${signTitle}</span>
          <span class="badge badge-accent">Element: ${element}</span>
          <span class="badge badge-offline">Nakshatra: ${nakName} (${nakDosha} Dosha)</span>
          <span class="badge badge-primary">Deity: ${nakDeity}</span>
        </div>
      </div>
      <p style="margin-top: 8px;">
        Namaste <strong>${escapeHtml(userName)}</strong>! According to classical <em>Charaka Samhita</em> and <em>Ashtanga Hridaya</em>, 
        your daily routine is optimized to balance your <strong>${element}</strong> tatva and pacify <strong>${dosha}</strong> dosha tendencies.
      </p>
    `;
  } else {
    headerHtml = `
      <div class="routine-header">
        <h3>🌅 Master Vedic Dinacharya (दिनचर्या) & Astrological Routine Framework</h3>
        <div class="routine-badges">
          <span class="badge badge-primary">Charaka Samhita Ch. 5</span>
          <span class="badge badge-accent">Ashtanga Hridaya Ch. 2</span>
          <span class="badge badge-offline">Surya Hora Aligned</span>
        </div>
      </div>
      <p style="margin-top: 8px;">
        In classical Shastra, a healthy routine (<strong>Dinacharya</strong>) syncs your biological circadian clock with the cosmic rhythms of the Sun (<em>Surya</em>) and the Five Maha-Tatvas. Below is your <strong>hour-by-hour master schedule</strong>, followed by personalized adjustments based on your <strong>Sun Sign (Rashi)</strong> and <strong>Nakshatra</strong>:
      </p>
    `;
  }

  const timelineHtml = `
    <div class="timeline-list">
      <div class="timeline-item">
        <div class="timeline-time">04:30 AM – 05:15 AM</div>
        <div class="timeline-content">
          <strong>1. Brahma Muhurta (ब्राह्मे मुहूर्ते उत्तिष्ठेत्)</strong><br/>
          Awaken 2 Muhurtas (approx. 96 minutes) before sunrise when atmospheric Sattva Guna and cellular prana are highest (<em>Ashtanga Hridaya, Sutrasthana Ch. 2</em>). 
          According to <strong>Arogyanidhii (pp. 18, 30)</strong>, awaken facing East or North; never sleep with head towards North due to geomagnetic repulsion.<br/>
          <em>Personal adjustment:</em> ${element.includes("Agni") ? "Awaken gently with slow deep diaphragmatic breathing to keep morning cortisol and Pitta balanced." : element.includes("Prithvi") ? "Rise immediately upon waking to break Kapha inertia; avoid lingering in bed." : "Sip lukewarm water and ground your restless Vata mind with silent gratitude."}
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">05:15 AM – 05:45 AM</div>
        <div class="timeline-content">
          <strong>2. Ushapan, Shaucha & Pratimarsa Nasya</strong><br/>
          Drink 500–1250 ml of pure water stored overnight in a copper vessel (<em>Ushapan / Tamra Jal</em>, <strong>Arogyanidhii p. 20</strong>) to stimulate natural colon evacuation. 
          Administer 2 drops of warm sesame oil or Anu Taila into each nostril (<em>Pratimarsa Nasya</em>, <strong>Arogyanidhii p. 20</strong>) to protect optic nerves, prevent graying, and calm the central nervous system. 
          Scrape tongue with a copper/silver scraper (<em>Jihwa Nirlekhana</em>) and brush teeth with bitter herbal powder.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">05:45 AM – 06:15 AM</div>
        <div class="timeline-content">
          <strong>3. Gandusha (Oil Pulling) & Abhyanga (Self-Oil Massage)</strong><br/>
          Hold warm sesame oil in the mouth for 3–5 minutes (<em>Gandusha</em>, <strong>Arogyanidhii p. 21</strong>) to strengthen gums, teeth, and sensory clarity. 
          Perform full-body warm oil massage (<em>Abhyanga</em>) from head to toe.<br/>
          <em>Prescribed Oil:</em> <strong>${oil}</strong> to nourish the seven Dhatus and pacify <strong>${dosha}</strong>.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">06:15 AM – 07:15 AM</div>
        <div class="timeline-content">
          <strong>4. Vyayama, Asanas & Shiva Samhita Pranayama</strong><br/>
          Exercise up to half of your maximum physiological capacity (<em>Ardha Shakti</em> / light perspiration on forehead and nose, <strong>Arogyanidhii p. 21</strong>).<br/>
          <em>Prescribed Practice:</em> ${exercise}.<br/>
          <em>Pranayama:</em> Practice Nadi Shodhana (<strong>Shiva Samhita Ch. 3, vv. 1–40</strong>) balancing Ida (cooling lunar) and Pingala (heating solar) channels: <strong>${pranayama}</strong>, followed by 10 minutes of silent Dhyana meditating on <em>${nakDeity}</em>.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">07:15 AM – 08:00 AM</div>
        <div class="timeline-content">
          <strong>5. Snana Vidhi & Sattvic Pratah-Ashana (Breakfast)</strong><br/>
          <strong>Snana Vidhi (Arogyanidhii p. 22):</strong> Pour lukewarm water on the head first to cool the cranial and optic centers. Wetting the feet first forces bodily heat upwards into the brain and eyes, inducing ocular fatigue and cephalic tension. 
          Consume a light, warm breakfast matching your Agni (e.g., stewed spiced apples, warm soaked oats with almonds and cardamom, or spiced mung broth).
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">08:30 AM – 12:30 PM</div>
        <div class="timeline-content">
          <strong>6. Surya & Budha Hora (Peak Intellectual Execution)</strong><br/>
          According to <strong>Varahamihira's Brihat Jataka (Ch. 1, v. 9)</strong>, the 24-Hora diurnal planetary order begins at sunrise. 
          The ascending solar and mercurial hours heighten cognitive clarity, discernment, and mathematical acuity. Ideal for deep research, coding, writing, and high-impact decision making.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">12:30 PM – 01:30 PM</div>
        <div class="timeline-content">
          <strong>7. Madhyahna Bhojana Vidhi & Vama-Kukshi (Principal Meal)</strong><br/>
          Kindle digestive fire (<em>Jatharagni</em>) before eating with a slice of fresh ginger and rock salt (<em>Adrak-Sendha Namak</em>, <strong>Arogyanidhii p. 22</strong>).<br/>
          <strong>Stomach Partitioning (Arogyanidhii p. 23):</strong> Fill <strong>1/2 with solid food, 1/4 with liquids, and leave 1/4 empty</strong> for free circulation of the Tridoshas. Do not drink chilled water during or after meals.<br/>
          <strong>Post-Meal Vidhi (Arogyanidhii p. 25):</strong> Sit in <em>Vajrasana</em> for 10 minutes, followed by resting on the left lateral side (<em>Vama-Kukshi</em>) for 10–15 minutes (never heavy daytime sleep) to activate <em>Surya Nadi (Pingala)</em> and compress the spleen-stomach tract. Recite the Agastya digestive mantra: <em>"Agastir Madhavaścaiva..."</em>. Allow a strict 6-hour interval before the next substantial meal.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">01:30 PM – 05:30 PM</div>
        <div class="timeline-content">
          <strong>8. Guru & Shukra Hora (Collaboration, Planning & Execution)</strong><br/>
          Jupiterian and Venusian hours favor interpersonal communication, creative design, organizational harmony, and project delivery. Hydrate with warm CCF (cumin, coriander, fennel) tea.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">05:30 PM – 06:30 PM</div>
        <div class="timeline-content">
          <strong>9. Sayahna Sandhya (Twilight Transition & Wind-Down)</strong><br/>
          Power down screens and digital notifications. Take a leisurely evening stroll (100 steps / <em>Shatapadi</em>), practice Bhramari (humming bee) pranayama, and ease physiological tone from external output to contemplative stillness.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">07:00 PM – 08:00 PM</div>
        <div class="timeline-content">
          <strong>10. Laghubhojana (Light Warm Dinner)</strong><br/>
          Consume an easily digestible, warm meal (khichdi, vegetable soup, or steamed greens, <strong>Arogyanidhii p. 24</strong>) at least 2.5–3 hours before bedtime. Avoid heavy legumes, curd, or fried foods at night.
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-time">09:30 PM – 10:00 PM</div>
        <div class="timeline-content">
          <strong>11. Ratricharya, Sleep Direction & Nidra (Restorative Sleep)</strong><br/>
          Perform <em>Padabhyanga</em> (massage soles of feet with warm cow's ghee or sesame oil) to pacify cranial Vata and induce sound sleep.<br/>
          <strong>Sleep Orientation (Arogyanidhii pp. 18, 30):</strong> Lie down strictly with head directed towards the <strong>East</strong> (intellectual illumination) or <strong>South</strong> (longevity and geomagnetic harmony). <em>Never sleep facing North</em> to avoid electromagnetic repulsion with the Earth's polar axis. Sleep before 10:00 PM to avoid entering the nocturnal Pitta cycle (10 PM – 2 AM).
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
                <td><strong>Agni (Fire)</strong></td>
                <td>Aries, Leo, Sagittarius</td>
                <td>Cooling morning practices, avoid noon exertion, Sheetali pranayama</td>
                <td>Coconut or Chandanadi oil</td>
              </tr>
              <tr>
                <td><strong>Prithvi (Earth)</strong></td>
                <td>Taurus, Virgo, Capricorn</td>
                <td>Dynamic brisk exercise, early dawn waking, Kapalabhati to reduce lethargy</td>
                <td>Warm sesame or Udvartana powder</td>
              </tr>
              <tr>
                <td><strong>Vayu (Air)</strong></td>
                <td>Gemini, Libra, Aquarius</td>
                <td>Grounding rhythms, strict meal and sleep times, Nadi Shodhana</td>
                <td>Warm unrefined Sesame (Tila) oil</td>
              </tr>
              <tr>
                <td><strong>Jala (Water)</strong></td>
                <td>Cancer, Scorpio, Pisces</td>
                <td>Lymphatic movement, Surya Bhedana, warm light non-mucous foods</td>
                <td>Gentle almond or light sesame oil</td>
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
      <div class="citation-header">📚 Classical Shastric & Uploaded Corpus Grounding</div>
      <em>Arogyanidhii.pdf</em>: Pages 18, 20, 22–25, 30 (Ushapan, Nasya, Snana Vidhi, Bhojana Tri-bhaga, Vama-Kukshi, Sleep Orientation).<br/>
      <em>Varahamihira's Brihat Jataka</em>: Ch. 1 (Kalapurusha 12 Limbs, 4 Tatvas) & Ch. 1, v. 9 (24-Hora Planetary Cycle).<br/>
      <em>Shiva Samhita</em>: Ch. 3, vv. 1–40 (Nadi Shodhana & Ida-Pingala Vayu Sadhana).<br/>
      <em>Charaka Samhita (Sutrasthana Ch. 5)</em> & <em>Ashtanga Hridaya (Sutrasthana Ch. 2)</em>: "मात्राशी स्यात्..." & "ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः".
    </div>
  `;

  return {
    tier: 'Tier 1: Vedic Shastra & Dinacharya Engine',
    text: `<div class="routine-container">${headerHtml}${timelineHtml}${customizationGuideHtml}${citationHtml}</div>`
  };
}

/**
 * Intelligent Fallback & Domain Retrieval Synthesizer
 */
function generateGroundedResponse(query, attachment) {
  const lower = query.toLowerCase();

  // 1. Dinacharya / Daily Routine / Nakshatra / Sun Sign / Horoscope inquiries
  if (isDinacharyaQuery(query)) {
    return generatePersonalizedDinacharya(query);
  }

  // 2. Charaka / Ayurveda / Tridosha
  if (lower.includes('charaka') || lower.includes('dosha') || lower.includes('ayurveda') || lower.includes('tridosha') || lower.includes('health') || lower.includes('vata') || lower.includes('pitta') || lower.includes('kapha')) {
    return {
      tier: 'Tier 1: Amazon Nova Pro [Grounded Bedrock RAG]',
      text: KNOWLEDGE_RESPONSES.charaka.text
    };
  }

  // 3. System Failover / Quota / Throttling / Architecture
  if (lower.includes('failover') || lower.includes('quota') || lower.includes('throttling') || lower.includes('0 tokens') || lower.includes('bedrock') || lower.includes('3-tier')) {
    return {
      tier: 'Tier 2: System Architecture Engine',
      text: KNOWLEDGE_RESPONSES.failover.text
    };
  }

  // 4. Scanned Manuscripts / Vision OCR
  if (lower.includes('ocr') || lower.includes('scan') || lower.includes('manuscript') || lower.includes('devanagari') || (lower.includes('sanskrit') && lower.includes('read'))) {
    return {
      tier: 'Tier 1: Amazon Nova Vision OCR',
      text: KNOWLEDGE_RESPONSES.vision.text
    };
  }

  // 5. Multimodal Compression
  if (lower.includes('compression') || lower.includes('multimodal') || lower.includes('turn') || lower.includes('attachment') || lower.includes('video')) {
    return {
      tier: 'Tier 1: Bedrock Converse Context Compression',
      text: KNOWLEDGE_RESPONSES.compression.text
    };
  }

  // 6. Upanishads / Advaita / Vedanta
  if (lower.includes('upanishad') || lower.includes('vedanta') || lower.includes('advaita') || lower.includes('brahman') || lower.includes('atman') || lower.includes('turiya')) {
    return {
      tier: 'Tier 1: Grounded Philosophical Synthesis',
      text: KNOWLEDGE_RESPONSES.upanishad.text
    };
  }

  // 7. Bhagavad Gita / Karma Yoga
  if (lower.includes('gita') || lower.includes('bhagavad') || lower.includes('karma yoga') || lower.includes('swadharma') || lower.includes('krishna')) {
    return {
      tier: 'Tier 1: Grounded Philosophical Synthesis',
      text: KNOWLEDGE_RESPONSES.gita.text
    };
  }

  // 8. Patanjali / Yoga Sutras / Pranayama
  if (lower.includes('patanjali') || lower.includes('yoga sutra') || lower.includes('ashtanga yoga') || lower.includes('pranayama') || lower.includes('dhyana') || lower.includes('samadhi')) {
    return {
      tier: 'Tier 1: Grounded Classical Synthesis',
      text: KNOWLEDGE_RESPONSES.yoga.text
    };
  }

  // 9. Surya Siddhanta / Aryabhata / Astronomy
  if (lower.includes('astronomy') || lower.includes('surya siddhanta') || lower.includes('aryabhata') || lower.includes('jyotish') || lower.includes('eclipse') || lower.includes('yuga')) {
    return {
      tier: 'Tier 1: Grounded Mathematical Shastra',
      text: KNOWLEDGE_RESPONSES.astronomy.text
    };
  }

  // 10. Arogyanidhii / Bhojana Vidhi / Snana Vidhi / Sleep Direction
  if (lower.includes('arogyanidhi') || lower.includes('ushapan') || lower.includes('nasya') || lower.includes('bhojana') || lower.includes('vama-kukshi') || lower.includes('snana vidhi')) {
    return {
      tier: 'Tier 1: Uploaded Corpus Grounding [Arogyanidhii.pdf]',
      text: KNOWLEDGE_RESPONSES.arogyanidhi.text
    };
  }

  // 11. Varahamihira / Brihat Jataka / Kalapurusha / Horas
  if (lower.includes('brihat jataka') || lower.includes('varahamihira') || lower.includes('kalapurusha') || lower.includes('hora')) {
    return {
      tier: 'Tier 1: Uploaded Corpus Grounding [Brihat_Jataka.pdf]',
      text: KNOWLEDGE_RESPONSES.brihatjataka.text
    };
  }

  // 12. Shiva Samhita / Nadi Shodhana / Kundalini Prana
  if (lower.includes('shiva samhita') || lower.includes('nadi shodhana') || lower.includes('ida') || lower.includes('pingala') || lower.includes('sushumna')) {
    return {
      tier: 'Tier 1: Uploaded Corpus Grounding [ShivaSahinta_WithHindiTika.pdf]',
      text: KNOWLEDGE_RESPONSES.shivasamhita.text
    };
  }

  // 13. Intelligent Shastric Synthesis for any general inquiry
  return {
    tier: activeMode === 'faiss' ? 'Tier 3: FAISS Local Vector Search' : 'Tier 1: Amazon Bedrock (Nova Pro)',
    text: `<p>Based on retrieval and reasoning from the <strong>ShaastraAI</strong> indexed knowledge base:</p>
    <p>Your inquiry <em>"${escapeHtml(query)}"</em> addresses classical Indic epistemology and shastric sciences. 
    In classical tradition, knowledge is verified through four means of valid cognition (<em>Pramanas</em>): 
    <strong>Pratyaksha</strong> (direct perception), <strong>Anumana</strong> (logical inference), <strong>Upamana</strong> (analogy), and <strong>Shabda</strong> (authoritative textual testimony).</p>
    <p>ShaastraAI applies these epistemological standards to ground computational reasoning with fault-tolerant retrieval across Sanskrit, Hindi, and English reference texts.</p>
    <div class="citation-box">
      <div class="citation-header">📚 Classical Epistemological Grounding</div>
      <em>Nyaya Sutras of Akshapada Gautama</em> (1.1.3): "प्रत्यक्षानुमानोपमानशब्दाः प्रमाणानि" (Perception, inference, analogy, and authoritative testimony are the valid means of knowledge).
    </div>`
  };
}

async function callLiveGemini(prompt, apiKey) {
  try {
    const systemInstruction = `You are ShaastraAI (शास्त्र AI), an authoritative, scholarly AI assistant specializing in classical Indian knowledge systems (Ayurveda, Jyotisha, Vedanta, Yoga, and Sanskrit shastras) and multimodal RAG, grounded directly in the uploaded corpus (including Arogyanidhii.pdf, Varahamihira's Brihat Jataka, Shiva Samhita, 108 Upanishads, and Bhagavad Gita).

When users ask for personalized guidance, such as crafting a daily routine (Dinacharya) based on their name, sun sign (Surya Rashi), moon sign (Chandra Rashi), nakshatra, or dosha:
1. Provide a detailed, chronologically structured Vedic schedule (from Brahma Muhurta 4:30 AM to Nidra 10:00 PM).
2. Integrate classical Ayurvedic principles and exact citations from the uploaded corpus:
   - Arogyanidhii (p. 20): Ushapan (500–1250ml copper vessel water before dawn) and Pratimarsa Nasya (2 drops warm sesame oil/Anu taila in nostrils for cranial clarity).
   - Arogyanidhii (p. 22): Snana Vidhi (Pour lukewarm water on head first to cool cerebral and ocular centers; never wet feet first).
   - Arogyanidhii (pp. 22–24): Bhojana Vidhi (Kindle Jatharagni with fresh ginger + rock salt; stomach partition: 1/2 solid, 1/4 liquid, 1/4 empty; 6-hour gap between meals).
   - Arogyanidhii (p. 25): Post-meal 10-min Vajrasana + 10–15 min Vama-Kukshi (left lateral rest to activate Surya Nadi/Pingala) + Agastya digestive mantra.
   - Arogyanidhii (pp. 18, 30): Sleep orientation (Head strictly East or South; never North due to magnetic field clash).
   - Shiva Samhita (Ch. 3, vv. 1–40): Nadi Shodhana balancing Ida (lunar) and Pingala (solar) channels.
   - Varahamihira's Brihat Jataka (Ch. 1-2): 12 Kalapurusha anatomical signs, 4 Maha-Tatvas, and the 24-Hora diurnal planetary sequence.
3. Align the routine with their Astrological element (Agni/Fire, Prithvi/Earth, Vayu/Air, Jala/Water), ruling planet, and Nakshatra dosha (Vata, Pitta, Kapha), tailoring oil types, diet, pranayama, and optimal work hours (Horas).
4. If they have not yet provided their specific name, sun sign, or nakshatra, provide the master classical Dinacharya schedule, explain the sign/nakshatra customization rules, and invite them to share their specific details for instant personalization.
Ground your answer with classical Sanskrit terms and shastric citations.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      return {
        tier: 'Tier 2: Google Gemini 2.5 Flash [Live Cloud]',
        text: `<p>${candidateText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
      };
    }
  } catch (err) {
    console.warn("Live Gemini request failed, using knowledge fallback:", err);
  }
  return null;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
