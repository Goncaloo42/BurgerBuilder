import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    //para o Burger Component aceitar as props enviadas pelo BurgerBuilder Component (o Object que contem os ingredientes), temos primeiro de transformar o Object num Array 
    // para depois então obter um array de ingredientes e começar a apresentá-los (com o Array já podemos utilizar a função Map para dar loop ao array e obter os elementos)
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey /*ingredientKey*/ => { //Object.keys() : função para criar array a partir das keys de objeto (neste caso: [salad, bacon, ...])
            return [...Array(props.ingredients[igKey])].map(
                (_, i) => {
                    return <BurgerIngredient key={igKey + i} type={igKey} />
                }
            );
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;