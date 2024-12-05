import React from "react";
import "./CardView.css";

function CardView() {
  const items = [
    { name: "Card 1", image: "image1.png", audio: "audio1.mp3" },
    { name: "Card 2", image: "image2.png", audio: "audio2.mp3" },
  ];

  return (
    <div className="card-container">
      {items.map((item, index) => (
        <div className="card" key={index}>
          <img src={`assets/images/${item.image}`} alt={item.name} />
          <h2>{item.name}</h2>
          <audio controls>
            <source src={`assets/audio/${item.audio}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
}

export default CardView;