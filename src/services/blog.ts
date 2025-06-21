/**
 * Represents a blog post.
 */
export interface BlogPost {
  /**
   * The title of the blog post.
   */
  title: string;
  /**
   * A short snippet/summary of the blog post.
   */
  snippet: string;
  /**
   * The URL of the external website where the full blog post is located.
   */
  externalUrl: string;
}

/**
 * Asynchronously retrieves a blog post by its ID.
 *
 * @param id The ID of the blog post to retrieve.
 * @returns A promise that resolves to a BlogPost object.
 */
export async function getBlogPost(id: string): Promise<BlogPost> {
  // TODO: Implement this by calling an API.

  return {
    title: 'Sample Blog Post',
    snippet: 'This is a sample blog post snippet.',
    externalUrl: 'https://example.com/blog/sample-post',
  };
}
