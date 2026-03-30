import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props)=>{

    const [allCoin,setAllCoin] = useState([]);
    const [currency,setCurrency] = useState({
        name: "usd",
        symbol: "$"
    })

    const fetchAllCoin = async ()=>{
        const options = {method: 'GET', headers: {'x-cg-demo-api-key': 'CG-E56519TQCeFvpCPQXQZcqFe2'}};

fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&price_change_percentage=1h&include_tokens=top`, options)
  .then(res => res.json())
  .then(res => setAllCoin(res))
  .catch(err => console.error(err));


  
}


useEffect(()=>{
    fetchAllCoin();
},[currency])

    const contextvalue={
        allCoin, currency, setCurrency
}

    return(
        <CoinContext.Provider value={contextvalue}>
            {props.children}
        </CoinContext.Provider>
    )
}

export default CoinContextProvider;