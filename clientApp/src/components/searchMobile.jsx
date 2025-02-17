import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { SearchForm } from "./SearchForm";


const SearchMobile = () => {

    const [searchMobile, setSearchMobile] = useState(false);


    return (

        <div className="">

            {/* Mobile Navigation */}
            <div className="md:hidden gap-2 flex items-center ">
                <div className="flex items-center p-2 rounded-3xl bg-white shadow-lg" onClick={() => setSearchMobile(!searchMobile)}>

                    {/* <FontAwesomeIcon  icon={faSearch} /> */}
                    <img src="../../public/imges/icons/search-home-icon.jpg" className='w-8 h-8' alt="" />
                    <p className='ps-4 pe-2'>search</p>
                </div>
            </div>

            {
                searchMobile &&
                <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-70 z-50">
                    <div className="mt-20 w-full  bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-6 ps-0 shadow-lg relative">
                        <button
                            onClick={() => setSearchMobile(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >

                            <FontAwesomeIcon icon={faMultiply} className='text-white text-xl bg-red-600 p-2 rounded-sm ' />

                        </button>
                        <div className="mt-10 ps-0">
                            <SearchForm />

                        </div>


                    </div>
                </div >
            }
        </div>

    );
};


export default SearchMobile;
