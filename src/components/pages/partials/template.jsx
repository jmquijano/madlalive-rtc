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

export default function Template(props) {
    return (
        <React.Fragment>
            <PageTitle title={props.pageTitle} />
            <ConfigProvider prefixCls="madla">
                <Layout className={'layout'}>
                    <Header>
                        <div className={'logo'}>
                            <img src={logo} height={25} width={'auto'} />
                        </div>
                        <Menu inlineIndent={0} mode="horizontal" defaultSelectedKeys={[props.selectedMenuIndex]}>
                            <Menu.Item key={1}>
                                <Link to={'/'}>
                                    Dashboard
                                </Link>
                            </Menu.Item>
                            <Menu.Item key={2}>
                                <Link to={'/meeting/create'}>
                                    Create Meeting
                                </Link>
                            </Menu.Item>
                            
                        </Menu>
                    </Header>
                </Layout>
            </ConfigProvider>
        </React.Fragment>
    );
}