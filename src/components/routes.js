import React, { useEffect, Component } from 'react';
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation,
    withRouter
} from "react-router-dom";

import {gql, useQuery} from '@apollo/client';

import Home from './pages/home';
import Login from './pages/login';


/* Meeting */
import CreateMeeting from './pages/meeting/create';

/* Charlang Components */
import MeetingMain from './pages/charlang/meeting';
import MeetingJoin from './pages/charlang/meetingJoin';
import MeetingRoom from './pages/charlang/room';

export const GQL_GetTokenInfo = gql`
    query {
        GetTokenInfo {
            id,
            username,
            displayName,
            iat,
            exp
        }
    }
`;


export default function Routes() {
    const history = useHistory();

    return (
        <Router>
            <div>
                <Switch>
                    <AuthenticatedRoute exact component={Home} path="/" />
                    {/**
                    <AuthenticatedRoute exact component={CreateMeeting} path="/meeting/create" />
                    */}
                    <AuthenticatedRoute exact component={() => {
                        localStorage.removeItem("token");
                        window.location.replace('/');
                        
                    }} path="/logout" />
                    <PublicRoute exact component={Login} path="/login" />

                    {/**
                     * This is Charlang
                     */}
                    <CharlangRoute exact component={MeetingMain} path="/meeting" />
                    <CharlangRoute exact component={MeetingJoin} path="/meeting/join/:id" />
                    <CharlangRoute exact component={MeetingRoom} path="/meeting/room/:id" />
                </Switch>
            </div>
        </Router>
    )
}

function AuthenticatedRoute ({ component: Component, ...rest }) {
    const [isAuth, setAuthBool] = React.useState(false);
    const [isLoading, setLoadingBool] = React.useState(true);

    let token = localStorage.getItem("token");

    const {data} = useQuery(GQL_GetTokenInfo, {
        context: {
            headers: {
                Authorization: token
            }
        },
        onCompleted: data => {
            setAuthBool(true);
            setLoadingBool(false);
        },
        onError: () => {
            setAuthBool(false);
            setLoadingBool(false);
        }
    })

    return <Route {...rest} render={(props) => (
        !isLoading ?
            isAuth === true
            ? <Component {...props} />
            : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            : <div></div>
    )} />
}

function CharlangRoute ({ component: Component, ...rest }) {
    const [isAuth, setAuthBool] = React.useState(false);
    const [isLoading, setLoadingBool] = React.useState(false);

    
    return <Route {...rest} render={(props) => (
        !isLoading ?
            isAuth === true
            ? <Redirect to={{
                pathname: '/logout/prompt',
                state: { from: props.location }
            }} />
            : <Component {...props} />
            : <div></div>
    )} />
}



function PublicRoute ({ component: Component, ...rest }) {
    const [isAuth, setAuthBool] = React.useState(false);
    const [isLoading, setLoadingBool] = React.useState(true);

    let token = localStorage.getItem("token");

    const {data} = useQuery(GQL_GetTokenInfo, {
        context: {
            headers: {
                Authorization: token
            }
        },
        onCompleted: data => {
            setAuthBool(true);
            setLoadingBool(false);
        },
        onError: () => {
            setAuthBool(false);
            setLoadingBool(false);
        }
    })

    return <Route {...rest} render={(props) => (
        !isLoading ?
            isAuth === true
            ? <Redirect to={{
                pathname: '/logout/prompt',
                state: { from: props.location }
            }} />
            : <Component {...props} />
            : <div></div>
    )} />
}

