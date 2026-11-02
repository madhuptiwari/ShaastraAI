/**
 * ShaastraAI — Frontend Portal Logic & Interactive Assistant
 * Your Personal Vedic Wisdom & Daily Routine Companion
 */

// State
let conversationHistory = [];
let currentAttachment = null;
let activeMode = 'auto'; // 'auto'

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
            tier: 'Vedic Wisdom',
            rawText: data.reply,
            text: `<p>${data.reply.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
          };
        }
      }
    } catch (_) {
      // Netlify function not available or running locally
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

function appendBotMessage(htmlContent, tierLabel = 'Vedic Wisdom') {
  if (!chatMessages) return;
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
        <span class="mini-pill">${escapeHtml(tierLabel)}</span>
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
 * Multi-Turn User Profile & Intent Accumulator
 */
function extractUserProfile(history, currentQuery) {
  const allUserTexts = (history || [])
    .filter(turn => turn.role === 'user')
    .map(turn => turn.content)
    .concat([currentQuery || '']);
  const combined = allUserTexts.join(' ').toLowerCase();

  let name = "Friend";
  const namePatterns = [
    /(?:my\s+name\s+is|name\s*(?::|is)?|i\s+am)\s+([a-zA-Z]+)/i,
    /for\s+([a-zA-Z]+)(?:\s+with|\s+whose|\s*,|\s+and|\s+having)/i
  ];
  for (const text of allUserTexts) {
    for (const pat of namePatterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        const candidate = match[1].trim();
        const forbidden = ['a', 'my', 'the', 'make', 'create', 'give', 'leo', 'aries', 'taurus', 'gemini', 'cancer', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        if (!forbidden.includes(candidate.toLowerCase())) {
          name = candidate.charAt(0).toUpperCase() + candidate.slice(1);
          break;
        }
      }
    }
    if (name !== "Friend") break;
  }

  let detectedSignKey = null;
  for (const signKey of Object.keys(RASHI_DATA)) {
    if (combined.includes(signKey)) {
      detectedSignKey = signKey;
      break;
    }
  }

  let detectedNakshatraKey = null;
  for (const nakKey of Object.keys(NAKSHATRA_DATA)) {
    if (combined.includes(nakKey)) {
      detectedNakshatraKey = nakKey;
      break;
    }
  }

  let detectedDosha = null;
  if (combined.includes('pitta')) detectedDosha = 'Pitta (Fire/Metabolic)';
  else if (combined.includes('vata')) detectedDosha = 'Vata (Air/Nervous)';
  else if (combined.includes('kapha')) detectedDosha = 'Kapha (Earth/Water)';

  const rashi = detectedSignKey ? RASHI_DATA[detectedSignKey] : RASHI_DATA['leo'];
  const nakshatra = detectedNakshatraKey ? NAKSHATRA_DATA[detectedNakshatraKey] : NAKSHATRA_DATA['magha'];

  return {
    name,
    signKey: detectedSignKey,
    rashi,
    nakshatraKey: detectedNakshatraKey,
    nakshatra,
    dosha: detectedDosha || (rashi ? rashi.dosha : 'Pitta-Vata')
  };
}

/**
 * Checks if the user is requesting an initial daily schedule
 */
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
  const userName = profile.name !== "Friend" ? profile.name : "Friend";
  const rashi = profile.rashi;
  const nakshatra = profile.nakshatra;
  const signTitle = profile.signKey ? rashi.sanskrit : "Surya Rashi";

  // 1. Follow-up on Step 1: Waking / Brahma Muhurta / Early vs Late Waking
  if (q.includes('4:30') || q.includes('brahma') || (q.includes('wake') && (q.includes('why') || q.includes('early') || q.includes('late') || q.includes('7') || q.includes('8') || q.includes('cannot') || q.includes("can't") || q.includes('instead') || q.includes('time'))) || q.includes('step 1')) {
    const isAskingWhy = q.includes('why') || q.includes('reason');
    const isWakingLater = q.includes('7') || q.includes('8') || q.includes('late') || q.includes("can't") || q.includes('cannot') || q.includes('work');
    
    let advice = "";
    if (isWakingLater) {
      advice = `<p>Namaste <strong>${escapeHtml(userName)}</strong>! Classical Ayurveda is deeply compassionate and realistic. In the <em>Charaka Samhita</em>, when an ideal guideline does not fit your current work or night schedule, you should adopt <strong>Padamshika Krama</strong> (the principle of gradual step-by-step transition):</p>
      <ul>
        <li><strong>Do not force an abrupt shock:</strong> Shifting instantly from 8:00 AM to 4:30 AM will only aggravate your ${rashi.element.includes("Agni") ? "Pitta (causing irritability and headaches)" : "Vata (causing restlessness)"}. Instead, shift your waking time backward by 15–20 minutes every 4–5 days.</li>
        <li><strong>If your job requires late sleep:</strong> If you must wake at 7:00 AM or 8:00 AM, the most critical rule from <strong>Arogyanidhii (p. 20)</strong> is: <em>never jump straight from bed into high-stress screens or cold foods</em>. Spend your first 15 minutes in quiet hydration (Ushapan) and 5 minutes of gentle diaphragmatic breathing to stabilize your circadian rhythm.</li>
      </ul>`;
    } else {
      advice = `<p>Namaste <strong>${escapeHtml(userName)}</strong>! The recommendation to awaken during <strong>Brahma Muhurta (04:30 AM – 05:15 AM)</strong> is grounded in both cosmological rhythm and human physiology:</p>
      <ul>
        <li><strong>Peak Atmospheric Sattva (Purity & Calm):</strong> Approximately 96 minutes (2 Muhurtas) before sunrise, atmospheric turbulence and noise are at their lowest. <em>Ashtanga Hridaya (Sutrasthana Ch. 2)</em> declares: <em>"ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः"</em> — awakening at this sacred hour preserves cellular vitality and longevity.</li>
        <li><strong>Elemental Prana:</strong> Nascent oxygen and pure Prana are at their cleanest before the sun triggers thermal convection. For someone with your <strong>${signTitle}</strong>, awakening in the quiet dawn prevents morning cortisol spikes and anchors deep focus for the entire day.</li>
      </ul>`;
    }

    return {
      tier: "Dinacharya Adaptation",
      rawText: `Guidance for ${userName} on Brahma Muhurta and morning waking from Arogyanidhii p. 18 and Ashtanga Hridaya Sutrasthana Ch. 2.`,
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
    return {
      tier: "Ayurvedic Hygiene",
      rawText: `Guidance for ${userName} on Ushapan (copper water) and Nasya from Arogyanidhii p. 20.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! Let's explore <strong>Step 2 of your morning routine: Ushapan & Nasya</strong> in detail:</p>
      <ul>
        <li><strong>Why Copper-Stored Water (Tamra Jal)?</strong> According to <strong>Arogyanidhii (p. 20)</strong>, drinking 500–1000 ml of pure water stored overnight in a clean copper vessel naturally ionizes the water with trace minerals. This stimulates natural gastrointestinal peristalsis, clears overnight Ama (digestive toxins), and cools excess heat.</li>
        <li><strong>What if you don't have a copper vessel?</strong> Pure lukewarm water stored in glass, earthen clay, or stainless steel is completely effective. You can add a pinch of cumin or fennel seeds if your digestion tends to feel sluggish.</li>
        <li><strong>Pratimarsa Nasya (Gentle Nasal Care):</strong> Administering 2 small drops of warm sesame oil or Anu Taila into each nostril lubricates the cranial sinuses, sharpens optical nerve vision (protecting eye health from screen strain), and prevents premature graying (<em>Arogyanidhii p. 20</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Shall we proceed to <strong>Step 3: Abhyanga (Self-Oil Massage)</strong> and the ideal therapeutic oil for your <strong>${signTitle}</strong>?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Arogyanidhii</em>, p. 20 (Ushapan & Pratimarsa Nasya Vidhi) & <em>Charaka Samhita, Sutrasthana Ch. 5</em> (Matrashitiya Adhyaya).
      </div>`
    };
  }

  // 3. Follow-up on Step 3: Abhyanga (Oil Massage) / Gandusha (Oil Pulling) / Best Oil
  if (q.includes('oil') || q.includes('abhyanga') || q.includes('massage') || q.includes('gandusha') || q.includes('step 3') || q.includes('pulling')) {
    return {
      tier: "Ayurvedic Rejuvenation",
      rawText: `Guidance for ${userName} on Abhyanga oil massage from Charaka Samhita Sutrasthana Ch. 5 and Arogyanidhii p. 21.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! Here are the customized guidelines for <strong>Step 3: Abhyanga & Gandusha</strong> tailored to your astrological energy (<strong>${signTitle}</strong>):</p>
      <ul>
        <li><strong>Your Prescribed Oil:</strong> <strong>${rashi.oil}</strong>. Because your sign is governed by <strong>${rashi.element}</strong>, this oil directly soothes your <strong>${profile.dosha}</strong> tendencies, nourishing the seven bodily tissues (Dhatus) and grounding the nervous system.</li>
        <li><strong>Quick 5-Minute Routine (Shiro-Karna-Pada):</strong> If a full-body oil massage isn't practical every morning before work, classical shastras prescribe massaging just three key centers: the <strong>crown of the head (Shiro)</strong>, the <strong>ears (Karna)</strong>, and the <strong>soles of the feet (Pada)</strong>. This delivers 80% of the neurological benefits in 5 minutes!</li>
        <li><strong>Gandusha (Oil Pulling):</strong> Swishing warm sesame oil in the mouth for 3–5 minutes strengthens gums, whitens teeth, and prevents dryness of the throat and lips (<em>Arogyanidhii p. 21</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to move into <strong>Step 4: Morning Yoga & Shiva Samhita Pranayama</strong> next?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Charaka Samhita, Sutrasthana Ch. 5, Verses 85–90</em> (Benefits of Daily Abhyanga) & <em>Arogyanidhii</em>, p. 21 (Snana-Purva Abhyanga & Gandusha).
      </div>`
    };
  }

  // 4. Follow-up on Step 4: Vyayama (Exercise), Asanas & Shiva Samhita Pranayama
  if (q.includes('step 4') || q.includes('yoga') || q.includes('pranayama') || q.includes('nadi shodhana') || q.includes('breath') || q.includes('exercise') || q.includes('workout') || q.includes('asana')) {
    return {
      tier: "Yogic Science",
      rawText: `Guidance for ${userName} on Vyayama and Nadi Shodhana from Shiva Samhita Ch. 3 and Arogyanidhii p. 21.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! Here is how to practice <strong>Step 4: Morning Movement & Pranayama</strong> safely and effectively:</p>
      <ul>
        <li><strong>The Ardha Shakti Rule (Arogyanidhii p. 21):</strong> Exercise only up to <em>half your physiological capacity</em> (stopping when light perspiration beads on your forehead, armpits, and tip of the nose). Never push to extreme breathless exhaustion, which depletes Ojas (vital immunity).</li>
        <li><strong>Tailored Yoga Movement:</strong> ${rashi.exercise}.</li>
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
      rawText: `Guidance for ${userName} on Snana Vidhi bathing order from Arogyanidhii p. 22.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! <strong>Snana Vidhi (Mindful Bathing Order)</strong> from <strong>Arogyanidhii (p. 22)</strong> contains profound neurological wisdom:</p>
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
      rawText: `Guidance for ${userName} on Bhojana Vidhi and Vama-Kukshi from Arogyanidhii pp. 22-25.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! Here is the complete breakdown of <strong>Step 7: Madhyahna Bhojana Vidhi (Midday Meal) & Vama-Kukshi</strong> from <strong>Arogyanidhii (pp. 22–25)</strong>:</p>
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
      rawText: `Guidance for ${userName} on 24 Horas from Varahamihira's Brihat Jataka Ch. 1 v. 9.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! In classical Vedic astrology, scheduling high-priority activities with the <strong>24 Diurnal Horas (Planetary Hours)</strong> connects your work to cosmic rhythms:</p>
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
      rawText: `Guidance for ${userName} on sleep direction and Padabhyanga from Arogyanidhii pp. 18, 30.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! The science of <strong>Nidra (Restorative Sleep)</strong> in <strong>Arogyanidhii (pp. 18, 30)</strong> explains why your sleeping orientation is so crucial:</p>
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
      rawText: `Astrological profile for ${userName} (${signTitle}) from Varahamihira's Brihat Jataka.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! According to <strong>Varahamihira's Brihat Jataka (Ch. 1–2)</strong>, here is the astrological essence of your profile:</p>
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
      rawText: `Guidance for ${userName} on anxiety and peace from Bhagavad Gita 2.47-48 and 3.35.`,
      text: `<p>Namaste <strong>${escapeHtml(userName)}</strong>! The <strong>Bhagavad Gita</strong> offers timeless, practical psychology for soothing anxiety and finding unshakable inner calm:</p>
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
  const userName = profile.name;
  const isFullyPersonalized = profile.signKey || profile.nakshatraKey || userName !== "Friend";
  const rashi = profile.rashi;
  const nakshatra = profile.nakshatra;
  const signTitle = profile.signKey ? rashi.sanskrit : "Surya Rashi Alignment (Solar Vitality)";
  const element = rashi.element;
  const dosha = profile.dosha;
  const oil = rashi.oil;
  const exercise = rashi.exercise;
  const pranayama = rashi.pranayama;
  const nakName = profile.nakshatraKey ? profile.nakshatraKey.charAt(0).toUpperCase() + profile.nakshatraKey.slice(1) : "Nakshatra Resonance";
  const nakDosha = nakshatra.dosha;
  const nakDeity = nakshatra.deity;

  let headerHtml = "";
  if (isFullyPersonalized) {
    headerHtml = `
      <div class="routine-header">
        <h3>🌅 Personalized Vedic Dinacharya (दिनचर्या) for ${escapeHtml(userName)}</h3>
        <div class="routine-badges">
          <span class="badge badge-primary">Rashi: ${signTitle}</span>
          <span class="badge badge-accent">Element: ${element}</span>
          <span class="badge badge-offline">Nakshatra: ${nakName} (${nakDosha})</span>
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
          <strong>1. Brahma Muhurta (ब्राह्मे मुहूर्ते उत्तिष्ठेत् — The sacred dawn hour of pure creative vitality)</strong><br/>
          Awaken 2 Muhurtas (approx. 96 minutes) before sunrise when atmospheric Sattva Guna (pure mental clarity and peace) and cellular Prana (vital oxygen) are at their peak (<em>Ashtanga Hridaya, Sutrasthana Ch. 2</em>). 
          According to <strong>Arogyanidhii (pp. 18, 30)</strong>, awaken facing East or North; never sleep with head towards North due to geomagnetic repulsion.<br/>
          <em>Personal adjustment:</em> ${element.includes("Agni") ? "Awaken gently with slow deep diaphragmatic breathing to keep morning cortisol and Pitta (metabolic heat) balanced." : element.includes("Prithvi") ? "Rise immediately upon waking to break Kapha (morning sluggishness); avoid lingering in bed." : "Sip lukewarm water and ground your restless Vata (air/nervous energy) with quiet gratitude."}
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
          <em>Pranayama:</em> Practice Nadi Shodhana (<strong>Shiva Samhita Ch. 3, vv. 1–40</strong>) — alternate-nostril breathing to harmonize Ida (cooling lunar channel) and Pingala (heating solar channel): <strong>${pranayama}</strong>, followed by 10 minutes of silent Dhyana (peaceful morning meditation) contemplating <em>${nakDeity}</em>.
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
 * Fully Multi-Turn, Stateful, and Scope-Enforcing
 */
function generateGroundedResponse(query, attachment, history) {
  const profile = extractUserProfile(history, query);

  // 1. Mandatory Out-of-Scope Enforcement
  if (isOutOfScope(query)) {
    return getOutOfScopeResponse(profile);
  }

  // 2. Multi-turn Follow-up and Coreference Resolution
  const followUp = resolveConversationalFollowUp(query, profile, history);
  if (followUp) {
    return followUp;
  }

  // 3. Initial Dinacharya Request
  if (isInitialRoutineQuery(query)) {
    return generatePersonalizedDinacharya(query, profile);
  }

  const lower = query.toLowerCase();
  const userName = profile.name !== "Friend" ? ` <strong>${escapeHtml(profile.name)}</strong>` : "";

  // 4. Charaka / Ayurveda / Tridosha
  if (lower.includes('charaka') || lower.includes('dosha') || lower.includes('ayurveda') || lower.includes('tridosha')) {
    return {
      tier: 'Ayurvedic Living',
      rawText: `Charaka Samhita Tridosha guidance customized for ${profile.name} (${profile.dosha}).`,
      text: `<p>Namaste${userName}! In the venerable <strong>Charaka Samhita</strong>, true health (<em>Swastha</em> — being disease-free and happily rooted in one's true Self) is defined as a harmonious equilibrium among the <strong>Tridoshas</strong> (the three governing biological energies: Vata, Pitta, and Kapha), healthy <strong>Dhatus</strong> (the seven vital body tissues building bones, muscle, and blood), proper <strong>Malas</strong> (natural, regular elimination of bodily waste), balanced digestive fire (<em>Agni</em>), and a delighted, peaceful state of the soul, senses, and mind (<em>Atma-Indriya-Manah Prasannah</em>).</p>
      <p>For your astrological profile (<strong>${escapeHtml(profile.rashi.sanskrit)}</strong>), your primary constitutional focus is balancing <strong>${escapeHtml(profile.dosha)}</strong>:</p>
      <ul>
        <li><strong>Vata (Air & Space energies):</strong> Governs physical movement, breathing, nerve impulses, and circulation. Aggravated by cold dryness, irregular eating, and chronic worry. Kept joyful and balanced with warm cooked meals and regular routines.</li>
        <li><strong>Pitta (Fire & Water energies):</strong> Governs internal digestion, enzyme metabolism, body warmth, vision, and mental intelligence. Aggravated by hot spicy foods, midday sun, and intense irritability. Kept joyful and balanced with cooling sweet fruits and staying hydrated.</li>
        <li><strong>Kapha (Water & Earth energies):</strong> Governs physical strength, joint lubrication, immune stability, and emotional calmness. Aggravated by sedentary lounging and heavy cold sweets. Kept joyful and balanced with dynamic morning exercise and early dawn waking.</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to explore which foods or daily habits best support your <strong>${escapeHtml(profile.dosha)}</strong>?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Charaka Samhita, Sutrasthana (Foundational Principles)</em> — Chapter 1 & 28, Verses 41–44: "दोषधातुमलमूलं हि शरीरम्..." (The healthy human body is founded upon balanced energies [Doshas], well-nourished tissues [Dhatus], and timely natural waste elimination [Malas]).
      </div>`
    };
  }

  // 5. Patanjali / Yoga Sutras / Meditation
  if (lower.includes('patanjali') || lower.includes('yoga sutra') || lower.includes('dhyana') || lower.includes('samadhi')) {
    return {
      tier: 'Yoga & Pranayama',
      rawText: `Patanjali Yoga Sutras wisdom on mental stillness for ${profile.name}.`,
      text: `<p>Namaste${userName}! In the <strong>Patanjali Yoga Sutras</strong>, the foundational definition of yoga is:</p>
      <p style="font-size: 1.05rem; font-weight: 600; color: var(--gold-light);"><em>"योगश्चित्तवृत्तिनिरोधः" (Yogaś Citta-Vṛtti-Nirodhaḥ — Yoga is the intentional settling and quieting of restless mental modifications).</em></p>
      <ul>
        <li><strong>Abhyasa (Dedicated Daily Practice):</strong> Cultivating an unbroken rhythm of quiet meditation (Dhyana) and conscious breath (Pranayama).</li>
        <li><strong>Vairagya (Inner Freedom & Non-Attachment):</strong> Letting go of anxious clinging to fleeting circumstances, resting in your true witnessing awareness (<em>Drashta</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Shall we explore how to incorporate a simple 10-minute meditation into your morning or evening routine?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Patanjali Yoga Sutras</em>, Samadhi Pada (Chapter 1, Sutras 2–3 & 12–14).
      </div>`
    };
  }

  // 6. Upanishads / Advaita Vedanta / Consciousness
  if (lower.includes('upanishad') || lower.includes('vedanta') || lower.includes('advaita') || lower.includes('brahman') || lower.includes('atman') || lower.includes('turiya')) {
    return {
      tier: 'Upanishadic Wisdom',
      rawText: `Mandukya Upanishad wisdom on the 4 states of consciousness for ${profile.name}.`,
      text: `<p>Namaste${userName}! In the profound <strong>Mandukya Upanishad</strong> (Atharva Veda), the nature of ultimate reality (<em>Brahman</em> — universal consciousness) and our true inner Self (<em>Atman</em>) is illuminated through the four states of consciousness:</p>
      <ul>
        <li><strong>Jagrat (Waking State):</strong> Our everyday sensory awareness experiencing the material world.</li>
        <li><strong>Swapna (Dream State):</strong> Inward awareness processing subtle memories and emotions.</li>
        <li><strong>Sushupti (Deep Sleep State):</strong> Dreamless restful dissolution into silent restorative peace.</li>
        <li><strong>Turiya (The Fourth State):</strong> Pure timeless witnessing consciousness—ever tranquil (<em>Shantam</em>), benevolent (<em>Shivam</em>), and non-dual (<em>Advaitam</em>).</li>
      </ul>
      <p style="margin-top: 10px;">Would you like to explore how to reflect on this silent presence during your evening meditation?</p>
      <div class="citation-box">
        <div class="citation-header">📚 Scriptural Sources</div>
        <em>Mandukya Upanishad</em> (Atharva Veda), Mantras 2 & 7: "अयमात्मा ब्रह्म..." ("This Self is Brahman").
      </div>`
    };
  }

  // 7. General Shastric Synthesis for other spiritual/lifestyle inquiries
  return {
    tier: 'Vedic Wisdom',
    rawText: `Vedic wisdom for ${profile.name} regarding "${query}".`,
    text: `<p>Namaste${userName}! Based on classical Vedic principles and shastric sciences:</p>
    <p>Your inquiry <em>"${escapeHtml(query)}"</em> reflects the deep Indic understanding of harmony between the individual human microcosm (<em>Pinda</em>) and the cosmic macrocosm (<em>Brahmanda</em>).</p>
    <p>In classical tradition, true health, clarity, and peace (<em>Swastha</em> — being disease-free and happily rooted in one's true Self) is achieved when your daily habits, thoughts, and nourishment are aligned with <em>Dharma</em> (natural moral law and living in harmony with cosmic rhythms).</p>
    <p>For your <strong>${escapeHtml(profile.rashi.sanskrit)}</strong> energy, cultivating balance through regular daily routines (Dinacharya), wholesome seasonal nourishment, and conscious breathwork brings immediate peace and vitality.</p>
    <p style="margin-top: 10px;">How would you like to continue our consultation — would you like to examine your daily timetable, astrological Horas, or Ayurvedic digestion?</p>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Taittiriya Upanishad</em> & <em>Charaka Samhita</em>: "शरीरमाद्यं खलु धर्मसाधनम्" (The physical body is indeed the prime sacred instrument for fulfilling life's purpose and dharma).
    </div>`
  };
}

async function callLiveGemini(prompt, apiKey, history = []) {
  try {
    const systemInstruction = `You are ShaastraAI (शास्त्र AI), an empathetic, highly conversational, and authoritative Vedic Astrology (Jyotisha) and Shastric Lifestyle Companion. You are pre-trained on classical Indian scriptures and astrological treatises:
- Varahamihira's Brihat Jataka (Classical Vedic Astrology, 12 Rashis/Kalapurusha signs, 27 Nakshatras, 24 Diurnal Horas, planetary rulers, elements/tatvas, planetary dignity)
- Arogyanidhii (Daily routine / Dinacharya, Ushapan [dawn hydration] p. 20, Nasya [nasal care] p. 20, Snana Vidhi [bathing order] p. 22, Bhojana Vidhi & stomach partition pp. 22-24, Vama-Kukshi [left-side digestive rest] p. 25, sleep direction & geomagnetic alignment pp. 18, 30)
- Charaka Samhita & Ashtanga Hridaya (Tridoshas [Vata, Pitta, Kapha], Agni digestive fire, Ahara Vidhi, Swastha)
- Shiva Samhita (Yogic physiology, Nadis [Ida, Pingala, Sushumna], Nadi Shodhana breathwork Ch. 3 vv. 1-40)
- Bhagavad Gita (Mind mastery, Karma Yoga, Swadharma, handling modern anxiety and stress)
- 108 Upanishads (Consciousness, Atman, Brahman, Turiya)

YOUR CORE MISSION & INTERACTION PRINCIPLES:
1. CARRY THE CONVERSATION & ADAPT DYNAMICALLY TO THE USER:
   - You are in an ONGOING, MULTI-TURN DIALOGUE. Never treat follow-up questions as isolated one-off prompts.
   - Actively remember and accumulate user details shared across turns: their name, Sun sign (Surya Rashi), Moon sign (Chandra Rashi), Nakshatra, dominant Dosha, health concerns (e.g. digestive weakness, insomnia, stress), work schedule, and lifestyle constraints.
   - RELATE CURRENT INTENT TO PREVIOUS INTENTS: When the user asks a follow-up (e.g. "Why that time?", "What if I can't wake up that early?", "Explain step 3 more", "What should I eat for lunch?", "How does this fit my Leo sign?"), understand immediately which part of previous turns they are referring to. DO NOT re-dump a generic 11-step schedule. Instead, answer their specific follow-up in depth, explaining the shastric reasoning and personalizing it to their situation.
   - PERSONALIZED & PROGRESSIVE: Address the user warmly, reference their past comments, and adapt your recommendations to their specific nature. Always conclude with a thoughtful, conversational follow-up question to keep the dialogue natural and supportive.

2. STRICT SCOPE & GROUNDING IN UPLOADED CORPUS:
   - Ground every astrological, dietary, and lifestyle recommendation strictly in the classical corpus (Varahamihira's Brihat Jataka, Arogyanidhii, Charaka Samhita, Shiva Samhita, Bhagavad Gita, Upanishads).
   - MANDATORY OUT-OF-SCOPE RULE: If the user asks a question OUTSIDE of Vedic astrology, Ayurvedic lifestyle, Dinacharya, Yogic sciences, and classical Indian scriptures (such as computer programming/coding, stock market/crypto trading, modern Western medicine/surgery, contemporary politics, sports, celebrity news, or legal advice):
     * You MUST explicitly and politely state that the inquiry is outside your sacred scope as an AI Astrology & Vedic Shastra Companion.
     * DO NOT attempt to answer or invent Vedic analogies for coding/finance.
     * Warmly guide the user back to what you CAN help them with (e.g., exploring their Rashi/Nakshatra, customizing an Ayurvedic daily timetable, digestion and sleep practices, or Bhagavad Gita wisdom).
     Example response for out-of-scope queries:
     "Namaste. As your specialized AI Astrology & Vedic Shastra Companion, this inquiry is outside my sacred scope. My guidance is dedicated exclusively to classical Vedic astrology (Jyotisha from Varahamihira's Brihat Jataka), Ayurvedic daily routines (Dinacharya from Arogyanidhii and Charaka Samhita), Yogic breathwork (Shiva Samhita), and sacred scriptures. I would be delighted to guide you on understanding your planetary signs, daily routine, or inner balance. How may I assist you on your astrological or lifestyle journey today?"

3. LAYMAN CLARITY & TRANSLATION OF SANSKRIT TERMS:
   - Write in warm, encouraging, crystal-clear everyday English. Avoid dense, intimidating academic jargon.
   - Whenever you introduce ANY Sanskrit term, IMMEDIATELY follow it with a clear, warm English translation and practical explanation in parentheses or natural prose (e.g. "Ushapan (drinking warm copper-stored water at dawn to awaken the digestive tract)", "Vama-Kukshi (resting gently on your left side for 10-15 minutes after lunch to boost digestion)").

4. STRUCTURED RESPONSE FORMAT:
   - Acknowledge and connect to prior conversation context.
   - Provide clear, tailored shastric insight.
   - Offer 1-3 practical action steps.
   - Conclude with a warm, conversational follow-up invitation.
   - Always include a formatted "### 📚 Scriptural Sources" block with exact book titles and page/chapter references.`;

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
