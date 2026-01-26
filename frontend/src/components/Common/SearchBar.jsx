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
                    ? "fixed top-0 left-0 z-50 bg-neutral-50 h-24 dark:bg-neutral-950 flex items-center justify-center px-4"
                    : "w-auto flex items-center justify-center"
            }`}
        >
            {isOpen ? (
                <form
                    ref={formRef}
                    onSubmit={handleSearch}
                    className="relative flex items-center justify-center w-full"
                >
                    <div className="relative w-11/12 md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="shadow-sm bg-white dark:text-neutral-50 dark:bg-neutral-800 px-4 py-2 pl-10 rounded-lg focus:outline-none w-full  dark:placeholder:text-neutral-400 placeholder:text-neutral-700"
                            autoFocus
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <button
                                type="submit"
                                className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 transition-colors duration-200"
                            >
                                <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSearchToggle}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white md:right-4"
                    >
                        <HiMiniXMark className="h-7 w-7" />
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
