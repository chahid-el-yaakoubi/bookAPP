import Layout from "../../components/Layout";
import DataShops from "./DataShops";
import NewShop from "./NewShop";
import SingleShop from "./sigleShop";


function Shops({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataShops /> : type === "new" ? <NewShop /> : type === "edit" ? <NewShop /> : type="single" ? <SingleShop />  : <SingleShop /> }
            </>
        } use="shops" />
    );
}

export default Shops;
    