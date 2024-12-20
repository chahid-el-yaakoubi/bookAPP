import { SideBarr } from './sideBarr';
import { Navbar } from './navBarr';
import { Featured } from './featured/Featured';

const testNew = () => {
    return (
        <>
            <Navbar />
            <SideBarr />
            <Featured />
            <div className='ps-24 pt-4 flex flex-row items-center gap-4 overflow-x-auto scrollbar-hide'>
                {[...Array(15)].map((_, index) => (
                    <div key={index} className="w-[250px] shrink-0 min-h-[400px] rounded-lg bg-white shadow-md">
                        <img 
                            src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop`} 
                            alt={`Product ${index + 1}`} 
                            className="w-full h-48 object-cover rounded-t-lg" 
                        />
                        <div className="p-4">
                            <h5 className='font-bold text-lg mb-2'>Product {index + 1}</h5>
                            <p className='text-gray-600 text-sm'>Description for product {index + 1}. Features and highlights go here.</p>
                            <button className='mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors'>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default testNew;