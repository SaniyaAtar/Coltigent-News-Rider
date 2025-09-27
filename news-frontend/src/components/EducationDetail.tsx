import React from "react";
import { useParams, Link } from "react-router-dom";

const educationNews = [
  {
    id: 1,
    title: "NEP 2025 Implementation Update",
    description: "Full content about NEP 2025 implementation...",
    image: "https://via.placeholder.com/800x300",
  },
  {
    id: 2,
    title: "AI in Classrooms",
    description: "Full content about how AI is transforming classrooms...",
    image: "https://via.placeholder.com/800x300",
  },
  {
    id: 3,
    title: "Scholarship Announcements",
    description: "Full details of the new scholarship scheme...",
    image: "https://via.placeholder.com/800x300",
  },
];

const EducationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const news = educationNews.find((item) => item.id === Number(id));

  if (!news) {
    return <div className="container my-5 text-center">News not found.</div>;
  }

  return (
    <div className="container my-5">
      <Link to="/education" className="btn btn-outline-secondary mb-3">
        ← Back to Education News
      </Link>
      <div className="card shadow p-4">
        <h2 className="mb-3">{news.title}</h2>
        <img
          src={news.image}
          alt={news.title}
          className="img-fluid mb-3 rounded"
        />
        <p>{news.description}</p>
      </div>
    </div>
  );
};

export default EducationDetail;
