import React, { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Bell } from 'react-feather';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Notification.css';

const Notification = props => {

    // State variabls
    const [showCount, setShowCount] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [readIndex, setReadIndex] = useState(0);

    //Ref
    const ref = useRef(null);

    // Props passed in to the component
    const data = props.data;
    const storageKey = props.storageKey || 'notification_storage_id';
    const key = props.notific_key;
    const notificationMsg = props.notific_value;
    const notificationRedirect = props.notific_redirect;
    const bellSize = props.size || 32;
    const bellColor = props.color || '#FFFFFF';
    const bellBgColor = props.bgcolor || '#000000';
    useEffect(() => {

        let readItems = reactLocalStorage.getObject(storageKey);
        let readMsgId = Object.keys(readItems).length > 0 ? readItems['id'] : '';
        let readIndex = (readMsgId === '') ? data.length : data.findIndex(elem => elem[key] === readMsgId);
        readIndex = readIndex === -1 ? data.length : readIndex;

        setReadIndex(readIndex);

        setShowCount((data.length && readIndex) > 0);
        setMessageCount(readIndex);
    }, [data]);

    // Handle the click on the notification bell
    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    }

    // Handle the click on the each notifications
    const handleNotificationClick = function (event, args) {
        console.log(args.notificationIndex);
        markAsRead(null, args.notificationIndex);
        window.location.href = args.redirectTo;
    }

    // Hide the notification on clicking outside
    const hide = () => {
        setShow(false);
    }

    // Call the function when "mark as read" link is clicked
    const markAsRead = (event, index) => {
        setShowCount((index > 0) || false);
        reactLocalStorage.setObject(storageKey, { 'id': data[index || 0][key] });
        setReadIndex(index || 0);
    }

    return (
        <>
            <div className="notification-container">
                <div className={showCount ? 'notification notify show-count' : 'notification notify'}
                    data-count={messageCount}
                    style={{background:bellBgColor}}
                    onClick={event => handleClick(event)}>
                    <Bell color={bellColor} size={bellSize} />
                </div>
            </div>

            <div ref={ref}>
                <Overlay
                    show={show}
                    target={target}
                    placement="bottom"
                    container={ref.current}
                    containerPadding={20}
                    rootClose={true}
                    onHide={hide}
                >
                    <Popover id="popover-contained">
                        <Popover.Content style={{ padding: '3px 3px'}}>
                            {showCount && <div>
                                <Button variant="link" onClick={markAsRead}>
                                    Mark as read
                                </Button>
                            </div>
                            }
                            <ul className="notification-info-panel">
                                {
                                    data.length > 0 ?
                                    
                                    data.map((message, index) =>
                                        <div
                                            className={index < readIndex ? 'notification-message unread' : 'notification-message'}
                                            key={index}
                                            onClick={(event) => handleNotificationClick(event, {
                                                data: message,
                                                redirectTo: message[notificationRedirect],
                                                notificationIndex: index
                                            })}>
                                            <div className="content" >
                                                <span>{message[notificationMsg]}</span>
                                            </div>
                                        </div>
                                    ) :
                                    <>
                                        <h5 className="nodata">No Notifications found!</h5>
                                    </>
                                }
                            </ul>
                        </Popover.Content>
                    </Popover>
                </Overlay>
            </div>
        </>
    )
};

Notification.prototype = {
    notific_key: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    notific_value: PropTypes.string.isRequired,
    notific_redirect: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.string,
    bgcolor: PropTypes.string
}

export default Notification;