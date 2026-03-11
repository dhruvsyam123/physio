import type { Referral } from "@/types";

export const mockReferrals: Referral[] = [
  {
    id: "ref1",
    patientName: "Priya Sharma",
    referrerName: "Dr. Helen Adams",
    referrerType: "GP",
    date: "2026-03-08",
    condition: "Thoracic Outlet Syndrome (Right)",
    rawText: `Dear Physiotherapist,

Re: Priya Sharma, DOB 15/08/1987
Address: 67 Bourke St, Surry Hills NSW 2010

I am writing to refer Ms. Sharma for physiotherapy assessment and management of suspected right-sided thoracic outlet syndrome.

Ms. Sharma is a 38-year-old software developer who presents with a 3-month history of right arm numbness and tingling, predominantly affecting digits 4 and 5. She also reports aching pain in the right neck and shoulder region, particularly after prolonged computer use. Symptoms are aggravated by overhead activities and carrying bags on the right shoulder.

Relevant History:
- No significant past medical history
- Sedentary occupation with prolonged screen time (8-10 hours/day)
- Non-smoker, occasional alcohol
- No history of cervical trauma

Investigations:
- Cervical spine X-ray: Mild degenerative changes C5-C6, no cervical rib identified
- Nerve conduction studies: Normal (ruling out peripheral entrapment)
- Roos test: Positive at 45 seconds (reproduction of symptoms)
- Adson's test: Positive on the right

I would appreciate your assessment and management. Please focus on postural correction, scalene and pectoralis minor stretching, and ergonomic modifications for her workstation. I have advised her to take regular breaks from computer work.

Please contact me if you have any concerns or if symptoms worsen.

Kind regards,
Dr. Helen Adams
Sydney Central Medical Practice
Ph: (02) 9111 2233`,
    status: "accepted",
    parsedData: {
      patientName: "Priya Sharma",
      dateOfBirth: "1987-08-15",
      condition: "Thoracic Outlet Syndrome (Right)",
      history:
        "38-year-old software developer with 3-month history of right arm numbness and tingling in digits 4-5. Aching in right neck and shoulder. Aggravated by overhead activities and bag carrying. Sedentary occupation. Positive Roos and Adson's tests.",
      goals: [
        "Reduce right arm numbness and tingling",
        "Improve posture and ergonomic workstation setup",
        "Strengthen scapular stabilisers",
        "Enable pain-free computer use for full work days",
      ],
      precautions: [
        "Monitor for vascular symptoms (colour changes, swelling)",
        "Avoid heavy overhead loading initially",
        "Cervical degenerative changes at C5-C6 noted",
      ],
      suggestedFrequency: "2x per week for 6 weeks, then reassess",
    },
  },
  {
    id: "ref2",
    patientName: "Marcus Webb",
    referrerName: "Dr. Jonathan Liu",
    referrerType: "specialist",
    date: "2026-03-06",
    condition: "Post Arthroscopic Shoulder Stabilisation (Right - Bankart Repair)",
    rawText: `Dear Physiotherapy Team,

Re: Marcus Webb, DOB 22/03/1998
Address: 45 Crown St, Woolloomooloo NSW 2011

I performed a right arthroscopic Bankart repair on Mr. Webb on 28 February 2026 for recurrent anterior shoulder instability.

Operative Findings:
- Anterior-inferior labral detachment (3 o'clock to 6 o'clock position)
- Mild Hill-Sachs lesion
- Three suture anchors placed
- Capsular plication performed

Post-operative Protocol:
- Sling immobilisation for 4 weeks (currently in week 1)
- No external rotation beyond neutral for 6 weeks
- No combined abduction and external rotation for 12 weeks
- Passive ROM only for first 4 weeks: flexion to 90 degrees, abduction to 60 degrees
- Active-assisted ROM weeks 4-8
- Strengthening from week 8
- Return to contact sport: minimum 6 months

The patient is a 27-year-old rugby player who has had 3 anterior dislocations in the past 18 months. He is motivated but needs close monitoring to prevent him from progressing too quickly.

Please begin gentle passive ROM within the stated parameters. I will review him at 6 weeks post-op.

Regards,
Dr. Jonathan Liu
Orthopaedic Surgeon, FRACS
Sydney Shoulder & Elbow Clinic
Ph: (02) 9222 4455`,
    status: "pending",
    parsedData: {
      patientName: "Marcus Webb",
      dateOfBirth: "1998-03-22",
      condition: "Post Arthroscopic Bankart Repair (Right Shoulder)",
      history:
        "27-year-old rugby player with recurrent right anterior shoulder instability (3 dislocations in 18 months). Arthroscopic Bankart repair with 3 suture anchors and capsular plication performed 28/02/2026.",
      goals: [
        "Restore full shoulder range of motion within protocol limits",
        "Regain shoulder strength and stability",
        "Return to rugby within 6 months",
        "Prevent recurrent instability",
      ],
      precautions: [
        "No external rotation beyond neutral for 6 weeks",
        "No combined abduction and external rotation for 12 weeks",
        "Passive ROM only for first 4 weeks",
        "Patient tends to over-do things - close monitoring needed",
        "Hill-Sachs lesion present",
      ],
      suggestedFrequency: "2x per week initially, reducing as independent",
    },
  },
  {
    id: "ref3",
    patientName: "Sandra Yip",
    referrerName: "Dr. Priya Mehta",
    referrerType: "GP",
    date: "2026-03-03",
    condition: "Chronic Neck Pain with Associated Headaches",
    rawText: `To the Physiotherapist,

Re: Sandra Yip, DOB 14/06/1972
Medicare: 2345 67890 1

I am referring Ms. Yip for physiotherapy management of chronic neck pain with cervicogenic headaches.

Ms. Yip is a 53-year-old high school teacher who has experienced persistent neck pain and associated headaches for the past 8 months. The headaches originate from the base of the skull and radiate over the top of the head to behind the right eye. They occur 3-4 times per week and are aggravated by prolonged standing (while teaching), marking papers, and stress.

She has tried paracetamol and ibuprofen with partial relief. She is reluctant to take stronger medications.

Previous imaging (6 months ago):
- Cervical X-ray: Moderate degenerative changes C4-C7, mild disc space narrowing C5-C6
- No instability on flexion-extension views

Past Medical History:
- Hypertension (controlled with medication)
- Mild osteoarthritis in both hands
- Anxiety (managed with counselling)

She has not had physiotherapy before and is unsure what to expect. Please assess and treat as appropriate. An EPC referral with 5 sessions is attached.

Warm regards,
Dr. Priya Mehta
Darlinghurst Family Practice
Ph: (02) 9333 4455`,
    status: "reviewed",
    parsedData: {
      patientName: "Sandra Yip",
      dateOfBirth: "1972-06-14",
      condition: "Chronic Neck Pain with Cervicogenic Headaches",
      history:
        "53-year-old teacher with 8-month history of neck pain and cervicogenic headaches (base of skull to behind right eye). Headaches 3-4x/week. Aggravated by prolonged standing and marking. Cervical degenerative changes C4-C7. First time seeing physiotherapy.",
      goals: [
        "Reduce headache frequency and intensity",
        "Decrease neck pain to manageable levels",
        "Improve cervical mobility",
        "Develop self-management strategies for work-related postures",
      ],
      precautions: [
        "Hypertension - monitor with vigorous exercise",
        "Cervical degenerative changes - avoid aggressive manipulation",
        "Anxiety - ensure comfortable and well-explained treatment approach",
        "First-time physio patient - thorough education important",
      ],
      suggestedFrequency: "Weekly for 5 sessions (EPC plan)",
    },
  },
  {
    id: "ref4",
    referrerName: "Emergency Department, Royal Prince Alfred Hospital",
    referrerType: "hospital",
    date: "2026-03-09",
    condition: "Distal Radius Fracture (Left - Colles' Type)",
    rawText: `DISCHARGE REFERRAL - PHYSIOTHERAPY

Patient: Anthony Moretti
DOB: 11/11/1965
UR Number: RPA-881234
Discharge Date: 09/03/2026

Diagnosis: Left distal radius fracture (Colles' type), non-displaced, treated with closed reduction and below-elbow cast.

Mechanism: Fall onto outstretched hand (FOOSH) from standing height.

X-ray Findings: Non-displaced, extra-articular distal radius fracture. Satisfactory alignment on post-reduction films. No ulnar styloid fracture.

Management: Below-elbow fibreglass cast applied. Cast to remain for 6 weeks (removal date approximately 20/04/2026). Follow-up fracture clinic in 2 weeks.

Referral: Please commence physiotherapy for:
1. Finger and thumb ROM exercises while in cast
2. Shoulder and elbow ROM maintenance
3. Oedema management
4. Post-cast removal: wrist and forearm mobilisation, progressive strengthening

Patient is a right-hand dominant 60-year-old restaurant owner. Main concern is returning to work duties as soon as possible.

Allergies: Penicillin
Medications: Nil regular. Paracetamol + codeine PRN for pain.

Regards,
Dr. Emily Tran
Emergency Medicine Registrar
Royal Prince Alfred Hospital`,
    status: "pending",
    parsedData: {
      patientName: "Anthony Moretti",
      dateOfBirth: "1965-11-11",
      condition: "Left Distal Radius Fracture (Colles' Type)",
      history:
        "60-year-old restaurant owner with non-displaced left Colles' fracture from a fall. Closed reduction and below-elbow cast applied. Right-hand dominant. Keen to return to work.",
      goals: [
        "Maintain finger, thumb, shoulder, and elbow ROM while in cast",
        "Manage oedema",
        "Restore wrist and forearm mobility post-cast removal",
        "Rebuild grip and forearm strength for return to work",
      ],
      precautions: [
        "Cast in situ for 6 weeks - no wrist movement until removal",
        "Monitor for signs of compartment syndrome (pain, swelling, numbness)",
        "Penicillin allergy",
        "Codeine use - may affect balance/alertness",
      ],
      suggestedFrequency:
        "Weekly while in cast, then 2x/week post-cast removal for 4-6 weeks",
    },
  },
  {
    id: "ref5",
    patientName: "Claire Beaumont",
    referrerName: "Claire Beaumont",
    referrerType: "self",
    date: "2026-03-10",
    condition: "Postpartum Pelvic Girdle Pain",
    rawText: `Online Booking - Self Referral

Name: Claire Beaumont
DOB: 03/09/1991
Phone: (02) 9444 5566
Email: claire.beaumont@email.com

Reason for Appointment:
I had my second baby 10 weeks ago (vaginal delivery, no complications) and I've been having pain in my pelvis and lower back since about 2 weeks postpartum. The pain is mainly around the front of my pelvis (pubic bone area) and in my right sacroiliac joint. It's worst when I'm getting in and out of the car, turning over in bed, and going up stairs. Walking is okay for about 15 minutes but then the pain increases.

I also feel like my core is very weak and I've noticed a gap in my stomach muscles that I'm worried about. My GP said it might be diastasis recti and suggested I see a physio.

Pain level: About 6/10 on a bad day, 3/10 on a good day.

I'm breastfeeding and not taking any regular medication, just paracetamol when needed.

Previous Issues: I had mild pelvic pain in my first pregnancy (2023) that resolved after delivery. No other injuries or surgeries.

I'd like an appointment as soon as possible please. Mornings work best as my partner can mind the children before work.`,
    status: "converted",
    parsedData: {
      patientName: "Claire Beaumont",
      dateOfBirth: "1991-09-03",
      condition: "Postpartum Pelvic Girdle Pain with Suspected Diastasis Recti",
      history:
        "34-year-old woman, 10 weeks postpartum (second vaginal delivery). Anterior pelvic pain (pubic symphysis) and right SIJ pain since 2 weeks postpartum. Aggravated by transfers, stairs, and prolonged walking. History of mild pelvic pain in first pregnancy. Concerned about abdominal muscle separation.",
      goals: [
        "Reduce pelvic girdle pain to enable daily activities",
        "Assess and manage diastasis recti",
        "Restore core and pelvic floor function",
        "Return to normal activity including exercise",
      ],
      precautions: [
        "Breastfeeding - consider medication limitations",
        "10 weeks postpartum - tissues still healing",
        "Assess pelvic floor before commencing core exercises",
        "May need referral to women's health physio if pelvic floor involvement",
      ],
      suggestedFrequency: "Weekly for 6-8 weeks",
    },
  },
];
