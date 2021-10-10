import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { PageTitle } from '../helmet';
import logo from '../media/images/madla-5-logo.cropped.png';

// GraphQL
import { gql, useLazyQuery } from '@apollo/client';

// Ant Design
import '../css/antd.css';
import '../css/app.css';
import { ConfigProvider, Layout, Button, Card, Space, Form, Input, Alert } from 'antd';
ConfigProvider.config({
    theme: {
      primaryColor: '#009B9B',
    },
});

const { Header, Content, Footer } = Layout;

export default function Login() {
    const history = useHistory();

    const [errorAlert, setErrorAlert] = React.useState({
        visibility: false,
        message: ''
    });

    const [form] = Form.useForm();
    const [formValues, setFormValues] = React.useState({
        username: null,
        password: null
    });

    const gql_query = gql`
            query Query($username: String!, $password: String!) {
                Authenticate(username: $username, password: $password) {
                status,
                message,
                token
                }
            }
        `;
        
    const [loginQuery, {data, error}] = useLazyQuery(gql_query, { 
        onCompleted: data => {
            if (data) {
                // console.log(data?.Authenticate?.token);
                localStorage.setItem("token", data?.Authenticate?.token);
                history.push('/');
            }
        },
        onError: error => {
            setErrorAlert({
                visibility: true,
                message: error.message
            });
            console.log(error.message);
        },
        errorPolicy: 'all' 
    });

    const handleLogin = async (values) => {
        // Revert to Default
        setErrorAlert({
            visibility: false,
            message: ''
        });

        // setFormValues(values);
        const data = await loginQuery({
            variables: values
        });
    }

    


    return (
        <React.Fragment>
            <PageTitle title={'Login'} />
            <ConfigProvider prefixCls="madla">
                <Layout className={'login-layout'}>
                    <Content className={'login-content'}>
                        <Card style={{ width: 400, textAlign: 'center' }}>
                            <Space size={10} direction={'vertical'}>
                            <img src={logo} width={'80px'} height={'auto'} />

                                <h1>Log in</h1>
                                
                            </Space>

                            {
                                errorAlert.visibility === true 
                                    ? 
                                    <Alert message={errorAlert.message} type="error" showIcon style={{textAlign: 'left', marginTop: 10, marginBottom: 10}} /> 
                                    : 
                                    <div></div>
                            }
                            
                            <Form 
                                name={'login'}
                                layout="vertical"
                                style={{
                                    width: '100%',
                                    textAlign: 'left'
                                }}
                                onFinish={handleLogin}
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                
                                <Form.Item style={{textAlign: 'left', marginTop: 20}}>
                                    <Button type="primary" htmlType="submit">
                                        Login
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Content>
                </Layout>
            </ConfigProvider>
        </React.Fragment>
    );
}