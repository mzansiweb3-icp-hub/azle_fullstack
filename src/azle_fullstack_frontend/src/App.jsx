import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Products from "./components/marketplace/Products";
import "./App.css";
import Wallet from "./components/Wallet";
import coverImg from "/sandwich.jpg";
import { login, logout as destroy } from "./utils/auth";
import Cover from "./utils/Cover";
import { isAuthenticated, getPrincipalText } from "./utils/auth";
import { tokenBalance, tokenSymbol } from "./utils/icrc2_ledger";
import { icpBalance } from "./utils/ledger.js";
import { getAddressFromPrincipal } from "./utils/marketplace";

const App = function AppWrapper() {
    const [authenticated, setAuthenticated] = useState(false);
    const [principal, setPrincipal] = useState('');
    const [icrcBalance, setICRCBalance] = useState('');
    const [balance, setICPBalance] = useState('');
    const [symbol, setSymbol] = useState('');
    const [address, setAddress] = useState('');


    const getICRCBalance = useCallback(async () => {
        if (authenticated) {
            const balance = await tokenBalance();
            setICRCBalance(balance);
        }
    }, [authenticated]); 

    const getICPBalance = useCallback(async () => {
        if (authenticated) {
            const balance = await icpBalance();
            setICPBalance(balance);
        }
    }, [authenticated]);

    
    useEffect(() => {
        const fetchSymbol = async () => {
            const symbolText = await tokenSymbol();
            setSymbol(symbolText);
        };

        fetchSymbol();
    }, [setSymbol]);

    useEffect(() => {
        (async () => {
            setAuthenticated(await isAuthenticated());
        })();
    }, [setAuthenticated]);



      useEffect(() => {
        const fetchPrincipal = async () => {
            const principalText = await getPrincipalText();
            setPrincipal(principalText);
        };

        fetchPrincipal();
    }, [setPrincipal]);

    useEffect(() => {
        const fetchAccount = async () => {
            const principalText = await getPrincipalText();
            const account = await getAddressFromPrincipal(principalText);
            setAddress(account?.account);
        };

        fetchAccount();
    }, [setAddress]);


    useEffect(() => {
        getICRCBalance();
    }, [getICRCBalance]);

    useEffect(() => {
        getICPBalance();
    }, [getICPBalance]);

    return (
        <>
            {authenticated ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                            <Wallet
                                address={address}
                                principal={principal}
                                icpBalance={balance}
                                icrcBalance={icrcBalance}
                                symbol={symbol}
                                isAuthenticated={authenticated}
                                destroy={destroy}
                            />
                        </Nav.Item>
                    </Nav>
                    <main>
                        <Products tokenSymbol={symbol} />
                    </main>
                </Container>
            ) : (
                <Cover name="Street Food" login={login} coverImg={coverImg} />
            )}
        </>
    );
};

export default App;