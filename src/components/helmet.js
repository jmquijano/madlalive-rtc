import React from 'react';
import Helmet from 'react-helmet';

export const PageTitle = ({title}) => {
    let defaultTitle = '';
    return (
        <Helmet>
            <title>{title ?? defaultTitle}</title>
        </Helmet>
    );
}