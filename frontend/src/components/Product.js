import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function Product(props) {
  const { product } = props;
  return (
    <div key={product._id} className="card">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <div className="product-name center">
        <Link to={`/product/${product._id}`}>
          {product.name}
        </Link>
        </div>
        <div className="product-brand center">{product.brand}</div>
        <div className="product-minOrder center">min-order {product.minOrder}</div>
        <Rating
          rating={product.rating}
        ></Rating>
        <div className="price">₹{product.price} <span className="product-small"> /{product.unit} </span></div>
      </div>
    </div>
  );
}
