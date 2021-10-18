import React, { useEffect, useState } from 'react';
import {useHistory, Link} from 'react-router-dom';

// Template
import Template from '../partials/template';

// GraphQL
import { gql, useMutation } from '@apollo/client';

// Ant Design
import '../../css/antd.css';
import '../../css/app.css';
import { ConfigProvider, Layout, Menu, Card, Form, Input, Button, Switch } from 'antd';
ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});

const { Header, Content, Footer } = Layout;

const token = localStorage.getItem("token");

export default function CreateMeeting() {
    const [waitingRoomState, setWaitingRoomState] = React.useState(false);
    const [createdMeeting, setCreatedMeeting] = React.useState({
        state: false,
        meeting: {
            agoraHostMeetingId: null,
            agoraParticipantMeetingId: null,
            meetingName: null,
            meetingDesc: null,
            meetingPasscode: null,
            enableWaitingRoom: null,
            meetingLink: null,
            meetingLinkWithPasscode: null
        }
        
    });

    const GQL_Mutation = gql`
        mutation CreateMeetingMutation($meetingName: String!, $meetingDesc: String!, $enableWaitingRoom: Boolean!) {
            CreateMeeting(meetingName: $meetingName, meetingDesc: $meetingDesc, enableWaitingRoom: $enableWaitingRoom) {
            agoraHostMeetingId
            agoraParticipantMeetingId
            meetingName
            meetingDesc
            meetingPasscode
            enableWaitingRoom
            meetingLink
            meetingLinkWithPasscode
            }
        }
    `;

    const [createMutation, {data,error}] = useMutation(GQL_Mutation, {
        onCompleted: data => {
            if (data) {
                setCreatedMeeting({
                    state: true,
                    meeting: data.CreateMeeting
                });
            }
        },
        onError: error => {
            
        },
        errorPolicy: 'all'
    })

    const submitCreateForm = async (values) => {
        // alert(values.enableWaitingRoom);
        const params = {
            meetingName: values.meetingName,
            meetingDesc: values.meetingDesc,
            enableWaitingRoom: waitingRoomState
        };
        
        // setFormValues(values);
        const data = await createMutation({
            variables: params,
            context: {
                headers: {
                    Authorization: token
                }
            }
        });

        console.log(data);
    }

    return (
        <React.Fragment>
            <Template pageTitle={'Create Meeting'} selectedMenuIndex={'2'} />
            <ConfigProvider prefixCls="madla">
                <Layout className={'layout'}>
                    <Content>
                        <h1>Create a Meeting</h1>
                        <Form
                            name={'createMeeting'}
                            onFinish={submitCreateForm}
                            initialValues={{
                                enableWaitingRoom: false
                            }}
                            requiredMark={false}
                            colon={false}
                            labelAlign={'left'}
                            layout="vertical"
                            labelCol={{span: 6}}
                            wrapperCol={{ span: 18}}
                            style={{
                                width: '100%',
                                maxWidth: 500,
                                textAlign: 'left'
                            }}
                            
                        >
                            <Form.Item 
                                
                                label="Topic"
                                name="meetingName"
                                rules={[{ required: true, message: 'Please enter topic.' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item 
                                label="Description"
                                name="meetingDesc"
                                rules={[{ required: false, message: 'Please enter description.' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item 
                                label="Waiting Room" 
                                name="enableWaitingRoom"
                                
                                valuePropName={"checked"}
                            >
                                <Switch style={{ marginRight: 7 }} onChange={(e) => {
                                    setWaitingRoomState(e);
                                }} />

                                {waitingRoomState === true ? <span style={{fontSize:10}}>Enabled</span> : <span style={{fontSize:10}}>Disabled</span>}
                            </Form.Item>
                            <Form.Item style={{textAlign: 'left', marginTop: 20}}>
                                <Button type="primary" htmlType="submit">
                                    Create
                                </Button>
                            </Form.Item>
                        </Form>
                    </Content>

                </Layout>
            </ConfigProvider>
            
        </React.Fragment>
    );
}