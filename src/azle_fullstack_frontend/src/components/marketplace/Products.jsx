import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import { Row } from "react-bootstrap";

import {
  getProducts as getProductList,
  createProduct, buyProduct
} from "../../utils/marketplace";
import Loader from "../../utils/Loader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of products
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      let res  = await getProductList();
      setProducts(res);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addProduct = async (data) => {
    try {
      setLoading(true);
      const priceStr = data.price;
      data.price = parseInt(priceStr, 10) * 10**8;
      createProduct(data).then((resp) => {
        console.log("Data, resp", data,)
        getProducts();
      });
      toast.success("Product created successfully");
    } catch (error) {
      console.log({ error });
      toast.error("Failed to create a product.");
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const buy = async (id) => {
    try {
      setLoading(true);
      await buyProduct({
        id
      }).then((resp) => {
        getProducts();
        toast.success("Product purchased successfully");
      });
    } catch (error) {
      console.log({ error });
      toast.error("Failed to purchase the product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Street Food</h1>
            <AddProduct save={addProduct} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {products?.map((_product) => (
              <Product
                product={{
                  ..._product,
                }}
                buy={buy}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Products;
