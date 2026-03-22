import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import logo from "../assets/ferias-logo.avif";
import beachBackground from "../assets/bg-ferias.webp";
import { BeachElements } from "./BeachElements";
import { Footer } from "./Footer";
import { MenuGrid } from "./MenuGrid";
const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export interface WPFeaturedMedia {
  source_url: string;
}

export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  slug: string;
  excerpt?: { rendered: string };
  _embedded?: {
    ["wp:featuredmedia"]?: WPFeaturedMedia[];
  };
}


export default function NewsPage() {
  const { id } = useParams();

  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${API}/wp-json/wp/v2/posts/${id}?_embed`);
        const data = await res.json();
        setPost(data);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const featuredImage =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  return (

    <div className="min-h-screen relative overflow-hidden">
      
      {/* Animated Beach Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${beachBackground}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 0%',
          backgroundRepeat: 'no-repeat'
        }}
        animate={{
          scale: [1, 1.05, 1],
          x: [0, -10, 0, 10, 0],
          y: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Light overlay for better content visibility - REDUCED */}
      <div 
        className="fixed inset-0 pointer-events-none z-1"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,247,230,0.15) 100%)'
        }}
      />
      
      {/* Floating Decorations - TEMPORARIAMENTE DESABILITADO */}
      {/* <FloatingDecorations /> */}
      
      {/* Beach Elements - Animated PNGs */}
      <BeachElements />
      
      {/* Header - Ocean Section */}
      <div 
        className="relative pt-10 pb-40 px-4 overflow-hidden"
      >
        <div className="relative z-10 max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <a href="/">
              <img 
                src={logo} 
                alt="Férias da Grama" 
                className="w-full max-w-xs h-auto drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(0,0,0,0.5))'
                }}
              />
            </a>
          </div>
        </div>
        
        {/* Beach Waves Transition - REMOVIDO */}
        {/* <BeachWaves /> */}
      </div>

      {/* Main Content - Beach/Sand Section */}
      <div className="max-w-md mx-auto px-4 -mt-24 pb-12 relative z-20">

        {/* Menu Grid */}
        <div className="mb-8">
          <MenuGrid />
        </div>
         {featuredImage && (
          <img
            src={featuredImage}
            alt={post?.title?.rendered || ""}
            className="rounded-2xl shadow-xl mb-6"
          />
        )}

        {post && (
          <div className="box-txt bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-5">
            <h1 className="text-3xl font-bold text-black mb-4">
              {decodeHtml(post.title.rendered)}
            </h1>

            <div
              className="mb-8 prose prose-invert max-w-none text-black"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}