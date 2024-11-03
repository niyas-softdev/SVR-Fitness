export const plansData = {
    frequencies: [
      { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
      { value: 'annually', label: 'Annually', priceSuffix: '/year' }
    ],
    plans: [
      {
        name: 'Basic Plan',
        id: 'basic-plan',
        price: { monthly: '999', annually: '9999' },
        description: 'Great for beginners starting their fitness journey.',
        features: ['Access to all gym equipment', 'Locker room access', '1 personal training session'],
        mostPopular: false
      },
      {
        name: 'Pro Plan',
        id: 'pro-plan',
        price: { monthly: '1999', annually: '19999' },
        description: 'Designed for regular gym-goers with advanced needs.',
        features: [
          'Unlimited group classes',
          '5 personal training sessions',
          'Access to VIP lounge'
        ],
        mostPopular: true
      },
      {
        name: 'Elite Plan',
        id: 'elite-plan',
        price: { monthly: '2999', annually: '29999' },
        description: 'For professionals seeking the best facilities and trainers.',
        features: [
          'All-access gym pass',
          'Unlimited personal training sessions',
          'Spa and massage access'
        ],
        mostPopular: false
      }
    ]
  };
  