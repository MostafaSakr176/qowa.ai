// components/LanguageSwitcher.tsx
'use client';

import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;

  // Available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ];

  return (
    <div style={{display: 'flex', gap: '10px'}}>
      {languages.map(lang => {
        // Replace the locale part in the URL
        const newPath = pathname.replace(`/${currentLocale}`, `/${lang.code}`);

        return (
          <Link
            key={lang.code}
            href={newPath}
            style={{
              padding: '6px 12px',
              background: currentLocale === lang.code ? '#0070f3' : '#ddd',
              color: currentLocale === lang.code ? '#fff' : '#000',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            {lang.label}
          </Link>
        );
      })}
    </div>
  );
}
