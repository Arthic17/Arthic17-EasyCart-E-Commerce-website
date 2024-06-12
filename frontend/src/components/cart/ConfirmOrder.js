// import MetaData from "../layouts/MetaData"
// import { Fragment,useEffect } from "react"
// import { validateShipping } from "./Shipping"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom";
// import CheckoutSteps from "./CheckoutStep";



// export default function ConfirmOrder(){

//     const {shippingInfo,items:cartItems}=useSelector(state=>state.cartState);
//     const {user}=useSelector(state=>state.cartState);
//     const itemsPrice=cartItems.reduce((acc,item)=>(acc+item.price*item.quantity),0)
//     const shippingPrice=itemsPrice>200?0:25;
//     const taxPrice = Number(0.05*itemsPrice).toFixed(2);
//     const totalPrice = Number(0.05*itemsPrice+shippingPrice+taxPrice).toFixed(2);
//     const navigate = useNavigate();

// useEffect(()=>{
//      validateShipping(shippingInfo,navigate)
// },[])


//     return(
//         <Fragment>
//             <MetaData title={'Confirm Order'}/>
//             <CheckoutSteps shipping confirmOrder/>
//   <div className="row d-flex justify-content-between">
//             <div className="col-12 col-lg-8 mt-5 order-confirm">

//                 <h4 className="mb-3">Shipping Info</h4>
//                 <p><b>Name:</b>{user.name}</p>
//                 <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
//                 <p className="mb-4"><b>Address:</b>{shippingInfo.address},{shippingInfo.city},{shippingInfo.postalCode},{shippingInfo.state},{shippingInfo.country}</p>
                
//                 <hr />
//                 <h4 className="mt-4">Your Cart Items:</h4>

//                 <hr />
//                 <div className="cart-item my-1">
//                     <div className="row">
//                         <div className="col-4 col-lg-2">
//                             <img src="./images/products/1.jpg" alt="Laptop" height="45" width="65"/>
//                         </div>

//                         <div className="col-5 col-lg-6">
//                             <a href="#">OPPO F21s Pro 5G (Dawnlight Gold, 8GB RAM, 128 Storage) with No Cost EMI/Additional Exchange Offers</a>
//                         </div>


//                         <div className="col-4 col-lg-4 mt-4 mt-lg-0">
//                             <p>1 x $245.67 = <b>$245.67</b></p>
//                         </div>

//                     </div>
//                 </div>
//                 <hr />

//             </div>
			
// 			<div className="col-12 col-lg-3 my-4">
//                     <div id="order_summary">
//                         <h4>Order Summary</h4>
//                         <hr />
//                         <p>Subtotal:  <span className="order-summary-values">$245.67</span></p>
//                         <p>Shipping: <span className="order-summary-values">$10</span></p>
//                         <p>Tax:  <span className="order-summary-values">$0</span></p>

//                         <hr />

//                         <p>Total: <span className="order-summary-values">$255.67</span></p>

//                         <hr />
//                         <button id="checkout_btn" className="btn btn-primary btn-block">Proceed to Payment</button>
//                     </div>
//                 </div>
			
			
//         </div>
//         </Fragment>
      
//     )
// }



import MetaData from '../layouts/MetaData';
import { Fragment, useEffect } from 'react';
import { validateShipping } from './Shipping';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutStep';

export default function ConfirmOrder () {
    const { shippingInfo, items:cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const itemsPrice = cartItems.reduce((acc, item)=> (acc + item.price * item.quantity),0);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    let taxPrice = Number(0.05 * itemsPrice);
    const totalPrice = Number(itemsPrice + shippingPrice + taxPrice).toFixed(2);
    taxPrice = Number(taxPrice).toFixed(2)
    
    const processPayment = () => {
        const data = {
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }


    useEffect(()=>{
        validateShipping(shippingInfo, navigate)
    },[])

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-confirm">

                <h4 className="mb-3">Shipping Info</h4>
                <p><b>Name:</b> {user.name}</p>
                <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                <p className="mb-4"><b>Address:</b> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country} </p>
                
                <hr />
                <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map(item => (
                            <Fragment>
                                <div className="cart-item my-1">
                                    <div className="row">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-6">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                            <p>{item.quantity} x ${item.price} = <b>${item.quantity * item.price}</b></p>
                                        </div>

                                    </div>
                                </div>
                                <hr />
                            </Fragment>
                        )
                    
                        )
                    
                    }
              
              
                

            </div>
			
            <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${itemsPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" onClick={processPayment} className="btn btn-primary btn-block">Proceed to Payment</button>
                    </div>
            </div>
        </div>
        </Fragment>
        
    )
}