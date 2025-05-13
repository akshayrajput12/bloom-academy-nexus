
import React from "react";
import { Helmet } from "react-helmet-async";

interface HeadContentProps {
  title?: string;
  description?: string;
}

const HeadContent: React.FC<HeadContentProps> = ({
  title = "Student Manager - Efficiently Manage Your Students",
  description = "A comprehensive student management system for educational institutions.",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </Helmet>
  );
};

export default HeadContent;
