/**
 * Training Content Seed Data
 * Pre-built courses for Insurance Licensing, Sales Training, and Team Building
 */

export const insuranceLicensingCourse = {
  title: 'Insurance Licensing: Complete Guide',
  slug: 'insurance-licensing-guide',
  description: 'Comprehensive training to help you obtain your insurance license and start your career as a licensed insurance agent.',
  category: 'licensing' as const,
  difficulty: 'beginner' as const,
  duration: 480, // 8 hours
  featured: true,
  required: true,
  displayOrder: 1,
  metadata: {
    learningObjectives: [
      'Understand insurance licensing requirements',
      'Prepare for and pass the state insurance exam',
      'Learn about different types of insurance products',
      'Navigate the licensing application process',
      'Maintain continuing education requirements',
    ],
    instructor: 'Apex Affinity Training Team',
    certification: true,
  },
  modules: [
    {
      title: 'Introduction to Insurance Licensing',
      description: 'Understanding the basics of insurance licensing and requirements',
      duration: 60,
      displayOrder: 1,
      lessons: [
        {
          title: 'Why Get Licensed?',
          content: `
# Why Get Licensed as an Insurance Agent?

Becoming a licensed insurance agent opens doors to a rewarding career with unlimited earning potential.

## Benefits of Insurance Licensing

### Financial Rewards
- Unlimited earning potential through commissions
- Residual income from policy renewals
- Multiple income streams (life, health, property, casualty)
- Build a sustainable business

### Professional Growth
- Gain credibility with clients
- Access to top insurance carriers
- Professional development opportunities
- Industry recognition

### Flexibility
- Set your own schedule
- Work from anywhere
- Build your own team
- Scale your business

## What You'll Learn

In this course, you'll discover:
- State-specific licensing requirements
- How to prepare for the state exam
- Product knowledge for life and health insurance
- Ethics and regulations
- Continuing education requirements

Let's get started on your journey to becoming a licensed insurance professional!
          `,
          lessonType: 'article' as const,
          duration: 15,
          displayOrder: 1,
        },
        {
          title: 'Understanding State Requirements',
          content: `
# State Insurance Licensing Requirements

Each state has specific requirements for insurance licensing. Here's what you need to know.

## General Requirements

### Age and Residency
- Must be at least 18 years old (some states require 21)
- Must be a U.S. citizen or legal resident
- Background check required

### Pre-Licensing Education
Most states require completion of pre-licensing education:
- **Life Insurance**: 20-40 hours
- **Health Insurance**: 20-40 hours
- **Property & Casualty**: 40-60 hours

### State Exam
- Pass your state's licensing examination
- Separate exams for different license types
- Minimum passing score typically 70%

### Application Process
1. Complete pre-licensing education
2. Pass the state exam
3. Submit licensing application
4. Background check
5. Pay licensing fees

## State-Specific Resources

We'll provide you with resources for your specific state, including:
- Pre-licensing course providers
- Exam scheduling information
- Application forms and instructions
- Fee schedules
- Continuing education requirements

**Next:** We'll dive into exam preparation strategies.
          `,
          lessonType: 'article' as const,
          duration: 20,
          displayOrder: 2,
        },
        {
          title: 'Types of Insurance Licenses',
          content: `
# Types of Insurance Licenses

Understanding different license types helps you choose the right path for your career.

## Common License Types

### Life Insurance License
Allows you to sell:
- Term life insurance
- Whole life insurance
- Universal life insurance
- Variable life insurance
- Annuities

**Best for**: Agents focused on financial planning and long-term client relationships

### Health Insurance License
Allows you to sell:
- Individual health insurance
- Group health plans
- Medicare supplements
- Long-term care insurance
- Disability insurance

**Best for**: Agents passionate about helping people access healthcare

### Property & Casualty License
Allows you to sell:
- Auto insurance
- Homeowners insurance
- Commercial property insurance
- Liability insurance

**Best for**: Agents who enjoy variety and business insurance

### Combined Licenses
Many agents hold multiple licenses:
- **Life & Health**: Most common combination
- **Life, Health & Annuities**: Comprehensive financial products
- **All Lines**: Maximum flexibility

## Which License Should You Get?

### Consider Your Goals
- What products excite you?
- What client base do you want to serve?
- What income potential are you targeting?

### Our Recommendation
Start with **Life & Health** licensing:
- Lower barrier to entry
- Strong earning potential
- Aligns with Apex Affinity's product offerings
- Can expand later with additional licenses

**Next:** Exam preparation strategies and study tips.
          `,
          lessonType: 'article' as const,
          duration: 25,
          displayOrder: 3,
        },
      ],
    },
    {
      title: 'Exam Preparation',
      description: 'Strategies and resources to help you pass your licensing exam',
      duration: 120,
      displayOrder: 2,
      lessons: [
        {
          title: 'Study Strategies That Work',
          content: `
# Proven Exam Preparation Strategies

Passing your licensing exam requires focused preparation. Here's how to succeed.

## Create a Study Plan

### Set a Timeline
- **4-6 weeks** is typical for most candidates
- Study **1-2 hours per day** consistently
- Schedule your exam **before** you start studying

### Use Multiple Resources
- **Pre-licensing course** (required)
- **Practice exams** (critical!)
- **Flashcards** for key terms
- **Study groups** for accountability

## Focus on High-Value Topics

### Life Insurance Exam Topics
1. **Insurance Basics** (15-20%)
   - Terminology
   - Types of policies
   - Policy provisions

2. **Life Insurance Products** (25-30%)
   - Term insurance
   - Whole life
   - Universal life
   - Variable products

3. **Taxes & Regulations** (20-25%)
   - Tax treatment of policies
   - Federal regulations
   - State regulations

4. **Application & Underwriting** (15-20%)
   - Application process
   - Risk classification
   - Medical exams

### Health Insurance Exam Topics
1. **Health Insurance Basics** (15-20%)
2. **Medicare & Medicaid** (25-30%)
3. **Group Health Plans** (15-20%)
4. **Medical Terms & Conditions** (10-15%)
5. **Regulations & Ethics** (20-25%)

## Study Techniques

### Active Recall
- Don't just read - test yourself
- Use practice questions extensively
- Explain concepts out loud

### Spaced Repetition
- Review material multiple times
- Space out your study sessions
- Focus on weak areas

### Practice Exams
- Take **at least 3** full practice exams
- Simulate exam conditions
- Review **every wrong answer**

## Resources We Provide
- Access to top-rated pre-licensing courses
- 500+ practice questions
- Study guides and cheat sheets
- One-on-one tutoring (if needed)

**Next:** Let's explore life insurance products in detail.
          `,
          lessonType: 'article' as const,
          duration: 30,
          displayOrder: 1,
        },
        {
          title: 'Life Insurance Products Deep Dive',
          content: `
# Life Insurance Products: What You Need to Know

Master the different types of life insurance products for your exam and future sales.

## Term Life Insurance

### Overview
- Provides coverage for a specific period
- Most affordable option
- Pure death benefit protection

### Types of Term Insurance
1. **Level Term**
   - Premium stays the same
   - Common lengths: 10, 20, 30 years
   - Most popular choice

2. **Decreasing Term**
   - Death benefit decreases over time
   - Often used for mortgage protection
   - Lower premiums

3. **Increasing Term**
   - Death benefit increases over time
   - Protects against inflation
   - Higher premiums

### Key Features
- No cash value accumulation
- Convertible to permanent insurance
- Renewable options available
- Lower initial cost

## Permanent Life Insurance

### Whole Life Insurance
- **Guaranteed** death benefit
- **Guaranteed** cash value growth
- **Fixed** premiums for life
- **Dividends** (in participating policies)

**Best for**: Conservative clients wanting guarantees

### Universal Life Insurance
- **Flexible** premiums
- **Adjustable** death benefit
- **Cash value** with interest
- **Transparency** in costs

**Types:**
- Traditional UL
- Indexed UL (tied to market index)
- Variable UL (investment options)

**Best for**: Clients wanting flexibility

### Variable Life Insurance
- **Investment options** (mutual funds)
- **Market-based** returns
- **Risk** of loss
- **Securities license** required to sell

**Best for**: Sophisticated investors

## Comparing Products

| Feature | Term | Whole Life | Universal Life |
|---------|------|------------|----------------|
| Cash Value | No | Yes | Yes |
| Premium | Low | High | Flexible |
| Duration | Temporary | Lifetime | Lifetime |
| Guarantees | Death Benefit | Everything | Minimum |

## Exam Tips
- Know the **differences** between products
- Understand when each is **appropriate**
- Memorize key **features** of each type
- Practice **scenario questions**

**Next:** Health insurance products and regulations.
          `,
          lessonType: 'article' as const,
          duration: 45,
          displayOrder: 2,
        },
        {
          title: 'Health Insurance Essentials',
          content: `
# Health Insurance: Products and Regulations

Understanding health insurance is crucial for your licensing exam and career.

## Types of Health Insurance

### Individual Health Insurance
- Purchased directly by consumers
- ACA (Affordable Care Act) compliant plans
- Metal tiers: Bronze, Silver, Gold, Platinum
- Essential health benefits required

### Group Health Insurance
- Employer-sponsored coverage
- ERISA regulations apply
- COBRA continuation rights
- Often includes dental/vision

### Medicare
**Part A**: Hospital insurance
**Part B**: Medical insurance
**Part C**: Medicare Advantage (private plans)
**Part D**: Prescription drug coverage

**Medicare Supplements (Medigap)**
- Fills gaps in Original Medicare
- Standardized plans (A-N)
- Guaranteed renewable
- High demand product

### Medicaid
- State and federal program
- For low-income individuals
- Eligibility varies by state
- Managed care plans available

## Key Health Insurance Concepts

### Deductibles
- Amount you pay before insurance kicks in
- Annual reset
- Can be per person or family

### Copayments
- Fixed amount per service
- $20 for doctor visit
- $10 for prescription

### Coinsurance
- Percentage you pay after deductible
- Common: 80/20 or 70/30 split
- Continues until out-of-pocket max

### Out-of-Pocket Maximum
- Maximum you'll pay in a year
- After this, insurance pays 100%
- Includes deductibles, copays, coinsurance

## Important Regulations

### HIPAA (Health Insurance Portability)
- Privacy protections
- Pre-existing condition limitations
- Portability between jobs

### ACA (Affordable Care Act)
- No pre-existing condition exclusions
- Essential health benefits
- Dependent coverage to age 26
- Individual mandate (some states)

### State Regulations
- Vary by state
- License requirements
- Market conduct rules
- Consumer protections

## Exam Focus Areas

### High-Priority Topics
1. Medicare Parts A, B, C, D
2. Medicare Supplements
3. ACA provisions
4. Underwriting and rating
5. HIPAA privacy rules

### Common Exam Questions
- Medicare eligibility ages
- Medigap enrollment periods
- ACA essential benefits
- HIPAA violations

**Next:** Taking practice quizzes to test your knowledge.
          `,
          lessonType: 'article' as const,
          duration: 45,
          displayOrder: 3,
        },
      ],
    },
    {
      title: 'The Licensing Process',
      description: 'Step-by-step guide through the application and exam process',
      duration: 90,
      displayOrder: 3,
      lessons: [
        {
          title: 'Scheduling Your Exam',
          content: `
# Scheduling and Taking Your Licensing Exam

You've studied hard - now it's time to take the exam. Here's exactly what to do.

## Step 1: Complete Pre-Licensing Education

### Find an Approved Provider
We partner with top providers:
- **Kaplan Financial Education**
- **ExamFX**
- **America's Professor**
- **360training**

### Complete Your Hours
- Life: 20-40 hours (state-specific)
- Health: 20-40 hours (state-specific)
- Self-paced or instructor-led options
- Receive certificate of completion

**Cost**: $100-$300 per course

## Step 2: Schedule the Exam

### Testing Providers
Most states use:
- **Prometric**
- **PSI Services**
- **Pearson VUE**

### How to Schedule
1. Visit your state's testing provider website
2. Create an account
3. Select your exam type
4. Choose date, time, and location
5. Pay the exam fee

**Exam Fees**: $50-$150

### Best Practices
- Schedule **2-3 weeks out** (motivation!)
- Choose **morning** time slots (fresh mind)
- Pick a **convenient location**
- Avoid Monday mornings (often busiest)

## Step 3: Exam Day Preparation

### What to Bring
**Required:**
- Government-issued photo ID
- Exam confirmation number
- Payment receipt (if needed)

**Not Allowed:**
- Cell phones
- Study materials
- Calculators (provided if needed)
- Food or drinks

### Arrival
- Arrive **30 minutes early**
- Check in at front desk
- Secure belongings in locker
- Review test center rules

## Step 4: Taking the Exam

### Exam Format
- **Multiple choice** questions
- **100-150 questions** typically
- **2-3 hours** time limit
- **Computer-based** testing

### Strategy During the Exam
1. Read each question **carefully**
2. Eliminate wrong answers first
3. Don't spend too long on one question
4. Mark and return to difficult questions
5. Review all answers if time permits

### Passing Score
- Typically **70%** correct
- Results available **immediately**
- Printed pass/fail report provided

## Step 5: If You Don't Pass

### Don't Panic!
- Many successful agents didn't pass first try
- Learn from the experience
- Review weak areas

### Retake Information
- Usually can retake after **24 hours**
- May need to wait **30 days** in some states
- Additional exam fee required
- Unlimited attempts (in most states)

## Step 6: Receiving Your Results

### Passing the Exam
- Immediate notification
- Score report provided
- Proceed to license application

### Next Steps After Passing
1. Celebrate! 🎉
2. Submit state license application
3. Complete background check
4. Pay licensing fees
5. Receive your license number

**Timeline**: 2-6 weeks for full licensing

**Next:** Completing your license application.
          `,
          lessonType: 'article' as const,
          duration: 30,
          displayOrder: 1,
        },
        {
          title: 'License Application Process',
          content: `
# Completing Your License Application

You passed the exam! Now let's get you officially licensed.

## Application Methods

### Online Application (Preferred)
Most states use **NIPR** (National Insurance Producer Registry):
- Faster processing
- Electronic payment
- Track application status
- Receive license electronically

### Paper Application
Some states still accept paper:
- Download from state website
- Complete by hand or type
- Mail with payment
- Longer processing time

## Required Information

### Personal Information
- Full legal name
- Social Security Number
- Date of birth
- Contact information
- Citizenship status

### Background Information
Questions about:
- Criminal history
- License suspensions
- Bankruptcy
- Professional misconduct

**Be Honest**: Background check will verify

### Education & Exam
- Pre-licensing course completion
- Exam pass date and score
- Testing center information

## Required Documents

### Typically Needed
1. **Proof of exam passage**
2. **Background check authorization**
3. **Employer/sponsor information** (if applicable)
4. **Fees payment**

### Additional Documents (Sometimes)
- Photo (digital upload)
- Fingerprint cards
- Bond or E&O insurance proof
- Business entity documents

## Application Fees

### Typical Costs
- **Application fee**: $50-$100
- **License fee**: $50-$150
- **Background check**: $50-$100
- **Total**: $150-$350

### Payment Methods
- Credit/debit card (online)
- Check or money order (paper)
- Some states accept electronic check

## Background Check

### What They Check
- Criminal history (federal and state)
- Credit history
- Previous license actions
- Professional references

### Timeline
- Electronic checks: 2-5 days
- FBI fingerprint check: 2-4 weeks

### Common Issues
**Minor traffic violations**: Usually OK
**DUI**: May require explanation
**Felonies**: Varies by state and type

## Processing Timeline

### Typical Timeframes
- **Electronic submission**: 1-2 weeks
- **Paper submission**: 4-6 weeks
- **With background issues**: 6-8 weeks

### Tracking Your Application
Most states offer:
- Online status checking
- Email notifications
- Phone support line

## After Approval

### Receiving Your License
- Email notification
- License number assigned
- Digital license available
- Physical license mailed (some states)

### Important Information
- **License number**: Use for all transactions
- **Expiration date**: Typically 2 years
- **CE requirements**: Starts immediately
- **E&O insurance**: May be required

### Activating Your License
1. Receive license number
2. Apply with insurance carriers
3. Get appointed with carriers
4. Start selling!

## Continuing Education

### Ongoing Requirements
Most states require:
- **20-24 hours** every 2 years
- **Ethics course** (3-4 hours)
- State-approved courses only
- Completion before renewal

### We've Got You Covered
Apex Affinity provides:
- Free CE courses
- Automatic tracking
- Renewal reminders
- Ethics training

**Next:** Starting your insurance career with Apex Affinity.
          `,
          lessonType: 'article' as const,
          duration: 30,
          displayOrder: 2,
        },
        {
          title: 'Maintaining Your License',
          content: `
# Maintaining Your Insurance License

Getting licensed is just the beginning. Here's how to maintain your license for a long career.

## License Renewal

### Renewal Frequency
- Most states: **Every 2 years**
- Some states: **Annually**
- Mark your calendar!

### Renewal Requirements
1. Complete continuing education
2. Pay renewal fees
3. Update contact information
4. Affirm background questions

### Renewal Fees
- Typically $50-$150
- Due before expiration date
- Late fees if you miss deadline

## Continuing Education (CE)

### Why CE Matters
- Keeps you current on products
- Updates on regulations
- Maintains professional standards
- Required by law

### Typical Requirements
**Total Hours**: 20-24 hours per 2 years

**Required Topics:**
- **Ethics**: 3-4 hours (every renewal)
- **State regulations**: 2-4 hours
- **General topics**: 14-16 hours

### CE Course Options

**Online Courses** (Most Popular)
- Self-paced
- Available 24/7
- Immediate completion certificates
- Track progress automatically

**Webinars**
- Live instruction
- Q&A opportunities
- Scheduled times
- Interactive learning

**In-Person Classes**
- Classroom setting
- Networking opportunities
- Hands-on activities
- Local continuing education providers

### Apex Affinity CE Benefits
We provide FREE continuing education:
- 50+ approved courses
- All required ethics courses
- Automatic completion tracking
- Renewal reminders

## Carrier Appointments

### What Are Appointments?
- Authorization to sell specific carrier's products
- Required for each insurance company
- Commission agreements tied to appointments

### Maintaining Appointments
- Meet minimum production requirements
- Complete carrier-specific training
- Maintain E&O insurance
- Follow carrier guidelines

### Appointment Terminations
Can happen if:
- Low production
- Compliance violations
- Misrepresentation
- License suspension

## Errors & Omissions (E&O) Insurance

### What is E&O?
- Professional liability insurance
- Protects against lawsuit costs
- Often required by states/carriers
- Covers unintentional errors

### Coverage Amounts
- Minimum: $100,000
- Recommended: $1,000,000
- Higher for P&C agents

### Cost
- $300-$800 annually
- Varies by coverage amount
- Discounts for group policies

## Compliance Best Practices

### Avoid License Discipline
1. Always tell the truth
2. Keep accurate records
3. Follow carrier guidelines
4. Disclose material information
5. Maintain client confidentiality

### Report Changes
Notify your state insurance department:
- Name changes
- Address changes
- Criminal convictions
- Civil actions
- Bankruptcy

### Common Violations
**Never:**
- Misrepresent products
- Forge signatures
- Share commissions with unlicensed persons
- Engage in rebating (where prohibited)
- Mix personal and client funds

## Record Keeping

### Required Documentation
- Client applications
- Policy illustrations
- Disclosure forms
- Communication records

### Retention Period
- Typically **5-7 years**
- Some states require longer
- Digital storage acceptable

### Best Practices
- Organize by client
- Backup regularly
- Secure storage
- Easy retrieval system

## Multi-State Licensing

### Non-Resident Licenses
If you want to sell in multiple states:

1. Get resident license first
2. Apply for non-resident licenses
3. Usually no additional exam
4. Pay fees for each state
5. Maintain all CE requirements

### Costs
- Each state charges fees
- CE requirements vary
- May need multiple E&O policies

## Career Development

### Advanced Certifications
Consider pursuing:
- **CLU** (Chartered Life Underwriter)
- **ChFC** (Chartered Financial Consultant)
- **LUTCF** (Life Underwriter Training Council Fellow)
- **CLTC** (Certification in Long-Term Care)

### Benefits of Certifications
- Increased credibility
- Higher income potential
- Advanced product knowledge
- Professional recognition

## Resources & Support

### Apex Affinity Provides
- License renewal reminders
- Free CE courses
- Compliance support
- Appointment assistance
- E&O insurance options
- Career coaching

### State Department of Insurance
- License verification
- Renewal processing
- Complaint resolution
- Regulatory guidance

**Congratulations!** You now have a complete understanding of insurance licensing. Next, let's move on to actually selling insurance!
          `,
          lessonType: 'article' as const,
          duration: 30,
          displayOrder: 3,
        },
      ],
    },
  ],
}

