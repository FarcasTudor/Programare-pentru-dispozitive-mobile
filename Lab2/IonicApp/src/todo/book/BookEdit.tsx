import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonModal, IonPage, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar, createAnimation } from '@ionic/react';
import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { BookContext } from './BookProvider';
import { BookProps } from './BookProps';
import { usePhotoGallery } from '../../ionic3/usePhotoGallery';
import { useMyLocation } from '../../ionic3/useMyLocation';
import { MyMap } from '../../ionic3/MyMap';


interface BookEditProps extends RouteComponentProps<{
    id?: string;
}> { }

const BookEdit: React.FC<BookEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem } = useContext(BookContext);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [numberOfPages, setNumberOfPages] = useState<number>(0);
    const [startedReading, setstartedReading] = useState<Date>(new Date());
    const [finishedReading, setfinishedReading] = useState(false);
    const [item, setItem] = useState<BookProps>();
    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);
    const [currentLatitude, setCurrentLatitude] = useState<number | undefined>(undefined);
    const [currentLongitude, setCurrentLongitude] = useState<number | undefined>(undefined);
    const [webViewPath, setWebViewPath] = useState('');
    const [isLocationChanged, setIsLocationChanged] = useState<boolean>();

    const [isModalVisible, setIsModalVisible] = useState(false);


    const location = useMyLocation();
    const { latitude: lat, longitude: lng } = location.position?.coords || {};
    const { takePhoto } = usePhotoGallery();

    const handleModalAnimation = (show: boolean) => {
        setIsModalVisible(show);
        const modalElement = document.querySelector('.modal-wrapper');

        if (modalElement) {
            const animation = createAnimation()
                .addElement(modalElement)
                .duration(500)
                .fromTo('opacity', show ? '0' : '1', show ? '1' : '0');

            animation.play();
        }
    };

    useEffect(() => {
        const routeId = match.params.id || '';
        const item = items?.find(it => it._id === routeId);
        setItem(item);
        if (item) {
            setTitle(item.title);
            setGenre(item.genre);
            setNumberOfPages(item.numberOfPages);
            setstartedReading(item.startedReading);
            setfinishedReading(item.finishedReading);
            setLatitude(item.latitude);
            setLongitude(item.longitude);
            setWebViewPath(item.webViewPath);
        }
    }, [match.params.id, items]);

    useEffect(() => {
        if (latitude === undefined && longitude === undefined) {
            setCurrentLatitude(lat);
            setCurrentLongitude(lng);
        } else {
            setCurrentLatitude(latitude);
            setCurrentLongitude(longitude);
        }
    }, [lat, lng, longitude, latitude]);

    useEffect(() => {
        if (isLocationChanged) {
            const editedItem = item ? { ...item, title, genre, numberOfPages, startedReading, finishedReading, latitude, longitude, webViewPath } : { title, genre, numberOfPages, startedReading, finishedReading, latitude, longitude, webViewPath };
            console.log(editedItem);
            saveItem && saveItem(editedItem).then(() => { history.goBack() });
        }
    }, [isLocationChanged, item, title, genre, numberOfPages, startedReading, finishedReading, latitude, longitude, webViewPath, saveItem, history]);

    const handleSave = () => {
        setLocation();
    };

    async function handlePhotoChange() {
        const image = await takePhoto();
        if (!image) {
            setWebViewPath('');
        } else {
            setWebViewPath(image);
            handleModalAnimation(true);
        }
    }

    function setLocation() {
        setLatitude(currentLatitude);
        setLongitude(currentLongitude);
        setIsLocationChanged(true);
    }

    const customEnterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const customLeaveAnimation = (baseEl: any) => {
        return customEnterAnimation(baseEl).direction('reverse');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit book</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel>Title:  </IonLabel>
                    <IonInput placeholder="title" value={title} onIonChange={e => setTitle(e.detail.value || '')} />
                </IonItem>
                <IonItem>
                    <IonLabel>Number of pages:  </IonLabel>
                    <IonInput value={numberOfPages} onIonChange={e => setNumberOfPages(parseInt(e.detail.value || '0'))} />
                </IonItem>
                <IonItem>
                    <IonLabel>Genre:  </IonLabel>
                    <IonSelect value={genre} onIonChange={e => setGenre(e.detail.value)}>
                        <IonSelectOption value="war">war</IonSelectOption>
                        <IonSelectOption value="crime">crime</IonSelectOption>
                        <IonSelectOption value="drama">drama</IonSelectOption>
                        <IonSelectOption value="romance">romance</IonSelectOption>
                        <IonSelectOption value="thriller">thriller</IonSelectOption>
                        <IonSelectOption value="comedy">comedy</IonSelectOption>
                        <IonSelectOption value="fantasy">fantasy</IonSelectOption>
                    </IonSelect>

                </IonItem>
                <IonItem>
                    <IonLabel>Started Reading: </IonLabel>
                    <IonDatetime value={new Date(startedReading).toLocaleString()} onIonChange={e => setstartedReading(new Date(e.detail.value?.toLocaleString() || ''))} />
                </IonItem>
                <IonItem>
                    <IonLabel>Finished Reading: </IonLabel>
                    <IonToggle checked={finishedReading} onIonChange={e => setfinishedReading(e.detail.checked)} />
                </IonItem>
  
                {webViewPath && (<img onClick={handlePhotoChange} src={webViewPath} style={{marginLeft: '47%'}} width={'100px'} height={'100px'} />)}
                {!webViewPath && (<IonButton onClick={handlePhotoChange} style={{ width: 190, height: 20 }}>Click to add an image</IonButton>)}

                <IonModal isOpen={isModalVisible} enterAnimation={customEnterAnimation} leaveAnimation={customLeaveAnimation} backdropDismiss={true} onDidDismiss={() => setIsModalVisible(false)}>
                    <img id="image" src={webViewPath} />
                </IonModal>

                {lat && lng &&
                    <MyMap
                        lat={currentLatitude}
                        lng={currentLongitude}
                        onMapClick={log('onMap')}
                        onMarkerClick={log('onMarker')}
                    />
                }

                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError?.message || 'Failed to save book'}</div>
                )}
            </IonContent>
        </IonPage>
    );

    function log(source: string) {
        return (e: any) => {
            setCurrentLatitude(e.latLng.lat());
            setCurrentLongitude(e.latLng.lng());
            console.log(source, e.latLng.lat(), e.latLng.lng());
        }
    }
};

export default BookEdit;