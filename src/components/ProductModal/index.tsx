import { FlatList, Modal } from "react-native";
import { Product } from "../../types/products";
import { Button } from "../Button";
import { Close } from "../Icons/Close";
import { Text } from "../Text";
import { formatCurrency } from "../utils/formatCurrency";
import { CloseButton, Footer, FooterContainer, Header, Image, Ingredient, IngredientsContainer, ModalBody, PriceContainer } from "./styles";
interface ProductModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: Product) => void
}

export function ProductModal({ visible, onClose, product, onAddToCart }: ProductModalProps){
    if(!product){
        return null;
    }

    function handleAddtoCart(){
        onAddToCart(product!)
        onClose();
    }


    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <Image
                source={{
                    uri: `http://192.168.15.8:3001/uploads/${product.imagePath}`
                }}
            >
                <CloseButton onPress={onClose}>
                    <Close />
                </CloseButton>
            </Image>

            <ModalBody>
                <Header>
                    <Text weight="600" size={24}>{product.name}</Text>
                    <Text color="#666" style={{ marginTop: 8 }}>{product.description}</Text>
                </Header>

                {product.ingredients.length > 0 && (
                    <IngredientsContainer>
                        <Text weight="600" color="#666">Ingredientes</Text>
                        <FlatList
                            data={product.ingredients}
                            keyExtractor={ingredients => ingredients._id}
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: 16 }}
                            renderItem={({ item: ingredient}) => (
                                <Ingredient>
                                    <Text>{ingredient.icon}</Text>
                                    <Text size={14} color="#666" style={{ marginLeft: 20 }}>{ingredient.name}</Text>
                                </Ingredient>
                            )}
                        />
                    </IngredientsContainer>)}
            </ModalBody>

            <Footer>
                <FooterContainer>
                    <PriceContainer>
                        <Text color="#666">Preço</Text>
                        <Text size={20} weight="600">{formatCurrency(product.price)}</Text>
                    </PriceContainer>

                    <Button onPress={handleAddtoCart}>Adicionar ao pedido</Button>
                </FooterContainer>
            </Footer>

        </Modal>
    )
}