import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button } from "../components/Button";
import { Cart } from "../components/Cart";
import { Categories } from "../components/Categories";
import { Header } from "../components/Header";
import { Menu } from "../components/Menu";
import { TableModal } from "../components/TableModal";
import { CartItem } from "../types/CartItem";
import { Product } from "../types/products";
import { CategoriesContainer, CenteredContainer, Container, Footer, MenuContainer } from "./styles";
import { products } from "../assets/mocks/products";
import { Empty } from "../components/Icons/Empty";
import { Text } from "../components/Text";


export function Main(){
    const [isTableModalVisible, setIsTableModalVisible] = useState<boolean>(false);
    const [selectedTable, setSelectedTable] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProducts, setIsProduct] = useState<Product[]>(products);

    function handleSaveTable(table: string){
        setSelectedTable(table);
        setIsTableModalVisible(false);
    }

    function handleResetOrder(){
        setSelectedTable('');
        setCartItems([])
    }

    function handleAddToCart(product: Product){
        if(!selectedTable){
            setIsTableModalVisible(true);
        }

        setCartItems((prevState) => {
            const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);

            if(itemIndex < 0){
                return prevState.concat({
                    quantity: 1,
                    product,
                });
            }

            const newCartItems = [...prevState];
            const item = newCartItems[itemIndex];

            newCartItems[itemIndex] = {
                ...item,
                quantity: newCartItems[itemIndex].quantity + 1,
            };

            return newCartItems;
        });
    }

    function handleDecrementCartItem(product: Product){
        setCartItems((prevState) => {
            const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);

            const item = prevState[itemIndex];
            const newCartItems = [...prevState];

            if(item.quantity === 1){
                newCartItems.splice(itemIndex, 1);

                return newCartItems;
            }


            newCartItems[itemIndex] = {
                ...item,
                quantity: newCartItems[itemIndex].quantity - 1,
            };

            return newCartItems;
        });
    }

    return (
        <>
            <Container>
                <Header selectedTable={selectedTable} onCancelOrder={handleResetOrder}/>

                    {isLoading && (
                        <CenteredContainer>
                            <ActivityIndicator color="#D73035" size="large"/>
                        </CenteredContainer>
                    )}

                    {!isLoading && (
                        <>
                            <CategoriesContainer>
                                <Categories />
                            </CategoriesContainer>

                            {isProducts.length > 0 ? (
                                <MenuContainer>
                                    <Menu onAddToCart={handleAddToCart} products={isProducts}/>
                                </MenuContainer>
                            ) : (
                                <CenteredContainer>
                                    <Empty />
                                    <Text color="#666" style={{ marginTop: 24}}>
                                        Nenhum produto foi encontrado!
                                    </Text>
                                </CenteredContainer>
                            )}
                        </>
                    )}
            </Container>
            <Footer>
                {/* <FooterContainer> */}
                    {!selectedTable && (
                        <Button onPress={() => setIsTableModalVisible(true)} disabled={isLoading}>
                            Novo pedido
                        </Button>
                    )}

                    {selectedTable && (
                        <Cart
                            cartItems={cartItems}
                            onAdd={handleAddToCart}
                            onDecrement={handleDecrementCartItem}
                            onConfirmOrder={handleResetOrder}
                        />
                    )}
                {/* </FooterContainer> */}
            </Footer>

            <TableModal
                visible={isTableModalVisible}
                onClose={() => setIsTableModalVisible(false)}
                onSave={handleSaveTable}
            />
       </>
    )
}