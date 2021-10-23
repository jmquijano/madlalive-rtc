import React, { useEffect, useState } from 'react';
import {useHistory, Link} from 'react-router-dom';
import { PageTitle } from '../../helmet';
import logo from '../../media/images/madla-5-logo.cropped.png';

// GraphQL
import { gql, useLazyQuery } from '@apollo/client';

// Ant Design
import '../../css/antd.css';
import '../../css/app.css';
import { ConfigProvider, Layout, Menu } from 'antd';
ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});

const { Header, Content, Footer } = Layout;



export default function CharlangTemplate(props) {
    return (
        <React.Fragment>
            <ConfigProvider prefixCls="madla">
                <Layout className={'layout'}>
                    <Header style={
                        {
                            borderBottom: "1px solid rgba(0,0,0,0.05)", 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    }>
                        <div className={'logo'}>
                            <img src={logo} height={25} width={'auto'} />
                        </div>
                        
                    </Header>
                </Layout>
                <Content style={
                    {
                        fontFamily:'Roboto',
                        display: (props?.display),
                        height: '80vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 0,
                        paddingRight: 0,
                        paddingTop: 0,
                        paddingBottom: 0
                    }
                }>
                    {props.children}
                </Content>
            </ConfigProvider>
        </React.Fragment>
    );
}