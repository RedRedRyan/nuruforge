const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "craft",
      title: "Craft",
    },
    {
      id: "info",
      title: "Info",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];

  const socials = [
    {
       name: "Youtube",
       icon: "/icons/youtube.png",
       url: "https://www.youtube.com/@Nuruforge",
    },
    {
       name: "X (Twitter)",
       icon: "/icons/x.png",
       url: "https://x.com/nuruforge",
    },
    {
       name: "TikTok",
       icon: "/icons/tiktok.png",
       url: "https://www.tiktok.com/@nuruforge",
    },
        {
        name: "LinkedIn",
        icon: "/icons/linkedin.png",
        url: "https://www.linkedin.com/company/nuruforge",
        },
        {
            name: "Instagram",
            icon: "/icons/instagram.png",
            url: "https://www.instagram.com/nuruforge",
        },
        {
            name: "Facebook",
            icon: "/icons/facebook.png",
            url: "https://www.facebook.com/nuruforge",
        }
   ];


  
  const marketsList = [
    {
      network: "/images/cryptologos/eth.svg",
      networkName: "Ethereum",
      collateral: "/images/cryptologos/meth.svg",
      collateralSymbol: "mETH",
      loan: "/images/cryptologos/usdc.svg",
      loanSymbol: "USDC",
      lltv: "86%",
      sixHrRate: "0.0021%",
      totalLiquidity: "$210.4M",
      slug: "market-1",
    },
    {
      network: "/images/cryptologos/base.svg",
      networkName: "Base",
      collateral: "/images/cryptologos/eth.svg",
      collateralSymbol: "ETH",
      loan: "/images/cryptologos/usdc.svg",
      loanSymbol: "USDC",
      lltv: "91.5%",
      sixHrRate: "0.0014%",
      totalLiquidity: "$158.7M",
      slug: "market-2",
    },
    {
      network: "/images/cryptologos/arb.svg",
      networkName: "Arbitrum",
      collateral: "/images/cryptologos/steth.svg",
      collateralSymbol: "stETH",
      loan: "/images/cryptologos/eth.svg",
      loanSymbol: "ETH",
      lltv: "94.5%",
      sixHrRate: "0.0008%",
      totalLiquidity: "$89.1M",
      slug: "market-3",
    },
    {
      network: "/images/cryptologos/eth.svg",
      networkName: "Ethereum",
      collateral: "/images/cryptologos/dai.svg",
      collateralSymbol: "DAI",
      loan: "/images/cryptologos/usdc.svg",
      loanSymbol: "USDC",
      lltv: "96.5%",
      sixHrRate: "0.0031%",
      totalLiquidity: "$54.6M",
      slug: "market-4",
    },
  ];
  const features = [
    {
      title: "Confidential Lending",
      description:
        "Supply assets to isolated markets with fully encrypted positions using FHE technology.",
      icon: "/images/rates.png",
      link: "/markets/supply",
    },
    {
      title: "Private Borrowing",
      description:
        "Borrow against collateral without exposing your strategy or position size to the public.",
      icon: "/images/credit.png",
      link: "/markets/borrow",
    },
    {
      title: "Isolated Markets",
      description:
        "Create or participate in permissionless markets with independent liquidity pools and risk.",
      icon: "/images/chart.png",
      link: "/markets/create",
    },
    {
      title: "Earn Yield",
      description:
        "Earn competitive APY from lending activity while keeping your supply shares encrypted on-chain.",
      icon: "/images/safe.png",
      link: "/earn",
    },
    {
      title: "FHE Privacy",
      description:
        "All positions encrypted as euint128 — only you can decrypt and view your exposure locally.",
      icon: "/images/qr.png",
      link: "/privacy",
    },
  ];


  

  
  export {
    navLinks,
    marketsList,
    features,
    socials

  };