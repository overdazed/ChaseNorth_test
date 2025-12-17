// after Topbar work on Navbar -> Header.jsx
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = ({ transparent = false }) => {
    // create a custom class for the custom red color -> add color in tailwind.config.js
    return (
    // <div className={`${transparent ? 'bg-custom-red/70 backdrop-blur-sm' : 'bg-custom-red'} text-white`}>
    // <div className={`${transparent ? 'bg-custom-red/50 backdrop-blur-sm' : 'bg-custom-red'} text-white`}>
    <div className="bg-accent text-nav-grey relative z-40">
        {/* mx-auto = to center the content */}
        {/* flex + justify-between = so icons are on the left and phone number on the right */}
        {/* not responsive */}
        {/* on mobile there are no icons and no telephone number, just the text*/}
        <div className="container mx-auto flex justify-between items-center py-1 px-4">
        {/*    icons */}
            {/* align the icons */}
            {/* <div className="flex items-center space-x-4"> */}
            {/* FIX THE RESPONSIVENESS */}
            {/* md = medium device, enable flex on medium device*/}
            {/*<div className="hidden md:flex items-center space-x-4">*/}
            {/*    <a href="#" className="hover:text-gray-300">*/}
            {/*        /!* first icon will be Meta (facebook) from react icons *!/*/}
            {/*        <TbBrandMeta className="h-5 w-5"/>*/}
            {/*    </a>*/}
            {/*    <a href="#" className="hover:text-gray-300">*/}
            {/*        /!* first icon will be Meta (facebook) from react icons *!/*/}
            {/*        <IoLogoInstagram className="h-5 w-5"/>*/}
            {/*    </a>*/}
            {/*    <a href="#" className="hover:text-gray-300">*/}
            {/*        /!* first icon will be Meta (facebook) from react icons *!/*/}
            {/*        /!* Twitter icon looks bigger in comparison, reduce height *!/*/}
            {/*        <RiTwitterXLine className="h-4 w-4"/>*/}
            {/*    </a>*/}
            {/*</div>*/}
            {/*    add message in the center */}
            {/* FIX THE RESPONSIVENESS, we have flex with justify between, flex-grow will expand the middle div */}
            <div className="text-sm text-center flex-grow">
                {/*<span>Free Shipping on all orders over $50</span>*/}
                {/* !!! make the text animate !!! */}
                <span>Reliable delivery to every corner of Europe!</span>
            </div>
            {/* add telephone number */}
            {/* FIX THE RESPONSIVENESS, block phone*/}
            {/*<div className="text-sm hidden md:block">*/}
            {/*    <a href="tel:+123456789" className="hover:text-gray-300">*/}
            {/*        +1 (234) 567-890*/}
            {/*    </a>*/}
            {/*</div>*/}
        </div>
    </div>
    )
}
export default Topbar
