export const EXAMPLE_DATA = {
  domains: [
    {
      id: 'd1', name: 'Career', color: '#E8630A',
      vectors: [
        {
          id: 'v1', letter: 'A', name: 'Path Resolution',
          goal: 'Decide your career direction by end of Q1',
          status: 'attention',
          actions: [
            { id: 'a1', text: 'Complete leadership assessment', quarter: 'Q1' },
            { id: 'a2', text: 'Interview two people in target role', quarter: 'Q1' },
            { id: 'a3', text: 'Write decision framework doc', quarter: 'Q1' },
          ],
          krs: [{ id: 'k1', label: 'Decision clarity score', current: 60, target: 100 }],
        },
        {
          id: 'v2', letter: 'B', name: 'Public Brand',
          goal: 'Reach 500 channel subscribers through consistent publishing',
          status: 'building',
          actions: [
            { id: 'a4', text: 'Publish 2 posts per week', quarter: 'Q1' },
            { id: 'a5', text: 'Write methodology intro series', quarter: 'Q1' },
          ],
          krs: [{ id: 'k2', label: 'Subscribers', current: 190, target: 500 }],
        },
      ],
    },
    {
      id: 'd2', name: 'Sport', color: '#16A34A',
      vectors: [
        {
          id: 'v4', letter: 'A', name: 'Race Goal',
          goal: 'Complete a 30k race this autumn',
          status: 'active',
          actions: [
            { id: 'a7', text: 'Build base mileage to 35km/week', quarter: 'Q1' },
            { id: 'a8', text: 'Weekly long run every Sunday', quarter: 'Q1' },
          ],
          krs: [
            { id: 'k4', label: 'Weekly km', current: 22, target: 35 },
            { id: 'k5', label: 'Training weeks banked', current: 4, target: 26 },
          ],
        },
        {
          id: 'v5', letter: 'B', name: 'Chess Rating',
          goal: 'Reach 1700 blitz rating',
          status: 'building',
          actions: [{ id: 'a9', text: '30 min tactics daily', quarter: 'Q1' }],
          krs: [{ id: 'k6', label: 'Blitz rating', current: 1540, target: 1700 }],
        },
      ],
    },
    {
      id: 'd3', name: 'Finances', color: '#0891B2',
      vectors: [
        {
          id: 'v6', letter: 'A', name: 'Income Growth',
          goal: 'Grow total income 15%+ through new revenue streams',
          status: 'building',
          actions: [{ id: 'a10', text: 'Price and launch first paid offering', quarter: 'Q1' }],
          krs: [{ id: 'k7', label: 'Income vs baseline %', current: 105, target: 115 }],
        },
      ],
    },
    {
      id: 'd4', name: 'Health', color: '#7C3AED',
      vectors: [
        {
          id: 'v7', letter: 'A', name: 'Sleep Quality',
          goal: 'Consistent 7.5h+ nightly sleep',
          status: 'active',
          actions: [{ id: 'a12', text: 'Hard cutoff: screens off 10:45pm', quarter: 'Q1' }],
          krs: [{ id: 'k8', label: 'Avg sleep hours', current: 6.8, target: 7.5 }],
        },
      ],
    },
    {
      id: 'd5', name: 'Discipline', color: '#CA8A04',
      vectors: [
        {
          id: 'v8', letter: 'A', name: 'Morning Routine',
          goal: 'Consistent wake time + structured morning workflow',
          status: 'active',
          actions: [
            { id: 'a14', text: '6:30am wake, no snooze', quarter: 'Q1' },
            { id: 'a15', text: '15min planning session before work', quarter: 'Q1' },
          ],
          krs: [{ id: 'k9', label: 'Streak days', current: 12, target: 90 }],
        },
      ],
    },
  ],
  anchors: [
    { id: 'an1', name: 'Career Direction Decision', date: '2026-03-31', color: '#E8630A' },
    { id: 'an2', name: 'Race Day', date: '2026-09-13', color: '#16A34A' },
    { id: 'an3', name: 'Year-end Review', date: '2026-12-20', color: '#0891B2' },
  ],
  calNotes: [
    { id: 'cn1', date: '2026-03-16', text: 'Leadership camp — first session', type: 'event' },
    { id: 'cn2', date: '2026-03-09', text: '18km long run — felt strong', type: 'log' },
  ],
  checkedActions: [],
  lastUpdated: new Date().toISOString().split('T')[0],
}
