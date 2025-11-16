import React from 'react';

function DefaultProfileIcon({ size = 150 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
        >
            {/* Gradient Definitions */}
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="personGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
                    <stop offset="100%" style={{ stopColor: '#e0e7ff', stopOpacity: 0.9 }} />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
            </defs>

            {/* Background Circle */}
            <circle
                cx="100"
                cy="100"
                r="98"
                fill="url(#bgGradient)"
                stroke="#ffffff"
                strokeWidth="3"
            />

            {/* Decorative Museum Icon Elements */}
            <g opacity="0.15">
                {/* Columns pattern */}
                <rect x="30" y="40" width="8" height="40" fill="#ffffff" rx="2" />
                <rect x="60" y="40" width="8" height="40" fill="#ffffff" rx="2" />
                <rect x="90" y="40" width="8" height="40" fill="#ffffff" rx="2" />
                <rect x="120" y="40" width="8" height="40" fill="#ffffff" rx="2" />
                <rect x="150" y="40" width="8" height="40" fill="#ffffff" rx="2" />
                {/* Roof */}
                <polygon points="100,20 25,50 175,50" fill="#ffffff" />
            </g>

            {/* User Silhouette */}
            <g filter="url(#shadow)">
                {/* Head */}
                <circle
                    cx="100"
                    cy="85"
                    r="28"
                    fill="url(#personGradient)"
                />
                {/* Body/Shoulders */}
                <ellipse
                    cx="100"
                    cy="155"
                    rx="45"
                    ry="40"
                    fill="url(#personGradient)"
                />
            </g>

            {/* Museum Icon Overlay (small badge) */}
            <g transform="translate(140, 140)">
                <circle cx="0" cy="0" r="22" fill="#ffd700" stroke="#ffffff" strokeWidth="3" />
                <g transform="scale(0.6) translate(-12, -15)">
                    <path
                        d="M12 2 L2 8 L2 10 L22 10 L22 8 Z"
                        fill="#764ba2"
                    />
                    <rect x="5" y="10" width="2" height="10" fill="#764ba2" />
                    <rect x="11" y="10" width="2" height="10" fill="#764ba2" />
                    <rect x="17" y="10" width="2" height="10" fill="#764ba2" />
                    <rect x="2" y="20" width="20" height="2" fill="#764ba2" />
                </g>
            </g>
        </svg>
    );
}

export default DefaultProfileIcon;
