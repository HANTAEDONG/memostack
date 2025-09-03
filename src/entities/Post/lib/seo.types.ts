export interface SEOAnalysis {
  overallScore: number;
  title: {
    current: string;
    suggestions: string[];
    score: number;
    issues: string[];
  };

  metaDescription: {
    current?: string;
    suggestions: string[];
    score: number;
    length: number;
  };

  keywords: {
    primary: string;
    secondary: string[];
    density: number;
    suggestions: string[];
    score: number;
  };

  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    score: number;
    suggestions: string[];
  };

  content: {
    readability: number;
    wordCount: number;
    internalLinks: string[];
    externalLinks: string[];
    score: number;
  };

  improvements: {
    critical: string[];
    important: string[];
    minor: string[];
  };
}
