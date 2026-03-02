import React, { useEffect, useState } from "react";
import "./GalleryPage.css";

const GALLERY_API_BASE =
  process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:8001`
    : "https://v3-dental-clinic.onrender.com";

function deriveTreatmentNameFromUrl(url) {
  if (!url) return "";
  try {
    const marker = "/tender-clinic/";
    const idx = url.indexOf(marker);
    if (idx === -1) return "";
    const start = idx + marker.length;
    const rest = url.substring(start);
    const parts = rest.split("/");
    const slug = parts[0];
    if (!slug) return "";
    const withSpaces = slug.replace(/-/g, " ");
    return withSpaces
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${GALLERY_API_BASE}/api/gallery`);
        if (!res.ok) {
          throw new Error("Failed to load gallery images");
        }
        const data = await res.json();
        const items = (Array.isArray(data) ? data : []).map((url) => ({
          url,
          treatmentName: deriveTreatmentNameFromUrl(url),
        }));
        setImages(items);
      } catch (err) {
        setError(err.message || "Unable to load gallery right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const treatmentCount = images.reduce((set, item) => {
    if (item.treatmentName) {
      set.add(item.treatmentName);
    }
    return set;
  }, new Set()).size;

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="gallery-hero-overlay" />
        <div className="gallery-hero-content">
          <h1 className="gallery-title">Smile Gallery</h1>
          <p className="gallery-subtitle">
            Real treatments. Real smiles.
          </p>
          {!loading && !error && treatmentCount > 0 && (
            <div className="gallery-count-badge">
              {treatmentCount}+<br />Smile Transformations
            </div>
          )}
        </div>
      </div>

      <div className="gallery-container">
        {loading && (
          <div className="gallery-status">
            <p>Loading gallery...</p>
          </div>
        )}

        {!loading && error && (
          <div className="gallery-status gallery-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="gallery-status">
            <p>No images uploaded yet. Please check back soon.</p>
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="gallery-grid">
            {images.map((item, index) => (
              <div className="gallery-item" key={index}>
                <div className="gallery-image-wrapper">
                  <img src={item.url} alt={item.treatmentName || `Treatment ${index + 1}`} loading="lazy" />
                </div>
                {item.treatmentName && (
                  <div className="gallery-image-caption">
                    {item.treatmentName}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;

