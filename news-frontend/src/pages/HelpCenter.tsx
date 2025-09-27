import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I navigate the Coltigent News Rider website?",
      answer:
        "Use the navigation bar at the top to access categories like National, World, Sports, Business, Education, Local, Trending, and Public.",
    },
    {
      question: "How often is the news updated on Coltigent News Rider?",
      answer:
        "Breaking news is updated immediately, while other news is refreshed every few hours for accuracy.",
    },
    {
      question: "Is Coltigent News Rider free to use?",
      answer:
        "Yes, all features are free to use. You can read, watch videos, and explore trending news without payment.",
    },
    {
      question: "Can I share Coltigent News Rider articles on social media?",
      answer:
        "Yes, every article has share buttons for quick posting on your social media platforms.",
    },
    {
      question: "What makes Coltigent News Rider different?",
      answer:
        "We focus on real-time updates, user-friendly design, video news, trending topics, and accurate reporting.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="container py-5">
      {/* Intro */}
      <div className="text-center mb-4">
        <h1 className="fw-bold" style={{ color: "#2c3e50" }}>
          Help Center
        </h1>
        <p className="text-muted">
          Find answers to common questions or reach out to our support team.
        </p>
      </div>

      {/* Search */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="accordion" id="faqAccordion">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="accordion-item mb-2">
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button ${openAccordion === index ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openAccordion === index}
                  aria-controls={`collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${openAccordion === index ? 'show' : ''}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted">{faq.answer}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No FAQs found.</p>
        )}
      </div>

      {/* Contact */}
      <div className="mt-5 text-center">
        <h3 className="h5 fw-bold mb-3" style={{ color: "#2c3e50" }}>
          Need More Help?
        </h3>
        <p className="text-muted">
          You can reach us anytime at:{" "}
          <a href="mailto:info@coltigent.com">info@coltigent.com</a>
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
