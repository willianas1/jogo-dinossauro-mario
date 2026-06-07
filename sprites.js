// Sprite Palette Mapping
const SPRITE_PALETTE = {
    '.': 'transparent',
    'R': '#E52521', // Mario Red / Yoshi Red saddle & boots / Bowser Hair / Red accent
    'U': '#0020C2', // Mario Blue (Overalls) / Sonic Blue / Kamek Robes
    'S': '#F8B888', // Peach/Skin (Mario, Sonic belly)
    'B': '#7A4300', // Hair and Shoes Brown / Kamek Wand Brown
    'Y': '#F8D800', // Yellow (Buttons / Gold Coin / Star / Bowser body / Kamek glasses)
    'K': '#000000', // Black
    'W': '#FFFFFF', // White
    
    // Goomba colors
    'O': '#F85800', // Goomba Orange/Brown body
    'E': '#4A2A00', // Goomba Dark Brown feet/eyebrows
    
    // Koopa / Yoshi / Environment colors
    'G': '#38D828', // Yoshi Light Green / Bushes / Bowser shell
    'D': '#005800', // Dark Green outline
    'V': '#8B0000', // Dark Red (Koopa shell outline)
    'P': '#F87858', // Yoshi Peach/Orange boots
    
    // Bullet Bill / Metal colors
    'M': '#505050', // Medium Metal Grey
    'N': '#303030', // Dark Metal Grey
    'L': '#A0A0A0', // Light Grey
    
    // Pain (Naruto) colors
    'Z': '#C8C0BC', // Pain pale grey skin
    'Q': '#8050C0', // Rinnegan purple

    // Background items
    'C': '#3CBCFC', // Sky Outline Blue
    'H': '#80D010', // Light Green (Hill)
    'A': '#B8B8B8'  // Brick Red/Grey
};

