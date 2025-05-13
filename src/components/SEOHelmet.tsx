
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title = "Student Manager - Efficiently Manage Your Students",
  description = "A comprehensive student management system for educational institutions.",
  keywords = "student management, education, academic tracking, courses",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="icon" href="/favicon.png" />
      <meta property="og:title" content="Student Manager" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
    </Helmet>
  );
};

export default SEOHelmet;
