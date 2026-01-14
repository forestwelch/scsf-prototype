import { PortableText as SanityPortableText } from '@portabletext/react';

interface PortableTextProps {
  value: any[];
}

const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold mb-4 mt-6">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold mb-3 mt-5">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-semibold mb-2 mt-4">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-semibold mb-2 mt-3">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-bridge-orange pl-4 italic my-4 text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
    number: ({ children }: any) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ value, children }: any) => {
      const href = value?.href || '#';
      return (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-brand-bridge-orange hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export default function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  return <SanityPortableText value={value} components={components} />;
}
