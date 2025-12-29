import { useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchProductsByFilters,
    setFilters,
} from "../../redux/slices/productsSlice.js";

const SearchBar = ({ className = '' }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const handleSearchToggle = () => {
        if (!isOpen) setSearchTerm(""); // Clear input on open
        setIsOpen(!isOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchTerm }));
        dispatch(fetchProductsByFilters({ search: searchTerm }));
        navigate(`/collections/all?search=${searchTerm}`);
        setIsOpen(false);
    };

    // 🔁 Close search bar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                formRef.current &&
                !formRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div
            className={`w-full ${
                isOpen
                    ? "fixed top-0 left-0 z-50 bg-white h-28 flex items-center justify-center px-4"
                    : "w-auto flex items-center justify-center"
            }`}
        >
            {isOpen ? (
                <form
                    ref={formRef}
                    onSubmit={handleSearch}
                    className="relative flex items-center justify-center w-full"
                >
                    <div className="relative w-1/2">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-neutral-700"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800"
                        >
                            <HiMagnifyingGlass className="h-6 w-6" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleSearchToggle}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800"
                    >
                        <HiMiniXMark className="h-6 w-6" />
                    </button>
                </form>
            ) : (
                <button onClick={handleSearchToggle}>
                    <HiMagnifyingGlass className={`h-6 w-6 ${className}`} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
