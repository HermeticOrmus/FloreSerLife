export type GardenContentType = "article" | "video" | "audio" | "exercise" | "meditation";

export interface GardenContent {
  id: string;
  title: string;
  description?: string;
  content?: string;
  contentType: string;
  fileUrl?: string;
  authorId: string;
  author?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  practitioner?: {
    archetype: string;
    experienceLevel: string;
  };
  createdAt: string;
  seedsReward: number;
  status: string;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  downloadCount: number;
  tags: string[];
}

export const contentTypeOptions = [
  { value: "article", label: "Article", icon: "pencil", description: "Written wisdom and insights" },
  { value: "video", label: "Video", icon: "video", description: "Video tutorials and demonstrations" },
  { value: "audio", label: "Audio", icon: "headphones", description: "Podcasts and audio guides" },
  { value: "exercise", label: "Exercise", icon: "activity", description: "Practical exercises and techniques" },
  { value: "meditation", label: "Meditation", icon: "circle", description: "Guided meditations and practices" },
] as const;

export const getArchetypeIcon = (archetype: string): string => {
  const icons: Record<string, string> = {
    bee: "bee-icon",
    hummingbird: "hummingbird-icon",
    butterfly: "butterfly-icon",
    beetle: "beetle-icon",
  };
  return icons[archetype] || "star";
};

export const getAuthorName = (content: GardenContent): string => {
  if (content.author?.firstName && content.author?.lastName) {
    return `${content.author.firstName} ${content.author.lastName}`;
  }
  return "Anonymous Facilitator";
};

export const getTierName = (seedsBalance: number): string => {
  if (seedsBalance >= 2000) return "Wise Garden";
  if (seedsBalance >= 500) return "Blooming";
  if (seedsBalance >= 100) return "Sprout";
  return "Seedling";
};

export type SortOption = "recent" | "liked" | "viewed";
