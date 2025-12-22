import Header from "../Common/Header";
import NewFooter from "../Common/NewFooter";
import ParallaxSection from "../Common/ParallaxSection";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../Common/Loader";
import Newsletter from "../Common/Newsletter.jsx";
import Featured from '../Common/Featured.jsx';
import FeaturesSection from "@/components/Products/FeaturesSection.jsx";
import Breadcrumbs from "../Common/Breadcrumbs"; // Add this import

const useScrollToBottom = () => {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            // Increased from 200px to 500px from bottom to make the button appear sooner
            const bottomPosition = document.documentElement.offsetHeight - 800;
            setIsAtBottom(scrollPosition >= bottomPosition);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isAtBottom;
};

const UserLayout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAtBottom = useScrollToBottom();

    const handleBugReportClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        navigate('/bug-report');
    };
    
    return (
        <>
        {/* Header */}
            <Header transparent={isHomePage}/>
        {/* Main Content */}
            {/*    <main>*/}
            {/*        <p>*/}
            {/*            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta dolor eligendi et laborum, molestias porro qui rerum sunt voluptas voluptate! Deleniti eius libero nihil, nostrum pariatur possimus quisquam velit vitae. A aliquid amet dicta nulla pariatur placeat quo sequi velit? Iste necessitatibus optio reprehenderit! Amet architecto, commodi dignissimos eius error fugiat harum illo ipsam ipsum laudantium maxime, non omnis? Animi commodi ea eius minima officiis, omnis quis sint? Assumenda dignissimos distinctio fugiat harum illo itaque maxime molestiae neque nihil non nostrum, nulla, recusandae tempore totam vitae voluptas voluptates voluptatibus! Adipisci architecto aspernatur at eaque expedita in incidunt magnam, magni molestias natus nostrum nulla numquam omnis perspiciatis ullam unde voluptatum! Ab alias at autem consequuntur distinctio ducimus exercitationem expedita, maiores non odio quam quidem recusandae reiciendis, repellendus repudiandae rerum tempore! Earum, ipsa, quasi. Assumenda atque dolorem doloremque exercitationem explicabo harum magnam quae quam qui quis. Consectetur cumque dolore ipsam iste quaerat! Ad, aperiam autem consectetur doloremque dolores enim, est harum inventore ipsam ipsum maxime nam, nemo nobis odio optio perferendis possimus quae quasi qui quia quos sequi similique suscipit! Ab ad animi blanditiis, dicta dolorem dolores earum eligendi error esse est, et facere id iure labore libero maiores molestiae mollitia natus nesciunt non officia porro ratione suscipit temporibus ullam vero, voluptates. Ex harum id sint. Aspernatur, aut dolorem dolores dolorum, eligendi ipsum molestias obcaecati porro quidem sint voluptatem voluptatibus. Amet asperiores autem consectetur explicabo nam officia officiis perferendis perspiciatis, quaerat recusandae sapiente sequi, tenetur ut! A consectetur corporis, cupiditate debitis dolores, ea, et ex explicabo fugit inventore nemo nulla officia officiis placeat porro quo quos recusandae rerum sunt vero vitae voluptatem voluptates voluptatibus. Beatae culpa cupiditate, dolorem doloribus ea, eligendi et eum excepturi exercitationem explicabo fuga ipsam ipsum, iure laboriosam minima necessitatibus nihil quam quidem vitae voluptas. Aliquid animi assumenda consectetur cupiditate, dolorem doloribus ex expedita inventore iste magnam maxime molestiae nam officia perferendis quam quasi qui quibusdam quod saepe sit sunt tempora vitae! A ab, accusamus accusantium alias amet aperiam blanditiis consectetur cupiditate eaque eius enim eos est, exercitationem hic laudantium libero magnam maiores molestiae nam nesciunt perferendis quis quod, sint suscipit vero voluptas voluptatem? A asperiores dicta eligendi fugiat illo labore officiis repudiandae sed velit vitae. At ea, enim eum facilis harum laborum minus molestiae natus nisi odit optio perspiciatis sed voluptatem? Consectetur cumque deleniti excepturi, fugit molestiae quis recusandae saepe vitae? Ex magnam minima quas rem. Architecto asperiores dolorem enim fugiat impedit minima numquam omnis. Ab, aliquam amet architecto autem earum eum iusto omnis optio perferendis praesentium quae, quidem vitae voluptatem! Ad animi aperiam exercitationem magnam modi nam neque non, perspiciatis quos tenetur. Consequuntur cupiditate, ea enim id nam nesciunt numquam quaerat quam quasi quidem quisquam repellat similique sunt temporibus vitae. Adipisci aliquam assumenda atque consectetur culpa debitis deleniti dolorem dolores ea earum eum, ipsam labore molestiae nam natus necessitatibus non nostrum numquam perspiciatis porro praesentium quia quibusdam totam, veniam voluptatibus. Accusamus dolorum eius eos est id, inventore mollitia provident sit voluptatibus. Adipisci dignissimos hic incidunt inventore molestias obcaecati sint. Accusantium inventore laborum nisi nostrum. Atque, beatae culpa deserunt dicta dolores doloribus eius ex excepturi facere hic id inventore ipsum molestias mollitia nam, numquam pariatur provident quaerat quam quia quis quisquam repellendus sapiente sed suscipit unde ut vel. At atque fugit officiis sint ut, vitae voluptas voluptates? Amet debitis modi possimus velit vero voluptatibus? Atque consequuntur delectus dolorem expedita explicabo facere nam officiis ullam vel? Dolor doloribus illo laboriosam maiores obcaecati perferendis provident qui quo temporibus velit. Ea id ipsam nobis placeat porro reiciendis. Accusamus aspernatur atque deleniti deserunt doloribus ducimus error eum facilis id magni molestiae nesciunt nostrum nulla omnis perferendis perspiciatis possimus praesentium quia, quis quo ratione rem repellat sunt temporibus veniam voluptate voluptatum! Aliquam architecto incidunt iusto, pariatur quis quod sunt tempora tenetur? Aliquam atque, aut culpa cupiditate delectus deleniti distinctio doloremque eaque et incidunt, ipsa labore laborum numquam perferendis provident quaerat reiciendis similique. Accusamus alias assumenda at cumque deleniti deserunt doloremque doloribus et, exercitationem id ipsa laboriosam laborum laudantium libero magni molestias nam nobis nulla odio perspiciatis praesentium provident quae quam qui, quisquam ratione rem, sed sequi soluta ullam ut vel voluptatem voluptates. A accusamus alias debitis dicta doloribus eligendi excepturi explicabo facere odio, pariatur qui quisquam tenetur, veritatis. A accusamus ad adipisci amet, animi aspernatur autem eaque eligendi error est excepturi facilis fuga illum incidunt itaque iure iusto libero magni maiores modi nemo, nihil nobis nulla odit perferendis quae quasi quisquam reiciendis rem repellat sed similique suscipit vero. Architecto aspernatur beatae culpa debitis dicta dolore doloribus eius eligendi esse ex, excepturi explicabo in laboriosam minus nam, non nostrum obcaecati odit officia perferendis provident quaerat quo reiciendis repudiandae saepe ut voluptates! A ab amet animi architecto beatae commodi culpa cumque deserunt dolore dolorem eaque, eligendi enim eveniet hic illo inventore ipsa, ipsam laboriosam libero maxime modi molestiae, mollitia nihil nobis nostrum nulla numquam officia officiis omnis perferendis quisquam rem sequi suscipit tempora unde ut veniam. Eius ex expedita mollitia nulla obcaecati placeat praesentium quibusdam voluptate? Accusamus aliquid amet atque corporis culpa deleniti, dicta dolores, explicabo impedit in iure iusto labore magni nisi numquam omnis optio quis veritatis vero, voluptatem! Assumenda corporis doloribus est impedit sapiente tenetur? Alias aut autem doloribus laudantium maiores modi quos? A animi assumenda, blanditiis commodi cumque ducimus facilis porro quam recusandae reprehenderit, sed sequi vitae voluptates. Mollitia, sed sunt. Cupiditate dignissimos ipsum minima molestias mollitia nemo, officia placeat? Asperiores consequuntur est fugiat nulla porro sequi, sint unde? Ad aliquid asperiores aspernatur atque cumque dicta, distinctio dolor, dolore exercitationem impedit ipsum labore magni minima nemo officiis placeat quas quos soluta sunt temporibus totam vel voluptate. Accusamus ad, alias aperiam aspernatur assumenda commodi ea et ex exercitationem fuga harum illum ipsum laboriosam molestiae molestias mollitia numquam odio optio perferendis rem repellendus reprehenderit repudiandae saepe sint temporibus totam veritatis vero. Dolorum et hic nisi odio. A aut commodi culpa, cumque deserunt dolorem eius enim est id impedit in ipsum iure minus modi neque nobis nulla quae quaerat sint soluta tenetur veniam voluptatum. Dignissimos.*/}
            {/*        </p>*/}
            {/*    </main>*/}
            {!isHomePage && <Breadcrumbs />}
            <main>
                <Outlet/>
            </main>


            {/*/!* Featured Section *!/*/}
            {/*<Featured />*/}
            <Newsletter />

            {/* Features Section */}
            <FeaturesSection/>

            {/* Parallax Section */}
            <ParallaxSection />

            {/*/!* Newsletter *!/*/}


        {/* Footer */}
            <NewFooter />
            {isLoading && <Loader />}
            {/* Scroll-based Bug Report Button */}
            <div className={`fixed bottom-2 left-2 z-50 transition-opacity duration-500 ${isAtBottom ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button 
  onClick={handleBugReportClick}
  className="group w-6 h-6 flex items-center justify-center bg-transparent border-none rounded-full cursor-pointer transition-all duration-300 hover:bg-accent">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 43 42" 
                        className="w-3 h-3 transition-all duration-300 group-hover:[&>path]:stroke-white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path strokeWidth="4" stroke="#808080" d="M20 7H23C26.866 7 30 10.134 30 14V28.5C30 33.1944 26.1944 37 21.5 37C16.8056 37 13 33.1944 13 28.5V14C13 10.134 16.134 7 20 7Z" />
                        <path strokeWidth="4" stroke="#808080" d="M18 2V7" />
                        <path strokeWidth="4" stroke="#808080" d="M25 2V7" />
                        <path strokeWidth="4" stroke="#808080" d="M31 22H41" />
                        <path strokeWidth="4" stroke="#808080" d="M2 22H12" />
                        <path strokeWidth="4" stroke="#808080" d="M12.5785 15.2681C3.5016 15.2684 4.99951 12.0004 5 4" />
                        <path strokeWidth="4" stroke="#808080" d="M12.3834 29.3877C3.20782 29.3874 4.72202 32.4736 4.72252 40.0291" />
                        <path strokeWidth="4" stroke="#808080" d="M30.0003 14.8974C39.0545 15.553 37.7958 12.1852 38.3718 4.20521" />
                        <path strokeWidth="4" stroke="#808080" d="M29.9944 29.7379C39.147 29.1188 37.8746 32.2993 38.4568 39.8355" />
                    </svg>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:-top-7">
                        Bug Report
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-accent transform rotate-45 -mb-0.5"></span>
                    </span>
                </button>
            </div>
        </>
    )
}
export default UserLayout;
