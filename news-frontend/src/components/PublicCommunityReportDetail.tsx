import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchUserInfo, type CommunityReport } from "../services/communityReportsApi";
import PublicNews from "./PublicNews";
import MediaPlayer from "./MediaPlayer";

const PublicCommunityReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<CommunityReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch a reasonable batch and find by id locally
        const { results } = await fetchUserInfo({ limit: 50, offset: 0 });
        const found = results.find((r) => String(r.id) === String(id));
        if (!found) {
          setError('Report not found');
        }
        setReport(found || null);
      } catch (err: any) {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading report...</h5>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h4>Report Not Found</h4>
          <p className="text-muted">The requested public report could not be found.</p>
          <Link to="/" className="btn btn-primary">Back</Link>
        </div>
      </div>
    );
  }

  const formattedDate = report.created_at || report.published_date;

  return (
    <div className="container-fluid my-4">
      <div className="row g-4">
        {/* Main Content - 9 columns */}
        <div className="col-lg-9 col-md-8">
          <Link to="/" className="btn btn-outline-secondary mb-3">Back</Link>
          <div className="card shadow-sm border-0" style={{ borderRadius: "0" }}>
            {/* Media section if S3 file is present */}
            {report.s3_file_url && (
              <div className="p-3 border-bottom">
                <MediaPlayer 
                  fileUrl={report.s3_file_url} 
                  fileName={report.ai_headline}
                  className="mb-0"
                />
              </div>
            )}
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-secondary">Public</span>
                <div className="text-end">
                  <small className="text-muted d-block">
                    {formattedDate ? new Date(formattedDate).toLocaleString() : 'Unknown date'}
                  </small>
                  {report.author && (
                    <small className="text-muted">
                      By: {report.author}
                    </small>
                  )}
                </div>
              </div>
              <h1 className="card-title mb-3" style={{ color: "#800000", fontSize: "2rem", lineHeight: "1.2" }}>
                {report.ai_headline}
              </h1>
              <div className="card-text" style={{ fontSize: "1.1rem", lineHeight: "1.6", textAlign: "justify" }}>
                {report.ai_summary ? report.ai_summary.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                )) : (
                  <p className="mb-3">No additional content provided.</p>
                )}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="mt-4 d-flex align-items-center gap-2">
                <Link to="/" className="btn btn-outline-secondary">Back</Link>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-share"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - 3 columns: More Public Reports */}
        <div className="col-lg-3 col-md-4">
          <div className="mb-4">
            <h6 className="mb-2">More Public Reports</h6>
            <PublicNews initialLimit={10} enableControls={true} excludeId={report.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCommunityReportDetail;


