import React from 'react';

const categories = [
  ['fundamentals', 'Fundamentals'],
  ['backend', 'Backend Engineering'],
  ['systems', 'Systems & Concurrency'],
  ['projects', 'Build Logs'],
  ['now', 'Now'],
  ['meetups', 'Meetups'],
  ['announcements', 'Announcements'],
];

export default function BlogSidebar({ activeSection, onSelect }) {
  return (
    <aside
      style={{
        width: '250px',
        flexShrink: 0,
        borderRight: '1px solid var(--ifm-color-emphasis-200)',
        padding: '1.5rem 1rem',
      }}
    >
      <h3 style={{ marginBottom: '1rem' }}>Blog</h3>

      {categories.map(([value, label]) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '0.6rem 0.75rem',
            marginBottom: '0.25rem',
            border: 'none',
            borderRadius: '6px',
            background:
              activeSection === value
                ? 'var(--ifm-color-emphasis-200)'
                : 'transparent',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          {label}
        </button>
      ))}
    </aside>
  );
}