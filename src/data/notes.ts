import type { SOAPNote } from "@/types";

export const mockNotes: SOAPNote[] = [
  {
    id: "note1",
    patientId: "p1",
    date: "2026-03-07",
    subjective:
      "James reports feeling much more confident with his knee. Pain levels have dropped to 2/10 at rest and 4/10 after exercises. He is able to walk without crutches for short distances around the house. He is eager to start more challenging exercises and has been asking about when he can begin jogging. No reports of swelling or giving way. Sleep is unaffected.",
    objective:
      "Active ROM: Flexion 0-125 degrees (improved from 115 last visit). Extension 0 degrees, full. Quad lag: nil. VMO activation: good, 4/5 on MMT. Hamstring strength 4/5. Gait: mild antalgic pattern, reduced stance time on left. No effusion. Lachman test: firm endpoint. Single leg balance: 20 seconds with minimal sway.",
    assessment:
      "Progressing well at 6 weeks post-ACL reconstruction. ROM is on track. Quadriceps strength improving but still a deficit compared to the right side. Gait normalising. Patient is motivated and compliant with home exercise programme. Ready to progress to Phase 2 of rehabilitation focusing on closed-chain strengthening and proprioceptive training.",
    plan:
      "1. Progress to closed-chain exercises: mini squats, leg press (low weight), step-ups (10cm step). 2. Introduce stationary bike for 15 minutes at low resistance. 3. Continue quad sets and SLR with ankle weight (1kg). 4. Proprioception: double-leg balance on wobble board. 5. Education: discussed realistic timeline for return to sport (4-6 months). Next appointment Thursday.",
    therapistName: "Dr. Sarah Thompson",
    signed: true,
    createdAt: "2026-03-07T10:45:00Z",
  },
  {
    id: "note2",
    patientId: "p2",
    date: "2026-03-06",
    subjective:
      "Margaret reports ongoing stiffness in her right shoulder, particularly in the morning. Pain is 5/10 at worst, usually when she reaches behind her back. She can now lift her arm to brush her hair with some difficulty. She is frustrated with the slow pace of recovery but understands this is expected with adhesive capsulitis. She has been diligent with her home exercises. No night pain disturbance.",
    objective:
      "Active ROM Right Shoulder: Flexion 110 degrees (from 95 last month), Abduction 90 degrees (from 80), External rotation 20 degrees (from 10), Internal rotation hand to sacrum. Passive ROM: Flexion 130 degrees, Abduction 110 degrees, ER 30 degrees. Capsular end-feel on all restricted movements. No rotator cuff weakness. Scapular dyskinesis noted with overhead movement.",
    assessment:
      "Adhesive capsulitis right shoulder in the thawing phase. Gradual improvement in ROM over the past 4 weeks, particularly in flexion and external rotation. Capsular pattern restrictions remain. Scapular control needs addressing as ROM increases. Patient responding well to combined mobilisation and active exercise approach.",
    plan:
      "1. Continue Maitland Grade III-IV glenohumeral mobilisations (inferior and posterior glides). 2. Progress active-assisted exercises: wand flexion aiming for 130 degrees, pulleys for ER. 3. Add scapular retraction and lower trapezius strengthening. 4. Home programme: pendulums 3x daily, wand exercises 2x daily, wall walks. 5. Consider hydrotherapy referral for warm-water ROM work. Review in 1 week.",
    therapistName: "Dr. Sarah Thompson",
    signed: true,
    createdAt: "2026-03-06T14:45:00Z",
  },
  {
    id: "note3",
    patientId: "p3",
    date: "2026-03-04",
    subjective:
      "Robert reports his lower back pain has improved since starting the McKenzie exercises. Central back pain is now 3/10, down from 6/10 at initial assessment. The radiating pain into his right buttock has resolved. He still notices increased stiffness after prolonged sitting at work (>45 minutes). He has set up a timer to remind himself to stand and move regularly. No change in bladder or bowel function. No saddle area numbness.",
    objective:
      "Posture: mild thoracic kyphosis with forward head carriage, improved from last visit. Lumbar ROM: Flexion - fingertips to mid-shin (limited by stiffness, not pain), Extension - full range, repeated extension centralises residual symptoms. Neurological: SLR negative bilaterally, L4-S1 dermatomes intact, reflexes normal. Core control: able to activate TrA in supine but loses control in sitting.",
    assessment:
      "L4-L5 disc protrusion responding favourably to McKenzie extension-based approach. Symptoms have centralised and peripheralisation has resolved. Directional preference confirmed as extension. Core stability deficits identified, particularly in functional upright positions. Ergonomic modifications at work are helping but need reinforcement.",
    plan:
      "1. Continue prone press-ups 3x daily (10 reps). 2. Progress core stability: dead bugs, bird dogs with 3-second holds. 3. Introduce seated core activation with neutral spine maintenance. 4. Workstation ergonomic review - consider standing desk recommendation letter. 5. Walking programme: 20 minutes daily at moderate pace. 6. Educate on lifting mechanics for home. Next session Wednesday.",
    therapistName: "Dr. Sarah Thompson",
    signed: true,
    createdAt: "2026-03-04T11:45:00Z",
  },
  {
    id: "note4",
    patientId: "p4",
    date: "2026-03-05",
    subjective:
      "Dorothy is very pleased with her progress since her hip replacement. She reports minimal pain at the surgical site (1/10 at rest, 3/10 after exercises). She has been walking around the house independently and managed a short walk to the letterbox yesterday with her stick. She is sleeping better as she can now lie on her non-operated side with a pillow between her knees. She asks about when she can drive again.",
    objective:
      "Gait: independent with single-point stick, improved cadence and step length compared to last visit. Mild Trendelenburg on right stance phase. Surgical wound healed. Active ROM Right Hip: Flexion 95 degrees, Abduction 25 degrees, Extension 5 degrees. Hip flexor strength 3+/5, abductors 3/5, extensors 3+/5. Sit-to-stand: independent without armrest push.",
    assessment:
      "Excellent progress at 4 weeks post right total hip replacement (posterior approach). Mobilising well with stick. Muscle strength steadily improving. Hip precautions still relevant for another 2 weeks. Sit-to-stand function is good. Trendelenburg gait indicates ongoing gluteus medius weakness that needs targeted work. Driving discussion - typically cleared at 6 weeks post-op.",
    plan:
      "1. Progress hip abductor strengthening: side-lying abduction, standing hip abduction with band. 2. Continue sit-to-stand practice (3x10 daily). 3. Gait training: focus on even weight-bearing and step length symmetry. 4. Outdoor walking with stick, gradually increasing distance (aim for 500m by next week). 5. Stair climbing practice: step-to pattern with rail. 6. Hip precautions until 6-week review with surgeon. Discuss driving at that review. Next session Thursday for formal review.",
    therapistName: "Dr. Sarah Thompson",
    signed: true,
    createdAt: "2026-03-05T09:15:00Z",
  },
  {
    id: "note5",
    patientId: "p5",
    date: "2026-03-07",
    subjective:
      "Ahmed reports his shoulder pain is improving with the modified bowling load. Pain is 3/10 at rest, 5/10 when bowling. He has reduced his bowling volume to 50% of normal as advised. He notices a painful arc between approximately 60-120 degrees of abduction. No night pain. He has been doing his isometric exercises consistently and feels they are helping. He asks about returning to full bowling for the upcoming cricket season.",
    objective:
      "Active ROM: Full flexion and abduction (painful arc 60-120 degrees). External rotation full, internal rotation mildly limited. Resisted tests: Supraspinatus (empty can) 4/5 with pain, infraspinatus 4+/5 pain-free, subscapularis 5/5. Neer's impingement: mildly positive. Hawkins-Kennedy: positive. Scapular control: mild winging on eccentric lowering from flexion. No AC joint tenderness.",
    assessment:
      "Right supraspinatus tendinopathy showing gradual improvement with load management and isometric loading programme. Painful arc consistent with subacromial involvement. Scapular dyskinesis contributing to impingement. Muscle strength improving. Patient is compliant with load modification. Need to progress from isometric to isotonic loading as pain allows. Return to full bowling should be graded over 4-6 weeks.",
    plan:
      "1. Progress to isotonic external rotation with light band (pain must remain <3/10). 2. Continue supraspinatus isometrics at 70% MVC (4x30 seconds). 3. Add scapular stabilisation: prone Y-T-W raises. 4. Pec stretch in doorway 3x30 seconds daily. 5. Maintain 50% bowling volume for another 2 weeks, then increase by 10% per week. 6. Ice after bowling sessions. 7. Review in 1 week to reassess isotonic tolerance.",
    therapistName: "Dr. Sarah Thompson",
    signed: true,
    createdAt: "2026-03-07T15:45:00Z",
  },
  {
    id: "note6",
    patientId: "p9",
    date: "2026-03-07",
    subjective:
      "Daniel reports his ankle feels much more stable. He is walking normally without any limp. Pain is 1/10, only noticeable on uneven ground. He has been wearing his ankle brace for gym work as advised. He tried a light jog on the weekend and had no pain during or after. He is keen to return to basketball and wants to know when he can start playing again.",
    objective:
      "Observation: No visible swelling or bruising. Full weight-bearing, normal gait. Active ROM: Dorsiflexion 12 degrees (left 15 degrees), plantarflexion full, inversion/eversion full. Anterior drawer: negative, firm endpoint. Talar tilt: negative. Single leg balance: 35 seconds eyes open (good), 15 seconds eyes closed (improving). Calf raise endurance: 18 reps (left 25 reps). Star Excursion Balance Test: 85% of uninvolved side.",
    assessment:
      "Grade II right lateral ankle sprain at 3 weeks. Progressing well through rehabilitation. Ligamentous stability restored. Proprioception improving but still deficit on eyes-closed testing. Calf endurance deficit compared to uninvolved side. SEBT approaching acceptable levels for return to sport (>90% is target). Graded return to basketball appropriate within 2-3 weeks.",
    plan:
      "1. Progress proprioception: single leg balance on wobble board, eyes-closed balance to 30 seconds. 2. Calf strengthening: progress to single leg calf raises (3x12). 3. Introduce agility drills: lateral shuffles, cutting movements, figure-of-8 running. 4. Sport-specific: basketball footwork drills, landing mechanics from jumps. 5. Brace for all sport activity for 6 weeks. 6. Return to basketball training at 4 weeks if SEBT >90%. Next session Tuesday.",
    therapistName: "Dr. Michael Rivera",
    signed: true,
    createdAt: "2026-03-07T16:15:00Z",
  },
  {
    id: "note7",
    patientId: "p6",
    date: "2026-03-06",
    subjective:
      "Lisa reports her elbow pain is gradually reducing. She rates her pain as 4/10 with gripping activities, down from 7/10 at the start of treatment. She is managing better at work with the ergonomic mouse and keyboard tray. She still has pain when lifting her coffee cup and opening jars. She has been doing her isometric exercises at her desk as instructed. She reports no pins and needles or numbness in her hand.",
    objective:
      "Inspection: mild tenderness over right lateral epicondyle, reduced from moderate. Grip strength dynamometry: Right 18kg, Left 26kg (previous right 14kg). Pain-free grip: Right 12kg (previous 8kg). Resisted wrist extension: 4/5 with mild pain. Resisted middle finger extension: mild pain at lateral epicondyle. Mill's test: mildly positive. Cervical screen: unremarkable.",
    assessment:
      "Right lateral epicondylalgia showing steady improvement over 12 sessions. Grip strength increasing and pain-free grip improving. Ergonomic modifications at work are reducing aggravating loads. Tendon load tolerance building with the isometric programme. Ready to progress to eccentric loading phase. Continuing to monitor cervical spine as a potential contributor.",
    plan:
      "1. Progress to eccentric wrist extension with 1kg dumbbell (3x15, 5-second eccentric phase). 2. Continue isometric wrist extension holds (4x30 seconds) as warm-up. 3. Add forearm pronation/supination with weighted hammer. 4. Grip strengthening with therapy putty (medium resistance). 5. Workplace: continue ergonomic set-up, avoid carrying heavy bags with involved hand. 6. Review in 1 week to assess eccentric loading tolerance.",
    therapistName: "Dr. Michael Rivera",
    signed: true,
    createdAt: "2026-03-06T10:15:00Z",
  },
  {
    id: "note8",
    patientId: "p14",
    date: "2026-03-04",
    subjective:
      "Natasha reports her left wrist pain is manageable when wearing the splint but increases when she removes it for bathing and certain baby care tasks. Pain is 3/10 with splint, 6/10 without during lifting. She has been practising the ergonomic lifting techniques for picking up and holding her 4-month-old baby. She is breastfeeding and concerned about taking anti-inflammatory medication. Sleep is disrupted by the baby but not specifically by wrist pain.",
    objective:
      "Inspection: mild swelling over radial styloid, tender over first dorsal compartment. Finkelstein's test: positive with moderate pain. Thumb CMC grind: negative. Grip strength: Left 14kg, Right 22kg. Thumb opposition and abduction: full ROM, mildly painful. Wrist ROM: full, pain at end-range ulnar deviation.",
    assessment:
      "Left De Quervain's tenosynovitis in a new mother, likely aggravated by repetitive lifting and holding of infant. Positive Finkelstein's confirms the diagnosis. Splint is helping manage symptoms during daily activities. Ergonomic education for infant handling is important as the baby will only get heavier. Anti-inflammatory options limited due to breastfeeding - topical NSAID may be appropriate with medical clearance.",
    plan:
      "1. Continue wrist splint for all lifting and carrying activities. 2. Gentle Finkelstein stretches (3x5 reps, 15-second holds) if pain <4/10. 3. Tendon gliding exercises for first dorsal compartment (3x daily). 4. Ergonomic baby handling: use both hands, support baby on forearm, avoid sustained thumb abduction grips. 5. Ice massage over radial styloid 5 minutes after aggravating activities. 6. Suggest GP review for topical NSAID suitability during breastfeeding. Review in 1 week.",
    therapistName: "Dr. Sarah Thompson",
    signed: false,
    createdAt: "2026-03-04T11:15:00Z",
  },
  {
    id: "note9",
    patientId: "p12",
    date: "2026-03-05",
    subjective:
      "Emma is feeling confident with her knee and reports no episodes of instability since beginning the strengthening programme. Pain is 1/10, only after high-demand exercises. She has been able to return to light training with her netball team doing non-contact drills. She is wearing her hinged knee brace during all training. She asks about the timeline for returning to competitive matches.",
    objective:
      "Active ROM: 0-140 degrees, full and pain-free. Lachman: Grade 1 laxity, firm endpoint. Pivot shift: negative. Quadriceps strength (isokinetic): 82% of uninvolved side (improved from 70%). Hamstring strength: 90% of uninvolved side. Single leg hop test: 78% of uninvolved side. Y-balance test: within 4cm of uninvolved side on all directions.",
    assessment:
      "Right ACL Grade II sprain managed conservatively. Excellent progress with strengthening and neuromuscular training. Quadriceps strength approaching acceptable levels (target >85%). Hop test needs further improvement (target >90%). No clinical instability with bracing. Patient is coping well with non-contact training. Competitive return should be considered when hop test symmetry exceeds 90% and she passes all return-to-sport criteria.",
    plan:
      "1. Continue quadriceps strengthening: leg press, split squats, step-ups with added weight. 2. Plyometric progression: double-leg hops to single-leg hops, box jumps. 3. Agility: lateral shuffles, cutting with 45-degree angles, reactive agility drills. 4. Sport-specific: netball footwork, landing from jumps, direction changes. 5. Hinged brace for all training and matches. 6. Retest hop test in 2 weeks. If >90%, clear for modified match play. Next session Thursday.",
    therapistName: "Dr. Michael Rivera",
    signed: true,
    createdAt: "2026-03-05T15:15:00Z",
  },
  {
    id: "note10",
    patientId: "p11",
    date: "2026-03-06",
    subjective:
      "George reports his heel pain has reduced since starting the shockwave therapy. Morning first-step pain is now 5/10, down from 8/10 at baseline. The pain improves after walking for a few minutes. His custom orthotics are comfortable and he is wearing them in his work shoes daily. He has lost 2kg since starting the walking programme. He is still unable to walk more than 30 minutes without significant heel pain increasing.",
    objective:
      "Palpation: tender over medial calcaneal tubercle bilaterally, left > right. Windlass test: positive left, negative right. Ankle dorsiflexion (knee extended): Left 5 degrees, Right 8 degrees (target >10 degrees). Calf muscle length: tight gastrocnemius bilaterally. Single leg calf raise: Left 12 reps, Right 18 reps. BMI: 30.2 (down from 31). Gait: mild overpronation bilaterally, improved with orthotics.",
    assessment:
      "Bilateral plantar fasciitis, left > right. Responding positively to shockwave therapy (2 sessions completed). Orthotics addressing overpronation. Persistent gastrocnemius tightness is a modifiable contributing factor. Weight loss is encouraging and will reduce plantar load. Calf endurance deficit on the left needs targeted strengthening. Walking tolerance gradually improving.",
    plan:
      "1. Third shockwave therapy session next Wednesday. 2. Calf stretching: gastrocnemius stretch (3x30 seconds, 3 times daily) and soleus stretch (3x30 seconds). 3. Eccentric calf raises off step: double leg (3x15), progress to single when pain-free. 4. Foot intrinsic strengthening: towel scrunches, marble pickups (2x daily). 5. Walking programme: 25 minutes, increase by 5 min per week if pain <4/10 during. 6. Continue orthotics in all footwear. Weight management: encourage continued dietary modifications. Review Friday.",
    therapistName: "Dr. Sarah Thompson",
    signed: true,
    createdAt: "2026-03-06T12:00:00Z",
  },
];
