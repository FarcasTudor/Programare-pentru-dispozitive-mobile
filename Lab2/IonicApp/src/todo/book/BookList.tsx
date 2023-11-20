import { IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonPage, IonSearchbar, IonSelect, IonSelectOption, IonToast, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { BookContext } from "./BookProvider";
import Book from "./Book";
import { add, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { AuthContext } from "../auth";
import { BookProps } from "./BookProps";
import { getLogger } from '../../ionic3';
import { Network } from '@capacitor/core';
import "./styles.css";

const log = getLogger('BookList');

const offset = 7;

const BookList: React.FC<RouteComponentProps> = ({ history }) => {
    const { logout } = useContext(AuthContext)
    const { items, fetching, fetchingError } = useContext(BookContext);
    const [disableInfiniteScroll, setDisabledInfiniteScroll] = useState<boolean>(false);
    const [visibleItems, setVisibleItems] = useState<BookProps[] | undefined>([]);
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<boolean>(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
    const [isSaveHovered, setIsSaveHovered] = useState(false);

    const { savedOffline, setSavedOffline } = useContext(BookContext);

    Network.getStatus().then(status => setStatus(status.connected));

    Network.addListener('networkStatusChange', (status) => {
        console.log("Statusssss: " + status)
        setStatus(status.connected);
    })

    const genres = ["war", "crime", "drama", "romance", "thriller", "comedy"];

    useEffect(() => {
        if (items?.length && items?.length > 0) {
            setPage(offset);
            fetchData();
            console.log(items);
        }
    }, [items]);

    useEffect(() => {
        if (items && filter) {
            setVisibleItems(items.filter(each => each.genre === filter));
        }
    }, [filter]);

    useEffect(() => {
        if (search === "") {
            setVisibleItems(items);
        }
        if (items && search !== "") {
            setVisibleItems(items.filter(each => each.title.startsWith(search)));
        }
    }, [search])

    function fetchData() {
        setVisibleItems(items?.slice(0, page + offset));
        setPage(page + offset);
        if (items && page > items?.length) {
            setDisabledInfiniteScroll(true);
            setPage(items.length);
        } else {
            setDisabledInfiniteScroll(false);
        }
    }

    async function searchNext($event: CustomEvent<void>) {
        await fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    const labelStyle = {
        background: "linear-gradient(to right, #eb9f3c, #616b31)",
        borderRadius: "50px",
        border: "1px solid white",

    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonItem>
                        <IonSelect style={{ fontSize: 20, width: '20%', height: '60px' }} value={filter} placeholder="Pick a genre" onIonChange={(e) => setFilter(e.detail.value)}>
                            {genres.map((each) => (
                                <IonSelectOption key={each} value={each}>
                                    {each}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                        <IonSearchbar style={{ width: '72%' }} placeholder="Search by title" value={search} debounce={200} onIonChange={(e) => {
                            setSearch(e.detail.value!);
                        }}>
                        </IonSearchbar>
                        <IonChip>
                            <IonLabel color={status ? "success" : "danger"}>
                                {status ? <IonIcon icon={checkmarkCircleOutline} /> : <IonIcon icon={closeCircleOutline} />}
                            </IonLabel>
                        </IonChip>
                    </IonItem>
                    <IonFab horizontal="end" vertical="top" style={{ marginRight: "10px", marginTop: "-8px" }}>
                        <IonFabButton
                            color="danger"
                            style={{
                                fontSize: 12,
                                transition: "transform 0.3s",
                                transform: isLogoutHovered ? "translateX(100px)" : "translateX(0)",
                            }}
                            onClick={handleLogout}
                            onMouseEnter={() => setIsLogoutHovered(true)}
                            onMouseLeave={() => setIsLogoutHovered(false)}
                        >
                            LOGOUT
                        </IonFabButton>
                    </IonFab>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen style={labelStyle}>
                <IonLoading isOpen={fetching} message="This might take a moment..." />

                {
                    visibleItems && (
                        <IonList >
                            <IonListHeader style={labelStyle}>
                                <IonLabel className="labelStyles">Title</IonLabel>
                                <IonLabel className="labelStyles">Genre</IonLabel>
                                <IonLabel className="labelStyles">Number of pages</IonLabel>
                                <IonLabel className="labelStyles">Started Reading</IonLabel>
                                <IonLabel className="labelStyles">Reading finished</IonLabel>
                                <IonLabel className="labelStyles">Latitude</IonLabel>
                                <IonLabel className="labelStyles">Longitude</IonLabel>
                                <IonLabel className="labelStyles">Image</IonLabel>
                            </IonListHeader>
                            {visibleItems
                                .map(({ _id, title, genre, numberOfPages, startedReading, finishedReading, latitude, longitude, webViewPath }) =>
                                    <Book key={_id} _id={_id} title={title} genre={genre} numberOfPages={numberOfPages} startedReading={startedReading} finishedReading={finishedReading || false} latitude={latitude} longitude={longitude} webViewPath={webViewPath} onEdit={_id => history.push(`/api/items/book/${_id}`)} />)}
                        </IonList>
                    )
                }

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent loadingText="Loading..." />
                </IonInfiniteScroll>

                {
                    fetchingError && (
                        <div>{fetchingError.message || 'Failed to fetch items'}</div>
                    )
                }

                
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                    color="warning"
                    style={{
                        fontSize: 12,
                        transition: "transform 0.3s",
                        transform: isSaveHovered ? "scale(1.4)" : "scale(1)",
                      }}
                    onClick={() => history.push('/api/items/book')}
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}
                >
                    <IonIcon icon={add} />
                </IonFabButton>
                </IonFab>

                <IonToast
                    isOpen={savedOffline ? true : false}
                    message="Your changes will be visible on server when you get back online!"
                    duration={2000} />
            </IonContent>
        </IonPage>
    );

    function handleLogout() {
        log("logout");
        logout?.();
    }
};


export default BookList;