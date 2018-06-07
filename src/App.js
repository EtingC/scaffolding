import React, { Component } from 'react';
import App from './panel/App';

import withLogic from 'broadlink-reactui/with-logic';
import LocaleProvider from 'broadlink-reactui/LocaleProvider';

let EnhanceApp = withLogic(App,{type:'async'});

const messages = {
    zh:{
        mainSwitch:'总开关',
        timer:'定时',
        delay:'延时',
        usbSwitch:'USB',
        lightSwitch:'夜灯',
        electricIcon:'电量'
    },
    en:{
        mainSwitch:'Main',
        timer:'Timer',
        delay:'Delay',
        usbSwitch:'USB',
        lightSwitch:'Light',
        electricIcon:'Electric'
    }
};

export default class extends Component {

    render() {
        return (
            <LocaleProvider messages={messages}>
                <EnhanceApp/>
            </LocaleProvider>
        );
    }
}

