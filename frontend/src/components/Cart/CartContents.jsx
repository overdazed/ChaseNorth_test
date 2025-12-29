// import {RiDeleteBin3Line} from "react-icons/ri";
import {useDispatch} from "react-redux";
import {removeFromCart, updateCartItemQuantity} from "@/redux/slices/cartSlice";
import { RiDeleteBinLine } from "react-icons/ri";

const CartContents = ({cart, userId, guestId}) => {
    const dispatch = useDispatch();

    // Handle adding or subtracting to cart
    // delta is the value that the user can add or subtract from the cart, delta > 1 for addition and delta > -1 for subtraction
    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(
                updateCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId,
                    size,
                    color
                })
            );
        }
    }

    // hardcode some value for cart items
    // picsum.photos api will act as placeholder image, ?random=1 generates a unique random image
    // const cartProducts = [
    //     {
    //         productId: 1,
    //         name: "T-Shirt",
    //         size: "M",
    //         color: "Red",
    //         quantity: 1,
    //         price: 15,
    //         image: "https://picsum.photos/200?random=1"
    //     },
    //     {
    //         productId: 2,
    //         name: "Jeans",
    //         size: "L",
    //         color: "Blue",
    //         quantity: 1,
    //         price: 25,
    //         image: "https://picsum.photos/200?random=2"
    //     },
    // ];

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(
            removeFromCart({productId, guestId, userId, size, color}))
    }

    return (
        <div>
            {
                cart.products.map((product, index) => (
                    <div key={index} className="flex items-start justify-between py-4 px-4 rounded-lg shadow-md bg-neutral-100 dark:bg-neutral-900 mb-2">
                        {/* should be items-center?!?*/}
                        <div className="flex items-start">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-24 object-cover mr-4 rounded"
                            />
                            <div>
                                <h3 className="text-md text-neutral-950 dark:text-neutral-100">{product.name}</h3>
                                <p className="text-sm text-neutral-500">
                                    size: {product.size} | color: {product.color}
                                </p>
                                <div className="mt-2">
                                    <div className={`flex items-center border-[0.5px] border-neutral-200 dark:border-neutral-800 w-32 rounded-md overflow-hidden`}>
                                        <button 
                                            className={`w-10 h-10 flex items-center justify-center border-r border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`}
                                            onClick={() => {
                                                if (product.quantity === 1) {
                                                    handleRemoveFromCart(
                                                        product.productId,
                                                        product.size,
                                                        product.color
                                                    );
                                                } else {
                                                    handleAddToCart(
                                                        product.productId,
                                                        -1,
                                                        product.quantity,
                                                        product.size,
                                                        product.color
                                                    );
                                                }
                                            }}
                                            aria-label={product.quantity === 1 ? "Remove item" : "Decrease quantity"}
                                        >
                                            {product.quantity === 1 ? (
                                                <RiDeleteBinLine className="text-neutral-950 dark:text-neutral-50 text-sm" />
                                            ) : (
                                                <span className="text-neutral-950 dark:text-neutral-50">-</span>
                                            )}
                                        </button>
                                        <div className={`flex-1 text-center text-neutral-950 dark:text-neutral-50`}>
                                            {product.quantity}
                                        </div>
                                        <button 
                                            className={`w-10 h-10 flex items-center justify-center border-l border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800`}
                                            onClick={() =>
                                                handleAddToCart(
                                                    product.productId,
                                                    1,
                                                    product.quantity,
                                                    product.size,
                                                    product.color
                                                )
                                            }
                                        >
                                            <span className="text-neutral-950 dark:text-neutral-50">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Price and remove button container */}
                        <div className="flex flex-col items-end justify-between">
                            <p className="text-lg text-neutral-950 dark:text-neutral-100 neutral-50 space-nowrap">$ {product.price.toLocaleString()}</p>
                            {/* Delete icon */}
                            <button
                                onClick={() =>
                                    handleRemoveFromCart(
                                        product.productId,
                                        product.size,
                                        product.color
                                    )
                                }
                                className="pt-3 hover:scale-110 transition-transform duration-200 self-end"
                                aria-label="Remove item"
                            >
                                <div className="relative p-1 w-8 h-8 flex items-center justify-center">
                                    {/*<div className="absolute top-0.2 w-8 h-8 rounded-full dark:bg-neutral-100"></div>*/}
                                    {/*<svg*/}
                                    {/*    viewBox="0 0 15 17.5"*/}
                                    {/*    height="22"*/}
                                    {/*    width="22"*/}
                                    {/*    xmlns="http://www.w3.org/2000/svg"*/}
                                    {/*    className="text-black dark:text-neutral-50 relative hover:fill-red-600"*/}
                                    {/*>*/}
                                    {/*    <path*/}
                                    {/*        d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"*/}
                                    {/*        transform="translate(-2.5 -1.25)"*/}
                                    {/*    />*/}
                                    {/*</svg>*/}
                                    <svg
                                        viewBox="0 0 15 17.5"
                                        height="22"
                                        width="22"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="relative fill-current text-neutral-950 dark:text-neutral-50 hover:fill-red-600 transition-colors duration-200"
                                    >
                                        <path
                                            d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                                            transform="translate(-2.5 -1.25)"
                                        />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
export default CartContents
