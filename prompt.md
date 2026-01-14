# **COMPLETE CURSOR PROMPT - SCSF Website Rebuild**

---

## **Project Context**

You are building a modern replacement for the San Francisco Skating Club website (currently at scsf.org running on WordPress). The new site must be 100% free to host and maintain, easy for non-technical board members to update content, and mobile-responsive with a focus on user experience.

## **Tech Stack**

- **Next.js 14** (App Router with TypeScript)
- **Sanity CMS** (already configured with embedded studio at `/studio`)
- **Tailwind CSS** (for all styling)
- **Deployed to Vercel** (free tier)

**Important:** Sanity is already set up with content types and sample data has been added. You will fetch real data from Sanity.

---

## **User Personas** (Priority Order)

### 1. **New Parent** - Looking for club info for their child

**Needs:**

- Clear overview of what the club offers
- Programs available (teams, testing, competitions)
- Costs, perks, and membership benefits
- Contact information and how to get started
- List of available coaches

### 2. **Current Member/Skater** - Regular updates

**Needs:**

- Upcoming test sessions and registration
- Competition announcements
- Latest club announcements
- Recognition for tests passed and competition results
- Quick access to important links (EntryEeze, EMS)

### 3. **Gala Guests/Donors** - Event information

**Needs:**

- Event logistics (date, location, time)
- Ticket purchasing capability
- Past event photos/videos to understand the vibe
- Information about supporting the club

---

## **Brand & Design System**

### **Logo & Assets**

- Primary logo: `/public/images/logo.png` (Golden Gate Bridge circular design)
- Use this logo in the header navigation

### **Color Palette** (Extracted from Logo)

Configure these in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        'sky-blue': '#4BA3C3',      // Main background blue - use for section backgrounds, cards
        'golden-yellow': '#F4B41A',  // Circle border, accents - use for CTAs, buttons, badges
        'bridge-orange': '#C1502E',  // Golden Gate Bridge color - use for links, important callouts
        'royal-blue': '#1450A3',     // Bottom band - use for header/nav, footer, primary buttons
        'off-white': '#F8F9FA',      // Light backgrounds
        'charcoal': '#2C3E50',       // Text, headers
      }
    }
  }
}
```

### **Color Usage Guidelines**

- **Primary (sky-blue)**: Section backgrounds, subtle card highlights
- **Accent (golden-yellow)**: Primary CTAs, hover states, featured badges
- **Bridge-orange**: Text links, important event tags, active nav states
- **Royal-blue**: Header background, footer, primary action buttons
- **Use colors sparingly** - mostly white backgrounds with strategic color pops
- Incorporate **circular design elements** where appropriate (echo the logo)

### **Typography**

- Use a clean, modern sans-serif (Inter, Outfit, or system fonts)
- Clear hierarchy between h1, h2, h3
- Readable body text (16px base minimum)

### **Visual Style**

- Clean, modern sports organization aesthetic
- Plenty of whitespace for breathing room
- Card-based layouts with subtle shadows
- Mobile-first design approach
- High contrast for accessibility
- Professional but welcoming tone

---

## **Site Structure & Navigation**

### **Main Navigation**

```
About
  - About the Club
  - Board of Directors
  - Announcements
  - Events (Annual Gala, Skate SF)
  - Club History

Membership
  - Why Join?
  - Join the Club
  - Membership Policies
  - Code of Conduct

Club Resources
  - Support Programs
  - Competition Resources
  - Testing
  - SCSF Coaches
  - Ice Time
  - Order Club Jackets

Programs
  - Teams (Ice Theatre, Tremors)
  - Tests
  - Competitions

FAQs
```

### **Footer Structure**

```
Contact Information:
- The Skating Club of San Francisco, Inc.
- P.O. BOX 320457, San Francisco, CA 94132
- Email: [contact email if available]

Yerba Buena Ice Skating & Bowling Center:
- 750 Folsom St., San Francisco, CA 94107
- Phone: (415) 820-3521

Social Media:
- Facebook icon + link
- Instagram icon + link

Quick Links:
- Get Involved
- Support/Donate
- Volunteer
- Privacy Policy
- FAQs

