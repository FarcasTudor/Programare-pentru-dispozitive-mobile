import { createAnimation, IonItem, IonLabel, IonModal } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { BookProps } from "./BookProps";

interface BookPropsExtended extends BookProps {
  onEdit: (_id?: string) => void;
}

const Book: React.FC<BookPropsExtended> = ({ _id, title, genre, startedReading, finishedReading, numberOfPages, latitude, longitude, webViewPath, onEdit }) => {

  const [showModal, setShowModal] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const itemStyle = {
    fontSize: "1.5rem",
    padding: "1rem",
  };

  const labelStyle = {
    fontSize: "1.2rem",
    fontFamily: 'Palatino',
    padding: "0.5rem",
  };
  
  const handleBookClick = () => {
    onEdit(_id);
  };

  return (
    <IonItem id="item" style={itemStyle} color="succes" onClick={handleBookClick}>
      <IonLabel style={labelStyle}>{title}</IonLabel>
      <IonLabel style={labelStyle}>{genre}</IonLabel>
      <IonLabel style={labelStyle}>{numberOfPages} pages</IonLabel>
      <IonLabel style={labelStyle}>
        {new Date(startedReading).toLocaleString()}
      </IonLabel>
      <IonLabel style={labelStyle}>
        {finishedReading ? "Finished 😃" : "Not finished 😞"}
      </IonLabel>
      <IonLabel style={labelStyle}>{latitude?.toFixed(8)}</IonLabel>
      <IonLabel style={labelStyle}>{longitude?.toFixed(8)}</IonLabel>
      {webViewPath && (<img id="image" src={webViewPath} width={'100px'} height={'100px'} />)}

      {!webViewPath && <div style={labelStyle}>No image for this book</div>}
    </IonItem>
  );
};

export default Book;
