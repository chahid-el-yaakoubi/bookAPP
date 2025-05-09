import HostLayout from '../../ComponentHost/HostLayout';
import AddCar from './components/AddCar';
import OptimizedCarsTable from './components/DataCars';

const VehiclesHost = ({type}) => {
    return (
        <HostLayout>
            <main className="flex-1 p-4 md:p-6">
                {type === 'table' ? <OptimizedCarsTable /> : <AddCar/>}
            
            </main>
        </HostLayout>
    );
};

export default VehiclesHost; 