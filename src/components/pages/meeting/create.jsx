import React, { useEffect, useState } from 'react';
import {useHistory, Link} from 'react-router-dom';

// Template
import Template from '../partials/template';

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


export default function CreateMeeting() {
    return (
        <Template pageTitle={'Create Meeting'} selectedMenuIndex={'2'} />
    );
}