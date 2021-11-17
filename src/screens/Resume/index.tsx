import React , {useEffect, useState, useCallback} from "react";
import { useFocusEffect } from "@react-navigation/core";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, subMonths, format } from "date-fns";
import {ptBR} from 'date-fns/locale';

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from 'styled-components';


import { HistoryCard } from "../../components/HistoryCard";
import { 
    Container,
    Header,
    Title,
    Content,
    ChatContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';
import { categories } from "../../utils/categories";


interface TransactionData {
    type: 'positive' | 'negative';
    name:           string;
    amount:         string;
    category:    string;
    date:           string;   
}

interface CategoryData{
    key: string;
    name:  string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [TotalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();
    function handlDateChange(action: 'next' | 'prev'){
        
           if(action == 'next') {
               
               setSelectedDate(addMonths(selectedDate, 1));
           }else{
            
            setSelectedDate(subMonths(selectedDate, 1));              

           }
    }

    async function LoadData(){
        setIsLoading(true);
            const datakey = '@gofinances:transactions' /*DEFINE O NOME DO ASYNC*/
            const response = await  AsyncStorage.getItem(datakey);       /* RECUPERA OS DADOS DO ASYNC */      
            const responseFormatted = response ? JSON.parse(response) : [];        /* CONVERTE EM JSON FORMATANDO */

            const expensives = responseFormatted
            .filter((expensive: TransactionData) => 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

            const expensivesTotal = expensives
            .reduce((acumullator: number, expensive: TransactionData) => {
                    return acumullator + Number(expensive.amount)
            }, 0);

            const totalByCategory : CategoryData[] = [];

            categories.forEach(category => {
                let categorySum = 0;
                expensives.forEach((expensive : TransactionData) => {
                    if(expensive.category === category.key )
                        categorySum += Number(expensive.amount);
                });

                if(categorySum > 0){
                    const totalFormatted = categorySum.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })

                    const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name, 
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                });
            }
            })
            setTotalByCategories(totalByCategory);
            setIsLoading(false);
            
    }


    useFocusEffect(useCallback(() => {LoadData();
    },[selectedDate]));

    return(
        <Container>
          
          

              <Header>
                  <Title>Resumo por categoria</Title>
              </Header> 

              {  
           isLoading ?
            <LoadContainer>
              <ActivityIndicator 
                 color={theme.colors.primary}
                 size="large" />
            </LoadContainer>   : 

          <Content
               showsVerticalScrollIndicator={false} 
               contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: useBottomTabBarHeight(),            
               }}
           >

          <MonthSelect>
              <MonthSelectButton onPress={() => handlDateChange('prev')}>
                  <MonthSelectIcon name="chevron-left"/>
              </MonthSelectButton>

              <Month>{ format(selectedDate, 'MMMM, yyy', {locale: ptBR})}</Month>

              <MonthSelectButton onPress={() => handlDateChange('next')}>
                  <MonthSelectIcon name="chevron-right"/>
              </MonthSelectButton>
          </MonthSelect>


          <ChatContainer>   
          <VictoryPie
            data={TotalByCategories}
              colorScale={TotalByCategories.map(category => category.color)}
              style={{ 
                  labels: { 
                      fontSize: RFValue(18),
                      fontWeight: 'bold',
                      fill: theme.colors.shape,
                    }                  
                     }}
              labelRadius={60}       
              x= "percent"
              y= "total" 
          />
          </ChatContainer>  
             
            {  
            TotalByCategories.map(item => (             
              <HistoryCard 
                 key={item.key}
                 title={item.name}
                 amount={item.totalFormatted}
                 color={item.color} 
              />
            ))
            }

           
          </Content>
           }
        </Container>
    )
}