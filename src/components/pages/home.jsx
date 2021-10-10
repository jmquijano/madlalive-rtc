import React, { useEffect, useState } from 'react';
import { PageTitle } from '../helmet';
import logo from '../media/images/madla-5-logo.cropped.png';

// Template
import Template from './partials/template';

// Ant Design
import '../css/antd.css';
import '../css/app.css';
import { ConfigProvider, Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});

const { Header, Content, Footer } = Layout;

export default function Home() {
    return (
        <Template pageTitle={'Create Meeting'} selectedMenuIndex={'1'} />
    );
}