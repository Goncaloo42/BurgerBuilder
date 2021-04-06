import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         ...
    //     };
    // }
    //--------OU--------
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable: false, //purchaseable = true - ativa o botão Checkout - quando acrescentamos ingredientes
        purchasing: false, //purchasing = true - mostrar modal com Order Summary - depois de clicar no botão Checkout
        loading: false
    }

    updatePurchaseState(ingredients) {
        // const ingredients = {           Pode causar problemas 
        //     ...this.state.ingredients   pois o estado obtido não é o mais atualizado... 
        // };                              é melhor receber o objeto já atualizado

        //Return the values from each key on the ingredients object (from state)
        const sum = Object.keys(ingredients)
            .map(igKey => { //espécie de foreach Object Key
                return ingredients[igKey] //dá return ao Value dessa Key
            })
            .reduce((sum, el) => {  //depois junta os valores do 
                return sum + el;    //novo objeto num valor com a soma deles
            }, 0);                  //de valor inicial 0
        this.setState({ purchaseable: sum > 0 }); //coloca o state a true caso soma > 0 ou false caso contrário
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    // purchaseHandler() {
    //     this.setState({ purchasing: true });    ------NÃO PODEMOS UTILIZAR DESTA FORMA POIS O THIS VAI DAR UNDIFINED. ISTO ACONTECE POIS ESTE MÉTODO É
    // }                                                 CHAMADO PELO onClick do botão checkout. Para corrigir utilizar arrow function

    purchaseHandler = () => {                //neste caso é MUITO IMPORTANTE criar o método como arrow function pois utilizamos o this. visto que o método é triggered por um 
        this.setState({ purchasing: true }); // evento, o this não apontaria para esta classe caso fosse método normal purchaseHandler() { ... };
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        //alert('You continued!')
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,        //in a real application the price should be calculated in the server side to make sure the user is not manipulating it
            customer: {
                name: 'Gonçalo Sousa',
                address: {
                    street: 'Rua da Escola',
                    zipCode: '2410-071',
                    country: 'Portugal'
                },
                email: 'goncalo@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order) // tem de ser adicionado .json porque o endpoint é Firebase
            .then(response => {
                //console.log(response)
                this.setState({ loading: false, purchasing: false });
            }
            )
            .catch(error => {
                //console.log(response)
                this.setState({ loading: false, purchasing: false });
            });
    }


    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        // disabledInfo = {
        //     salad: true,
        //     meat: true,
        //     ...
        // }

        let orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            burgerPrice={this.state.totalPrice} />
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
            </Aux>
        );
    }
}

export default BurgerBuilder;