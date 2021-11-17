import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";


import {
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogourButton,
    LoadContainer
} from './styles'


export interface DataListProps extends TransactionCardProps{
    id: string;
}

interface HighlightProps{ 
    amount: string; 
    lastTransaction: string; 
}

interface HighlightData { 
    entries: HighlightProps, 
    expensive: HighlightProps,
    total:  HighlightProps}

export function Dashboard(){
  /*  const datas: DataListProps[] = [{
        id:'1',
        type: "positive",
        title: "huasl",
        amount : "R$12.00",
         category: {name: 'vendas', icon:'dollar-sign'},
         date: "13/04/2020"
    }]*/

    const [isLoading, setIsLoading]         = useState(true);    
    const [transactions, setTransactions]   = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    function getLastTransactionData(
        collection: DataListProps[], 
        type: 'positive' | 'negative'
        ){
        const lastTransaction = new Date(
        Math.max.apply(Math, collection
            .filter(transaction => transaction.type === type)
            .map(   transaction => new Date(transaction.date).getTime())) )       
          

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' } )}`;        
    }

    async function loadTransactions() {
        const datakey = '@gofinances:transactions'; /*DEFINE O NOME DO ASYNC*/ 
        const response = await AsyncStorage.getItem(datakey);
        const transactions = response ? JSON.parse(response): [];

        let entriesTotal = 0;
        let expenseveTotal =  0;

        const transactionFromatted : DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else {
                expenseveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month:'2-digit',
                year:'2-digit'
            }).format(new Date(item.date));

            return{
                id:       item.id,
                name:     item.name,
                amount,
                type:     item.type,
                category: item.category,
                date,
            }
        });
        setTransactions(transactionFromatted);

        const au = transactions
                .filter((transaction : DataListProps) => transaction.type === 'negative')
                .map(   (transaction : DataListProps) => transaction.date )
        

        const lastTransactionEntries = getLastTransactionData(transactions, 'positive');        
        const lastTransactionExpensive = getLastTransactionData(transactions, 'negative'); 
        console.log(au) 
        const totalInterval = `01 a ${lastTransactionExpensive}`;  
            
        const total = entriesTotal - expenseveTotal;

        setHighlightData({
           entries: {
            amount: entriesTotal.toLocaleString('pr-BR', {
                 style: 'currency',
                 currency: 'BRL'  
               }),
               lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
           },

           expensive: {
            amount: expenseveTotal.toLocaleString('pr-BR', {
                    style: 'currency',
                    currency: 'BRL'  
                  }),
                  lastTransaction: `Última saída dia ${lastTransactionExpensive}`,
        },

        total: {
            amount: total.toLocaleString('pr-BR', {
                    style: 'currency',
                    currency: 'BRL'  
                   
                }),
                lastTransaction: totalInterval
            },
        });
        
        setIsLoading(false); /**Ao FINALIZAR O CARREGAMENTO ASYNCORONO ELE FECHA O LOAD */
    }

    useEffect(() => {
        loadTransactions()

    }, [])

    useFocusEffect(useCallback(() => {loadTransactions();
    },[]));


    return(
        <Container>
            { isLoading ?
            <LoadContainer>
              <ActivityIndicator 
                 color={theme.colors.primary}
                 size="large" />
            </LoadContainer>   :
            
                <>
            <Header>

               <UserWrapper>
                <UserInfo>
                    <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/45778562?v=4' }}/>
                     <User>
                        <UserGreeting>Olá, </UserGreeting> 
                        <UserName>Usuario</UserName>
                     </User>
                </UserInfo>

              <LogourButton onPress={() => {}}>
                <Icon name="power"/>
              </LogourButton>  

                </UserWrapper> 
            </Header>   

            <HighlightCards >                
                <HighlightCard type="up" title={'Entradas'} amount={highlightData.entries.amount}   lastTransaction={highlightData.entries.lastTransaction} />
                <HighlightCard type="down" title={'Saídas'} amount={highlightData.expensive.amount} lastTransaction={highlightData.expensive.lastTransaction}/>
                <HighlightCard type="total" title={'Total'} amount={highlightData.total.amount}     lastTransaction={highlightData.total.lastTransaction}/>
            </HighlightCards>  

            <Transactions>
                  <Title>Listagem</Title> 
                  <TransactionList 
                    data={transactions} 
                    keyExtractor={ item => item.id}
                    renderItem={({ item }) => <TransactionCard data={ item } /> }                    
                    />

            </Transactions> 

         </>
        }                       
             
        </Container>

    )
}
