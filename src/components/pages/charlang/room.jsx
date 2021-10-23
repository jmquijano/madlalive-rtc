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

import camIcon from '../../media/images/cam.png';
import micIcon from '../../media/images/mic.png';

import ChatContent from './chatContent';


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
import { ConfigProvider, Layout, Button, Tabs, Drawer, Row, Col, Divider, Form, Input, Switch, Carousel, Modal, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { CloseOutlined, LoadingOutlined, MenuOutlined } from '@ant-design/icons';

ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});



const JoinMeetingUrlBase = "http://localhost:4000/meeting/join/";


const { TabPane } = Tabs;

const { Header, Content, Footer } = Layout;

export const antIcon = <LoadingOutlined style={{ fontSize: 45, color: '#fff' }} spin />;


export default function MeetingRoom(props) {
    const { id } = props.match.params;

    const [micState, setMicState] = React.useState(false);
    const [camState, setCamState] = React.useState(false);

    const search = window.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const pwd = params.get('pwd');
    const args = params.get('args');
    const asHost = params.get('as_host');

    const meetingRoomLink = '/meeting/room/' + id + '?pwd=' + pwd + '&args=' + args + '&as_host' + asHost; 

    let videoPlayer = useRef();


    const [siderVisibility, setSiderVisibility] = React.useState(true);
    
    const [userType, setUserType] = React.useState(1); // Participant (1) | Host (2)
    
    const [defaultTitle, setDefaultTitle] = React.useState('Meeting Room');

    // Loading
    const [loadingState, setLoadingState] = React.useState(false);

    const [waitingRoomState, setWaitingRoomState] = React.useState(false);
    const cardCarousel = useRef();

    const args_JSON = JSON.parse(args);

    // Event Handlers
    useEffect(() => {
    }, []);

    

    return (
        <React.Fragment>
            <PageTitle title={defaultTitle} />

            <CharlangTemplate pageTitle={'Create a Meeting'} >
                <div style={{width: '100%'}}>
                    <Row style={{borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                        <Col span={12}>
                            <div>
                                <div style={{
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 15,
                                    paddingBottom:5
                                }}>
                                    <h1 style={{fontSize: 14}}>{args_JSON.topic}</h1>

                                </div>
                            </div>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                            <div style={{
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 10,
                                    paddingBottom:5
                                }}>
                                
                                <Divider type={'vertical'} />
                                <Button type={'link'} onClick={() => {
                                    if(siderVisibility) {
                                        setSiderVisibility(false);
                                    } else {
                                        setSiderVisibility(true);
                                    }
                                }} shape="circle" icon={<MenuOutlined />} />

                            </div>
                        </Col>
                    </Row>
                    
                    {/**
                     * Chat, QA, Polls (Sider)
                     */}
                    <Drawer
                        width={350}
                        mask={false}
                        closable={true}
                        extra={[
                            <Button type={'link'} icon={<CloseOutlined />}></Button>
                        ]}
                        closable={false}
                        visible={siderVisibility}
                        autoFocus={false}
                        closeIcon={<CloseOutlined />}
                        onClose={() => {
                            if(siderVisibility) {
                                setSiderVisibility(false);
                            } else {
                                setSiderVisibility(true);
                            }
                        }}
                        
                    >
                        <div style={{width:'100%', padding: 0}}>
                            <Button type={'link'} onClick={() => {
                                if(siderVisibility) {
                                    setSiderVisibility(false);
                                } else {
                                    setSiderVisibility(true);
                                }
                            }} icon={<CloseOutlined />}></Button>
                            <div style={{
                                marginTop: 5
                            }}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Chat" key="1">
                                        <ChatContent />
                                    </TabPane>
                                    <TabPane tab="Q&A" key="2">
                                        Content of Q&A
                                    </TabPane>
                                    <TabPane tab="Polls (For Host)" key="3">
                                        Content of Polls
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </Drawer>

                </div>
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    height: 100,
                    background: "rgba(0,0,0,0.1)",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Row style={{width: '100%', padding: '0px 20px'}}>
                        <Col span={8}>
                            <div style={{display: 'inline'}}>
                                <Button type={'danger'}>Leave Meeting</Button>
                            </div>
                        </Col>
                        <Col span={8} style={{textAlign:'center'}}>
                            <div style={{display: 'inline'}}>
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
                            
                            
                        </Col>
                        <Col span={8}>
                            
                        </Col>
                    </Row>
                        
                </div>
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