const SPRITES = {
    // ==========================================
    // SMALL MARIO (16x16 grid)
    // ==========================================
    mario_small_stand: [
        "................",
        ".....RRRRR......",
        "....RRRRRRRRR...",
        "....BBBSSBS.....",
        "...BBSBSSSBSS...",
        "...BBSBBSBSSS...",
        "....BBSSSBSS....",
        "......SSSSSS....",
        "....RRUURR......",
        "...RRRUUUURRR...",
        "..RRRRUUUURRRR..",
        "..SSRUURRUURSS..",
        "..SSSUUUUUUSSS..",
        "..SSUUUUUUUUSS..",
        "....UUU..UUU....",
        "....BBB..BBB...."
    ],
    mario_small_run1: [
        "................",
        ".....RRRRR......",
        "....RRRRRRRRR...",
        "....BBBSSBS.....",
        "...BBSBSSSBSS...",
        "...BBSBBSBSSS...",
        "....BBSSSBSS....",
        "......SSSSSS....",
        "....RRUURR......",
        "...RRRUUUURRR...",
        "..RRRRUUUURRRR..",
        "..SSRUURRUURSS..",
        "..SSSUUUUUUSSS..",
        "..SSUUUUUUUUSS..",
        "....UUU..UUU....",
        "....BBB...BBB..."
    ],
    mario_small_run2: [
        "................",
        ".....RRRRR......",
        "....RRRRRRRRR...",
        "....BBBSSBS.....",
        "...BBSBSSSBSS...",
        "...BBSBBSBSSS...",
        "....BBSSSBSS....",
        "......SSSSSS....",
        "....RRUURRU.....",
        "...RRRUUUURR....",
        "..RRRRUUUURRR...",
        "..SSRUURRUURSS..",
        "..SSSUUUUUUSSS..",
        "..SSUUUUUUUUSS..",
        "....UU....UU....",
        "....BBB...BB...."
    ],
    mario_small_jump: [
        "................",
        ".....RRRRR......",
        "....RRRRRRRRR...",
        "....BBBSSBS.....",
        "...BBSBSSSBSS...",
        "...BBSBBSBSSS...",
        "....BBSSSBSS....",
        "......SSSSSS....",
        "....RRUURR......",
        "...RRRUUUURRR...",
        "..SSRRUUUURRSS..",
        "..SSSRUURRUUSSS.",
        "..SSSUUUUUUSSS..",
        "....UUUUUUUU....",
        "....BBB...BBB...",
        "...BBB.....BBB.."
    ],
    mario_small_duck: [
        "................",
        "................",
        "................",
        "................",
        ".....RRRRR......",
        "....RRRRRRRRR...",
        "....BBBSSBS.....",
        "...BBSBSSSBSS...",
        "...BBSBBSBSSS...",
        "....BBSSSBSS....",
        "....RRUURR......",
        "...RRRUUUURRR...",
        "..SSRUURRUURSS..",
        "..SSSUUUUUUSSS..",
        "..SSUUUUUUUUSS..",
        "....BBB..BBB...."
    ],

    // ==========================================
    // SUPER MARIO (28x16 grid - Elongated to make him truly Super)
    // ==========================================
    mario_super_stand: [
        "......RRRRR.....", // 0
        "....RRRRRRRRR...", // 1
        "....BBBSSBS.....", // 2
        "...BBSBSSSBSS...", // 3
        "...BBSBBSBSSS...", // 4
        "...BBSBSSSBSS...", // 5
        "....BBSSSBSS....", // 6
        ".....SSSSSSS....", // 7
        "....RRUURRUUR...", // 8
        "...RRRUURRUURR..", // 9
        "..RRRRUUUUUURRR.", // 10
        "..RRRRUUUUUURRR.", // 11
        "..SSRRUUUUUURRSS", // 12
        "..SSRRUUUUUURRSS", // 13
        "..SSSRUUUUUURSSS", // 14
        "..SSSRUUUUUURSSS", // 15
        "..SSUUUUUUUUUUSS", // 16
        "..SSUUUUUUUUUUSS", // 17
        "....UUUUUUUUUU..", // 18
        "....UUUUUUUUUU..", // 19
        "....UUU....UUU..", // 20
        "....UUU....UUU..", // 21
        "....UUU....UUU..", // 22
        "....UUU....UUU..", // 23
        "....BBB....BBB..", // 24
        "....BBB....BBB..", // 25
        "...BBBB....BBBB.", // 26
        "...BBBB....BBBB."  // 27
    ],
    mario_super_run1: [
        "......RRRRR.....", // 0
        "....RRRRRRRRR...", // 1
        "....BBBSSBS.....", // 2
        "...BBSBSSSBSS...", // 3
        "...BBSBBSBSSS...", // 4
        "...BBSBSSSBSS...", // 5
        "....BBSSSBSS....", // 6
        ".....SSSSSSS....", // 7
        "....RRUURRUUR...", // 8
        "...RRRUURRUURR..", // 9
        "..RRRRUUUUUURRR.", // 10
        "..RRRRUUUUUURRR.", // 11
        "..SSRRUUUUUURRSS", // 12
        "..SSRRUUUUUURRSS", // 13
        "..SSSRUUUUUURSSS", // 14
        "..SSSRUUUUUURSSS", // 15
        "..SSUUUUUUUUUUSS", // 16
        "..SSUUUUUUUUUUSS", // 17
        "....UUUUUUUUUU..", // 18
        "....UUUUUUUUUU..", // 19
        "....UUUU...UUU..", // 20
        "....UUUU...UUU..", // 21
        "....UUUU...UUU..", // 22
        "....BBB.....BBB.", // 23
        "....BBB.....BBB.", // 24
        "...BBBB......BBB", // 25
        "...BBBB......BBB", // 26
        "....BBB......BBB"  // 27
    ],
    mario_super_run2: [
        "......RRRRR.....", // 0
        "....RRRRRRRRR...", // 1
        "....BBBSSBS.....", // 2
        "...BBSBSSSBSS...", // 3
        "...BBSBBSBSSS...", // 4
        "...BBSBSSSBSS...", // 5
        "....BBSSSBSS....", // 6
        ".....SSSSSSS....", // 7
        "....RUURRUURR...", // 8
        "...RRUURRUURRR..", // 9
        "..RRRUUUUUURRRR.", // 10
        "..RRRUUUUUURRRR.", // 11
        "..SSUUUUUUUURRSS", // 12
        "..SSUUUUUUUURRSS", // 13
        "..SSUUUUUUUUSSSS", // 14
        "..SSUUUUUUUUSSSS", // 15
        "..SSUUUUUUUUUUSS", // 16
        "..SSUUUUUUUUUUSS", // 17
        "....UUUUUUUUUU..", // 18
        "....UUUUUUUUUU..", // 19
        "....UUU....UUU..", // 20
        "....UUU....UUU..", // 21
        "....UUU....UUU..", // 22
        "....BBB....BBB..", // 23
        "....BBB....BBB..", // 24
        "....BBB....BBB..", // 25
        "....BBB....BBB..", // 26
        "....BBB....BBB.."  // 27
    ],
    mario_super_jump: [
        "......RRRRR.....", // 0
        "....RRRRRRRRR...", // 1
        "....BBBSSBS.....", // 2
        "...BBSBSSSBSS...", // 3
        "...BBSBBSBSSS...", // 4
        "...BBSBSSSBSS...", // 5
        "....BBSSSBSS....", // 6
        ".....SSSSSSS....", // 7
        "....RRUURRUUR...", // 8
        "...RRRUURRUURR..", // 9
        "..SSRRUUUUUURRSS", // 10
        "..SSRRUUUUUURRSS", // 11
        "..SSSRUUUUUURSSS", // 12
        "..SSSRUUUUUURSSS", // 13
        "..SSSUUUUUUUUSSS", // 14
        "..SSSUUUUUUUUSSS", // 15
        "....UUUUUUUUUU..", // 16
        "....UUUUUUUUUU..", // 17
        "....UUUU..UUUU..", // 18
        "....UUUU..UUUU..", // 19
        "....BBB....BBB..", // 20
        "....BBB....BBB..", // 21
        "...BBB......BBB.", // 22
        "...BBB......BBB.", // 23
        "..BBB........BBB", // 24
        "..BBB........BBB", // 25
        "..BBB........BBB", // 26
        "..BBB........BBB"  // 27
    ],
    mario_super_duck: [
        "......RRRRR.....", // 0
        "....RRRRRRRRR...", // 1
        "....BBBSSBS.....", // 2
        "...BBSBSSSBSS...", // 3
        "...BBSBBSBSSS...", // 4
        "....BBSSSBSS....", // 5
        ".....SSSSSSS....", // 6
        "....RRUURRUUR...", // 7
        "...RRRUURRUURR..", // 8
        "..RRRRUUUUUURRR.", // 9
        "..SSRRUUUUUURRSS", // 10
        "..SSSRUUUUUURSSS", // 11
        "..SSUUUUUUUUUUSS", // 12
        "....UUUUUUUUUU..", // 13
        "....UUU....UUU..", // 14
        "....UUU....UUU..", // 15
        "....BBB....BBB..", // 16
        "...BBBB....BBBB."  // 17
    ],

    // ==========================================
    // YOSHI RIDING (24x32 grid - Small Mario version)
    // ==========================================
    yoshi_small_stand: [
        "........................",
        "........RRRRR...........",
        ".......RRRRRRRRR........",
        ".......BBBSSBS..........",
        "......BBSBSSSBSS........",
        "......BBSBBSBSSS........",
        ".......BBSSSBSS.........",
        ".........SSSSSS.........",
        ".......RRUURR...........",
        "......RRRUUUUR..........",
        "......RRRUURRU..GGGGGG..",
        ".....RRRUUUUUU.GGGGGGGG.",
        ".....SSUUUUUUU.GKWGGWWG.",
        ".....SSSUUUUUU.GKKGGWWG.",
        ".....SSUUUUUUGGGGGGGGG..",
        ".......UUU..UGWWWWGG....",
        ".......BBB..GGWWWWG.....",
        "...........GGGGGGGGGG...",
        "..........GGGGGGGGGGGG..",
        "..........GGGGGGGGGGGG..",
        ".........GGGGGGGGGGGG...",
        ".........RGGGGGGGGGG....",
        ".........RGGGGGGGGGG....",
        ".........RRGGGGGGGG.....",
        "..........GGGGGGGG......",
        "...........GG..GG.......",
        "...........PP..PP.......",
        "..........PPP..PPP......",
        "..........PP....PP......",
        "........................",
        "........................",
        "........................"
    ],
    yoshi_small_run1: [
        "........................",
        "........RRRRR...........",
        ".......RRRRRRRRR........",
        ".......BBBSSBS..........",
        "......BBSBSSSBSS........",
        "......BBSBBSBSSS........",
        ".......BBSSSBSS.........",
        ".........SSSSSS.........",
        ".......RRUURR...........",
        "......RRRUUUUR..........",
        "......RRRUURRU..GGGGGG..",
        ".....RRRUUUUUU.GGGGGGGG.",
        ".....SSUUUUUUU.GKWGGWWG.",
        ".....SSSUUUUUU.GKKGGWWG.",
        ".....SSUUUUUUGGGGGGGGG..",
        ".......UUU..UGWWWWGG....",
        ".......BBB..GGWWWWG.....",
        "...........GGGGGGGGGG...",
        "..........GGGGGGGGGGGG..",
        "..........GGGGGGGGGGGG..",
        ".........GGGGGGGGGGGG...",
        ".........RGGGGGGGGGG....",
        ".........RGGGGGGGGGG....",
        ".........RRGGGGGGGG.....",
        "..........GGGGGGGG......",
        "...........GG...GG......",
        "...........PP...P.......",
        "..........PPP..PP.......",
        ".........PP.....PP......",
        "........................",
        "........................",
        "........................"
    ],
    yoshi_small_run2: [
        "........................",
        "........RRRRR...........",
        ".......RRRRRRRRR........",
        ".......BBBSSBS..........",
        "......BBSBSSSBSS........",
        "......BBSBBSBSSS........",
        ".......BBSSSBSS.........",
        ".........SSSSSS.........",
        ".......RRUURRU..........",
        "......RRRUUUUR..........",
        "......RRRUURRU..GGGGGG..",
        ".....RRRUUUUUU.GGGGGGGG.",
        ".....SSUUUUUUU.GKWGGWWG.",
        ".....SSSUUUUUU.GKKGGWWG.",
        ".....SSUUUUUUGGGGGGGGG..",
        ".......UU...UGWWWWGG....",
        ".......BBB..GGWWWWG.....",
        "...........GGGGGGGGGG...",
        "..........GGGGGGGGGGGG..",
        "..........GGGGGGGGGGGG..",
        ".........GGGGGGGGGGGG...",
        ".........RGGGGGGGGGG....",
        ".........RGGGGGGGGGG....",
        ".........RRGGGGGGGG.....",
        "..........GGGGGGGG......",
        "............GG..GG......",
        "............P..PP.......",
        "...........PP..PPP......",
        "..........PP....PP......",
        "........................",
        "........................",
        "........................"
    ],
    yoshi_small_jump: [
        "........................",
        "........RRRRR...........",
        ".......RRRRRRRRR........",
        ".......BBBSSBS..........",
        "......BBSBSSSBSS........",
        "......BBSBBSBSSS........",
        ".......BBSSSBSS.........",
        ".........SSSSSS.........",
        ".......RRUURR...........",
        "......RRRUUUUR..........",
        "......SSRRUURR..GGGGGG..",
        ".....SSSRUUUUU.GGGGGGGG.",
        ".....SSSUUUUUU.GKWGGWWG.",
        "......UUUUUUUGGGKKGGWWG.",
        ".......UUU..UGGGGGGGGG..",
        ".......BBB..GGWWWWGG....",
        "............GGWWWWG.....",
        "...........GGGGGGGGGG...",
        "..........GGGGGGGGGGGG..",
        "..........GGGGGGGGGGGG..",
        ".........GGGGGGGGGGGG...",
        ".........RGGGGGGGGGG....",
        ".........RGGGGGGGGGG....",
        ".........RRGGGGGGGG.....",
        "..........GGGGGGGG......",
        "...........GG..GG.......",
        "...........PP..PP.......",
        "..........PPP..PPP......",
        "..........PP....PP......",
        "........................",
        "........................",
        "........................"
    ],

    // ==========================================
    // YOSHI RIDING (24x34 grid - Truncated empty lines for Ground contact)
    // ==========================================
    yoshi_super_stand: [
        "........RRRRR...........",
        "......RRRRRRRRR.........",
        "......BBBSSBS...........",
        ".....BBSBSSSBSS.........",
        ".....BBSBBSBSSS.........",
        ".....BBSBSSSBSS.........",
        "......BBSSSBSS..........",
        ".......SSSSSSS..........",
        "......RRUURRUUR.........",
        ".....RRRUURRUURR........",
        "....RRRRUUUUUURR........",
        "....SSRRUUUUUURRSS......",
        "....SSSRUUUUUURSSS......",
        "....SSUUUUUUUUUUSS......",
        "......UUUUUUUUUU........",
        "......UUUU..UUUU........",
        "......UUU....UUU........",
        "......BBB....BBB..GGGGGG",
        ".............GGGGGGGGGG.",
        "............GKWGGWWGG...",
        "...........GGKKGGWWG....",
        "...........GGGGGGGGG....",
        "..........GWWWWGG.......",
        "........GGGGGGGGGGGG....",
        "........GGGGGGGGGGGG....",
        ".......GGGGGGGGGGGG.....",
        ".......RGGGGGGGGGG......",
        ".......RGGGGGGGGGG......",
        ".......RRGGGGGGGG.......",
        "........GGGGGGGG........",
        ".........GG..GG.........",
        ".........PP..PP.........",
        "........PPP..PPP........",
        "........PP....PP........"
    ],
    yoshi_super_run1: [
        "........RRRRR...........",
        "......RRRRRRRRR.........",
        "......BBBSSBS...........",
        ".....BBSBSSSBSS.........",
        ".....BBSBBSBSSS.........",
        ".....BBSBSSSBSS.........",
        "......BBSSSBSS..........",
        ".......SSSSSSS..........",
        "......RRUURRUUR.........",
        ".....RRRUURRUURR........",
        "....RRRRUUUUUURR........",
        "....SSRRUUUUUURRSS......",
        "....SSSRUUUUUURSSS......",
        "....SSUUUUUUUUUUSS......",
        "......UUUUUUUUUU........",
        "......UUUU..UUUU........",
        "......UUU....UUU........",
        "......BBB....BBB..GGGGGG",
        ".............GGGGGGGGGG.",
        "............GKWGGWWGG...",
        "...........GGKKGGWWG....",
        "...........GGGGGGGGG....",
        "..........GWWWWGG.......",
        "........GGGGGGGGGGGG....",
        "........GGGGGGGGGGGG....",
        ".......GGGGGGGGGGGG.....",
        ".......RGGGGGGGGGG......",
        ".......RGGGGGGGGGG......",
        ".......RRGGGGGGGG.......",
        "........GGGGGGGG........",
        ".........GG...GG........",
        ".........PP...P.........",
        "........PPP..PP.........",
        ".......PP.....PP........"
    ],
    yoshi_super_run2: [
        "........RRRRR...........",
        "......RRRRRRRRR.........",
        "......BBBSSBS...........",
        ".....BBSBSSSBSS.........",
        ".....BBSBBSBSSS.........",
        ".....BBSBSSSBSS.........",
        "......BBSSSBSS..........",
        ".......SSSSSSS..........",
        "......RRUURRUUR.........",
        ".....RRRUURRUURR........",
        "....RRRRUUUUUURR........",
        "....SSRRUUUUUURRSS......",
        "....SSSRUUUUUURSSS......",
        "....SSUUUUUUUUUUSS......",
        "......UUUUUUUUUU........",
        "......UUUU..UUUU........",
        "......UUU....UUU........",
        "......BBB....BBB..GGGGGG",
        ".............GGGGGGGGGG.",
        "............GKWGGWWGG...",
        "...........GGKKGGWWG....",
        "...........GGGGGGGGG....",
        "..........GWWWWGG.......",
        "........GGGGGGGGGGGG....",
        "........GGGGGGGGGGGG....",
        ".......GGGGGGGGGGGG.....",
        ".......RGGGGGGGGGG......",
        ".......RGGGGGGGGGG......",
        ".......RRGGGGGGGG.......",
        "........GGGGGGGG........",
        "..........GG..GG........",
        "..........P..PP.........",
        ".........PP..PPP........",
        "........PP....PP........"
    ],
    yoshi_super_jump: [
        "........RRRRR...........",
        "......RRRRRRRRR.........",
        "......BBBSSBS...........",
        ".....BBSBSSSBSS.........",
        ".....BBSBBSBSSS.........",
        ".....BBSBSSSBSS.........",
        "......BBSSSBSS..........",
        ".......SSSSSSS..........",
        "......RRUURRUUR.........",
        ".....RRRUURRUURR........",
        "....SSRRUUUUUURRSS......",
        "....SSSRUUUUUURSSS......",
        "....SSSUUUUUUUUSSS......",
        "......UUUUUUUUUU........",
        "......UUUU..UUUU........",
        "......BBB....BBB..GGGGGG",
        ".............GGGGGGGGGG.",
        "............GKWGGWWGG...",
        "...........GGKKGGWWG....",
        "...........GGGGGGGGG....",
        "..........GWWWWGG.......",
        "........GGGGGGGGGGGG....",
        "........GGGGGGGGGGGG....",
        ".......GGGGGGGGGGGG.....",
        ".......RGGGGGGGGGG......",
        ".......RGGGGGGGGGG......",
        ".......RRGGGGGGGG.......",
        "........GGGGGGGG........",
        ".........GG..GG.........",
        ".........PP..PP.........",
        "........PPP..PPP........",
        "........PP....PP........"
    ],

    // ==========================================
    // NEW POWER-UP ITEMS (16x16 grid)
    // ==========================================
    star: [
        ".......KK.......",
        "......KYYK......",
        "......KYYK......",
        ".....KYYYYK.....",
        "....KYYYYYYK....",
        "KKKKKYYYYYYKKKKK",
        ".KYYYYKKKKYYYYK.",
        "..KYYYKWWKYYYK..",
        "...KYYKKKKYK....",
        "....KYYYYYYK....",
        "...KYYYYYYYYK...",
        "..KYYKKKKKYYK..",
        "..KYK......KYK..",
        ".KKK........KKK.",
        "................",
        "................"
    ],
    yoshi_egg: [
        "......KKKK......",
        "....KKGGGGKK....",
        "...KGGGGGGGGK...",
        "..KGGWWGGWWGGK..",
        "..KGGWWGGWWGGK..",
        ".KGGGGGGGGGGGGK.",
        ".KGGGGWWGGGGGGK.",
        ".KGGGGWWGGGGGGK.",
        ".KGGGGGGGGGGGGK.",
        ".KGGGGGGWWGGGGK.",
        "..KGGGGGWWGGGK..",
        "..KGGGGGGGGGGK..",
        "...KGGGGGGGGK...",
        "....KKGGGGKK....",
        "......KKKK......",
        "................"
    ],

    // ==========================================
    // NEW BOSSES & PROJECTILES (Version 3)
    // ==========================================
    boss_bowser: [
        "................................",
        ".............RRRRR..............",
        "............RRRRRRRR............",
        "...........RRYYBYYRRR...........",
        "..........RRYYKKYYRRRR..........",
        "..........RRYYYYYYRRRR..........",
        "..........KWWKYYKKWWK...........",
        ".........KWWWWKKWWWWK...........",
        ".........KWWKKKKKKWWK...........",
        "..........KKKKKKKKKK............",
        ".........GGGGGGGGGGGG...........",
        ".......GGGGGGGGGGGGGGGG.........",
        "......GDGDGGDGDGGDGDGDGG........",
        ".....GDGWKDGKWDGKWKDGKWDG.......",
        "....GGGGKKGGKKGGKKGGKKGGGG......",
        "....GDGKWKDGKWKDGKWKDGKWKDG.....",
        "....GDGWKDGKWDGKWKDGKWDGDG......",
        "....GGGGGGGGGGGGGGGGGGGGGG......",
        ".....YYYYYYYYYYYYYYYYYYYYY......",
        ".....YYYYYYYYYYYYYYYYYYYYY......",
        ".....YYYYYKKYYYYYYYYYKKYY.......",
        ".....YYYYKKKKYYYYYYYKKKKY.......",
        "......YYYKKKKYYYYYYYKKKKY.......",
        ".......YYYKKYYYYYYYYYKK.........",
        "........YYYYYYYYYYYYY...........",
        "........YYYYYYYYYYYYY...........",
        ".........YYYY...YYYY............",
        ".........YYYY...YYYY............",
        ".........BBBB...BBBB............",
        "........BBBBB...BBBBB...........",
        "................................",
        "................................"
    ],
    boss_sonic: [
        "........................",
        ".........UUUUU..........",
        "........UUUUUUUU........",
        ".......UUUUUUUUUU.......",
        "......UUSSSSSSUSUU......",
        ".....UUSSSSSSSSUUUU.....",
        "....UUUSSSKKSSKKUUUU....",
        "....UUUSSSKKSKKSOUUU....",
        "....UUUUSSSSSSSOUUUU....",
        ".....UUUUSSSSSOUUUUU....",
        "......UUUUSSSOUUUUU.....",
        "........UUUUUUUU........",
        "........UUUUUUUU........",
        ".......UUUUUUUUUU.......",
        "......UUUSSSSSSUUU......",
        ".....UUUUSSSSSSUUUU.....",
        ".....UUUUSSSSSSUUUU.....",
        "......UUUUUUUUUUUU......",
        ".......UUU....UUU.......",
        ".......WWWW..WWWW.......",
        ".......WWWW..WWWW.......",
        ".......RRRR..RRRR.......",
        "......RRRRR..RRRRR......",
        "........................"
    ],
    boss_kamek: [
        "........................",
        ".........UUUU...........",
        "........UUUUUU..........",
        ".......UUUUUUUU.........",
        ".......UWWWWWWU.........",
        "......UWWYYYYWWU........",
        "......UWYYYYYYWU........",
        ".....UWYYKYYKYYWU.......",
        ".....UWYYKKKKYYWU..BB...",
        "......UWYYYYYYWU..BBB...",
        ".......UWWWWWWU..BBBB...",
        "........UUUUUU...KRRK...",
        ".......UUUUUUUU..KRRK...",
        "......UUUUUUUUUU........",
        ".....UUUUUUUUUUUU.......",
        ".....UUUUUUUUUUUU.......",
        ".....UUUUUUUUUUUU.......",
        "......UUUUUUUUUU........",
        ".......UUU..UUU.........",
        ".......UUU..UUU.........",
        ".......WWW..WWW.........",
        "......WWWW..WWWW........",
        "......WWWW..WWWW........",
        "........................"
    ],
    boss_pain: [
        "........................",
        "....OOO....OOO..........",
        "...OOOOOOOOOOOO.........",
        "..OOOOOOOOOOOOOO........",
        "..OZZZZZZZZZZZZZO.......",
        "..OZQKZZZZZZQKZZO.......",
        "..OZQZZZZZZZZQZZO.......",
        "..OZZZZKZZKZZZZO........",
        "..OZZZZZZZZZZZZO........",
        "...OKZZZZZKKO...........",
        "...KKKKKKKKKKKK.........",
        "..KKKKKKKKKKKKKK........",
        "..KKKKKRRRKKKKKK........",
        ".KKKKKRRRRRRKKKK........",
        ".KKKKRRRRRRRRKKKK.......",
        ".KKKKKRRRRKKKKKK........",
        ".KKKKKKKKKKKKKKKK.......",
        ".KKKKKKKKKKKKKKKK.......",
        ".KKKKKKKKKKKKKKK........",
        "..KKKKKK.KKKKKKK........",
        "..KKKKK...KKKKK.........",
        "...KKK.....KKK..........",
        "...KKK.....KKK..........",
        "........................"
    ],
    projectile_shinra: [
        "....QQQQ....",
        "..QQ....QQ..",
        ".QW......WQ.",
        ".Q........Q.",
        "Q..........Q",
        "Q..........Q",
        ".Q........Q.",
        ".QW......WQ.",
        "..QQ....QQ..",
        "....QQQQ....",
        "............",
        "............"
    ],
    projectile_fire: [
        "....RRRR....",
        "..RRYYYYRR..",
        ".RRYYYYYYRR.",
        "RRYYKKKKYYRR",
        "RRYYKKKKYYRR",
        ".RRYYYYYYRR.",
        "..RRYYYYRR..",
        "....RRRR...."
    ],
    projectile_spin: [
        "......UUUU......",
        "....UUUUUUUU....",
        "...UUUWWWWUUU...",
        "..UUUWWWWWWUUU..",
        "..UUWWWWWWWWUU..",
        ".UUUWWWWWWWWUUU.",
        ".UUWWWWWWWWWWUU.",
        ".UUWWWWWWWWWWUU.",
        ".UUWWWWWWWWWWUU.",
        ".UUWWWWWWWWWWUU.",
        ".UUUWWWWWWWWUUU.",
        "..UUWWWWWWWWUU..",
        "..UUUWWWWWWUUU..",
        "...UUUWWWWUUU...",
        "....UUUUUUUU....",
        "......UUUU......"
    ],
    projectile_magic: [
        "....RRYY....",
        "...RRYYYY...",
        "..RRYYGGYY..",
        ".RRYYGGGGYY.",
        "RRYYGGGGGGYY",
        "RRYYGGGGGGYY",
        ".RRYYGGGGYY.",
        "..RRYYGGYY..",
        "...RRYYYY...",
        "....RRYY...."
    ],

    // ==========================================
    // ENEMIES (16x16 grid)
    // ==========================================
    goomba_run1: [
        "......KKKK......",
        "....KKWWWWKK....",
        "...KOWWWWWWOo...",
        "..KOWKWWWWKWOK..",
        "..KOWKWWWWKWOK..",
        ".KooOWWWWWWOooK.",
        ".KooOWKKKKWOWoK.",
        ".KoooWWWWWWoooK.",
        "..KooooooooooK..",
        "...KKKKKKKKKK...",
        "....KK....KK....",
        "...KEEK..KEEK...",
        "..KEEEK..KEEEK..",
        "..KEEEK..KEEEK..",
        "...KKK....KKK...",
        "................"
    ],
    goomba_run2: [
        "......KKKK......",
        "....KKWWWWKK....",
        "...KOWWWWWWOo...",
        "..KOWKWWWWKWOK..",
        "..KOWKWWWWKWOK..",
        ".KooOWWWWWWOooK.",
        ".KooOWKKKKWOWoK.",
        ".KoooWWWWWWoooK.",
        "..KooooooooooK..",
        "...KKKKKKKKKK...",
        ".....KK..KK.....",
        "....KEEKKEEK....",
        "....KEEKKEEK....",
        "...KEEEKKEEEK...",
        "....KKK..KKK....",
        "................"
    ],
    goomba_flat: [
        "................",
        "................",
        "................",
        "................",
        "................",
        "......KKKK......",
        "....KKWWWWKK....",
        "..KKOWKKKKWOKK..",
        ".KKooOWWWWOooKK.",
        "KKoooWWWWWWoooKK",
        "KKooooooooooooKK",
        ".KKKKKKKKKKKKKK.",
        "..KEEEEKKEEEEK..",
        "...KKKK..KKKK...",
        "................",
        "................"
    ],
    koopa_shell1: [
        "......RRRR......",
        "....RRRRRRRR....",
        "...RVRRRRRRRR...",
        "..RVRWWRRWWRR...",
        "..RRRRWWRRWWR...",
        ".RRRRRRRRRRRRR.",
        ".RVRVRVRVRVRVR.",
        ".RVRVRVRVRVRVR.",
        ".RKKKKKKKKKKKR.",
        "..KWWWWWWWWWK..",
        "..KWWWWWWWWWK..",
        "...KWWWWWWWK...",
        "....KKKKKKK....",
        "................",
        "................",
        "................"
    ],
    koopa_shell2: [
        "......RRRR......",
        "....RRRRRRRR....",
        "...RVRRRRRRRR...",
        "..RWWRRWWRRRV...",
        "..WWRRWWRRRRR...",
        ".RRRRRRRRRRRRR.",
        ".VRVRVRVRVRVRV.",
        ".VRVRVRVRVRVRV.",
        ".RKKKKKKKKKKKR.",
        "..KWWWWWWWWWK..",
        "..KWWWWWWWWWK..",
        "...KWWWWWWWK...",
        "....KKKKKKK....",
        "................",
        "................",
        "................"
    ],
    bullet_bill: [
        "........MMMMMMMMMMMM....",
        "......MMNNNNNNNNNNNNM...",
        "....MMNNNNNNNNNNNNNNNM..",
        "...MNNNNNNNNNNNNNNNNNM..",
        "..MNNNNNNNNNNNNNNNNNNNM.",
        ".MNNNWWWNNNNNNNNNNNNNNM.",
        "MNNNWKKKWNNNNWWMWNNNNNNM",
        "MNNNWKKKWNNWMMWWMMNNNNNM",
        "MNNNNWWWNNNWMMWWMMNNNNNM",
        "MNNNNNNNNNNNNWWMWNNNNNNM",
        ".MNNNNNNNNNNNNNNNNNNNNM.",
        "..MNNNNNNNNNNNNNNNNNNM..",
        "...MNNNNNNNNNNNNNNNNM...",
        "....MMNNNNNNNNNNNNNM....",
        "......MMNNNNNNNNNNM.....",
        "........MMMMMMMMMM......"
    ],

    // ==========================================
    // ITEMS (16x16 grid)
    // ==========================================
    mushroom: [
        "......RRRR......",
        "....RRRRRRRR....",
        "...RRWWRRWWRR...",
        "..RRWWWWRRWWWR..",
        "..RRWWWWRRWWWR..",
        ".RRRRWWRRWWRRRR.",
        ".RRRRRRRRRRRRRR.",
        "..RKKKKKKKKKKR..",
        "...KSWWWWWWKS...",
        "...KSWKSWKSWKS...",
        "...KSWKSWKSWKS...",
        "...KSWWWWWWKS...",
        "....KSSKKSKKS...",
        ".....KKKKKKK....",
        "................",
        "................"
    ],
    coin_1: [
        "......YYYY......",
        "....YYYYYYYY....",
        "...YYYKKKKYYY...",
        "..YYYKKYYYKKYY..",
        "..YYKYYYYYYKYY..",
        ".YYKYYYYYYYYKYY.",
        ".YYKYYYKKYYYKYY.",
        ".YYKYYYKKYYYKYY.",
        ".YYKYYYKKYYYKYY.",
        ".YYKYYYKKYYYKYY.",
        ".YYKYYYYYYYYKYY.",
        "..YYKYYYYYYKYY..",
        "..YYYKKYYYKKYY..",
        "...YYYKKKKYYY...",
        "....YYYYYYYY....",
        "......YYYY......"
    ],
    coin_2: [
        ".......YY.......",
        ".....YYYYYY.....",
        "....YYKKKKYY....",
        "...YYKYYYYKYY...",
        "..YYKYYYYYYKYY..",
        "..YKYYYYYYYYKY..",
        "..YKYYYKKYYYKY..",
        "..YKYYYKKYYYKY..",
        "..YKYYYKKYYYKY..",
        "..YKYYYKKYYYKY..",
        "..YKYYYYYYYYKY..",
        "..YYKYYYYYYKYY..",
        "...YYKYYYYKYY...",
        "....YYKKKKYY....",
        ".....YYYYYY.....",
        ".......YY......."
    ],
    coin_3: [
        "........Y.......",
        "......YYYY......",
        ".....YKKKKY.....",
        "....YKYYYYKY....",
        "....YKYYYYKY....",
        "....YKYYYYKY....",
        "....YKYYKKKY....",
        "....YKYYKKKY....",
        "....YKYYKKKY....",
        "....YKYYKKKY....",
        "....YKYYYYKY....",
        "....YKYYYYKY....",
        "....YKYYYYKY....",
        ".....YKKKKY.....",
        "......YYYY......",
        "........Y......."
    ],
    coin_4: [
        "................",
        ".......YY.......",
        "......YYYY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YKKY......",
        "......YYYY......",
        ".......YY.......",
        "................"
    ],
    mystery_1: [
        "KKKKKKKKKKKKKKKK",
        "KYYYYYYYYYYYYYBK",
        "KYYKKYYYYYYKKYYK",
        "KYYYYYKKKKYYYYYK",
        "KYYYYKKYYYYKKYYK",
        "KYYYYYYYYYYKKYYK",
        "KYYYYYYYYYKKYYYK",
        "KYYYYYYYKKYYYYYK",
        "KYYYYYYYKKYYYYYK",
        "KYYYYYYYYYYYYYYK",
        "KYYYYYYYKKYYYYYK",
        "KYYYYYYYKKYYYYYK",
        "KYYKKYYYYYYKKYYK",
        "KYYYYYYYYYYYYYYK",
        "KBBBBBBBBBBBBBBK",
        "KKKKKKKKKKKKKKKK"
    ],
    mystery_2: [
        "KKKKKKKKKKKKKKKK",
        "KWWWWWWWWWWWWWBK",
        "KWWKKWWWWWWKKWWK",
        "KWWWWWKKKKWWWWWK",
        "KWWWWKKWWWWKKWWK",
        "KWWWWWWWWWWKKWWK",
        "KWWWWWWWWWKKWWWK",
        "KWWWWWWWKKWWWWWK",
        "KWWWWWWWKKWWWWWK",
        "KWWWWWWWWWWWWWWK",
        "KWWWWWWWKKWWWWWK",
        "KWWWWWWWKKWWWWWK",
        "KWWKKWWWWWWKKWWK",
        "KWWWWWWWWWWWWWWK",
        "KBBBBBBBBBBBBBBK",
        "KKKKKKKKKKKKKKKK"
    ],
    mystery_empty: [
        "KKKKKKKKKKKKKKKK",
        "KBBBBBBBBBBBBBBK",
        "KBBBBBBBBBBBBBBK",
        "KBBKKKKKKKKKKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKBBBBBBBBKBBK",
        "KBBKKKKKKKKKKBBK",
        "KBBBBBBBBBBBBBBK",
        "KBBBBBBBBBBBBBBK",
        "KKKKKKKKKKKKKKKK"
    ],

    // ==========================================
    // ENVIRONMENT (various grids)
    // ==========================================
    cloud: [
        "......KKKKKKKK..........",
        "....KKWWWWWWWWKK........",
        "...KWWWWWWWWWWWWK.......",
        "..KWWWWWWWWWWWWWWK......",
        "..KWWWWCCWWWWCCWWK.KKKK.",
        ".KWWWWWCCWWWWCCWWKKWWWWK",
        "KWWWWWWWWWWWWWWWWWWWWWWK",
        "KWWWWWWWWWWWWWWWWWWWWWWK",
        "KWWWWWCCWWWWCCWWWWCCWWWK",
        "KWWWWWCCWWWWCCWWWWCCWWWK",
        "KWWWWWWWWWWWWWWWWWWWWWWK",
        ".KWWWWWWWWWWWWWWWWWWWWK.",
        "..KKWWWWWWWWWWWWWWWWKK..",
        "....KKKKKKKKKKKKKKKK....",
        "........................",
        "........................"
    ],
    bush: [
        "......GGGGGGGG..........",
        "....GGGGGGGGGGGG........",
        "...GDGGGGGGGGGGGG.......",
        "..GDGGGGGGGGGGGGGG......",
        "..GGGGDDGGGGDDGGGG.GGGG.",
        ".GGGGGDDGGGGDDGGGGKGGGGK",
        "GGGGGGGGGGGGGGGGGGGGGGGG",
        "GGGGGGGGGGGGGGGGGGGGGGGG",
        "GGGGGDDGGGGDDGGGGDDGGGGK",
        "GGGGGDDGGGGDDGGGGDDGGGGK",
        "GGGGGGGGGGGGGGGGGGGGGGGG",
        ".GGGGGGGGGGGGGGGGGGGGGG.",
        "..GGGGGGGGGGGGGGGGGGGG..",
        "....GGGGGGGGGGGGGGGG....",
        "........................",
        "........................"
    ],
    hill: [
        "............KK............",
        "...........KHKK...........",
        "..........KHHHKK..........",
        ".........KHHHHHKK.........",
        "........KHHHHHHHKK........",
        ".......KHHHHHHHHHKK.......",
        "......KHHHHHHHHHHHKK......",
        ".....KHHHHHHHHHHHHHKK.....",
        "....KHHHHHHHHHHHHHHHKK....",
        "...KHHHHHHHHHHHHHHHHHKK...",
        "..KHHHHHHHHHHHHHHHHHHHKK..",
        ".KHHHHHHHHHHHHHHHHHHHHHKK.",
        "KHHHHHHHHHHHHHHHHHHHHHHHKK",
        "KKKKKKKKKKKKKKKKKKKKKKKKKK"
    ],
    castle: [
        "....KK...KK...KK....",
        "....KK...KK...KK....",
        "....KK...KK...KK....",
        "....KKKKKKKKKKKK....",
        "....KAAAAAAAAAAK....",
        "....KAAAAAAAAAAK....",
        "....KAAKKKKAAAKK....",
        "..KKKAAK..KAAAKKK...",
        "..KAAAAK..KAAAAAK...",
        "..KAAAAKKKKAAAAAK...",
        "..KAAAAAAAAAAAAAK...",
        "KKKAAAAAAAAAAAAAKKK.",
        "KAAAAAAAAAAAAAAAAK..",
        "KAAAAAAAAAAAAAAAAK..",
        "KAAAAKKKKKKKKAAAAK..",
        "KAAAAK......KAAAAK..",
        "KAAAAK......KAAAAK..",
        "KAAAAK......KAAAAK..",
        "KKKKKK......KKKKKK.."
    ],
    ground: [
        "GGGGGGGGGGGGGGGG",
        "DDDDDDDDDDDDDDDD",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBB"
    ]
};

// Main Sprite Rendering Engine
// Renders the 2D grid representation of sprite onto specified Canvas 2d context.
function drawSprite(ctx, spriteKey, x, y, width, height, facingRight = true, paletteOverride = null) {
    const spriteArray = SPRITES[spriteKey];
    if (!spriteArray) return;
    
    const rows = spriteArray.length;
    const cols = spriteArray[0].length;
    const pixelWidth = width / cols;
    const pixelHeight = height / rows;

    ctx.save();
    if (!facingRight) {
        ctx.translate(x + width, y);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(x, y);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const colorChar = spriteArray[r][c];
            let color = paletteOverride && paletteOverride[colorChar] ? paletteOverride[colorChar] : SPRITE_PALETTE[colorChar];
            if (color && color !== 'transparent') {
                ctx.fillStyle = color;
                ctx.fillRect(
                    Math.floor(c * pixelWidth),
                    Math.floor(r * pixelHeight),
                    Math.ceil(pixelWidth),
                    Math.ceil(pixelHeight)
                );
            }
        }
    }
    ctx.restore();
}
