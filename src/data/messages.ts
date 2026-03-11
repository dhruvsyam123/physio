import type { Conversation } from "@/types";

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    patientId: "p1",
    patientName: "James Mitchell",
    lastMessage: "Thanks! I'll keep at it. See you Thursday.",
    lastMessageTime: "2026-03-10T18:32:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg1-1",
        conversationId: "conv1",
        senderId: "p1",
        senderName: "James Mitchell",
        senderRole: "patient",
        content:
          "Hi Dr. Thompson, I just wanted to check - is it normal to feel some tightness behind my knee when I do the quad sets? It doesn't hurt exactly, just feels tight.",
        timestamp: "2026-03-10T14:15:00Z",
        read: true,
      },
      {
        id: "msg1-2",
        conversationId: "conv1",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "Hi James! Yes, that's quite normal at this stage. The tightness behind the knee is likely from your hamstring and calf muscles, which can get a bit stiff after surgery. As long as there's no sharp pain or significant swelling, you're fine to continue. Try adding a gentle hamstring stretch - lie on your back and pull your leg toward you with a towel around your foot. Hold for 30 seconds, 3 times.",
        timestamp: "2026-03-10T15:42:00Z",
        read: true,
      },
      {
        id: "msg1-3",
        conversationId: "conv1",
        senderId: "p1",
        senderName: "James Mitchell",
        senderRole: "patient",
        content:
          "That makes sense, thanks! I tried the hamstring stretch and it helped a lot. Also wanted to ask - I did 15 minutes on my flatmate's exercise bike yesterday at low resistance. Is that okay or too soon?",
        timestamp: "2026-03-10T17:08:00Z",
        read: true,
      },
      {
        id: "msg1-4",
        conversationId: "conv1",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "Great initiative! The exercise bike is actually perfect at this stage - it's one of the exercises I was planning to introduce at your next session. Keep the resistance low and the seat high enough that you're not forcing the knee past your comfortable range. 15 minutes is a good starting point. If your knee feels fine the next day, you can continue daily.",
        timestamp: "2026-03-10T18:05:00Z",
        read: true,
      },
      {
        id: "msg1-5",
        conversationId: "conv1",
        senderId: "p1",
        senderName: "James Mitchell",
        senderRole: "patient",
        content:
          "Thanks! I'll keep at it. See you Thursday.",
        timestamp: "2026-03-10T18:32:00Z",
        read: true,
      },
    ],
  },
  {
    id: "conv2",
    patientId: "p4",
    patientName: "Dorothy Williams",
    lastMessage:
      "That's wonderful progress, Dorothy! Keep up the great work and we'll review everything on Thursday.",
    lastMessageTime: "2026-03-10T11:20:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg2-1",
        conversationId: "conv2",
        senderId: "p4",
        senderName: "Dorothy Williams",
        senderRole: "patient",
        content:
          "Good morning Dr. Thompson. I managed to walk to the letterbox and back today without my stick! My son was watching from the door just in case. I'm so happy with this progress.",
        timestamp: "2026-03-10T09:15:00Z",
        read: true,
      },
      {
        id: "msg2-2",
        conversationId: "conv2",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "That's fantastic news, Dorothy! It's great that you had Thomas nearby for safety. For now, I'd still recommend using your stick when you're walking outdoors or on uneven surfaces, especially since you're only 4 weeks post-surgery. Inside the house on flat surfaces, if you feel stable, you can try without it as you did today.",
        timestamp: "2026-03-10T10:03:00Z",
        read: true,
      },
      {
        id: "msg2-3",
        conversationId: "conv2",
        senderId: "p4",
        senderName: "Dorothy Williams",
        senderRole: "patient",
        content:
          "Of course, I'll keep the stick for outside walks. I also wanted to mention that I've been doing my exercises every morning and evening as you prescribed. The sit-to-stand ones are getting much easier - I can do them without pushing off the armrests now.",
        timestamp: "2026-03-10T10:45:00Z",
        read: true,
      },
      {
        id: "msg2-4",
        conversationId: "conv2",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "That's wonderful progress, Dorothy! Keep up the great work and we'll review everything on Thursday.",
        timestamp: "2026-03-10T11:20:00Z",
        read: true,
      },
    ],
  },
  {
    id: "conv3",
    patientId: "p7",
    patientName: "Kevin Park",
    lastMessage:
      "Could I try a short 2km jog this weekend to test it out?",
    lastMessageTime: "2026-03-11T08:14:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "msg3-1",
        conversationId: "conv3",
        senderId: "p7",
        senderName: "Kevin Park",
        senderRole: "patient",
        content:
          "Hi Dr. Rivera, I've been doing the VMO exercises and hip strengthening as prescribed. My knees feel a lot better going up stairs but I still get some aching after sitting in lectures for more than an hour. Should I be worried?",
        timestamp: "2026-03-09T20:30:00Z",
        read: true,
      },
      {
        id: "msg3-2",
        conversationId: "conv3",
        senderId: "therapist1",
        senderName: "Dr. Michael Rivera",
        senderRole: "therapist",
        content:
          "Hey Kevin, that's actually a really common finding with patellofemoral pain - we call it 'movie sign' or 'theatre sign.' The pain with prolonged sitting happens because the kneecap is compressed against the femur when the knee is bent for a long time. Try to take a break every 30-40 minutes during lectures to straighten your legs. You could also sit in an aisle seat so you can extend your legs more easily.",
        timestamp: "2026-03-10T08:15:00Z",
        read: true,
      },
      {
        id: "msg3-3",
        conversationId: "conv3",
        senderId: "p7",
        senderName: "Kevin Park",
        senderRole: "patient",
        content:
          "Oh that makes total sense. I'll try the aisle seat idea - that's clever. My main question is about running. I haven't run in 3 weeks now and I can feel my fitness dropping. I'm getting pretty anxious about losing my base before the uni athletics season.",
        timestamp: "2026-03-10T19:42:00Z",
        read: true,
      },
      {
        id: "msg3-4",
        conversationId: "conv3",
        senderId: "therapist1",
        senderName: "Dr. Michael Rivera",
        senderRole: "therapist",
        content:
          "I completely understand the frustration. The good news is your cardiovascular fitness takes much longer to lose than you think - you won't lose significant fitness in 3 weeks. For now, you can maintain fitness with the bike or swimming (both are low-impact on the knees). We'll look at starting a graded return-to-run programme at your next session if your pain has continued improving. Let's reassess on Wednesday.",
        timestamp: "2026-03-11T07:50:00Z",
        read: true,
      },
      {
        id: "msg3-5",
        conversationId: "conv3",
        senderId: "p7",
        senderName: "Kevin Park",
        senderRole: "patient",
        content:
          "Could I try a short 2km jog this weekend to test it out?",
        timestamp: "2026-03-11T08:14:00Z",
        read: false,
      },
    ],
  },
  {
    id: "conv4",
    patientId: "p9",
    patientName: "Daniel Murphy",
    lastMessage:
      "Perfect, I'll bring my basketball shoes to the next session.",
    lastMessageTime: "2026-03-09T16:55:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg4-1",
        conversationId: "conv4",
        senderId: "therapist1",
        senderName: "Dr. Michael Rivera",
        senderRole: "therapist",
        content:
          "Hi Daniel, just following up from our session today. Remember to wear your ankle brace whenever you're doing any weight-bearing exercise or gym work. Also, please do the ankle eversion exercises with the band (3x15) and single-leg balance (3x30 sec) every evening this week.",
        timestamp: "2026-03-09T14:20:00Z",
        read: true,
      },
      {
        id: "msg4-2",
        conversationId: "conv4",
        senderId: "p9",
        senderName: "Daniel Murphy",
        senderRole: "patient",
        content:
          "Will do, thanks. Just to confirm, am I okay to do upper body weights at the gym? I've been avoiding the gym altogether since the sprain.",
        timestamp: "2026-03-09T15:33:00Z",
        read: true,
      },
      {
        id: "msg4-3",
        conversationId: "conv4",
        senderId: "therapist1",
        senderName: "Dr. Michael Rivera",
        senderRole: "therapist",
        content:
          "Absolutely, upper body work is totally fine. You can also do seated exercises for legs (leg press, seated calf raises, leg extensions) as long as they don't load the ankle into inversion. Just avoid jumping, running, or lateral movements for now. Bring your basketball shoes to the next session - I want to start some light court-specific drills.",
        timestamp: "2026-03-09T16:10:00Z",
        read: true,
      },
      {
        id: "msg4-4",
        conversationId: "conv4",
        senderId: "p9",
        senderName: "Daniel Murphy",
        senderRole: "patient",
        content:
          "Perfect, I'll bring my basketball shoes to the next session.",
        timestamp: "2026-03-09T16:55:00Z",
        read: true,
      },
    ],
  },
  {
    id: "conv5",
    patientId: "p14",
    patientName: "Natasha Ivanova",
    lastMessage:
      "I had a question about the splint - is it okay to wear it while sleeping? My wrist aches in the morning.",
    lastMessageTime: "2026-03-11T07:22:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "msg5-1",
        conversationId: "conv5",
        senderId: "p14",
        senderName: "Natasha Ivanova",
        senderRole: "patient",
        content:
          "Hi Dr. Thompson, I tried the new way of lifting the baby that you showed me, using both hands and scooping instead of gripping with my thumb. It's definitely less painful! Thank you for the demonstration.",
        timestamp: "2026-03-08T10:15:00Z",
        read: true,
      },
      {
        id: "msg5-2",
        conversationId: "conv5",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "I'm so glad that's making a difference, Natasha! The scooping technique really helps avoid the thumb position that aggravates the tendons. Keep practising it, and eventually it'll become second nature. Also, for breastfeeding, try using a nursing pillow to support the baby's weight so your wrists don't have to do all the work.",
        timestamp: "2026-03-08T12:40:00Z",
        read: true,
      },
      {
        id: "msg5-3",
        conversationId: "conv5",
        senderId: "p14",
        senderName: "Natasha Ivanova",
        senderRole: "patient",
        content:
          "Great idea about the nursing pillow - I already have one but wasn't using it consistently. I'll make sure to use it every time. My husband has also been helping more with the lifting which gives my wrist a rest.",
        timestamp: "2026-03-09T09:30:00Z",
        read: true,
      },
      {
        id: "msg5-4",
        conversationId: "conv5",
        senderId: "p14",
        senderName: "Natasha Ivanova",
        senderRole: "patient",
        content:
          "I had a question about the splint - is it okay to wear it while sleeping? My wrist aches in the morning.",
        timestamp: "2026-03-11T07:22:00Z",
        read: false,
      },
    ],
  },
  {
    id: "conv6",
    patientId: "p3",
    patientName: "Robert Nguyen",
    lastMessage:
      "Great, let's discuss the standing desk option at your session tomorrow.",
    lastMessageTime: "2026-03-10T13:45:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg6-1",
        conversationId: "conv6",
        senderId: "p3",
        senderName: "Robert Nguyen",
        senderRole: "patient",
        content:
          "Dr. Thompson, my back is definitely better overall but I had a flare-up yesterday after helping my neighbour move some boxes. The pain went back up to about 5/10 and I felt some tightness in my right buttock again. Should I be concerned?",
        timestamp: "2026-03-10T09:15:00Z",
        read: true,
      },
      {
        id: "msg6-2",
        conversationId: "conv6",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "Hi Robert, sorry to hear about the flare-up. This is a very common and expected part of the recovery process - it doesn't mean you've gone backwards. Lifting heavy objects can temporarily aggravate the disc. Do your prone press-ups more frequently today (every 2 hours, 10 reps) to help centralise the symptoms. Avoid sitting for prolonged periods and try walking gently for 10-15 minutes. If the buttock symptoms don't improve in 48 hours, or if you get any leg weakness, numbness below the knee, or bladder changes, contact me immediately.",
        timestamp: "2026-03-10T10:30:00Z",
        read: true,
      },
      {
        id: "msg6-3",
        conversationId: "conv6",
        senderId: "p3",
        senderName: "Robert Nguyen",
        senderRole: "patient",
        content:
          "Thanks for the quick response. I did the press-ups and went for a walk and the buttock tightness has already eased a lot. I'll be more careful with lifting. I've also been thinking about getting a standing desk at work - my employer might cover it. Would you be able to write a letter supporting that?",
        timestamp: "2026-03-10T13:00:00Z",
        read: true,
      },
      {
        id: "msg6-4",
        conversationId: "conv6",
        senderId: "therapist1",
        senderName: "Dr. Sarah Thompson",
        senderRole: "therapist",
        content:
          "Great, let's discuss the standing desk option at your session tomorrow.",
        timestamp: "2026-03-10T13:45:00Z",
        read: true,
      },
    ],
  },
];
