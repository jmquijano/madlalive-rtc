import React, { useEffect, useState } from 'react';
import { PageTitle } from '../helmet';
import logo from '../media/images/madla-5-logo.cropped.png';

// Moment
import moment from 'moment';

// Template
import Template from './partials/template';

// GraphQL
import {gql, useQuery} from '@apollo/client';

// Ant Design
import '../css/antd.css';
import '../css/app.css';
import { ConfigProvider, Layout, Menu, Button, Tabs, Card, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});



const { TabPane } = Tabs;

const { Header, Content, Footer } = Layout;

const GQL_GetAll = gql`
query Query {
    GetAllHostedMeeting {
        meetingSharedIdentifier
        agoraHostMeetingId
        agoraParticipantMeetingId
        meetingName
        meetingDesc
        meetingPasscode
        enableWaitingRoom
        meetingLink
        meetingLinkWithPasscode
        createdAt
    }
    GetAllJoinedMeeting {
        meetingSharedIdentifier
        meetingName
        meetingDesc
        enableWaitingRoom
        meetingLink
        meetingLinkWithPasscode,
        host {
            displayName
            profileUrl
            me
        }
        createdAt
    }
}
`;

const token = localStorage.getItem("token");

export default function Home() {
    const [hostedMeeting, setHostedMeeting] = React.useState([]);

    const { data, error } = useQuery(GQL_GetAll, {
        context: {
            headers: {
                Authorization: token
            }
        }
    });


    return (
        <React.Fragment>
            <Template pageTitle={'Dashboard'} selectedMenuIndex={'1'} />
            <ConfigProvider prefixCls="madla">
                <Layout className={'layout'}>
                    <Content>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Hosted" key="1">
                                <Row gutter={[16, 16]}>
                                    {data?.GetAllHostedMeeting?.map((d) => {
                                        return (
                                            <Col xs={{ span: 24 }} md={{ span:  12}} lg={{ span: 6 }}>
                                                <Card 
                                                    size="small" 
                                                    title={d?.meetingName}
                                                    extra={<Button 
                                                        type={'primary'} 
                                                        size={'small'} 
                                                        shape="round"
                                                        style={{ fontSize: 10 }}
                                                        >
                                                        <Link to={'/meeting/open/' + d?.meetingSharedIdentifier}>Manage</Link>
                                                    </Button>} 
                                                    style={{ width: '100%' }}
                                                    
                                                >
                                                    <Row>
                                                        <Col span={12}>
                                                            
                                                            <span style={{fontSize:10, display:'block'}}>Created on </span>
                                                            <span style={{fontSize:10, display:'block', fontWeight: 'bold'}}>{moment(parseInt(d?.createdAt)).format('MM/DD/YYYY hh:mm A')}</span>

                                                        </Col>
                                                    </Row>
                                                    
                                                </Card> 
                                            </Col>
                                            
                                        )
                                    })}
                                </Row>
                                
                            </TabPane>
                            <TabPane tab="Joined" key="2">
                                <Row gutter={[16, 16]}>
                                    {data?.GetAllJoinedMeeting?.map((d) => {
                                        return (
                                            <Col xs={{ span: 24 }} md={{ span:  12}} lg={{ span: 6 }}>
                                                <Card 
                                                    size="small" 
                                                    title={d?.meetingName}
                                                    extra={<Button 
                                                        type={'primary'} 
                                                        size={'small'} 
                                                        shape="round"
                                                        style={{ fontSize: 10 }}
                                                        >
                                                        {d?.host?.me === true 
                                                            ? 
                                                            <Link to={'/meeting/open/' + d?.meetingSharedIdentifier}>Manage</Link>
                                                            : 
                                                            <Link to={'/meeting/open/' + d?.meetingSharedIdentifier}>Open</Link> 
                                                        }
                                                        
                                                    </Button>} 
                                                    style={{ width: '100%' }}
                                                    
                                                >
                                                    <Row>
                                                        <Col span={12}>
                                                            
                                                            <span style={{fontSize:10, display:'block'}}>Joined</span>
                                                            <span style={{fontSize:10, display:'block', fontWeight: 'bold'}}>{moment(parseInt(d?.createdAt)).format('MM/DD/YYYY hh:mm A')}</span>

                                                        </Col>
                                                        <Col span={12} style={{textAlign: 'right'}}>
                                                            
                                                            <span style={{fontSize:10, display:'block'}}>Host</span>
                                                            <span style={{fontSize:10, display:'block', fontWeight: 'bold'}}><a href={d?.host?.profileUrl}>{d?.host?.displayName}</a></span>

                                                        </Col>
                                                    </Row>
                                                    
                                                </Card> 
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </TabPane>
                            
                        </Tabs>
                    </Content>
                    
                </Layout>
            </ConfigProvider>
            
        </React.Fragment>
        
    );
}