export const insuranceSalesCourse = {
  title: 'Insurance Sales Mastery',
  slug: 'insurance-sales-mastery',
  description: 'Learn proven strategies to sell insurance effectively, build client relationships, and maximize your income.',
  category: 'sales' as const,
  difficulty: 'intermediate' as const,
  duration: 360, // 6 hours
  featured: true,
  required: true,
  displayOrder: 2,
  metadata: {
    learningObjectives: [
      'Master the insurance sales process',
      'Build trust and rapport with clients',
      'Handle objections effectively',
      'Close more sales confidently',
      'Manage your sales pipeline',
    ],
    instructor: 'Top Producers at Apex Affinity',
    certification: true,
  },
  modules: [
    {
      title: 'The Sales Mindset',
      description: 'Developing the right mindset for insurance sales success',
      duration: 60,
      displayOrder: 1,
      lessons: [
        {
          title: 'You Are Helping, Not Selling',
          content: `
# The Insurance Sales Mindset

The best insurance agents don't think of themselves as salespeople - they think of themselves as problem solvers and protectors.

## Shift Your Perspective

### From Selling TO Helping
**Old mindset**: "I need to sell a policy"
**New mindset**: "I need to protect this family"

When you genuinely care about helping people:
- Clients sense your authenticity
- You ask better questions
- You recommend right solutions
- You build lasting relationships
- Referrals happen naturally

## Why Insurance Matters

### You're Providing Protection
Every policy you sell:
- Protects families from financial devastation
- Ensures children can go to college
- Prevents home foreclosure
- Provides retirement income
- Covers medical expenses

### Real Impact Stories
**The Young Father**: 32 years old, bought term life insurance for $40/month. Passed away unexpectedly. His $500,000 policy meant his wife could stay home with their toddler and pay off their mortgage.

**The Retiree**: Bought long-term care insurance at 62. At 75, needed nursing home care costing $8,000/month. Policy paid benefits for 4 years, protecting retirement savings.

**The Business Owner**: Purchased disability insurance. At 48, suffered stroke and couldn't work for 18 months. Disability policy paid $6,000/month, saving his business and family.

## Characteristics of Top Producers

### 1. Servant Leadership
- Put clients first
- Educate don't manipulate
- Build trust through transparency

### 2. Resilience
- Embrace rejection
- Learn from setbacks
- Maintain positive attitude

### 3. Continuous Learning
- Stay updated on products
- Master sales skills
- Understand market trends

### 4. Time Management
- Prioritize income-producing activities
- Systemize routine tasks
- Focus on high-value prospects

### 5. Relationship Building
- Follow up consistently
- Provide ongoing value
- Ask for referrals

## The Insurance Sales Professional Code

### Your Commitments
1. **Always do what's best for the client** - even if it means less commission
2. **Never misrepresent products** - honesty builds long-term success
3. **Educate thoroughly** - informed clients make better decisions
4. **Follow up consistently** - service after the sale matters
5. **Continuously improve** - be the best version of yourself

## Setting Income Goals

### Think Big, Start Smart
**Year 1 Goal**: $50,000-$75,000
**Year 2 Goal**: $75,000-$100,000
**Year 3+ Goal**: $100,000-$250,000+

### Income Breakdown
If you want to earn $100,000:
- **Average commission**: $500 per policy
- **Policies needed**: 200 per year
- **Per month**: 17 policies
- **Per week**: 4 policies

### Make It Happen
- **Appointments per policy**: 3-4
- **Weekly appointments needed**: 12-16
- **Daily prospecting**: 2-3 hours
- **Presentations**: 2-3 per day

**Next**: Learning the complete insurance sales process.
          `,
          lessonType: 'article' as const,
          duration: 30,
          displayOrder: 1,
        },
      ],
    },
    {
      title: 'The Sales Process',
      description: 'Step-by-step process to convert prospects into satisfied clients',
      duration: 120,
      displayOrder: 2,
      lessons: [
        {
          title: 'Prospecting and Lead Generation',
          content: `
# Prospecting: Building Your Pipeline

Without prospects, there are no sales. Let's build a consistent flow of qualified leads.

## Prospecting Methods

### 1. Warm Market (Fastest Results)
**Who**: People you already know
- Family and friends
- Former colleagues
- Social media connections
- Community members

**Approach**:
"Hey [Name], I recently got licensed to help people protect their families with life insurance. I'm building my business and would love your support. Can we grab coffee so I can share what I'm doing?"

**Pros**: Higher trust, easier appointments
**Cons**: Limited pool, can feel uncomfortable

### 2. Referrals (Best Quality)
**The Golden Rule**: Every satisfied client knows 10 potential clients

**How to Ask**:
"I'm so glad we found the right coverage for you! I help families just like yours every day. Who do you know - maybe a family member, coworker, or neighbor - who would benefit from having their family protected?"

**Follow-Up**:
"Would you mind texting/calling them to let them know I'll be reaching out? That way they'll expect my call."

### 3. Social Media Marketing
**Platforms**: Facebook, LinkedIn, Instagram

**Content Strategy**:
- Share client testimonials (with permission)
- Post educational content
- Show your lifestyle (freedom, income)
- Tell your story
- Go live weekly

**Example Posts**:
- "Just helped a family save $200/month on their insurance!"
- "Quick tip: Don't wait until you have health issues to get life insurance"
- "My client testimonial: [Share success story]"

### 4. Community Involvement
**Where to Connect**:
- Chamber of Commerce
- Networking groups (BNI, etc.)
- Church or religious organizations
- Sports leagues
- Volunteer organizations

**Be Genuine**: Network to build relationships, not just to sell

### 5. Online Lead Generation
**Paid Methods**:
- Facebook Ads ($300-$500/month budget)
- Google Ads (more expensive, highly qualified)
- Lead aggregators (shared leads)

**Free Methods**:
- YouTube channel
- Blog or website
- LinkedIn outreach
- Facebook groups

### 6. Direct Mail
**Still Works**:
- Target specific demographics
- Send postcards or letters
- Include compelling offer
- Track response rate

**Cost**: $0.50-$1.00 per piece

## The Prospecting Schedule

### Daily Plan
**Morning (8-10 AM)**:
- 30 calls to warm market
- 10 social media messages
- 5 LinkedIn connections

**Afternoon (1-3 PM)**:
- Follow up on previous contacts
- Set appointments
- Research prospects

**Goal**: 10-15 conversations per day

### Weekly Metrics
- **100+ prospect contacts**
- **20-30 appointments set**
- **10-15 presentations given**
- **4-6 policies sold**

## Qualifying Prospects

### Not Everyone is Your Client
**Good Prospects**:
- Have a need
- Can afford premiums
- Are decision-makers
- Are ready to act

**Poor Prospects**:
- Just gathering information
- No urgency
- Can't afford coverage
- Won't meet in person

### The Qualifier Questions
1. "Do you currently have life insurance?" (Identifies need)
2. "When was the last time you reviewed your coverage?" (Opening)
3. "If something happened to you, would your family be financially secure?" (Creates urgency)
4. "Are you the person who makes financial decisions?" (Decision maker)
5. "If I can show you affordable options, when would you like to meet?" (Action)

## Setting Appointments

### The Perfect Script
"I help families protect themselves from financial disaster. I'd love to show you how affordable it can be to give your family peace of mind. Do you have 30 minutes this week to meet? I have Tuesday at 6pm or Thursday at 7pm - which works better for you?"

### Key Elements
1. **Brief value statement**
2. **Specific time commitment** (30 minutes)
3. **Two-choice close** (Tuesday or Thursday)
4. **Confirm immediately**

### Appointment Confirmation
**24 hours before**:
Text: "Looking forward to meeting tomorrow at 6pm! I have some great options to show you."

**2 hours before**:
Text: "See you at 6pm! Address is [Your Location]. Can't wait to help you protect your family!"

**Next**: How to conduct effective fact-finding appointments.
          `,
          lessonType: 'article' as const,
          duration: 40,
          displayOrder: 1,
        },
      ],
    },
  ],
}

