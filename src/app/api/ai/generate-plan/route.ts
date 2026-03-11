import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";
import { GENERATE_PLAN_PROMPT } from "@/lib/ai-prompts";

function getFallbackPlan(
  condition: string,
  goals: string[]
) {
  const conditionLower = condition.toLowerCase();

  const isLowerBack =
    conditionLower.includes("back") || conditionLower.includes("lumbar");
  const isShoulder =
    conditionLower.includes("shoulder") || conditionLower.includes("rotator");
  const isKnee =
    conditionLower.includes("knee") ||
    conditionLower.includes("acl") ||
    conditionLower.includes("patellofemoral");

  if (isLowerBack) {
    return {
      name: `Treatment Plan: ${condition}`,
      phases: [
        {
          name: "Phase 1: Pain Management & Protection",
          weekStart: 1,
          weekEnd: 2,
          notes:
            "Focus on pain reduction, patient education, and gentle activation. Avoid aggravating positions.",
          exercises: [
            {
              exerciseName: "Pelvic Tilts",
              sets: 3,
              reps: 10,
              holdSeconds: 5,
              frequency: "2x daily",
              notes: "Perform in supine with knees bent. Gentle posterior tilt.",
            },
            {
              exerciseName: "Knee-to-Chest Stretch",
              sets: 3,
              reps: 1,
              holdSeconds: 30,
              frequency: "2x daily",
              notes: "Alternate legs. Keep opposite foot flat on floor.",
            },
            {
              exerciseName: "Cat-Cow Stretches",
              sets: 2,
              reps: 10,
              holdSeconds: null,
              frequency: "2x daily",
              notes: "Slow, controlled movement through comfortable range.",
            },
            {
              exerciseName: "Walking Program",
              sets: 1,
              reps: 1,
              holdSeconds: null,
              frequency: "Daily",
              notes: "Start with 10-15 minutes of flat-surface walking.",
            },
          ],
        },
        {
          name: "Phase 2: Core Activation & Mobility",
          weekStart: 3,
          weekEnd: 5,
          notes:
            "Progress core stability exercises. Increase movement tolerance. Begin functional activities.",
          exercises: [
            {
              exerciseName: "Dead Bugs",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "Daily",
              notes: "Maintain neutral spine throughout. Alternate sides.",
            },
            {
              exerciseName: "Bird-Dogs",
              sets: 3,
              reps: 10,
              holdSeconds: 5,
              frequency: "Daily",
              notes: "Focus on minimal trunk rotation during movement.",
            },
            {
              exerciseName: "Glute Bridges",
              sets: 3,
              reps: 12,
              holdSeconds: 3,
              frequency: "Daily",
              notes: "Progress to single-leg when able to complete 3x12 easily.",
            },
            {
              exerciseName: "Hip Flexor Stretch",
              sets: 3,
              reps: 1,
              holdSeconds: 30,
              frequency: "2x daily",
              notes: "Half-kneeling position. Keep trunk upright.",
            },
          ],
        },
        {
          name: "Phase 3: Strengthening & Functional Training",
          weekStart: 6,
          weekEnd: 9,
          notes:
            "Progressive loading. Return to normal daily activities. Address any remaining deficits.",
          exercises: [
            {
              exerciseName: "Goblet Squats",
              sets: 3,
              reps: 12,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Light weight. Full depth as tolerated with neutral spine.",
            },
            {
              exerciseName: "Romanian Deadlifts",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Light dumbbell. Focus on hip hinge pattern.",
            },
            {
              exerciseName: "Side Plank",
              sets: 3,
              reps: 1,
              holdSeconds: 30,
              frequency: "Daily",
              notes: "From knees initially, progress to full position.",
            },
            {
              exerciseName: "Pallof Press",
              sets: 3,
              reps: 10,
              holdSeconds: 3,
              frequency: "3x per week",
              notes: "Band resistance. Focus on anti-rotation control.",
            },
          ],
        },
        {
          name: "Phase 4: Return to Full Activity",
          weekStart: 10,
          weekEnd: 12,
          notes:
            "Sport/activity-specific training. Self-management strategies. Maintenance program.",
          exercises: [
            {
              exerciseName: "Barbell Deadlifts",
              sets: 3,
              reps: 8,
              holdSeconds: null,
              frequency: "2x per week",
              notes: "Progressive loading. Maintain form throughout.",
            },
            {
              exerciseName: "Loaded Carries",
              sets: 3,
              reps: 1,
              holdSeconds: null,
              frequency: "2x per week",
              notes: "Farmer's walks, 30m per set. Moderate weight.",
            },
            {
              exerciseName: "Activity-Specific Drills",
              sets: 2,
              reps: 10,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Tailored to patient's sport or work demands.",
            },
          ],
        },
      ],
    };
  }

  if (isShoulder) {
    return {
      name: `Treatment Plan: ${condition}`,
      phases: [
        {
          name: "Phase 1: Pain Relief & Protected Motion",
          weekStart: 1,
          weekEnd: 2,
          notes:
            "Reduce pain and inflammation. Maintain available ROM. Begin rotator cuff activation.",
          exercises: [
            {
              exerciseName: "Pendulum Exercises",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "3x daily",
              notes: "Small circles, forward/backward, side to side.",
            },
            {
              exerciseName: "Isometric External Rotation",
              sets: 3,
              reps: 10,
              holdSeconds: 10,
              frequency: "2x daily",
              notes: "Elbow at side, press into wall/door frame at 50% effort.",
            },
            {
              exerciseName: "Scapular Squeezes",
              sets: 3,
              reps: 12,
              holdSeconds: 5,
              frequency: "2x daily",
              notes: "Seated or standing. Retract and depress scapulae.",
            },
            {
              exerciseName: "Passive Flexion Stretch",
              sets: 3,
              reps: 1,
              holdSeconds: 30,
              frequency: "2x daily",
              notes: "Supine, use other arm to assist. Pain-free range only.",
            },
          ],
        },
        {
          name: "Phase 2: Active ROM & Early Strengthening",
          weekStart: 3,
          weekEnd: 5,
          notes:
            "Restore full active ROM. Begin progressive cuff strengthening. Address scapular control.",
          exercises: [
            {
              exerciseName: "Theraband External Rotation",
              sets: 3,
              reps: 12,
              holdSeconds: null,
              frequency: "Daily",
              notes: "Elbow at side, light resistance. Slow eccentrics.",
            },
            {
              exerciseName: "Wall Push-Ups with Plus",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "Daily",
              notes: "Protract scapulae at end range of push-up.",
            },
            {
              exerciseName: "Prone Y-T-W Raises",
              sets: 3,
              reps: 8,
              holdSeconds: 3,
              frequency: "Daily",
              notes: "Lying face down on bench. Thumbs up position. No weight initially.",
            },
            {
              exerciseName: "Thoracic Extension on Foam Roller",
              sets: 2,
              reps: 10,
              holdSeconds: null,
              frequency: "Daily",
              notes: "Hands behind head. Extend over roller at mid-back level.",
            },
          ],
        },
        {
          name: "Phase 3: Progressive Strengthening",
          weekStart: 6,
          weekEnd: 9,
          notes:
            "Increase resistance and complexity. Functional movement patterns. Sport-specific prep.",
          exercises: [
            {
              exerciseName: "Dumbbell Shoulder Press",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Light to moderate weight. Scapular plane.",
            },
            {
              exerciseName: "Side-Lying External Rotation",
              sets: 3,
              reps: 12,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Dumbbell, towel roll under arm. 2-3 kg.",
            },
            {
              exerciseName: "Serratus Punches",
              sets: 3,
              reps: 12,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Supine with dumbbell. Protract scapula at top.",
            },
            {
              exerciseName: "Rows with Band",
              sets: 3,
              reps: 12,
              holdSeconds: 2,
              frequency: "3x per week",
              notes: "Squeeze scapulae at end range. Moderate resistance.",
            },
          ],
        },
      ],
    };
  }

  if (isKnee) {
    return {
      name: `Treatment Plan: ${condition}`,
      phases: [
        {
          name: "Phase 1: Pain Management & Quad Activation",
          weekStart: 1,
          weekEnd: 2,
          notes:
            "Control swelling, restore quad activation, maintain ROM. RICE protocol as needed.",
          exercises: [
            {
              exerciseName: "Quad Sets",
              sets: 5,
              reps: 10,
              holdSeconds: 10,
              frequency: "3x daily",
              notes: "Towel under knee, press knee down firmly.",
            },
            {
              exerciseName: "Straight Leg Raises",
              sets: 3,
              reps: 10,
              holdSeconds: 3,
              frequency: "2x daily",
              notes: "Lock knee fully before lifting. All four directions.",
            },
            {
              exerciseName: "Heel Slides",
              sets: 3,
              reps: 15,
              holdSeconds: null,
              frequency: "2x daily",
              notes: "Seated or supine. Work toward full flexion ROM.",
            },
            {
              exerciseName: "Calf Raises",
              sets: 3,
              reps: 15,
              holdSeconds: 2,
              frequency: "Daily",
              notes: "Bilateral. Hold support for balance as needed.",
            },
          ],
        },
        {
          name: "Phase 2: Strengthening & Balance",
          weekStart: 3,
          weekEnd: 6,
          notes:
            "Progressive loading of quadriceps and hip musculature. Introduce balance training.",
          exercises: [
            {
              exerciseName: "Mini Squats (0-45°)",
              sets: 3,
              reps: 12,
              holdSeconds: null,
              frequency: "Daily",
              notes: "Keep knees tracking over toes. Pain-free range.",
            },
            {
              exerciseName: "Step-Ups",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "Daily",
              notes: "15-20cm step. Lead with affected leg going up.",
            },
            {
              exerciseName: "Side-Lying Hip Abduction",
              sets: 3,
              reps: 15,
              holdSeconds: 2,
              frequency: "Daily",
              notes: "Add ankle weight when able (0.5-1kg).",
            },
            {
              exerciseName: "Single Leg Balance",
              sets: 3,
              reps: 1,
              holdSeconds: 30,
              frequency: "Daily",
              notes: "Progress to unstable surface when 30s achieved easily.",
            },
          ],
        },
        {
          name: "Phase 3: Functional & Sport-Specific",
          weekStart: 7,
          weekEnd: 10,
          notes:
            "Higher-level strengthening. Plyometric introduction. Return to running protocol.",
          exercises: [
            {
              exerciseName: "Bulgarian Split Squats",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Bodyweight initially, add dumbbells when form is solid.",
            },
            {
              exerciseName: "Box Jumps",
              sets: 3,
              reps: 8,
              holdSeconds: null,
              frequency: "2x per week",
              notes: "Low box (15cm). Focus on soft landing mechanics.",
            },
            {
              exerciseName: "Lateral Band Walks",
              sets: 3,
              reps: 12,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Medium resistance band above knees. Athletic stance.",
            },
            {
              exerciseName: "Single Leg Romanian Deadlift",
              sets: 3,
              reps: 10,
              holdSeconds: null,
              frequency: "3x per week",
              notes: "Light dumbbell. Focus on hip hinge and knee control.",
            },
          ],
        },
      ],
    };
  }

  // Generic fallback plan
  return {
    name: `Treatment Plan: ${condition}`,
    phases: [
      {
        name: "Phase 1: Acute Management",
        weekStart: 1,
        weekEnd: 2,
        notes: `Initial phase focusing on pain management and protection. Goals: ${goals.slice(0, 2).join(", ") || "Reduce pain, restore basic mobility"}.`,
        exercises: [
          {
            exerciseName: "Gentle Range of Motion",
            sets: 3,
            reps: 10,
            holdSeconds: null,
            frequency: "2x daily",
            notes: "Active-assisted, within pain-free range.",
          },
          {
            exerciseName: "Isometric Strengthening",
            sets: 3,
            reps: 10,
            holdSeconds: 10,
            frequency: "2x daily",
            notes: "Sub-maximal contractions at multiple angles.",
          },
          {
            exerciseName: "Ice/Heat Application",
            sets: 1,
            reps: 1,
            holdSeconds: null,
            frequency: "3x daily",
            notes: "Ice for 15-20 minutes post-exercise. Heat before if stiff.",
          },
        ],
      },
      {
        name: "Phase 2: Restoration",
        weekStart: 3,
        weekEnd: 5,
        notes:
          "Restore full ROM and begin progressive strengthening. Introduce functional movement patterns.",
        exercises: [
          {
            exerciseName: "Active Range of Motion",
            sets: 3,
            reps: 12,
            holdSeconds: null,
            frequency: "Daily",
            notes: "Full available range in all planes of movement.",
          },
          {
            exerciseName: "Progressive Resistance Exercise",
            sets: 3,
            reps: 10,
            holdSeconds: null,
            frequency: "Daily",
            notes: "Start light, progress by 10% when 3x12 is achieved easily.",
          },
          {
            exerciseName: "Stretching Program",
            sets: 3,
            reps: 1,
            holdSeconds: 30,
            frequency: "2x daily",
            notes: "Target all identified tight muscle groups.",
          },
          {
            exerciseName: "Balance / Proprioception",
            sets: 3,
            reps: 1,
            holdSeconds: 30,
            frequency: "Daily",
            notes: "Progress difficulty as able: eyes closed, unstable surface.",
          },
        ],
      },
      {
        name: "Phase 3: Functional Recovery",
        weekStart: 6,
        weekEnd: 9,
        notes:
          "High-level strengthening and functional training. Begin activity-specific preparation.",
        exercises: [
          {
            exerciseName: "Compound Strengthening",
            sets: 3,
            reps: 10,
            holdSeconds: null,
            frequency: "3x per week",
            notes: "Multi-joint exercises with moderate load.",
          },
          {
            exerciseName: "Functional Task Training",
            sets: 3,
            reps: 10,
            holdSeconds: null,
            frequency: "3x per week",
            notes: "Simulate work/sport demands with controlled loading.",
          },
          {
            exerciseName: "Cardiovascular Conditioning",
            sets: 1,
            reps: 1,
            holdSeconds: null,
            frequency: "4x per week",
            notes: "20-30 minutes moderate intensity. Low-impact initially.",
          },
        ],
      },
      {
        name: "Phase 4: Return to Activity",
        weekStart: 10,
        weekEnd: 12,
        notes:
          "Full return to activities. Establish long-term maintenance program. Discharge planning.",
        exercises: [
          {
            exerciseName: "Activity-Specific Drills",
            sets: 3,
            reps: 10,
            holdSeconds: null,
            frequency: "3x per week",
            notes: "Gradual return to full sport/work demands.",
          },
          {
            exerciseName: "Maintenance Strengthening",
            sets: 2,
            reps: 12,
            holdSeconds: null,
            frequency: "2x per week",
            notes: "Key exercises to maintain gains long-term.",
          },
          {
            exerciseName: "Self-Management Program",
            sets: 1,
            reps: 1,
            holdSeconds: null,
            frequency: "Ongoing",
            notes: "Flare-up management plan and prevention strategies.",
          },
        ],
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { condition, patientProfile, goals } = await req.json();

    if (!condition) {
      return NextResponse.json(
        { error: "Condition is required" },
        { status: 400 }
      );
    }

    const prompt = [
      `Condition: ${condition}`,
      `Patient Profile: ${patientProfile || "Adult patient, no significant comorbidities"}`,
      `Goals: ${(goals || []).join(", ") || "Reduce pain, restore function, prevent recurrence"}`,
      "\nGenerate a phased treatment plan with exercises.",
    ].join("\n");

    const result = await generateContent(prompt, GENERATE_PLAN_PROMPT);

    if (!result) {
      return NextResponse.json(getFallbackPlan(condition, goals || []));
    }

    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      // If parsing fails, return fallback
      return NextResponse.json(getFallbackPlan(condition, goals || []));
    }
  } catch (error) {
    console.error("Generate plan API error:", error);
    return NextResponse.json(
      { error: "Failed to generate treatment plan" },
      { status: 500 }
    );
  }
}
