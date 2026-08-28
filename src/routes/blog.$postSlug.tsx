import { createFileRoute, Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock3, Copy, Share2 } from "lucide-react";

import heroChildrenImage from "@/assets/hero-children.jpg";
import studentsImage from "@/assets/students.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchPostBySlug, fetchPosts } from "@/lib/api";
import { formatDate } from "@/lib/date";

async function loadBlogPostPageData(postSlug: string) {
  const post = await fetchPostBySlug(postSlug);
  const allPosts = await fetchPosts(6);
  return { post, allPosts };
}

type BlogPostPageData = Awaited<ReturnType<typeof loadBlogPostPageData>>;

export const Route = createFileRoute("/blog/$postSlug")({
  loader: ({ params }) => loadBlogPostPageData(params.postSlug),
  head: (ctx) => {
    const { post } = ctx.loaderData as BlogPostPageData;
    const description = post?.excerpt ?? "Hope Alliance blog post details.";

    return {
      meta: [
        {
          title: post
            ? `${post.title} | Hope Alliance Blog`
            : "Blog post not found | Hope Alliance",
        },
        { name: "description", content: description },
        { property: "og:title", content: post?.title ?? "Hope Alliance Blog" },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BlogPostModal,
  errorComponent: () => <BlogErrorModal />,
});

function BlogErrorModal() {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => navigate({ to: "/blog" })}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold">Blog not found</h1>
        <p className="mt-2 text-muted-foreground">
          The blog post you&apos;re looking for could not be found. Please return to the blog.
        </p>
        <Button className="mt-6" onClick={() => navigate({ to: "/blog" })}>
          Back to blog
        </Button>
      </div>
    </div>
  );
}

function BlogPostModal() {
  const { post, allPosts } = useLoaderData({ from: "/blog/$postSlug" }) as BlogPostPageData;
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/blog" });
  };

  if (!post) {
    return <BlogErrorModal />;
  }

  const relatedPosts =
    allPosts?.filter((item) => item.category === post.category && item.id !== post.id) ?? [];
  const cover =
    post.cover_image_url ??
    (post.category.toLowerCase().includes("student") ? studentsImage : heroChildrenImage);
  const readingTime = estimateReadingTime(post.content || post.excerpt || "");
  const authorInitials = post.author_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");
  const publishedDate = formatDate(post.published_at, "dd MMMM yyyy");

  const shareStory = async () => {
    try {
      const payload = {
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(payload);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Ignore share failures so the page stays usable.
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Ignore clipboard failures.
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-background animate-in fade-in duration-200"
    >
      <div className="mx-auto w-full max-w-7xl py-6 sm:py-10">
        {/* Action Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Button variant="outline" size="sm" onClick={handleClose}>
            <ArrowLeft className="mr-2 size-4" />
            BACK TO BLOG
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={shareStory}>
              <Share2 className="mr-2 size-4" />
              SHARE
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="mr-2 size-4" />
              COPY LINK
            </Button>
          </div>
        </div>

        {/* Main Content Layout */}
        <article>
          <div className="mx-auto mb-8 max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{post.title}</h1>
          </div>

          <div className="w-full overflow-hidden bg-primary/10">
            <div className="mx-auto aspect-[21/9] max-w-7xl sm:aspect-[2.4/1]">
              <img
                src={cover}
                alt={post.title}
                className="size-full object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-4 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="secondary">{post.category}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock3 className="size-3.5" />
                  {readingTime} min read
                </Badge>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 text-accent" />
                  Published {publishedDate}
                </span>
              </div>

              <div className="space-y-6 pt-4 text-left sm:pt-6">
                <p className="text-lg leading-8 text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className={articleBodyClasses}>
                  <BlogContent content={post.content} />
                </div>
              </div>
            </div>
          </div>

          <aside className="mx-auto mt-10 grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            <Card className="p-6 shadow-card md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                  {authorInitials || "HA"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Article author
                  </p>
                  <h2 className="truncate font-display text-lg font-bold">{post.author_name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Hope Alliance editorial team</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Category
                  </p>
                  <p className="mt-2 text-sm font-semibold">{post.category}</p>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Read time
                  </p>
                  <p className="mt-2 text-sm font-semibold">{readingTime} min</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display text-lg font-bold">Story overview</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Published</dt>
                  <dd className="mt-1 font-medium">{publishedDate}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Author</dt>
                  <dd className="mt-1 font-medium">{post.author_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="mt-1 font-medium">{post.category}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6 shadow-card md:col-span-3">
              <h2 className="font-display text-lg font-bold">Related articles</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {relatedPosts.length > 0 ? (
                  relatedPosts.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      to="/blog/$postSlug"
                      params={{ postSlug: item.slug }}
                      className="group block rounded-2xl border border-border/70 p-4 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/5"
                    >
                      <Badge variant="secondary" className="mb-3">
                        {item.category}
                      </Badge>
                      <h3 className="font-display font-bold group-hover:text-accent">{item.title}</h3>
                      <p className="mt-2 max-h-12 overflow-hidden text-sm text-muted-foreground">
                        {item.excerpt}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No related articles available yet.</p>
                )}
              </div>
            </Card>
          </aside>
        </article>
      </div>
    </div>
  );
}

function BlogContent({ content }: { content: string }) {
  if (looksLikeHtml(content)) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  const paragraphs = content
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 12)}`}
            className="text-[1.05rem] leading-8 text-muted-foreground"
          >
            {paragraph}
          </p>
        ))
      ) : (
        <p className="text-[1.05rem] leading-8 text-muted-foreground">
          This story does not have a detailed body yet. Please check back soon for more information.
        </p>
      )}
    </div>
  );
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function estimateReadingTime(content: string) {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const articleBodyClasses = [
  "space-y-6 leading-8 text-foreground",
  "[&_p]:text-[1.05rem]",
  "[&_p]:leading-8",
  "[&_p]:text-muted-foreground",
  "[&_h2]:mt-10",
  "[&_h2]:font-display",
  "[&_h2]:text-2xl",
  "[&_h2]:font-bold",
  "[&_h3]:mt-8",
  "[&_h3]:font-display",
  "[&_h3]:text-xl",
  "[&_h3]:font-bold",
  "[&_ul]:ml-6",
  "[&_ul]:list-disc",
  "[&_ul]:space-y-3",
  "[&_ol]:ml-6",
  "[&_ol]:list-decimal",
  "[&_ol]:space-y-3",
  "[&_blockquote]:border-l-4",
  "[&_blockquote]:border-accent",
  "[&_blockquote]:pl-4",
  "[&_blockquote]:italic",
  "[&_blockquote]:text-muted-foreground",
  "[&_a]:font-semibold",
  "[&_a]:text-primary",
  "[&_a]:underline",
  "[&_strong]:text-foreground",
].join(" ");