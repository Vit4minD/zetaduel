import Script from 'next/script';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://zetaduel.vercel.app/#website",
        "url": "https://zetaduel.vercel.app/",
        "name": "ZetaDuel - Multiplayer Arithmetic Game",
        "description": "Multiplayer arithmetic game inspired by Zetamac. Fast-paced mental math battles online.",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://zetaduel.vercel.app/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "WebApplication",
        "@id": "https://zetaduel.vercel.app/#webapp",
        "url": "https://zetaduel.vercel.app/",
        "name": "ZetaDuel",
        "description": "Multiplayer arithmetic game like Zetamac. Challenge opponents in mental math battles with addition, subtraction, multiplication, and division.",
        "applicationCategory": "GameApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiplayer arithmetic battles",
          "Single player practice mode",
          "Real-time competition",
          "Addition, subtraction, multiplication, division",
          "Speed-based scoring",
          "High score tracking"
        ],
        "screenshot": "https://zetaduel.vercel.app/og-image.png",
        "softwareVersion": "1.0.0",
        "datePublished": "2024-01-01",
        "inLanguage": "en-US"
      },
      {
        "@type": "Game",
        "@id": "https://zetaduel.vercel.app/#game",
        "name": "ZetaDuel Arithmetic Game",
        "description": "Fast-paced multiplayer arithmetic game inspired by Zetamac. Test your mental math skills against real opponents.",
        "url": "https://zetaduel.vercel.app/",
        "genre": ["Educational", "Puzzle", "Strategy"],
        "gamePlatform": "Web Browser",
        "numberOfPlayers": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2
        },
        "playMode": ["MultiPlayer", "SinglePlayer"],
        "applicationCategory": "Game",
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://zetaduel.vercel.app/#organization",
        "name": "ZetaDuel Team",
        "url": "https://zetaduel.vercel.app/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "url": "https://zetaduel.vercel.app/logo.png",
          "contentUrl": "https://zetaduel.vercel.app/logo.png",
          "width": 512,
          "height": 512,
          "caption": "ZetaDuel Logo"
        }
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

