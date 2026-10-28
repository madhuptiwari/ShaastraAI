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
            text: `<p>${data.reply.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
          };
        }
      }
    } catch (_) {
      // Netlify function not available or running locally
    }

    if (!responseData && apiKey) {
      responseData = await callLiveGemini(userQuery, apiKey);
    }

    if (!responseData) {
      // Classical grounded knowledge base & Dinacharya generator
      responseData = generateGroundedResponse(userQuery, attachedFile);
    }

    removeLoadingIndicator(loadingId);
    appendBotMessage(responseData.text, responseData.tier || 'Vedic Wisdom');
    conversationHistory.push({ role: 'assistant', content: responseData.text });
  } catch (err) {
    removeLoadingIndicator(loadingId);
    console.warn("Consultation fallback:", err);
    const fallbackData = generateGroundedResponse(userQuery, attachedFile);
    appendBotMessage(fallbackData.text, fallbackData.tier || 'Vedic Wisdom');
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
  let userName = "Friend";
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

  const isFullyPersonalized = detectedSignKey || detectedNakshatraKey || userName !== "Friend";
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
    text: `<div class="routine-container">${headerHtml}${timelineHtml}${customizationGuideHtml}${citationHtml}</div>`
  };
}

/**
 * Intelligent Shastric Knowledge Synthesizer
 */
function generateGroundedResponse(query, attachment) {
  const lower = query.toLowerCase();

  // 1. Dinacharya / Daily Routine / Nakshatra / Sun Sign inquiries
  if (isDinacharyaQuery(query)) {
    return generatePersonalizedDinacharya(query);
  }

  // 2. Charaka / Ayurveda / Tridosha / Digestion / Eating / Bhojana Vidhi
  if (lower.includes('charaka') || lower.includes('dosha') || lower.includes('ayurveda') || lower.includes('tridosha') || lower.includes('health') || lower.includes('vata') || lower.includes('pitta') || lower.includes('kapha') || lower.includes('digest') || lower.includes('eat') || lower.includes('food') || lower.includes('bhojana')) {
    return {
      tier: 'Ayurvedic Living',
      text: KNOWLEDGE_RESPONSES.charaka.text
    };
  }

  // 3. Arogyanidhii / Daily habits / Sleep / Water / Ushapan
  if (lower.includes('arogyanidhi') || lower.includes('ushapan') || lower.includes('nasya') || lower.includes('snana') || lower.includes('sleep') || lower.includes('vama-kukshi')) {
    return {
      tier: 'Ayurvedic Lifestyle',
      text: KNOWLEDGE_RESPONSES.arogyanidhi.text
    };
  }

  // 4. Patanjali / Yoga Sutras / Pranayama / Calm / Meditation
  if (lower.includes('patanjali') || lower.includes('yoga') || lower.includes('pranayama') || lower.includes('stress') || lower.includes('calm') || lower.includes('breath') || lower.includes('dhyana') || lower.includes('samadhi')) {
    return {
      tier: 'Yoga & Pranayama',
      text: KNOWLEDGE_RESPONSES.yoga.text
    };
  }

  // 5. Bhagavad Gita / Karma Yoga / Swadharma / Anxiety
  if (lower.includes('gita') || lower.includes('bhagavad') || lower.includes('karma') || lower.includes('swadharma') || lower.includes('anxiety') || lower.includes('work') || lower.includes('peace') || lower.includes('krishna')) {
    return {
      tier: 'Bhagavad Gita Wisdom',
      text: KNOWLEDGE_RESPONSES.gita.text
    };
  }

  // 6. Upanishads / Advaita / Vedanta / Consciousness / Turiya
  if (lower.includes('upanishad') || lower.includes('vedanta') || lower.includes('advaita') || lower.includes('brahman') || lower.includes('atman') || lower.includes('turiya') || lower.includes('mandukya')) {
    return {
      tier: 'Upanishadic Wisdom',
      text: KNOWLEDGE_RESPONSES.upanishad.text
    };
  }

  // 7. Varahamihira / Brihat Jataka / Kalapurusha / Horas / Nakshatras
  if (lower.includes('brihat jataka') || lower.includes('varahamihira') || lower.includes('kalapurusha') || lower.includes('astrolog') || lower.includes('hora') || lower.includes('rashi') || lower.includes('nakshatra')) {
    return {
      tier: 'Vedic Astrology',
      text: KNOWLEDGE_RESPONSES.brihatjataka.text
    };
  }

  // 8. Shiva Samhita / Nadi Shodhana / Nadis / Vital Breath
  if (lower.includes('shiva samhita') || lower.includes('nadi') || lower.includes('ida') || lower.includes('pingala') || lower.includes('sushumna') || lower.includes('prana')) {
    return {
      tier: 'Yogic Science',
      text: KNOWLEDGE_RESPONSES.shivasamhita.text
    };
  }

  // 9. Ritucharya / Seasons
  if (lower.includes('season') || lower.includes('ritu')) {
    return {
      tier: 'Ayurvedic Guidance',
      text: KNOWLEDGE_RESPONSES.ritucharya.text
    };
  }

  // 10. Mind / Mental Focus
  if (lower.includes('mind') || lower.includes('manas') || lower.includes('focus')) {
    return {
      tier: 'Vedic Wisdom',
      text: KNOWLEDGE_RESPONSES.mindPrana.text
    };
  }

  // 11. Diet & Sattva
  if (lower.includes('sattva') || lower.includes('nutrition') || lower.includes('meal')) {
    return {
      tier: 'Ayurvedic Guidance',
      text: KNOWLEDGE_RESPONSES.sattva.text
    };
  }

  // 12. Surya Siddhanta / Classical Astronomy
  if (lower.includes('astronomy') || lower.includes('surya siddhanta') || lower.includes('aryabhata') || lower.includes('yuga')) {
    return {
      tier: 'Vedic Astronomy',
      text: KNOWLEDGE_RESPONSES.astronomy.text
    };
  }

  // 13. General Shastric Synthesis for any general inquiry
  return {
    tier: 'Vedic Wisdom',
    text: `<p>Based on classical Vedic principles and shastric sciences:</p>
    <p>Your inquiry <em>"${escapeHtml(query)}"</em> reflects the deep Indic understanding of harmony between the individual body (<em>Pinda</em> — the microcosm of our human form) and the cosmos (<em>Brahmanda</em> — the macrocosm of the universe).</p>
    <p>In classical tradition, true health and peace (<em>Swastha</em> — being disease-free and happily rooted in one's true Self) is achieved when your daily habits, thoughts, and nourishment are aligned with <em>Dharma</em> (natural moral law and living in harmony with nature's circadian rhythms).</p>
    <div class="citation-box">
      <div class="citation-header">📚 Scriptural Sources</div>
      <em>Taittiriya Upanishad</em> & <em>Charaka Samhita</em>: "शरीरमाद्यं खलु धर्मसाधनम्" (The physical body is indeed the prime sacred instrument for fulfilling life's purpose and dharma).
    </div>`
  };
}

async function callLiveGemini(prompt, apiKey) {
  try {
    const systemInstruction = `You are ShaastraAI (शास्त्र AI), a warm, compassionate, and authoritative guide specializing in classical Indian wisdom and scriptures (including Arogyanidhii, Charaka Samhita, Varahamihira's Brihat Jataka, Shiva Samhita, 108 Upanishads, and the Bhagavad Gita).

Your absolute highest priority is LAYMAN CLARITY, ENGAGEMENT, and SCRIPTURAL ACCURACY:
1. WRITE FOR AN EVERYDAY PERSON: Use warm, encouraging, and crystal-clear everyday English. Avoid dense academic jargon or complicated medical/astrological formulas. Explain things so simply and warmly that someone with zero background in Sanskrit or coding feels immediately comfortable and inspired.
2. TRANSLATE EVERY SANSKRIT TERM: Whenever you mention ANY Sanskrit concept or practice (e.g. Dinacharya, Ushapan, Abhyanga, Gandusha, Nasya, Snana, Bhojana Vidhi, Vama-Kukshi, Padabhyanga, Tridosha, Agni, Tatva, Hora, Nadi Shodhana), you MUST immediately follow it with a clear, warm English translation and practical explanation in parentheses or natural prose.
   Example: "Ushapan (drinking warm copper-stored water at dawn to awaken the digestive system)"
   Example: "Vama-Kukshi (resting gently on your left side for 10-15 minutes after lunch to boost digestion)"
   Example: "Abhyanga (a nourishing full-body warm oil massage to calm the nervous system)"
3. CHRONOLOGICAL & ACTIONABLE ROUTINES: When asked for a daily routine (Dinacharya), provide a rich, hour-by-hour schedule from morning waking (Brahma Muhurta) to restful sleep (Nidra).
   Ground the recommendations in:
   - Arogyanidhii (p. 20): Ushapan (warm water at dawn to awaken the gut) and Pratimarsa Nasya (gentle oil drops in nostrils for sensory and eye clarity).
   - Arogyanidhii (p. 22): Snana Vidhi (bathing by pouring water on the head first to cool cranial centers and protect eye vitality; wetting feet first pushes heat upward to the brain).
   - Arogyanidhii (pp. 22–24): Bhojana Vidhi (kindling digestive fire with fresh ginger and rock salt; partitioning the stomach into 1/2 solid, 1/4 liquid, 1/4 empty; maintaining a 6-hour gap between heavy meals).
   - Arogyanidhii (p. 25): Post-meal 10-min Vajrasana (kneeling diamond pose) + 10–15 min Vama-Kukshi (resting on your left side to activate the solar digestive channel) + Agastya digestive mantra.
   - Arogyanidhii (pp. 18, 30): Sleep orientation (head pointed strictly East for learning/clarity or South for longevity; never North due to geomagnetic repulsion causing restlessness).
   - Shiva Samhita (Ch. 3, vv. 1–40): Nadi Shodhana breathwork balancing Ida (cooling lunar) and Pingala (heating solar) channels.
   - Varahamihira's Brihat Jataka (Ch. 1-2): 12 Cosmic Body Signs (Kalapurusha), 4 Elements (Tatvas), and 24 Diurnal Planetary Hours (Horas).
4. SCRIPTURAL SOURCES BOX: Always conclude your response with a clean, beautifully formatted markdown block titled "### 📚 Scriptural Sources" containing exact book titles and page/chapter references.
5. NO TECHNICAL/ENGINEERING JARGON: Never mention internal AI mechanisms, "Tier 1/2/3", "Bedrock failover", "token quotas", "FAISS vectors", or API backends. Present yourself purely as a wise, warm, and helpful guide of the sacred Shastras.`;

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
      throw new Error(`Gemini API Error: ${res.status}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      return {
        tier: 'Vedic Wisdom',
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
