import { ADD_TO_CART } from "../constants/shoppingCartConstants";
import Axios from "axios";

// dispatch and getState are functions of redux thunk used to dipatch an action and also get the state of redux store
export const addToCart = (itemId, quantity) => async (dispatch, getState) => {
    // sending an ajax request to the server to get information about this particular item
    const {data} = await Axios.get(`/api/items/${itemId}`);
    //dispatching an action after getting data about that item. This action sends a request to redux store to add this payload to the shopping cart
    dispatch({
        type: ADD_TO_CART,
        //the payload of this action is an object that contains the required info about the item in question
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            numberOfItemInInvetory: data.numberOfItemInInvetory,
            //we rename the item id to just item here in our payload so we can use it later to add it to the database
            item: data._id,
            //We also add quantity as it is required to create an order history
            quantity
        }
    });
    //saving the items in shopping cart to the local storage each time we dispatch add to cart
    localStorage.setItem('cartItems', JSON.stringify(getState().shoppingCart.shoppingCartItems));
};