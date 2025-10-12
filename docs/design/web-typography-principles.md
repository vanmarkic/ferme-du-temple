# Web Typography Principles and Best Practices

Based on: "Everything You Need to Know About Designing for Web Typography" by Teo Yu Siang

## The Holy Trinity of Web Typography

Web typography is fundamentally built on three core elements:

1. **Font Size** - what sizes will you use?
2. **Line Height** - how much space between lines of text?
3. **Line Length** - how wide will your blocks of text be?

These three elements directly determine the reading experience and text pleasingness.

---

## 1. Font Size

### Type Scale System

**What is a Type Scale?**
- A mathematical approach to define font sizes from body text to heading 1 and down to captions
- Uses a scale factor (e.g., 1.25) to multiply/divide from a base font size
- Creates harmonious, non-arbitrary font size relationships

**How Type Scale Works:**
1. Choose a **base font size** (most important text, usually body text)
2. Choose a **scale factor** to multiply/divide the base size

### Choosing Base Font Size

**Considerations:**
- Content type: text-heavy vs. media-heavy
- Project type: content-focused (larger) vs. dashboard (smaller but readable)
- **Modern standard: 18px or larger** (16px is no longer large enough)
- Account for typeface differences - some appear larger than others at same size

**Examples:**
- Content-heavy sites (Medium, Smashing Magazine): 18px+
- Dashboard/dense information: smaller but still readable
- Different typefaces at same size appear different

### Choosing Scale Factor

**Common Musical & Geometric Scales:**
- Minor Second: 1.067
- Major Second: 1.125
- Minor Third: 1.2
- Major Third: 1.25
- Perfect Fourth: 1.333
- Augmented Fourth: 1.414
- Perfect Fifth: 1.5
- Golden Ratio: 1.618

**Selection Approach:**
1. **Practical:** Consider extremes - with 6 heading levels, will heading 1 be too large?
   - Example: 18px body with Golden Ratio (1.618) = 119px heading 1 (too large!)
   - Scales larger than Perfect Fourth (1.333) often create oversized headings
2. **Romantic:** Listen to musical pieces using these intervals - which represents your brand?

**Recommended:** Major Third (1.25) - provides good heading distinction, reasonable heading 1 size, sounds nice musically

**Tool:** type-scale.com

### Responsive Design: Double-Stranded Type Scale

**Problem:** Single type scale doesn't work across all screen sizes

**Solution:** Use two type scales
- One for medium/large screens
- One for small screens

**Two Methods:**
1. **Change base font size** (preferred for simpler CSS)
   - Example: 16px body for small screens, 18px for larger screens
2. **Change scale factor**
   - Example: Minor Third (1.2) for small screens, Major Third (1.25) for larger screens

**Why Method 1 is preferred:** Only need to define two rem values for body text vs. defining two complete sets of heading sizes

---

## 2. Line Height

### What is Line Height?

Line height defines the space above and below lines of text.

**Units:**
- Always use **relative units** (1.5em, 1.5, 150%)
- Avoid absolute units (24px) - requires manual updates when font size changes

**Calculation:** Line height of 1.5 on 16px text = 24px total height per line (1.5 × 16px)

### Choosing Line Heights

**Key Principle:** Line height is subjective - aim for what looks right

**Three Considerations:**

#### 1. Based on Typeface
- **Taller x-height requires taller line-height**
- Prevents text from mushing together
- More separation needed for taller fonts

#### 2. Based on Line Length
- **Wider text → taller line-height**
  - Eyes travel more per line, need more space to jump to next line
- **Narrower text → shorter line-height**
  - Frequent eye hops, less space makes jumping easier

#### 3. Based on Text Type
- **Body text:** Line height can exceed 1.7
- **Headings:** ~1.2 line height
  - Want heading read as one block
  - Less space than body text

### Vertical Rhythm (Advanced)

**Concept:** Design looks more harmonic with consistent spacing between elements

**Implementation:**
1. Find line-height that produces "nice numbers" (multiples of 4 or 8) when multiplied by base font size
   - Example: 18px × 1.33 ≈ 24px
   - Example: 18px × 1.78 ≈ 32px
   - Example: 16px × 1.5 = 24px

2. Use common denominator throughout project:
   - Image sizes in multiples of 8px (e.g., 40px profile pictures)
   - Spacing above/below headings in multiples of 8px
   - Paragraph spacing in multiples of 8px

**Note:** Perfect vertical rhythm is ideal but don't spend too much time achieving it unless you're a typography purist