External Links:
- SCSF EntryEeze Portal
- EMS Registration (USFS)
```

---

## **Sanity Content Types (Already Configured)**

You have access to these content types:

- `announcement` - Blog-style posts with title, date, excerpt, content, author, mainImage
- `event` - Events with title, eventType, startDate, endDate, location, description, ticketLink, isFeatured, mainImage
- `testPassed` - Test results with skaterName, testType, testLevel, passedDate
- `coach` - Coach directory with name, photo, bio, specialties, email, phone
- `boardMember` - Board members with name, role, photo, bio, order
- `page` - Generic pages with title, slug, content, showInNav

---

## **Homepage Requirements** (Priority #1)

Build a modern, engaging homepage with these sections:

### **1. Hero Section**

- Full-width hero image or background (skating imagery)
- Overlay text targeting the "new parent" persona
- Headline: Something welcoming like "Welcome to the Skating Club of San Francisco"
- Subheadline: Brief value proposition (e.g., "Supporting figure skaters of all levels since [year]. Join our community.")
- **Primary CTA Button**: "Join the Club" (golden-yellow background, links to membership page)
- **Secondary CTA**: "Learn More" or "View Programs"
- Ensure text is readable over image (use overlay gradient if needed)

### **2. Latest Announcements Section**

- Section title: "Latest News" or "Recent Announcements"
- Display **3 most recent** announcements from Sanity
- Each announcement card should show:
  - Date (formatted nicely)
  - Title
  - Excerpt (first 2-3 lines)
  - "Read More" link
  - Optional: Featured image thumbnail if available
- Cards should have subtle shadows and hover states
- Link to full announcements archive page
- Use sky-blue or off-white background for this section

### **3. Upcoming Events Section**

- Section title: "Upcoming Events"
- Display events where `isFeatured = true` AND `startDate` is in the future
- Show 1-2 featured events prominently
- Each event card should show:
  - Event type badge (golden-yellow background)
  - Title
  - Date range (formatted nicely)
  - Location
  - Brief description
  - "Learn More" or "Register" button (if ticketLink exists)
  - Optional: Event image
- If no featured events, show a placeholder message

### **4. Quick Links / Call-to-Action Section** (Optional)

- 3-4 icon-based cards for quick actions:
  - "View Test Schedule"
  - "Meet Our Coaches"
  - "Competition Calendar"
  - "Support the Club"
- Each with icon, title, brief description, and link

### **5. Recognition Highlight** (Optional for MVP)

- "Recent Achievements" or "Congratulations"
- Pull 3-5 recent test results or competition highlights
- Keep it simple - just names and accomplishments

---

## **Announcements Pages**

### **Announcements List Page** (`/announcements`)

- Page title: "Announcements"
- Display all announcements in reverse chronological order
- Pagination or "Load More" if there are many posts
- Each listing shows:
  - Date
  - Title
  - Excerpt
  - "Read More" link
- Clean, scannable layout

### **Individual Announcement Page** (`/announcements/[slug]`)

- Full article layout
- Show: title, date, author, featured image, full content
- Back link to announcements list
- Consider: sharing buttons (optional)

---

## **Static Pages**

### **About the Club Page** (`/about`)

- Mission statement
- Brief history
- What makes SCSF special
- Programs overview (link to detailed program pages)
- Photos if available
- Link to board members

### **Membership Page** (`/membership`)

- "Why Join?" section targeting new parents
- Benefits of membership
- Membership categories and pricing (if available)
- Clear "Join Now" CTA linking to EntryEeze or external registration
- Policies information (code of conduct, volunteer commitment)

---

## **Layout Components**

### **Header/Navigation**

- Logo on the left (clickable, links to homepage)
- Main navigation menu (desktop: horizontal, mobile: hamburger)
- Dropdown menus for nested navigation
- Sticky header (optional but nice)
- Use royal-blue background with white text
- Active/hover states use bridge-orange or golden-yellow

### **Footer**

- Dark background (royal-blue or charcoal)
- Three columns on desktop, stacked on mobile:
  - Column 1: Contact info (address, email)
  - Column 2: Quick links (support, volunteer, privacy, FAQs)
  - Column 3: Social media icons + external links (EntryEeze, EMS)
- Bottom row: Copyright text
- Links use golden-yellow or white with hover effects

---

## **Key Technical Requirements**

### **Sanity Integration**

1. Create `lib/sanity.client.ts` with Sanity client configuration
2. Create `lib/sanity.queries.ts` with GROQ queries for:
   - Latest announcements
   - Featured events
   - Individual announcement by slug
   - All announcements (paginated)
3. Use Server Components for data fetching where possible
4. Use `@sanity/image-url` for optimized image rendering

### **Sample GROQ Queries to Implement**

```groq
// Latest 3 announcements
*[_type == "announcement"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  author
}

// Featured events
*[_type == "event" && isFeatured == true && startDate > now()] | order(startDate asc) {
  _id,
  title,
  slug,
  eventType,
  startDate,
  endDate,
  location,
  description,
  ticketLink,
  mainImage
}

