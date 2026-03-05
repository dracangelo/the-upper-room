"use client";

import { useState, useEffect, useRef, ReactNode, JSX } from "react";

// Sample Bible verses database (in production, this would be a full API)
const bibleVerses: Record<string, { text: string; translation: string }> = {
  "John 3:16": {
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    translation: "ESV"
  },
  "John 3:17": {
    text: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.",
    translation: "ESV"
  },
  "Romans 3:23": {
    text: "For all have sinned and fall short of the glory of God.",
    translation: "ESV"
  },
  "Romans 6:23": {
    text: "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.",
    translation: "ESV"
  },
  "Ephesians 2:8": {
    text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.",
    translation: "ESV"
  },
  "Philippians 4:13": {
    text: "I can do all things through him who strengthens me.",
    translation: "ESV"
  },
  "Psalm 23:1": {
    text: "The Lord is my shepherd; I shall not want.",
    translation: "ESV"
  },
  "Proverbs 3:5": {
    text: "Trust in the Lord with all your heart, and do not lean on your own understanding.",
    translation: "ESV"
  },
  "Jeremiah 29:11": {
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    translation: "ESV"
  },
  "Matthew 28:19": {
    text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    translation: "ESV"
  },
  "Acts 2:42": {
    text: "And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers.",
    translation: "ESV"
  },
  "James 5:16": {
    text: "Therefore, confess your sins to one another and pray for one another, that you may be healed. The prayer of a righteous person has great power as it is working.",
    translation: "ESV"
  },
};

// Regex to match scripture references
const scriptureRegex = /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\s+(\d+):(\d+)(?:-(\d+))?\b/g;

interface ScriptureTooltipProps {
  reference: string;
  children: ReactNode;
}

function ScriptureTooltip({ reference, children }: ScriptureTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const verse = bibleVerses[reference];

  return (
    <span className="relative inline-block">
      <span
        className="text-[#C9A227] font-semibold cursor-pointer hover:underline decoration-2 underline-offset-2"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </span>
      {isVisible && verse && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80">
          <div className="bg-[#1E2A38] text-white p-4 rounded-lg shadow-xl border border-[#C9A227]">
            <div className="text-[#C9A227] font-semibold text-sm mb-2">{reference} ({verse.translation})</div>
            <p className="text-sm leading-relaxed italic">"{verse.text}"</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-[#1E2A38] border-r border-b border-[#C9A227]"></div>
          </div>
        </div>
      )}
    </span>
  );
}

interface ScriptureTextProps {
  children: string;
  className?: string;
}

export function ScriptureText({ children, className = "" }: ScriptureTextProps) {
  const parseText = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex
    scriptureRegex.lastIndex = 0;

    while ((match = scriptureRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const reference = match[0];
      parts.push(
        <ScriptureTooltip key={`${match.index}-${reference}`} reference={reference}>
          {reference}
        </ScriptureTooltip>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return <span className={className}>{parseText(children)}</span>;
}

// Standalone verse lookup component
interface VerseLookupProps {
  initialReference?: string;
}

export function VerseLookup({ initialReference = "" }: VerseLookupProps) {
  const [reference, setReference] = useState(initialReference);
  const [verse, setVerse] = useState(bibleVerses[initialReference] || null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setVerse(bibleVerses[reference] || null);
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Scripture Lookup</h3>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g., John 3:16"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
          onKeyDown={(e) => e.key === "Enter" && handleLookup()}
        />
        <button
          onClick={handleLookup}
          disabled={isSearching}
          className="btn-primary"
        >
          {isSearching ? "Searching..." : "Lookup"}
        </button>
      </div>
      
      {verse ? (
        <div className="bg-[#FDFBF7] border-l-4 border-[#C9A227] p-4 rounded">
          <p className="text-lg italic text-[#1E2A38] mb-2">"{verse.text}"</p>
          <p className="text-sm text-[#C9A227] font-semibold">— {reference} ({verse.translation})</p>
        </div>
      ) : reference ? (
        <p className="text-gray-500 text-center py-4">
          Verse not found. Try format: "John 3:16"
        </p>
      ) : null}
    </div>
  );
}

// Bible verse display component for posts
interface BibleQuoteProps {
  reference: string;
  className?: string;
}

export function BibleQuote({ reference, className = "" }: BibleQuoteProps) {
  const verse = bibleVerses[reference];

  if (!verse) {
    return (
      <div className={`bible-verse ${className}`}>
        <p className="text-gray-500">[Verse not available: {reference}]</p>
      </div>
    );
  }

  return (
    <blockquote className={`bible-verse ${className}`}>
      <p>{verse.text}</p>
      <footer className="text-[#C9A227] font-semibold mt-2 not-italic">
        — {reference} ({verse.translation})
      </footer>
    </blockquote>
  );
}
