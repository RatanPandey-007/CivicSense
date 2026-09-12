import { Layout } from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

interface BlogPost {
  title: string;
  content: string;
  image_url: string;
  category: string;
  author_name: string;
  created_at: string;
  read_time: string;
}

const BlogArticle = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to load article");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding flex flex-col items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-12 h-12 text-primary/50 animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">
            Loading extraordinary stories...
          </p>
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article>
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 overflow-hidden bg-muted/30">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="container-custom max-w-3xl mx-auto section-padding -mt-20 relative">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary font-medium mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>

          <span className="badge-primary mb-4 inline-block">
            <Tag className="w-3 h-3 mr-1" /> {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {post.author_name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />{" "}
              {new Date(post.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.read_time}
            </span>
          </div>

          <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed font-sans prose-img:rounded-xl break-words whitespace-pre-wrap">
            {post.content
              .split("\n")
              .filter((p) => p.trim() !== "")
              .map((paragraph, i) => (
                <p key={i} className="mb-6">
                  {paragraph}
                </p>
              ))}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" /> Share this article
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Facebook className="w-4 h-4 mr-2" /> Facebook
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4 mr-2" /> Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
              </Button>
            </div>
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Read More Articles
            </h3>
            <Button className="btn-gradient" asChild>
              <Link to="/blog">
                Browse All Articles{" "}
                <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogArticle;