export const teamBuildingCourse = {
  title: 'Team Building & Recruiting',
  slug: 'team-building-recruiting',
  description: 'Build a strong, productive team by recruiting, training, and developing new insurance representatives.',
  category: 'recruiting' as const,
  difficulty: 'advanced' as const,
  duration: 300, // 5 hours
  featured: true,
  required: false,
  displayOrder: 3,
  metadata: {
    learningObjectives: [
      'Identify and recruit quality team members',
      'Conduct effective recruiting presentations',
      'Train new representatives for success',
      'Build team culture and motivation',
      'Scale your team for maximum growth',
    ],
    instructor: 'Leadership Team at Apex Affinity',
    certification: true,
  },
  modules: [
    {
      title: 'The Power of Team Building',
      description: 'Why building a team accelerates your success',
      duration: 45,
      displayOrder: 1,
      lessons: [
        {
          title: 'Why Build a Team?',
          content: `
# The Power of Building a Team

Building a team is how you go from earning a good income to creating true wealth and time freedom.

## The Leverage Principle

### Working Alone
**Your Income Formula**: Your Time × Your Sales = Your Income

**Limitations**:
- Only 24 hours in a day
- Physical and mental limitations
- Income stops when you stop working
- No scalability

**Maximum Potential**: $100,000-$250,000/year

### Working with a Team
**Your Income Formula**:
(Your Time × Your Sales) + (Team's Time × Team's Sales × Your Override) = Your Income

**Advantages**:
- Unlimited time through others
- Multiple income streams
- Passive override income
- Exponential growth potential
- Time freedom

**Maximum Potential**: $250,000-$1,000,000+/year

## Real Team Building Success Stories

### Case Study: Sarah M.
**Timeline**: 3 years
- Year 1: Solo agent, earned $65,000
- Year 2: Recruited 5 team members, earned $120,000
- Year 3: Team of 15 people, earned $320,000

**Key Success Factor**: Recruited 1-2 people per month consistently

### Case Study: Michael T.
**Timeline**: 5 years
- Started with zero insurance experience
- Built team of 47 representatives
- Earns $750,000+ annually
- Works 20 hours per week
- True time and financial freedom

## The Math of Team Building

### Your Commission Levels
**Personal Sales**: 80-100% commission
**Level 1 (Direct Recruits)**: 20-40% override
**Level 2 (Their Recruits)**: 10-20% override
**Level 3+**: 5-10% override

### Income Breakdown Example
**Scenario**: You have 10 direct recruits, each recruiting 5 people

**Your Team**:
- You: 1
- Level 1: 10 people
- Level 2: 50 people
- Total Organization: 61 people

**Monthly Income Calculation**:
- **Your sales**: 5 policies × $500 = $2,500
- **Level 1 override**: 10 people × 4 policies × $150 = $6,000
- **Level 2 override**: 50 people × 3 policies × $75 = $11,250
- **Total Monthly Income**: $19,750
- **Annual Income**: $237,000

## Benefits Beyond Money

### Time Freedom
- Team handles prospecting
- Systems run the business
- Work from anywhere
- Vacation without income loss

### Personal Growth
- Leadership development
- Public speaking skills
- Business management
- Mentorship abilities

### Impact
- Create opportunities for others
- Change families' financial futures
- Build lasting legacy
- Community recognition

## The Team Building Mindset

### Leadership vs. Management
**Managers**:
- Tell people what to do
- Focus on tasks
- Control outcomes

**Leaders**:
- Show people the way
- Inspire action
- Develop people
- Create vision

### You Must Be A Leader
**Leaders**:
1. **Lead by example** - Be the model producer
2. **Serve their team** - Help others succeed
3. **Cast vision** - Show what's possible
4. **Stay positive** - Encouragement over criticism
5. **Never stop recruiting** - Always building

## Team Building Stages

### Stage 1: Personal Production (Months 1-3)
**Focus**: Become profitable yourself
- Learn the products
- Master the sales process
- Build confidence
- Create income
- Develop systems

**Don't Recruit Yet**: Get your foundation first

### Stage 2: Begin Recruiting (Months 4-6)
**Focus**: Add 1-2 team members
- Identify candidates
- Share opportunity
- Provide training
- Support their sales
- Refine your system

### Stage 3: Scale Your Team (Months 7-12)
**Focus**: Recruit consistently
- Add 2-3 people monthly
- Develop leaders
- Implement systems
- Build culture
- Track metrics

### Stage 4: Leadership Development (Year 2+)
**Focus**: Create leaders who recruit
- Identify top performers
- Train on recruiting
- Provide leadership development
- Create incentives
- Plan recognition events

## Common Team Building Mistakes

### Mistake 1: Recruiting Too Early
**Problem**: You can't teach what you haven't mastered
**Solution**: Get 3-6 months of personal success first

### Mistake 2: Recruiting Anyone Who Says Yes
**Problem**: Wrong people create problems
**Solution**: Be selective, quality over quantity

### Mistake 3: Not Training Properly
**Problem**: New reps fail and quit
**Solution**: Comprehensive onboarding and ongoing support

### Mistake 4: Giving Up Too Soon
**Problem**: Team building takes time
**Solution**: Commit to 2-3 years of consistent effort

### Mistake 5: Not Staying in Production
**Problem**: Leaders who don't sell lose credibility
**Solution**: Always maintain personal production

## Your Team Building Commitment

### The 90-Day Challenge
Commit to recruiting **one new representative per month** for 90 days.

**Month 1**: Recruit Person A
**Month 2**: Recruit Person B (you have 2)
**Month 3**: Recruit Person C (you have 3)

If each person does the same:
- **Month 4**: 3 × 1 = 3 new (you have 6)
- **Month 5**: 6 × 1 = 6 new (you have 12)
- **Month 6**: 12 × 1 = 12 new (you have 24)

**In 6 months**: Team of 24+ people!

**Next**: How to identify ideal team member candidates.
          `,
          lessonType: 'article' as const,
          duration: 45,
          displayOrder: 1,
        },
      ],
    },
  ],
}
