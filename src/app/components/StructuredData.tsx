"use client";

import React from "react";

const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Mahadev Automobiles",
    alternateName: "Chottu's Bike Repair Shop",
    description:
      "Professional bike repair and maintenance services in Sataun, District Sirmour, Himachal Pradesh. Expert mechanics with over 7 years of experience. Same-day repairs, quality parts, emergency services.",
    url: "https://mahadevautomobiles.vercel.app",
    telephone: "+918350902050",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Bus Stand",
      addressLocality: "Sataun",
      addressRegion: "Sirmour",
      addressCountry: "IN",
      postalCode: "173029",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.75,
      longitude: 77.25,
    },
    openingHours: "Mo-Sa 09:00-20:00, Su 09:00-18:00",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Card, UPI",
    areaServed: [
      {
        "@type": "City",
        name: "Sataun",
      },
      {
        "@type": "City",
        name: "Sirmour",
      },
      {
        "@type": "State",
        name: "Himachal Pradesh",
      },
    ],
    serviceType: [
      "Bike Repair",
      "Bicycle Maintenance",
      "Emergency Repairs",
      "Bike Tune-up",
      "Parts Replacement",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bike Repair Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Basic Tune-Up",
            description:
              "Complete inspection and adjustment of brakes, gears, and wheels. Perfect for regular maintenance.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Service",
            description:
              "Comprehensive service including parts replacement, deep cleaning, and complete bike overhaul.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Emergency Repairs",
            description:
              "Quick fixes for urgent issues. Flat tires, broken chains, and other immediate problems.",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Amit Chauhan",
        },
        reviewBody:
          "Excellent service! They fixed my mountain bike in just a few hours. The mechanic was very knowledgeable and explained everything clearly.",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Deepak Chauhan",
        },
        reviewBody:
          "I've been bringing my bikes here for years. Always reliable, fair pricing, and they stand behind their work. Highly recommended!",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Akhil Chaudhary",
        },
        reviewBody:
          "Emergency repair on a Sunday! They came through when I needed them most. Professional and quick service. Will definitely use them again.",
      },
    ],
    sameAs: [
      "https://www.facebook.com/mahadevautomobiles",
      "https://www.instagram.com/mahadevautomobiles",
    ],
    foundingDate: "2017",
    founder: {
      "@type": "Person",
      name: "Sunil Tomar",
      alternateName: "Chottu",
      jobTitle: "Owner & Lead Mechanic",
      description:
        "Owner of Mahadev Automobiles with over 7 years of experience in bike repair and maintenance",
    },
    employee: {
      "@type": "Person",
      name: "Sunil Tomar (Chottu)",
      jobTitle: "Owner & Bike Repair Specialist",
      description:
        "Certified mechanic and owner with over 7 years of experience in bike repair and maintenance",
    },
    award: [
      "7+ Years Experience",
      "1000+ Bikes Repaired",
      "100% Satisfaction Rate",
      "24h Emergency Service",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
