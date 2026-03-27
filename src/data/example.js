export const EXAMPLE_DATA = {
  domains: [
    {
      id: 'd1', name: 'Build', color: '#E8630A',
      vectors: [
        {
          id: 'v1', name: 'Ship the Product',
          goal: 'Launch SaaS MVP and reach first 10 paying customers by Q2',
          status: 'on track',
          actions: [
            { id: 'a1',  text: 'Finalize core feature set, cut scope ruthlessly', quarter: 'Q1' },
            { id: 'a2',  text: 'Build auth + billing infrastructure', quarter: 'Q1' },
            { id: 'a3',  text: 'Run 5 user interviews on prototype', quarter: 'Q1' },
            { id: 'a4',  text: 'Public beta launch + Product Hunt post', quarter: 'Q2' },
            { id: 'a5',  text: 'Onboard first 10 paid users personally', quarter: 'Q2' },
            { id: 'a6',  text: 'Implement top 3 requests from beta feedback', quarter: 'Q2' },
          ],
          krs: [
            { id: 'k1', label: 'Beta waitlist signups', current: 87, target: 200 },
            { id: 'k2', label: 'Paying customers', current: 0, target: 10 },
            { id: 'k3', label: 'Core features shipped', current: 6, target: 8 },
          ],
        },
        {
          id: 'v2', name: 'Grow MRR',
          goal: 'Reach $3 000 MRR by end of year through retention and distribution',
          status: 'not started',
          actions: [
            { id: 'a7',  text: 'Set up email nurture sequence for trial users', quarter: 'Q3' },
            { id: 'a8',  text: 'Launch affiliate / referral program', quarter: 'Q3' },
            { id: 'a9',  text: 'Write 6 SEO-targeted landing pages', quarter: 'Q3' },
            { id: 'a10', text: 'Annual plan promo to convert monthly users', quarter: 'Q4' },
          ],
          krs: [
            { id: 'k4', label: 'MRR ($)', current: 0, target: 3000 },
            { id: 'k5', label: 'Churn rate (%)', current: 0, target: 5 },
          ],
        },
      ],
    },

    {
      id: 'd2', name: 'Craft', color: '#0891B2',
      vectors: [
        {
          id: 'v3', name: 'Systems Design Depth',
          goal: 'Reach senior-principal level in distributed systems — pass staff loop at any top company',
          status: 'on track',
          actions: [
            { id: 'a11', text: 'Read Designing Data-Intensive Applications end-to-end', quarter: 'Q1' },
            { id: 'a12', text: 'Design and document 3 real system architecture proposals', quarter: 'Q1' },
            { id: 'a13', text: 'Do 2 mock staff-level system design interviews', quarter: 'Q2' },
            { id: 'a14', text: 'Contribute architecture RFC to open-source project', quarter: 'Q2' },
          ],
          krs: [
            { id: 'k6', label: 'Mock interview score (1–10)', current: 6, target: 9 },
            { id: 'k7', label: 'Architecture docs written', current: 1, target: 3 },
          ],
        },
        {
          id: 'v4', name: 'Open Source Signal',
          goal: 'Build visible OSS presence — 500 GitHub stars on personal project',
          status: 'attention',
          actions: [
            { id: 'a15', text: 'Ship v1.0 of CLI tool with README + demo GIF', quarter: 'Q1' },
            { id: 'a16', text: 'Post on HN Show HN + Reddit r/programming', quarter: 'Q2' },
            { id: 'a17', text: 'Add contributor guide, triage open issues weekly', quarter: 'Q2' },
            { id: 'a18', text: 'Write blog post on architecture decisions', quarter: 'Q3' },
          ],
          krs: [
            { id: 'k8', label: 'GitHub stars', current: 34, target: 500 },
            { id: 'k9', label: 'External contributors', current: 1, target: 10 },
          ],
        },
      ],
    },

    {
      id: 'd3', name: 'Body', color: '#16A34A',
      vectors: [
        {
          id: 'v5', name: 'Triathlon Finish',
          goal: 'Complete Olympic-distance triathlon in under 2h 45min',
          status: 'on track',
          actions: [
            { id: 'a19', text: 'Build swim base — 3×/week, 2km sessions', quarter: 'Q1' },
            { id: 'a20', text: 'Long ride every Saturday, 60 → 80km progression', quarter: 'Q1' },
            { id: 'a21', text: 'Run 4×/week, add brick sessions bi-weekly', quarter: 'Q2' },
            { id: 'a22', text: 'Two B-race tune-up events (sprint tri)', quarter: 'Q2' },
            { id: 'a23', text: 'Race-week taper protocol, visualisation daily', quarter: 'Q3' },
          ],
          krs: [
            { id: 'k10', label: 'Swim pace /100m (sec)', current: 118, target: 100 },
            { id: 'k11', label: 'Cycling FTP (watts)', current: 215, target: 260 },
            { id: 'k12', label: 'Run 10km time (min)', current: 51, target: 46 },
          ],
        },
        {
          id: 'v6', name: 'Strength Base',
          goal: 'Hit compound lift targets: 100kg squat, 120kg deadlift, 80kg bench',
          status: 'paused',
          actions: [
            { id: 'a24', text: 'Resume 2×/week lifting after triathlon (Q4)', quarter: 'Q4' },
            { id: 'a25', text: '12-week linear progression program', quarter: 'Q4' },
          ],
          krs: [
            { id: 'k13', label: 'Squat 1RM (kg)', current: 82, target: 100 },
            { id: 'k14', label: 'Deadlift 1RM (kg)', current: 105, target: 120 },
          ],
        },
      ],
    },

    {
      id: 'd4', name: 'Wealth', color: '#CA8A04',
      vectors: [
        {
          id: 'v7', name: 'Investment Engine',
          goal: 'Invest 20% of gross income monthly, grow portfolio to target by year-end',
          status: 'on track',
          actions: [
            { id: 'a26', text: 'Automate monthly index fund buy on the 1st', quarter: 'Q1' },
            { id: 'a27', text: 'Review and rebalance portfolio allocation (Q2)', quarter: 'Q2' },
            { id: 'a28', text: 'Max out pension / retirement contribution for the year', quarter: 'Q3' },
            { id: 'a29', text: 'Tax-loss harvest review before year-end', quarter: 'Q4' },
          ],
          krs: [
            { id: 'k15', label: 'Portfolio value ($k)', current: 68, target: 90 },
            { id: 'k16', label: 'Savings rate (%)', current: 22, target: 30 },
          ],
        },
        {
          id: 'v8', name: 'Side Income Runway',
          goal: 'Build 12-month emergency fund + diversify income beyond salary',
          status: 'on track',
          actions: [
            { id: 'a30', text: 'Calculate exact 12-month runway target', quarter: 'Q1' },
            { id: 'a31', text: 'Freelance contract: 1 client, 1 day/week max', quarter: 'Q2' },
            { id: 'a32', text: 'Product revenue covers hosting + tools costs', quarter: 'Q3' },
          ],
          krs: [
            { id: 'k17', label: 'Emergency fund months', current: 4, target: 12 },
            { id: 'k18', label: 'Non-salary income ($k/yr)', current: 8, target: 24 },
          ],
        },
      ],
    },

    {
      id: 'd5', name: 'Mind', color: '#7C3AED',
      vectors: [
        {
          id: 'v9', name: 'Deep Work Protocol',
          goal: 'Average 4 hours of uninterrupted deep work daily, 5 days a week',
          status: 'on track',
          actions: [
            { id: 'a33', text: 'Block 7–11am calendar every weekday, no meetings', quarter: 'Q1' },
            { id: 'a34', text: 'Phone in drawer during deep work blocks', quarter: 'Q1' },
            { id: 'a35', text: 'Weekly review: track actual deep hours logged', quarter: 'Q1' },
            { id: 'a36', text: 'Introduce Pomodoro logging for accountability', quarter: 'Q2' },
          ],
          krs: [
            { id: 'k19', label: 'Avg deep hours/day', current: 3.1, target: 4.0 },
            { id: 'k20', label: 'Focus streak (weeks)', current: 5, target: 20 },
          ],
        },
        {
          id: 'v10', name: 'Spanish Fluency',
          goal: 'Reach B2 conversational fluency — hold a 30-min business conversation',
          status: 'not started',
          actions: [
            { id: 'a37', text: 'Start italki: 3 lessons/week with native tutor', quarter: 'Q3' },
            { id: 'a38', text: 'Duolingo streak: daily vocab, 15 min minimum', quarter: 'Q3' },
            { id: 'a39', text: 'Watch 1 Spanish Netflix show per month, no subtitles', quarter: 'Q4' },
            { id: 'a40', text: 'One-week immersion trip (Colombia or Mexico)', quarter: 'Q4' },
          ],
          krs: [
            { id: 'k21', label: 'CEFR level (A1=1 … C2=6)', current: 1, target: 4 },
            { id: 'k22', label: 'italki lessons completed', current: 0, target: 48 },
          ],
        },
      ],
    },

    {
      id: 'd6', name: 'People', color: '#DB2777',
      vectors: [
        {
          id: 'v11', name: 'Mentorship Circle',
          goal: 'Give back consistently — mentor 3 junior engineers, stay connected to key peers',
          status: 'on track',
          actions: [
            { id: 'a41', text: 'Schedule bi-weekly 1:1 with each mentee', quarter: 'Q1' },
            { id: 'a42', text: 'Host one "office hours" session for the community', quarter: 'Q2' },
            { id: 'a43', text: 'Write "lessons learned" post on engineering growth', quarter: 'Q2' },
            { id: 'a44', text: 'Attend one in-person conference, reconnect with 10 peers', quarter: 'Q3' },
          ],
          krs: [
            { id: 'k23', label: 'Active mentees', current: 2, target: 3 },
            { id: 'k24', label: 'Meaningful peer checkins/month', current: 3, target: 6 },
          ],
        },
      ],
    },
  ],

  anchors: [
    { id: 'an1', name: 'Beta Launch',          date: '2026-04-01', color: '#E8630A' },
    { id: 'an2', name: 'Q1 Review & Reset',    date: '2026-03-29', color: '#0891B2' },
    { id: 'an3', name: 'Sprint Offsite',        date: '2026-05-22', color: '#7C3AED' },
    { id: 'an4', name: 'Olympic Triathlon',     date: '2026-08-16', color: '#16A34A' },
    { id: 'an5', name: 'Q3 Review & Reset',     date: '2026-09-27', color: '#0891B2' },
    { id: 'an6', name: 'Colombia Trip',         date: '2026-11-08', color: '#DB2777' },
    { id: 'an7', name: 'Year-End Review',       date: '2026-12-27', color: '#CA8A04' },
  ],

  calNotes: [
    { id: 'cn1', date: '2026-03-10', text: 'Deep work audit: only 2.4h avg this week — distraction was Slack pings. Block notifications during morning window.', type: 'reflection' },
    { id: 'cn2', date: '2026-03-15', text: '72km long ride — new PR on the main climb. FTP trending up.', type: 'log' },
    { id: 'cn3', date: '2026-03-20', text: 'User interview #4 done. Key insight: onboarding drop-off at step 3. Must fix before launch.', type: 'log' },
    { id: 'cn4', date: '2026-03-23', text: 'Portfolio hit $68k. Savings rate slipped to 18% — unexpected car repair. Back on track next month.', type: 'log' },
    { id: 'cn5', date: '2026-03-26', text: 'First mentee shipped their project to prod independently. This is why mentorship matters.', type: 'reflection' },
    { id: 'cn6', date: '2026-04-15', text: 'Product Hunt launch day — coordinate with community supporters', type: 'event' },
  ],

  checkedActions: [],
  lastUpdated: new Date().toISOString().split('T')[0],
}
