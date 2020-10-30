import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = () => {
    if (window.confirm('Are you sure Payment Received?')) {
    dispatch(payOrder(order._id));
    }
  };

  const deliverHandler = () => {
    if (window.confirm('Are you sure Order Delivered?')) {
    dispatch(deliverOrder(order._id));
    }
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
        <div>
          <h1>Order id {order._id}</h1><br />
       Your order has been successfully placed
          <div className="row top">
            <div className="col-2">
              <ul>
                <li>
                  <div className="card card-body grey">
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                      <strong>Address: </strong> {order.shippingAddress.address},<br />
                      <strong>City: </strong>{order.shippingAddress.city}, <br />
                      <strong>Landmark: </strong> {order.shippingAddress.landmark} <br />
                      <strong>Postal Code: </strong>{order.shippingAddress.postalCode}<br />
                      <strong>Mobile Number:</strong> {order.shippingAddress.mobileNumber}
                    </p>
                    {order.isDelivered ? (
                      <MessageBox variant="success">
                        Delivered at {order.deliveredAt}
                      </MessageBox>
                    ) : (
                        <MessageBox variant="danger">Status: Not Delivered</MessageBox>
                      )}
                  </div>
                </li>
                <li>
                  <div className="card card-body grey">
                    <h2>Payment</h2>
                    <p>
                      <strong>Method:</strong> {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <MessageBox variant="success">
                        Paid at {order.paidAt}
                      </MessageBox>
                    ) : (
                        <MessageBox variant="danger">Not Paid</MessageBox>
                      )}
                  </div>
                </li>
                <li>
                  <div className="card card-body grey">
                    <h2>Order Items</h2>
                    <ul>
                      {order.orderItems.map((item) => (
                        <li key={item.product}>
                          <div className="row">
                            <div>
                              <Link to={`/product/${item.product}`}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="small"
                                ></img></Link>
                            </div>
                            <div className="min-30">
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </div>
                            {item.size ? <div>Size: {item.size}</div> : ''}
                            <div>
                              {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body grey">
                <ul>
                  <li>
                    <h2>Order Summary</h2>
                  </li>
                  <li>
                    <div className="row">
                      <div>Items</div>
                      <div>₹{order.itemsPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Shipping</div>
                      <div>₹{order.shippingPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Tax</div>
                      <div>₹{order.taxPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>
                        <strong> Order Total</strong>
                      </div>
                      <div>
                        <strong>₹{order.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                  </li>
                  {userInfo.isAdmin && !order.isPaid  && (
                    <li>
                      {loadingPay && <LoadingBox></LoadingBox>}
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      <button
                        type="button"
                        className="block"
                        onClick={successPaymentHandler}
                      >
                        Payment Received
                  </button>
                    </li>
                  )}
                  {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <li>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      {errorDeliver && (
                        <MessageBox variant="danger">{errorDeliver}</MessageBox>
                      )}
                      <button
                        type="button"
                        className="primary block"
                        onClick={deliverHandler}
                      >
                        Delivered Order
                  </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
}