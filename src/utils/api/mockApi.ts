import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
} from "../../types/post";

let initialMockPosts: Post[] = [
  {
    id: 1,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    title: "React 18 New Features",
    content: "React 18 brings many new features and improvements...",
    slug: "react-18-new-features",
    sharingTime: "2024-01-20T10:30:00Z",
    status: "published",
    publishStatus: "public",
    author: {
      id: 1,
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    category: "technology",
    galleryImages: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    ],
  },
  {
    id: 2,
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    title: "TypeScript Best Practices",
    content: "Learn the best practices for TypeScript development...",
    slug: "typescript-best-practices",
    sharingTime: "2024-01-18T14:20:00Z",
    status: "draft",
    publishStatus: "private",
    author: {
      id: 2,
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    category: "programming",
    galleryImages: [],
  },
];

const loadPostsFromStorage = (): Post[] => {
  try {
    const saved = localStorage.getItem("mockPosts");
    if (saved) {
      const posts = JSON.parse(saved);

      posts.forEach((post: Post, index: number) => {});
      return posts;
    }
    return initialMockPosts;
  } catch (error) {
    console.error("LocalStorage load error:", error);
    return initialMockPosts;
  }
};

const savePostsToStorage = (posts: Post[]) => {
  try {
    localStorage.setItem("mockPosts", JSON.stringify(posts));

    posts.forEach((post, index) => {});
  } catch (error) {
    console.error(" LocalStorage save error:", error);
  }
};

let mockPosts: Post[] = loadPostsFromStorage();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const processImage = async (image: File | string): Promise<string> => {
  if (typeof image === "string") {
    if (image.startsWith("data:") || image.startsWith("http")) {
      return image;
    }

    return `data:image/jpeg;base64,${image}`;
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;

        resolve(base64);
      };

      reader.onerror = (error) => {
        console.error("FileReader xətası:", error);
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);
        const fallbackUrl = `https://picsum.photos/seed/${timestamp}-${randomId}/800/600`;
        resolve(fallbackUrl);
      };

      reader.onabort = () => {
        console.error("FileReader dayandırıldı");
        const fallbackUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
        resolve(fallbackUrl);
      };

      reader.readAsDataURL(image);
    });
  }
};

export const postsApi = {
  getPosts: async (): Promise<Post[]> => {
    await delay(500);
    mockPosts = loadPostsFromStorage();

    mockPosts.forEach((post, index) => {});

    return mockPosts;
  },

  getPostById: async (id: number): Promise<Post | null> => {
    await delay(300);
    mockPosts = loadPostsFromStorage();
    const post = mockPosts.find((post) => post.id === id) || null;

    if (post) {
    }
    return post;
  },

  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    await delay(600);

    mockPosts = loadPostsFromStorage();

    const coverImageUrl = await processImage(postData.coverImage);

    const galleryImageUrls = postData.galleryImages
      ? await Promise.all(postData.galleryImages.map(processImage))
      : [];

    const newId =
      mockPosts.length > 0 ? Math.max(...mockPosts.map((p) => p.id)) + 1 : 1;

    const newPost: Post = {
      id: newId,
      coverImage: coverImageUrl,
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      sharingTime: new Date().toISOString(),
      status: "draft",
      publishStatus: "public",
      author: {
        id: 1,
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      category: postData.category,
      galleryImages: galleryImageUrls,
    };

    mockPosts.push(newPost);
    savePostsToStorage(mockPosts);

    return newPost;
  },

  updatePost: async (postData: UpdatePostRequest): Promise<Post> => {
    await delay(500);
    mockPosts = loadPostsFromStorage();

    const index = mockPosts.findIndex((post) => post.id === postData.id);
    if (index === -1) throw new Error("Post not found");

    let updatedCoverImage = mockPosts[index].coverImage;
    let updatedGalleryImages = mockPosts[index].galleryImages;

    if (postData.coverImage) {
      updatedCoverImage = await processImage(postData.coverImage);
    } else {
    }

    if (postData.galleryImages) {
      updatedGalleryImages = await Promise.all(
        postData.galleryImages.map(processImage)
      );
    } else {
    }

    const updatedPost: Post = {
      ...mockPosts[index],
      ...postData,
      coverImage: updatedCoverImage,
      galleryImages: updatedGalleryImages,
    };

    mockPosts[index] = updatedPost;
    savePostsToStorage(mockPosts);

    return updatedPost;
  },

  deletePost: async (id: number): Promise<{ success: boolean }> => {
    await delay(400);
    mockPosts = loadPostsFromStorage();
    const initialLength = mockPosts.length;
    mockPosts = mockPosts.filter((post) => post.id !== id);
    savePostsToStorage(mockPosts);

    return { success: true };
  },
};

export const mockApi = {
  ...postsApi,
};