// Single announcement
*[_type == "announcement" && slug.current == $slug][0] {
  _id,
  title,
  publishedAt,
  content,
  mainImage,
  author
}
```

### **Responsive Design**

- Mobile-first approach (most parents browse on phones)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation collapses to hamburger menu on mobile
- Cards stack vertically on mobile, grid on desktop
- Touch-friendly tap targets (minimum 44px)

### **Performance**

- Use Next.js Image component for all images
- Optimize Sanity image URLs
- Lazy load images below the fold
- Minimize JavaScript bundle size

### **SEO & Metadata**

- Implement proper `<title>` and `<meta>` tags for each page
- Add OpenGraph tags for social sharing
- Use semantic HTML (header, nav, main, article, section, footer)
- Alt text for all images

---

## **Styling Guidelines**

### **Component Patterns**

- **Buttons**: Rounded corners (rounded-md), clear padding, hover states
  - Primary: golden-yellow background, dark text, hover: slightly darker
  - Secondary: outline style with bridge-orange border
- **Cards**: White background, subtle shadow (shadow-sm), hover: shadow-md, rounded corners
- **Links**: bridge-orange color, underline on hover
- **Sections**: Alternating white and off-white backgrounds for visual separation

### **Spacing**

- Generous padding/margin (use Tailwind's spacing scale)
- Sections: py-16 md:py-24
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

### **Typography Scale**

- h1: text-4xl md:text-5xl lg:text-6xl font-bold
- h2: text-3xl md:text-4xl font-bold
- h3: text-2xl md:text-3xl font-semibold
- Body: text-base md:text-lg
- Small: text-sm

---

## **What NOT to Include (Out of Scope)**

- User authentication/login system
- Member portal/dashboard
- Payment processing (link to external services instead)
- Advanced search functionality
- Multi-language support
- Comment systems
- Complex admin permissions

---

## **File Structure**

```
app/
  layout.tsx              # Root layout with Header/Footer
  page.tsx                # Homepage
  announcements/
    page.tsx              # Announcements list
    [slug]/
      page.tsx            # Individual announcement
  about/
    page.tsx              # About page
  membership/
    page.tsx              # Membership page
  events/
    page.tsx              # Events list (optional)

components/
  Header.tsx              # Site header with navigation
  Footer.tsx              # Site footer
  AnnouncementCard.tsx    # Reusable announcement card
  EventCard.tsx           # Reusable event card
  Container.tsx           # Max-width container wrapper

lib/
  sanity.client.ts        # Sanity client configuration
  sanity.queries.ts       # GROQ queries
  sanity.image.ts         # Image URL builder helper

public/
  images/
    logo.png              # SCSF logo
```

---

## **Key Differences from Current WordPress Site**

### **Remove:**

- Sticky social media sidebar (move to footer)
- Redundant top bar links (Facebook, newsletter archive)
- Excessive menu depth (flatten navigation)
- Paid contact form widget (build simple form or link to email)
- Cluttered carousel with no clear CTAs

### **Improve:**

- Mobile responsiveness (current site is not mobile-friendly)
- Clear visual hierarchy and CTAs
- Modern, clean design aesthetic
- Fast loading times
- Easy content management for non-technical users
- Accessible design

---

## **Immediate Priorities for Prototype**

Build these in order:

1. **Homepage** with all sections (hero, announcements, events, footer)
2. **Header/Navigation** component with responsive menu
3. **Footer** component with all contact/link sections
4. **Announcements list page** (`/announcements`)
5. **Individual announcement page** (`/announcements/[slug]`)
6. **One static page** - either "About" or "Membership"

---

## **Success Criteria**

- ✅ Homepage loads and looks modern/professional
- ✅ Content dynamically pulls from Sanity CMS
- ✅ Non-technical users can add/edit content via `/studio`
- ✅ Navigation is intuitive and works on mobile
- ✅ Site is fully responsive (mobile, tablet, desktop)
- ✅ Brand colors are used tastefully throughout
- ✅ Performance is good (Lighthouse score >90)
- ✅ Site is deployable to Vercel with one command

---

## **Additional Notes**

- Keep code clean and well-commented
- Use TypeScript properly with interfaces for Sanity data
- Handle loading and error states gracefully
- Ensure all external links open in new tabs
- Test on multiple screen sizes
- If you need placeholder images, use appropriate skating/sports imagery
- Remember: this is a community sports club, not a corporate website - keep it warm and welcoming

---

## **Deployment**

Once built:

```bash
vercel --prod
```

The site will be live at a Vercel URL that can be shown to stakeholders. Sanity Studio will also be accessible at `[your-url]/studio` for content management demo.

---

**GO BUILD! Focus on clean, modern, mobile-responsive design with the brand colors used tastefully. Fetch real data from Sanity. Make it look professional but welcoming. You've got this!** 🚀
