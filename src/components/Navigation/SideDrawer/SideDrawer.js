import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import BackDrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary/Auxiliary'

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];     
    if (props.open) {                                               // Lógica de validação se SideDrawer está aberta ou fechada
        attachedClasses = [classes.SideDrawer, classes.Open];       
    }
    return (
        <Aux>
            <BackDrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')}>
                {/* <Logo height="11%"/> --------------- UMA FORMA DE DAR OVERWRITE OS STYLES DEFINIDOS NAS CLASSES, NESTE CASO PARA AJUSTAR O LOGO.. OU*/}
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Aux>
    );
};

export default sideDrawer;