---

## 3. Line Length

### Optimal Character Range

**Target:** 45-75 characters per line
- Not too wide (tedious to read)
- Not too narrow (requires frequent hops)

### Implementation

**For Medium/Large Screens:**
- Use grid system with max-width property
- Test to find how many columns achieve optimal character count
- Example: max-width equivalent to 8 columns in 12-column grid

**For Small Screens:**
- Line length becomes less critical on narrow screens
- Focus on font size and line-height instead
- Double-stranded type scale helps achieve comfortable character count naturally

---

## 4. Spacing

### Letter Spacing

**Rule of Thumb:**
- **Large text (headings):** Reduce letter spacing (negative values, e.g., -1.5px)
  - Larger fonts create larger gaps between letters
  - Higher heading level = tighter spacing
- **Small text (captions):** Increase letter spacing (positive values)
  - Prevents clumping on screen
  - Improves legibility

**Used by:** Google Material Design, Apple Human Interface Guidelines

### Paragraph Spacing

**Rule of Thumb:**
- Paragraphs should appear distinct but not disjointed
- **Taller fonts require larger paragraph spacing**
- Subjective and depends on typeface

### Heading Spacing

**Rules:**
- **Space above heading > space below heading**
  - Visually anchors heading to its section
  - Prevents association with preceding section
- **Larger heading = more space around it**

---

## Research-Backed Data

### Line Spacing Impact
- Increasing line spacing from 100% to 120% improves:
  - Reading accuracy: up to 20% improvement
  - Eye strain reduction: 30% reduction

### Optimal Line Height Range
- **1.125 to 1.200 times the font size (112.5%-120%) = better readability**

### Heading Line Heights
- Short headings (1-2 lines): 1.0 to 1.35
- Longer texts: at least 1.5

### Line Length
- Desktop comfort range: 45-80 characters
- **Ideal: 66 characters per line for body text**

---

## Font Size Guidelines by Device

**Mobile:** 12-16pt
**Tablet:** 15-19pt
**Desktop:** 16-20pt

**Desktop Headings:** 30-50px
**Desktop Body:** typically 16px
**Desktop H1:** typically 48px

---

## Accessibility

### WCAG Standards
- **4.5:1 contrast ratio** minimum
- Scalable text
- Proper spacing

---

## Typography Mistakes to Avoid

1. **Too many font sizes** - most pages can look fine with about 4 font sizes total
2. **Using absolute units for line-height** - always use relative units
3. **Headings too close in size** - use type scale to create clear hierarchy
4. **Ignoring x-height differences** - different typefaces need different line heights
5. **Equal spacing above/below headings** - more space above anchors heading to section

---

## Implementation Order

Recommended sequence for designing web typography:

1. **Font Sizes** (use type scale)
2. **Line Heights** (based on typeface, line length, text type)
3. **Line Lengths** (45-75 characters per line)
4. **Spacing** (letter, paragraph, heading spacing)

---

## Tools

- **type-scale.com** - Interactive type scale calculator
- Prototyping apps for testing font sizes in context

---

## Philosophy

**Guidelines are guidelines, not rules:**
- Ultimate goal: create great reading experience
- Trust your eyes
- Break rules when it makes sense
- Don't miss the forest for the trees

**Example:** Golden Ratio (1.618) often too large for practical type scales despite its "magical properties"

---

## Summary Checklist

### Font Size
- [ ] Choose base font size (18px+ for body text)
- [ ] Select scale factor (Major Third 1.25 recommended)
- [ ] Create double-stranded type scale for responsive design
- [ ] Limit to ~4 font sizes total

### Line Height
- [ ] Use relative units (not absolute)
- [ ] Body text: 1.5-1.7+ line height
- [ ] Headings: ~1.2 line height
- [ ] Adjust for x-height of typeface
- [ ] Adjust for line length (wider = taller line height)
- [ ] Consider vertical rhythm with 4px/8px multiples

### Line Length
- [ ] Target 45-75 characters per line (ideal: 66)
- [ ] Use max-width with grid system
- [ ] Less critical on small screens

### Spacing
- [ ] Tighten letter spacing on large text (negative values)
- [ ] Increase letter spacing on small text
- [ ] More space above headings than below
- [ ] Larger headings = more surrounding space
- [ ] Taller fonts = larger paragraph spacing

### Accessibility
- [ ] 4.5:1 contrast ratio minimum
- [ ] Scalable text
- [ ] Proper spacing
