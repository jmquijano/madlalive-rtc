import React, { useEffect, useState, useRef } from 'react';
import { PageTitle } from '../../helmet';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

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
import { ConfigProvider, Layout, Descriptions, Button, Tabs, Card, Row, Col, Divider, Form, Input, Switch, Carousel, Modal } from 'antd';
import { Link } from 'react-router-dom';
ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});


const JoinMeetingUrlBase = "http://localhost:3000/meeting/join/";


const { TabPane } = Tabs;

const { Header, Content, Footer } = Layout;

export default function MeetingMain() {
    
    
    const [defaultTitle, setDefaultTitle] = React.useState('Create a Meeting');

    // Button Text
    const [buttonTextState, setButtonTextState] = React.useState({
        p1: 'Copy link',
        p2: 'Copy link',
        p3: 'Copy link',
        p4: 'Copy link'
    })

    // Modal
    const [createModal, setCreateModalState] = React.useState(false);
    const [joinModal, setJoinModalState] = React.useState(false);

    // Input
    const [createInput, setCreateInput] = React.useState();

    // Output
    const [createOutput, setCreateOutput] = React.useState({
        topic: null,
        waitingRoomState: null,
        meetingId: null,
        publicPasscode: null,
        hostPasscode: null
    });

    // Loading
    const [loadingState, setLoadingState] = React.useState(false);

    const [waitingRoomState, setWaitingRoomState] = React.useState(false);
    const cardCarousel = useRef();

    // Event Handlers
    const onCreate = (values) => {
        setLoadingState(true);
        
        setTimeout((values) => {
            setLoadingState(false);
            setCreateModalState(true);

            const createParameters = {
                topic: createInput?.topic,
                waitingRoomState: waitingRoomState,
                meetingId: generateMeetingSharedIdentifier(16),
                publicPasscode: generatePassword(12),
                hostPasscode: generatePassword(12)
            };

            setCreateOutput(createParameters);

            console.log(createParameters);

            
        }, 2000);

    }

    return (
        <React.Fragment>
            <PageTitle title={defaultTitle} />

            <CharlangTemplate pageTitle={'Create a Meeting'} display={'flex'}>
                <Card style={
                    {
                        padding: 0,
                        width: '100%',
                        maxWidth: '600px'
                    }
                }>
                    <Carousel autoplay={false} dots={false} ref={cardCarousel}>
                        <div key={1}>
                            <h1 style={{textAlign:'center'}}>Create a Meeting</h1>
                            <Form 
                                size={'large'}
                                label
                                layout={'horizontal'}
                                colon={false}
                                name={'createMeeting'}
                                style={{marginTop: 30, padding: '0px 10px'}}
                                onFinish={onCreate}
                            >
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            rules={[{ required: true, message: 'You may not start the meeting without a topic. Just describe a few words.' }]}
                                            name="topic" 
                                        >
                                            <Input placeholder={'Define a topic'} onChange={(e) => {
                                                setCreateInput({
                                                    topic: e.target.value
                                                })
                                            }} style={{borderRadius:50}} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={0} style={{textAlign: 'right'}}>
                                        <Form.Item 
                                            name="enableWaitingRoom"
                                            
                                            valuePropName={"checked"}
                                        >
                                            <Switch style={{ marginRight: 7 }} onChange={(e) => {
                                                setWaitingRoomState(e);
                                            }} />

                                            {waitingRoomState === true ? <span style={{fontSize:10}}>Waiting room is enabled</span> : <span style={{fontSize:10}}>Waiting room is disabled</span>}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                

                                

                                <Form.Item style={{textAlign: 'left', marginTop: 10}}>
                                    <Button type="primary" htmlType="submit" style={{fontSize: 15, borderRadius: 50}} loading={loadingState}>
                                        Create
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider />
                            
                            <div style={{textAlign:'center'}}>
                                <span style={{fontFamily: 'Roboto', fontSize: 13, marginRight: 10}}>I already have a meeting.</span>
                                <Button type={'secondary'} onClick={() => {
                                    cardCarousel.current.next();
                                }}>Join a meeting</Button>
                            </div>
                        </div>

                        <div key={2}>
                            <h1 style={{textAlign:'center'}}>Join a Meeting</h1>
                            <Form 
                                size={'large'}
                                label
                                layout={'horizontal'}
                                colon={false}
                                name={'createMeeting'}
                                style={{marginTop: 30, padding: '0px 10px'}}
                            >
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                        
                                            name="meet" 
                                            rules={[{ required: true, message: 'You must enter a valid Meeting ID or link.' }]}
                                        >
                                            <Input placeholder={'Meeting Link'} style={{borderRadius:50}} />
                                        </Form.Item>
                                    </Col>
                                    
                                </Row>
                                

                                

                                <Form.Item style={{textAlign: 'left', marginTop: 10}}>
                                    <Button type="primary" htmlType="submit" style={{fontSize: 15, borderRadius: 50}} onClick={() => {
                                        window.location.href = + createOutput?.meetingId + '?pwd=' + sha256(createOutput?.publicPasscode) + '&args=' + JSON.stringify(createOutput) + '&as_host=false';
                                    }}>
                                        Join
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider />
                            
                            <div style={{textAlign:'center'}}>
                                <span style={{fontFamily: 'Roboto', fontSize: 13, marginRight: 10}}>I want to create a meeting.</span>
                                <Button type={'secondary'} onClick={() => {
                                    cardCarousel.current.prev();
                                    console.log();
                                }}>Create a meeting</Button>
                            </div>
                        </div>
                    </Carousel>
                    
                    {/**
                     * Modal for Create Meeting
                     */}
                    <Modal 
                        width={600}
                        title={'Launch Meeting'} 
                        visible={createModal}
                        closeable={true}
                        keyboard={false}
                        footer={[
                            <Button type={'primary'}><Link to={'/meeting/join/' + createOutput?.meetingId + '?pwd=' + sha256(createOutput?.publicPasscode) + '&args=' + JSON.stringify(createOutput) + '&as_host=true'} target={'_blank'}>Join Meeting as a Host</Link></Button>
                        ]}
                        onCancel={(e) => {
                            setCreateModalState(false);
                        }}
                    >
                        <Descriptions title={'Meeting Information'} labelStyle={{fontWeight:'light'}} contentStyle={{fontWeight: 'bold'}}>
                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Topic">{createOutput?.topic}</Descriptions.Item>
                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Waiting Room">{createOutput?.waitingRoomState ? "Enabled" : "Disabled"}</Descriptions.Item>
                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Meeting ID">{createOutput?.meetingId}</Descriptions.Item>

                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Participant Passcode">{createOutput?.publicPasscode}</Descriptions.Item>
                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Host Passcode">{createOutput?.hostPasscode}</Descriptions.Item>


                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Participant Link">
                                <Button size={'small'} style={{fontSize: 13}} type={'secondary'} onClick={() => {
                                    let u = JoinMeetingUrlBase + createOutput?.meetingId + '?args=' + JSON.stringify(createOutput);
                                    navigator.clipboard.writeText(u);
                                    setButtonTextState({...buttonTextState, p1: 'Copied!'});

                                    setTimeout(() => {
                                        setButtonTextState({...buttonTextState, p1: 'Copy link'});
                                    }, 2000);
                                }}>{buttonTextState?.p1}</Button>
                            </Descriptions.Item>
                            <Descriptions.Item style={{display: 'block', paddingBottom: 0}} label="Participant link with passcode">
                                <Button size={'small'} style={{fontSize: 13}} type={'secondary'} onClick={() => {
                                        let u = JoinMeetingUrlBase + createOutput?.meetingId + '?pwd=' + sha256(createOutput?.publicPasscode) + '&args=' + JSON.stringify(createOutput);
                                        navigator.clipboard.writeText(u);
                                        setButtonTextState({...buttonTextState, p2: 'Copied!'});

                                        setTimeout(() => {
                                            setButtonTextState({...buttonTextState, p2: 'Copy link'});
                                        }, 2000);
                                    }}>{buttonTextState?.p2}</Button>
                            </Descriptions.Item>

                        </Descriptions>
                    </Modal>

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

