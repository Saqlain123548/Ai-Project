export interface Message {
  id: string;
  timestamp: string;
  sender: {
    id: string;
    avatarUrl: string;
    username: string;
    name: string;
  };
  content: string;
}

export const MESSAGES: Message[] = [
  {
    id: "1",
    timestamp: "2024-01-20T10:00:00Z",
    sender: {
      id: "user1",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@johndoe",
      name: "John Doe",
    },
    content: "Hey Ann! How's the project coming along?",
  },
  {
    id: "2",
    timestamp: "2024-01-20T10:02:00Z",
    sender: {
      id: "ann",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
      name: "Ann Smith",
    },
    content: "Hi John! It's going well. I've been working on the new dashboard design. The wireframes are almost done.",
  },
  {
    id: "3",
    timestamp: "2024-01-20T10:03:00Z",
    sender: {
      id: "ann",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
      name: "Ann Smith",
    },
    content: "I think you'll really like the new navigation structure. It's much more intuitive now.",
  },
  {
    id: "4",
    timestamp: "2024-01-20T10:05:00Z",
    sender: {
      id: "user1",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@johndoe",
      name: "John Doe",
    },
    content: "That sounds great! Can you share the latest mockups? I'd love to take a look.",
  },
  {
    id: "5",
    timestamp: "2024-01-20T10:07:00Z",
    sender: {
      id: "ann",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
      name: "Ann Smith",
    },
    content: "Absolutely! I'll send them over right now. Also, I wanted to ask about the color scheme - are we sticking with the current brand colors?",
  },
  {
    id: "6",
    timestamp: "2024-01-20T10:10:00Z",
    sender: {
      id: "user1",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@johndoe",
      name: "John Doe",
    },
    content: "Yes, let's keep the brand colors consistent. The mockups look fantastic! I especially like the new card layout.",
  },
  {
    id: "7",
    timestamp: "2024-01-20T14:30:00Z",
    sender: {
      id: "ann",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
      name: "Ann Smith",
    },
    content: "Thanks! I've also been thinking about the mobile responsiveness. The current design should work well on smaller screens, but I want to make sure the touch targets are appropriately sized.",
  },
  {
    id: "8",
    timestamp: "2024-01-20T14:35:00Z",
    sender: {
      id: "user1",
      avatarUrl: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@johndoe",
      name: "John Doe",
    },
    content: "Good point about mobile. Let's schedule a quick review meeting tomorrow to go over the responsive design details.",
  },
];
