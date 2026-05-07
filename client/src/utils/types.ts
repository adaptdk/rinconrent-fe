export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

export interface Logo {
  id: number;
  logoText: string;
  logoLink: string;
  image: Image;
}

export interface Link {
  href: string;
  label?: string;
  isExternal?: boolean;
  isButtonLink?: boolean;
  type?: "PRIMARY" | "SECONDARY";
}

export interface PageHeaderProps {
  hideHeader?: boolean;
  headerType?: "text" | "image" | "video";
  headerSize?: "small" | "medium";
  horizontalLayout?: boolean;
  pretitle?: string;
  title?: string;
  subtitle?: string;
  image?: Image | null;
  video?: { url: string; alternativeText?: string | null; mime?: string } | null;
}

export interface NavItem {
  label: string;
  href?: string;
  isExternal?: boolean;
  children?: Link[];
}

export interface GlobalPageHeader {
  logo: Logo;
  topNav: Link[];
  navItems: NavItem[];
  ctaGroup: NavItem;
}

export interface SocialLink {
  id: number;
  platform: "LINKEDIN" | "FACEBOOK" | "INSTAGRAM" | "TWITTER" | "YOUTUBE" | "TIKTOK";
  href: string;
  label: string;
}

export interface FooterMenu {
  id: number;
  title: string;
  links: Link[];
}

export interface GlobalPageFooter {
  logo: Logo;
  footerMenus: FooterMenu[];
  text: string;
}

export type ComponentType =
  | "blocks.hero"
  | "blocks.heading-section"
  | "blocks.card-grid"
  | "blocks.content-with-image"
  | "blocks.faqs"
  | "blocks.person-card"
  | "blocks.markdown"
  | "blocks.featured-articles"
  | "blocks.newsletter"
  | "blocks.community-links"
  | "blocks.featured-workshops"
  | "blocks.featured-destinations"
  | "blocks.testimonials"
  | "blocks.embed-code";

export interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>
> {
  id?: number;
  __component: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export interface HeroProps extends Base<"blocks.hero"> {
  heading: string;
  text: string;
  mediaType?: "image" | "video";
  image?: Image | null;
  video?: { url: string; alternativeText?: string | null; mime?: string } | null;
  textDark?: boolean;
  links?: Link[];
}

export interface HeadingSectionProps extends Base<"blocks.heading-section"> {
  subHeading: string;
  heading: string;
  anchorLink: string;
}

export interface CardGridProps extends Base<"blocks.card-grid"> {
  card: {
    id: number;
    heading: string;
    text: string;
    image: Image;
  }[];
}

export interface ContentWithImageProps
  extends Base<"blocks.content-with-image"> {
  heading: string;
  text: string;
  imagePosition: "left" | "right" | "full_width";
  image: Image;
  links?: Link[];
}

export interface FaqsProps extends Base<"blocks.faqs"> {
  faq: {
    heading: string;
    text: string;
  }[];
}
export interface PersonCardProps extends Base<"blocks.person-card"> {
  personName: string;
  personJob: string;
  image: Image;
  text: string;
}

export interface MarkdownProps extends Base<"blocks.markdown"> {
  content: string;
}

export interface FeaturedArticlesProps extends Base<"blocks.featured-articles"> {
  articles: {
    id: number;
    documentId: string;
    title: string;
    description: string;
    link: Link;
    publishedAt: string;
    updatedAt: string;
    slug: string;
    author: {
      id: number;
      documentId: string;
      fullName: string;
      image: Image;
    };
    featuredImage: Image;
  }[];
}

export interface NewsletterProps extends Base<"blocks.newsletter"> {
  heading: string;
  text: string;
  placeholder: string;
  label: string;
  formId: string;
}

export interface CommunityLinksProps extends Base<"blocks.community-links"> {
  heading: string;
  link: {
    id?: number;
    title: string;
    description: string;
    href: string;
    label: string;
  }[];
}

export interface FeaturedWorkshopsProps extends Base<"blocks.featured-workshops"> {
  workshops: {
    id: number;
    documentId: string;
    title: string;
    description: string;
    slug: string;
    instructor: string;
    skillLevel: string;
    duration: string;
    price: number;
    coverImage: Image;
  }[];
}

export interface FeaturedDestinationsProps extends Base<"blocks.featured-destinations"> {
  title?: string | null;
  content?: string | null;
  destinations?: {
    id?: number;
    documentId?: string;
    title?: string | null;
    slug: string;
    teaserImage?: Image | null;
  }[];
}

export interface TestimonialsProps extends Base<"blocks.testimonials"> {
  title?: string | null;
  content?: string | null;
  testimonials?: {
    id?: number;
    documentId?: string;
    content: string;
    author: string;
  }[];
}

export interface EmbedCodeProps extends Base<"blocks.embed-code"> {
  code?: string | null;
}

export type BlockData =
  | HeroProps
  | HeadingSectionProps
  | CardGridProps
  | ContentWithImageProps
  | FaqsProps
  | PersonCardProps
  | MarkdownProps
  | FeaturedArticlesProps
  | NewsletterProps
  | CommunityLinksProps
  | FeaturedWorkshopsProps
  | FeaturedDestinationsProps
  | TestimonialsProps
  | EmbedCodeProps;
