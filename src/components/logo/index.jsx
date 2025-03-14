import React from 'react'

export const Logo = (props) => {

    let logoWidth = props.width || 186;
    let logoHeight = props.width || 186;

    return (
        <div>
            <div>
                <svg version="1.0"
                    width={logoWidth} height={logoHeight} viewBox="0 0 186 186"
                    preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,189.000000) scale(0.100000,-0.100000)"
                        fill={props.color || '#000000'} stroke="none">
                        <path d="M775 1805 c-267 -50 -485 -218 -610 -470 -21 -43 -38 -91 -38 -106 0
-16 -5 -25 -10 -22 -6 3 -7 2 -4 -4 4 -6 0 -43 -9 -83 -8 -41 -13 -92 -11
-114 3 -39 4 -39 5 9 2 38 5 46 13 35 7 -11 8 -3 3 29 -5 34 -3 42 6 36 10 -6
11 -1 6 21 -4 16 -4 26 -1 22 4 -4 20 27 34 70 70 200 216 364 406 458 134 66
195 79 360 79 127 0 148 -3 224 -28 100 -33 146 -56 221 -108 160 -109 272
-273 321 -469 19 -74 21 -104 17 -230 -5 -128 -9 -156 -37 -238 -31 -94 -76
-182 -91 -182 -5 0 -11 -8 -14 -17 -3 -10 -38 -52 -78 -92 -75 -77 -75 -83 -1
-23 24 19 40 39 36 46 -3 6 -3 8 2 4 4 -4 15 -2 24 5 9 7 6 -1 -6 -18 -28 -40
-103 -110 -175 -163 -63 -46 -78 -67 -25 -33 153 97 244 196 318 346 60 124
87 226 99 375 l9 115 -4 -120 c-8 -241 -97 -450 -255 -600 -109 -103 -120
-114 -120 -109 0 2 -28 -12 -63 -31 -119 -65 -229 -95 -335 -89 -54 2 -59 2
-25 -5 61 -11 64 -21 7 -22 -34 -2 -40 -3 -19 -6 42 -7 164 14 243 41 373 127
612 485 589 880 -14 233 -94 410 -258 574 -198 198 -483 287 -754 237z"/>
                        <path d="M911 1497 c-13 -22 -35 -115 -67 -288 l-47 -256 -81 -12 c-101 -16
-169 -44 -164 -68 2 -12 40 -36 105 -67 l102 -49 -6 -122 c-4 -77 -2 -124 4
-128 6 -4 12 25 16 76 8 106 17 147 32 147 19 0 146 -93 192 -141 65 -69 88
-122 85 -197 -2 -56 0 -63 15 -60 16 3 18 16 19 103 0 73 11 150 38 285 20
102 39 192 42 201 3 12 16 15 62 12 42 -3 53 -2 42 6 -8 6 -28 11 -45 11 -57
1 -58 4 -30 156 14 76 37 190 51 252 28 132 27 122 14 122 -21 0 -41 -66 -80
-271 -23 -118 -43 -222 -46 -231 -5 -16 -22 -18 -165 -18 -150 0 -159 1 -159
19 0 42 81 446 106 534 9 29 -13 19 -35 -16z m246 -569 c-2 -7 -17 -98 -32
-203 -15 -104 -29 -196 -31 -204 -3 -8 -15 1 -32 25 -41 55 -132 136 -203 180
-68 41 -65 28 -37 156 l9 47 47 4 c26 2 100 4 166 5 91 2 117 -1 113 -10z
m-370 -30 c-3 -13 -9 -44 -12 -70 -4 -27 -8 -48 -10 -48 -1 0 -35 15 -76 34
-41 18 -83 36 -93 40 -32 11 -4 28 81 47 108 24 116 24 110 -3z"/>
                    </g>
                </svg>
            </div>
        </div>
    )
}

