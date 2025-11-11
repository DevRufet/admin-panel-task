// POST
export interface CreatePostRequest {
  title: string;
  slug: string;
  category: string;
  coverImage: File | string;
  content: string;
  galleryImages?: (File | string)[];
}

// GET
export interface Post {
  id: number;
  coverImage: string;
  title: string;
  slug: string;
  content: string;
  sharingTime: string;
  status: "draft" | "published" | "archived";
  publishStatus: "public" | "private";
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  category: string;
  galleryImages?: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}
