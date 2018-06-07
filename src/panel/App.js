import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './App.less';
import powerOnIcon from './images/pwr-on.svg';
import powerOffIcon from './images/pwr-off.svg';
import delayIcon from './images/delay.svg';
import timeIcon from './images/time.svg';
import usbOn from './images/usb-on.svg';
import usbOff from './images/usb-off.svg';
import lightOn from './images/light-on.svg';
import lightOff from './images/light-off.svg';
import electricIcon from './images/electric.svg';
import commonIcon from './images/home_big_16.png';
import Button from 'broadlink-reactui/dna/Button'
import stateful from 'broadlink-reactui/dna/stateful-button';
import Page from 'broadlink-reactui/dna/Page';
import {injectIntl} from 'react-intl';
import {isIphoneX} from "broadlink-reactui/device";

import classNames from 'classnames';
/* eslint-disable */
const INTFS = PROFILE.suids && PROFILE.suids[0] && PROFILE.suids[0].intfs;
/* eslint-enable */

const PowerButton = stateful(new Map([[0,{image:powerOffIcon}],[1,{image:powerOnIcon}]]));
const UsbPwrButton = stateful(new Map([[0,{image:usbOff}],[1,{image:usbOn}]]));
const NgLightButton = stateful(new Map([[0,{image:lightOff}],[1,{image:lightOn}]]));

class App extends React.PureComponent {
    pwrClick=(state)=>{
        this.props.control({pwr:state===0?1:0});
    };

    usbClick=(state)=>{
        this.props.control({usbpwr:state===0?1:0});
    };

    lightClick=(state)=>{
        this.props.control({ntlight:state===0?1:0});
    };

    render(){
        const {status,intl} = this.props;
        return (
            <Page saveBottom className={classNames({[style.bgColor]:true,[style.bgColorOff]:(status.pwr===0)})}>
                <div>
                    <div className={classNames(style.topBox,{[style.topBoxX]:isIphoneX})}>
                        <img src={commonIcon} alt=""/>
                    </div>
                </div>
                <div className={style.lControl}>
                    <div className={style.fatherBox}>
                        <div className={style.childBox}>
                            <PowerButton label={intl.formatMessage({id:'mainSwitch'})} state={status.pwr} onClick={this.pwrClick}/>
                        </div>
                        <div className={style.childBox}>
                            <Button onClick={this.openTimer} image={timeIcon} state={status.pwr} label={intl.formatMessage({id:'timer'})}/>
                        </div>
                        <div className={style.childBox}>
                            <Button state={status.pwr} image={delayIcon} label={intl.formatMessage({id:'delay'})} onClick={this.openDelayPopup}/>
                        </div>
                        {
                            INTFS.usbpwr&&
                            <div className={style.childBox}>
                                <UsbPwrButton label={intl.formatMessage({id:'usbSwitch'})} state={status.usbpwr} onClick={this.usbClick}/>
                            </div>
                        }
                    </div>
                    {
                        INTFS.ntlight&&
                        <div className={style.fatherBox}>
                            <div className={style.childBox}>
                                <NgLightButton label={intl.formatMessage({id:'lightSwitch'})} state={status.ntlight} onClick={this.lightClick}/>
                            </div>
                            <div className={style.childBox}>
                                <Button state={status.pwr} image={electricIcon} label={intl.formatMessage({id:'electricIcon'})} onClick={this.openElectirc}/>
                            </div>
                            <div className={style.childBox}>
                            </div>
                            <div className={style.childBox}>
                            </div>
                        </div>
                    }
                </div>
            </Page>
        )
    }
}

export default injectIntl(App);