export const LogoText = (props) => {
    let textHeight = props.height || 54;
    let textWidth = props.height * (276 / 54) || 276;
    return (
        <div>
            <svg
                width={textWidth} height={textHeight} viewBox="0 0 276 54"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,54.000000) scale(0.100000,-0.100000)"
                    fill={props.color || '#000000'} stroke="none">
                    <path d="M220 300 l0 -160 30 0 30 0 0 74 c0 82 12 103 55 92 24 -6 25 -9 25
-86 l0 -80 30 0 30 0 0 85 c0 78 -2 88 -25 110 -27 28 -62 32 -91 10 -10 -8
-21 -15 -24 -15 -3 0 -3 29 -2 65 l4 65 -31 0 -31 0 0 -160z"/>
                    <path d="M550 300 l0 -160 29 0 c29 0 30 2 33 51 l3 50 38 -50 c33 -45 42 -51
73 -51 l36 0 -34 41 c-64 79 -63 71 -18 121 22 26 40 48 40 50 0 3 -15 3 -32
0 -23 -2 -45 -17 -70 -45 l-37 -42 -1 98 0 97 -30 0 -30 0 0 -160z"/>
                    <path d="M2390 300 l0 -160 30 0 29 0 3 76 c2 60 7 79 21 88 12 8 22 8 35 0
13 -9 18 -28 20 -88 l3 -76 29 0 30 0 0 85 c0 78 -2 88 -25 110 -27 28 -62 32
-91 10 -10 -8 -22 -15 -25 -15 -4 0 -4 29 -1 65 l5 65 -32 0 -31 0 0 -160z"/>
                    <path d="M1550 390 c0 -23 -5 -31 -25 -36 -33 -8 -35 -44 -2 -44 22 0 23 -3
19 -59 -4 -54 -2 -62 21 -85 17 -17 37 -26 57 -26 25 0 30 4 30 24 0 18 -6 25
-22 28 -20 3 -23 10 -26 61 -3 55 -2 57 23 57 18 0 25 5 25 20 0 15 -7 20 -26
20 -24 0 -26 3 -22 35 4 33 2 35 -24 35 -24 0 -28 -4 -28 -30z"/>
                    <path d="M1274 345 c-22 -17 -38 -20 -29 -5 4 6 -7 10 -24 10 l-31 0 0 -155 0
-155 30 0 30 0 0 66 c0 59 1 64 16 50 26 -27 81 -20 115 13 53 54 35 157 -33
180 -41 14 -50 14 -74 -4z m56 -45 c48 -26 26 -110 -30 -110 -53 0 -78 62 -40
100 22 22 42 25 70 10z"/>
                    <path d="M1806 345 c-43 -23 -55 -44 -56 -98 0 -41 5 -53 29 -78 40 -40 105
-41 150 -3 17 14 31 30 31 35 0 14 -49 10 -74 -6 -34 -23 -86 2 -86 41 0 2 36
4 80 4 74 0 80 2 80 20 0 37 -28 77 -61 89 -42 15 -58 14 -93 -4z m82 -37 c25
-25 13 -38 -33 -38 -33 0 -45 4 -45 15 0 29 56 45 78 23z"/>
                    <path d="M2124 346 c-60 -26 -81 -93 -50 -155 36 -69 162 -67 194 3 11 24 10
26 -14 26 -13 0 -38 -10 -54 -21 -28 -21 -30 -21 -54 -5 -28 18 -35 61 -16 97
14 25 64 25 82 1 9 -12 21 -16 41 -12 27 5 27 6 11 29 -16 23 -71 51 -96 51
-7 -1 -27 -7 -44 -14z"/>
                    <path d="M858 260 c3 -79 6 -92 25 -105 25 -17 70 -20 98 -5 13 7 19 7 19 0 0
-5 14 -10 30 -10 l30 0 0 105 0 105 -30 0 -30 0 0 -68 c0 -73 -10 -92 -47 -92
-33 0 -46 34 -40 102 l5 58 -31 0 -32 0 3 -90z"/>
                </g>
            </svg>
        </div>

    )
}
