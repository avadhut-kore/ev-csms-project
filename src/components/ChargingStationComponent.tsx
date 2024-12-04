import { useEffect, useState } from "react";
import api from '@/lib/axios';
import styles from "../styles/ChargingStationComponent.module.css";
import { ChargingStation, DayData } from "@/types/charging-station";
import DayToggles from "./DayToggles";

interface ChargingStationComponentProps {
    chargingStationId: number;
}

const ChargingStationComponent: React.FC<ChargingStationComponentProps> = ({ chargingStationId }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isOpenAllDay, setIsOpenAllDay] = useState<boolean>(false)
    const [isOpen24x7, setIsOpen24x7] = useState<boolean>(false)
    const [operationalHours, setOperationalHours] = useState<DayData[]>([
        {
            day: "Monday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
        {
            day: "Tuesday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
        {
            day: "Wednesday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
        {
            day: "Thursday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
        {
            day: "Friday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
        {
            day: "Saturday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
        {
            day: "Sunday",
            isOpen: false,
            operationalTiming: {
                openTime: "07:00 AM",
                closeTime: "10:00 PM"
            }
        },
    ])

    const initialChargingStation: ChargingStation = {
        id: chargingStationId,
        name: "",
        description: "",
        address: "",
        pincode: "",
        latitude: 0,
        longitude: 0,
        tenantId: 0,
        open: false,
        isOpen24x7: true,
        operationalHours: null,
        amenity: {
            wifi: false,
            foodcourt: false,
            washroom: false,
            children_playarea: false,
            atm: false,
            id: 0
        },
    };

    const [chargingStation, setChargingStation] = useState<ChargingStation>(initialChargingStation);
    const [editChargingStation, setEditChargingStation] = useState<ChargingStation>(initialChargingStation);

    const apiUrl = '/charging-stations';

    useEffect(() => {
        fetchChargingStationDetails();
    }, [chargingStationId]);

    const fetchChargingStationDetails = async () => {
        try {
            const response = await api.get(`${apiUrl}/${chargingStationId}`);
            setChargingStation(response.data);
            setIsOpen24x7(response.data.isOpen24x7);
        } catch (error: any) {
            console.error('Error fetching chargingStation details:', error);
        }
    };

    const handleEditClick = () => {
        setEditChargingStation(chargingStation);
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            if (editChargingStation) {
                const updatedChargingStation: ChargingStation = {
                    ...editChargingStation,
                    isOpen24x7: isOpen24x7,
                    operationalHours: isOpen24x7 ? null : operationalHours
                };
                await api.put(`${apiUrl}/${chargingStationId}`, updatedChargingStation);
                setChargingStation(updatedChargingStation);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating chargingStation:', error);
        }
    };

    const handleCancelClick = () => {
        setEditChargingStation(chargingStation);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setEditChargingStation({
                ...editChargingStation,
                amenity: {
                    ...editChargingStation.amenity,
                    [name]: checked
                }
            });
        } else {
            setEditChargingStation({ ...editChargingStation, [name]: value });
        }
    };

    const handleOpenEveryDay = (e: React.ChangeEvent<HTMLInputElement>) => {
        const allDays = [...operationalHours]
        if (e.target.checked) {
            setIsOpenAllDay(true)
            const updatedData = allDays?.map((item) => {
                return {
                    ...item,
                    isOpen: true
                }
            })
            setOperationalHours(updatedData)
        } else {
            setIsOpenAllDay(false)
            const updatedData = allDays?.map((item) => {
                return {
                    ...item,
                    isOpen: false
                }
            })
            setOperationalHours(updatedData)
        }
    }

    return (
        <div className={styles.chargingStationContainer}>
            {!isEditing ? (
                <div className={styles.viewScreen}>
                    <h1>{chargingStation.name}</h1>
                    <p>{chargingStation.description}</p>
                    <p>Address: {chargingStation.address}</p>
                    <p>Pincode: {chargingStation.pincode}</p>
                    <p>Latitude: {chargingStation.latitude}</p>
                    <p>Longitude: {chargingStation.longitude}</p>
                    <p>Operational Hours:</p>
                    {chargingStation.isOpen24x7 ? (
                        <p>Open 24x7</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Open Time</th>
                                    <th>Close Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chargingStation.operationalHours?.map((day, index) => (
                                    <tr key={index}>
                                        <td>{day.day}</td>
                                        {day.isOpen ? (
                                            <>
                                                <td>{day.operationalTiming.openTime}</td>
                                                <td>{day.operationalTiming.closeTime}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td colSpan={2} style={{ textAlign: 'center' }}>--</td>
                                            </>
                                        )}
                                        <td>{day.isOpen ? 'Open' : 'Closed'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <p>Status: {chargingStation.open ? "Open" : "Closed"}</p>
                    <div>
                        <h3>Amenities:</h3>
                        <ul>
                            {chargingStation.amenity?.wifi && <li>WiFi</li>}
                            {chargingStation.amenity?.foodcourt && <li>Food Court</li>}
                            {chargingStation.amenity?.washroom && <li>Washroom</li>}
                            {chargingStation.amenity?.children_playarea && <li>Children Play Area</li>}
                            {chargingStation.amenity?.atm && <li>ATM</li>}
                        </ul>
                    </div>
                    <button onClick={handleEditClick} className={styles.button}>
                        Edit
                    </button>
                </div>
            ) : (
                <div className={styles.editScreen}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={editChargingStation.name}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            type="text"
                            name="description"
                            value={editChargingStation.description}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={editChargingStation.address}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Pincode:
                        <input
                            type="text"
                            name="pincode"
                            value={editChargingStation.pincode}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Latitude:
                        <input
                            type="text"
                            name="latitude"
                            value={editChargingStation.latitude}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Longitude:
                        <input
                            type="text"
                            name="longitude"
                            value={editChargingStation.longitude}
                            onChange={handleChange}
                            className={styles.inputText}
                        />

                    </label>
                    <div className={styles.everydayParent}>
                        <label>
                            Operational Hours:
                            {/* <input
                            type="text"
                            name="operationalHours"
                            value={editChargingStation.operationalHours}
                            onChange={handleChange}
                            className={styles.inputText}
                        /> */}

                        </label>
                        <span className={styles.everyday}>
                            <label htmlFor="24 * 7"> 24 * 7</label>
                            <input type="checkbox" id="24 * 7" checked={isOpen24x7} onChange={() => setIsOpen24x7(!isOpen24x7)} />
                        </span>
                    </div>

                    {!isOpen24x7 && <div className={styles.operationalTimingParent}>
                        <div className={styles.eachDayToggle}>
                            {operationalHours?.map((item) => {
                                return <div key={item.day} className={styles.operationalTiming}>
                                    <DayToggles data={item} setOperationalTiming={setOperationalHours} setIsOpenAllDay={setIsOpenAllDay} />
                                </div>
                            })}
                        </div>
                        <div className={styles.allDayOpen}>
                            <label htmlFor="allDays">Open everyday</label>
                            <input type="checkbox" name="allDays" id="allDays" checked={isOpenAllDay} onChange={(e) => handleOpenEveryDay(e)} />
                        </div>
                    </div>}
                    {/* <label>
                        Open:
                        <input
                            type="checkbox"
                            name="open"
                            checked={editChargingStation.open}
                            onChange={handleBooleanChange}
                            className={styles.checkbox}
                        />
                    </label> */}
                    <div>
                        <h3>Amenities</h3>
                        <label>
                            WiFi:
                            <input
                                type="checkbox"
                                name="wifi"
                                checked={editChargingStation.amenity?.wifi}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                        <label>
                            Food Court:
                            <input
                                type="checkbox"
                                name="foodcourt"
                                checked={editChargingStation.amenity?.foodcourt}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                        <label>
                            Washroom:
                            <input
                                type="checkbox"
                                name="washroom"
                                checked={editChargingStation.amenity?.washroom}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                        <label>
                            Children Play Area:
                            <input
                                type="checkbox"
                                name="children_playarea"
                                checked={editChargingStation.amenity?.children_playarea}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                        <label>
                            ATM:
                            <input
                                type="checkbox"
                                name="atm"
                                checked={editChargingStation.amenity?.atm}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                        </label>
                    </div>
                    <button onClick={handleSaveClick} className={styles.button}>
                        Save
                    </button>
                    <button onClick={handleCancelClick} className={styles.button}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChargingStationComponent;
