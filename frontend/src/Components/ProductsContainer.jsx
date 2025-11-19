import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  handleOnDelete,
  handleOnEdit,
  
}) {
  return (
    <div className="ProductsContainer">
      {products.map((product) => (
        <ProductCard
          key={product._id} //use _id instead of id as some of the products won't have an id and it will throw a missing key prop error
          {...product}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={
            productQuantity.find((p) => p.id === product.id).quantity
          }
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
      ))}
    </div>
  );
}