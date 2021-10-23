import React, { useEffect, useState, useRef } from 'react';
import { PageTitle } from '../../helmet';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import {
    Player,
    ControlBar,
    ReplayControl,
    ForwardControl,
    CurrentTimeDisplay,
    TimeDivider,
    PlaybackRateMenuButton,
    VolumeMenuButton,
    BigPlayButton
  } from 'video-react';
import 'video-react/dist/video-react.css';

import joinKhyle from '../../media/videos/join.khyle.mp4';
import joinMosh from '../../media/videos/join.mosh.mp4';

import camIcon from '../../media/images/cam.png';
import micIcon from '../../media/images/mic.png';


import logo from '../../media/images/madla-5-logo.cropped.png';

import dotenv from 'dotenv';

// Moment
import moment from 'moment';

// Template
import CharlangTemplate from '../partials/charlangTemplate';

// GraphQL
import {gql, useQuery} from '@apollo/client';

// Ant Design
import '../../css/antd.css';
import '../../css/app.css';
import { ConfigProvider, Layout, Descriptions, Button, Tabs, Card, Row, Col, Divider, Form, Input, Switch, Carousel, Modal, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});



const JoinMeetingUrlBase = "http://localhost:4000/meeting/join/";


const { TabPane } = Tabs;

const { Header, Content, Footer } = Layout;

export const antIcon = <LoadingOutlined style={{ fontSize: 45, color: '#fff' }} spin />;


export default function MeetingJoin(props) {
    const { id } = props.match.params;

    const search = window.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const pwd = params.get('pwd');
    const args = params.get('args');
    const asHost = params.get('as_host');

    const meetingRoomLink = '/meeting/room/' + id + '?pwd=' + pwd + '&args=' + args + '&as_host' + asHost; 

    let videoPlayer = useRef();

    const [micState, setMicState] = React.useState(false);
    const [camState, setCamState] = React.useState(false);

    const [videoStreamVisibility, setVideoStreamVisibility] = React.useState(true);

    const [userType, setUserType] = React.useState(1); // Participant (1) | Host (2)
    
    const [defaultTitle, setDefaultTitle] = React.useState('Join a Meeting');


    // Button Text
    const [buttonTextState, setButtonTextState] = React.useState({
        p1: 'Copy link',
        p2: 'Copy link',
        p3: 'Copy link',
        p4: 'Copy link'
    })

    const [joinButton, setJoinButton] = React.useState({
        loadingState: false,
        text: 'Join'
    });

    // Loading
    const [loadingState, setLoadingState] = React.useState(false);

    const [waitingRoomState, setWaitingRoomState] = React.useState(false);
    const cardCarousel = useRef();

    // Event Handlers
    useEffect(() => {
        videoPlayer?.current?.seek(5);

        console.log(id);

        

        if (asHost) {
            setUserType(2);
        }

        setTimeout(() => {
            setLoadingState(true);
        }, 2000);
    }, []);

    

    return (
        <React.Fragment>
            <PageTitle title={defaultTitle} />

            <CharlangTemplate pageTitle={'Join Meeting'} display={'flex'}>
                <Card style={
                    {
                        padding: 0,
                        width: '100%',
                        maxWidth: '600px'
                    }
                }>
                    <h1 style={{textAlign:'center'}}>Join meeting</h1>

                    <div width={660} height={360} style={{
                        background: "rgba(0,0,0,0.9)",
                        minWidth: 480,
                        minHeight: 270
                    }}>
                        {/**
                         * Loading
                         */}
                        <div className={(!loadingState ? "video-loading-active" : "video-loading-inactive")} style={{
                            minWidth: 480,
                            minHeight: 270,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div>
                                <Spin style={{display:'block'}} indicator={antIcon} />
                                <span style={{fontSize:10,display:'block', color: '#fff', opacity: 0.5, marginTop: 5}}>Searching for device stream.</span>
                            </div>
                            
                        </div>

                        {/**
                         * Video Stream (Lobby)
                         */}
                        <div className={(loadingState ? (videoStreamVisibility ? (!camState ? "video-loading-active" : "video-loading-inactive") : "video-loading-inactive") : "video-loading-inactive")} style={{
                            minWidth: 480,
                            minHeight: 270,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            
                            <Player ref={videoPlayer} startTime={'0:15'} playsInline fluid={false} autoPlay={true} width={480} height={270} muted loop={true}>
                                <source width={480} height={270} src={(userType === 1 ? joinMosh : joinKhyle)} />
                                <ControlBar cla>
                                    
                                    <VolumeMenuButton disabled />
                                </ControlBar>
                                
                            </Player>
                        </div>

                        
                    </div>
                    
                    <div style={{textAlign: 'center', marginTop: 10}}>
                        {/**
                         * Controls
                         */}
                        <div style={{display: 'inline-block'}}>
                            <Button 
                                type={'primary'} 
                                className={(micState ? 'madla-btn video-icon-mic-disable' : 'madla-btn video-icon-mic-enable')} 
                                style={{borderRadius: 0, display: 'block'}}
                                onClick={() => {
                                    if (micState) {
                                        setMicState(false);
                                    } else {
                                        setMicState(true);
                                    }
                                }}
                            >
                                <img src={micIcon} height={20} width={20} />
                            </Button>
                            <span className={(micState ? 'video-icon-label-v' : 'video-icon-label-nv')} style={{fontSize:10, color: 'red'}}>Muted</span>
                        </div>

                        <div style={{display: 'inline-block', marginLeft: 10}}>
                            <Button 
                                type={'primary'} 
                                className={(camState ? 'madla-btn video-icon-mic-disable' : 'madla-btn video-icon-mic-enable')} 
                                style={{borderRadius: 0, display: 'block'}}
                                onClick={() => {
                                    if (camState) {
                                        setCamState(false);
                                    } else {
                                        setCamState(true);
                                    }
                                }}
                            >
                                <img src={camIcon} height={20} width={20} />
                            </Button>
                            <span className={(camState ? 'video-icon-label-v' : 'video-icon-label-nv')} style={{fontSize:10, color: 'red', height: 20}}>Disabled</span>
                        </div>
                        
                    </div>
                    
                    <div style={{textAlign:'center', marginTop:10}}>
                        <Button 
                            type={'primary'} 
                            style={{borderRadius: 50}} 
                            loading={joinButton?.loadingState}
                            onClick={() => {
                                setJoinButton({...joinButton, loadingState: true, text: 'Initializing Connection'});

                                setTimeout(() => {
                                    setJoinButton({loadingState: true, text: 'Connecting to Socket'});

                                    setTimeout(() => {
                                        setLoadingState(false);
                                        setJoinButton({loadingState: true, text: 'Redirecting you to meeting room'});
                                        
                                        setTimeout(() => {
                                            window.location.href = meetingRoomLink;
                                        })
                                    }, 3000);
                                }, 5000)
                            }}
                        >
                            {joinButton?.text}
                        </Button>
                    </div>
                    
                </Card>
            </CharlangTemplate>
        </React.Fragment>
    )
}

function generatePassword(l = 8, t = 'numeric') {
    var length = l,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";

    if (t === 'numeric') {
        charset = "01234567890";
    }

    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function generateMeetingSharedIdentifier(l = 8, c = "LC", ht = "N") {
    var length = l,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789012345678901234567890123456789012345678901234567890123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    let v = null;

    // Case Type
    if (c === "LC") {
        v = retVal.toLowerCase();
    } else if (c === "UC") {
        v = retVal.toUpperCase();
    } else {
        v = retVal;
    }

    return v;
    
}

