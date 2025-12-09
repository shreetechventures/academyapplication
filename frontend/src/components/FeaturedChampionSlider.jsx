import React from "react";
import "../styles/champions.css";

export default function FeaturedChampionSlider({ champions }) {
  return (
    <div className="featured-slider">
      {champions.map((c) => (
        <div key={c._id} className="featured-slide">
          <img src={c.imageUrl} alt="champion" />
          <h4>{c.name}</h4>
          <p>{c.achievementTitle}</p>
        </div>
      ))}
    </div>
  );
}
