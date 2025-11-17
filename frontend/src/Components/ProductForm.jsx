export default function ProductForm({
    name,
    brand,
    image,
    price,
    handleOnSubmit,
    handleOnChange
}) {
    return (
        <div>
            <h2>Product Form</h2>
            <form onSubmit={handleOnSubmit}>
                <label htmlFor="name"></label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={productName}
                    onChange={handleOnChange}
                    placeholder="Product Name"
                />
                <br/>
                <label htmlFor="brand"></label>
                <input 
                    type="text" 
                    id="brand" 
                    name="brand" 
                    value={brand} 
                    onChange={handleOnChange}
                    placeholder="Brand"
                />
                <br/>
                <label htmlFor="image"></label>
                <input 
                    type="text" 
                    id="image" 
                    name="image" 
                    value={image} 
                    onChange={handleOnChange}
                    placeholder="Image URL"
                />
                <br/>   
                <label htmlFor="price"></label>
                <input 
                    type="text" 
                    id="price" 
                    name="price"
                    value={price}
                    onChange={handleOnChange}
                    placeholder="Price"
                />
                <br/>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );

}