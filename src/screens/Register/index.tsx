import React, {useState, useEffect} from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'
import { useForm } from "react-hook-form";
import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { useNavigation } from "@react-navigation/native";

import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";
import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

interface FormData{
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatorio'),
    amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatorio')
});

export function Register(){
    
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen]  = useState(false);



    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
});

    type NavigationProps = { navigate:(screen:string) => void; }
    const navigation = useNavigation<NavigationProps>();

    const{
        control,
        handleSubmit,
        reset,
        formState: {errors}    
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionsTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true); 
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false); 
    }

    async function handleRegister(form : FormData){
        if(!transactionType)
        return Alert.alert('Selecione o tipo da transação')

        if(category.key === 'category')
        return Alert.alert('Selecione a categoria')

        const newTransaction= {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const datakey = '@gofinances:transactions' /*DEFINE O NOME DO ASYNC*/
            const data = await  AsyncStorage.getItem(datakey);       /* RECUPERA OS DADOS DO ASYNC */      
            const currentData = data ? JSON.parse(data) : [];        /* CONVERTE EM JSON FORMATANDO */
            const dataFormatted = [...currentData, newTransaction]   /* PEGA O DADOS QUE JA TINHA E ADD */
            
            await  AsyncStorage.setItem(datakey, JSON.stringify(dataFormatted));   /* SALAVA OS DADOS  */

            reset();
            setTransactionType(''); /** Apos o cadastro limpa os dados */
            setCategory({ 
                key: 'category',
                name: 'Categoria'
            });
            navigation.navigate('Listagem'); /**Apos finaliza o cadastro direciona para a listagem */

            
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar!')
        }
    }
    /*     EXIBE OS DADOS DO ASYNC ESTORAGE
    useEffect(() => {
        async function loadData(){ const data = await  AsyncStorage.getItem('@gofinances:transactions');
       console.log(JSON.parse(data!));
    }
    loadData();  
    },[]);*/
    

    /*     DELETA TODOS OS DADOS DO ASYNC ESTORAGE
    useEffect(() => {
        async function removeall(){ await  AsyncStorage.removeItem('@gofinances:transactions');       
    }
    removeall();  
    },[]);*/
    

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>

              <Fields>  
                <InputForm 
                   name="name" 
                   control={control} 
                   placeholder="Nome"  
                   autoCapitalize="sentences"
                   autoCorrect={false}
                   error={errors.name && errors.name.message}

                />
                <InputForm 
                   name="amount" 
                   control={control} 
                   placeholder="Preço" 
                   keyboardType="numeric"
                   error={errors.amount && errors.amount.message}
                />

                <TransactionTypes>
                  <TransactionTypeButton title="Entrada" type="up" onPress={() => handleTransactionsTypeSelect('positive')} isActive={transactionType === 'positive'}/>
                  <TransactionTypeButton title="Saida" type="down" onPress={() => handleTransactionsTypeSelect('negative')} isActive={transactionType === 'negative'} />
                </TransactionTypes>  

               <CategorySelectButton title={category.name}  onPress={handleOpenSelectCategoryModal}/>
                
              </Fields> 


                <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                
            </Form>    
             
             <Modal visible={categoryModalOpen}>
                 <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                 />
             </Modal>

        </Container>
     </TouchableWithoutFeedback>    

    );
}